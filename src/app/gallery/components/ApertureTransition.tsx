"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

interface ApertureTransitionContextValue {
  triggerTransition: (
    href: string,
    origin?: { x: number; y: number },
  ) => void;
  isTransitioning: boolean;
}

const ApertureTransitionContext =
  createContext<ApertureTransitionContextValue>({
    triggerTransition: () => {},
    isTransitioning: false,
  });

export function useApertureTransition() {
  return useContext(ApertureTransitionContext);
}

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/**
 * Full-screen WebGL2 3D Mechanical 9-Blade Camera Aperture Iris Shader.
 * Models 3D beveled overlapping metallic blades with anisotropic brushed
 * micro-grooves, inter-blade cast shadows, specular lighting, and brass chamfers.
 */
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uOpen;   // 1.0 = fully open (off-screen), 0.0 = fully closed
uniform float uFlash;  // 0.0..1.0 subtle specular flash at full closure
uniform float uTime;

const int BLADES = 9;
const float PI = 3.14159265358979323846;
const float TAU = 6.28318530717958647692;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  if (uOpen >= 0.999) {
    outColor = vec4(0.0);
    return;
  }

  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

  // Distance from uCenter to the farthest viewport corner in aspect-corrected space
  vec2 c0 = (vec2(0.0, 0.0) - uCenter) * aspect;
  vec2 c1 = (vec2(1.0, 0.0) - uCenter) * aspect;
  vec2 c2 = (vec2(0.0, 1.0) - uCenter) * aspect;
  vec2 c3 = (vec2(1.0, 1.0) - uCenter) * aspect;
  float maxCorner = max(max(length(c0), length(c1)), max(length(c2), length(c3)));

  // Normalized coordinates centered at uCenter where 1.0 = farthest screen corner
  vec2 p = ((vUv - uCenter) * aspect) / max(maxCorner, 0.0001);
  float r = length(p);

  // Blade mechanical twist angle as aperture closes
  float closeAmount = clamp(1.0 - uOpen, 0.0, 1.0);
  float twist = closeAmount * 0.72 + 0.08;

  // Inscribed polygon aperture radius:
  // At uOpen = 0.0, radius is negative (-0.015) so blades lock tightly with zero gap.
  // At uOpen = 1.0, radius exceeds 1.18 so the octagonal hole clears all screen corners.
  float apertureRadius = mix(-0.018, 1.22, uOpen * uOpen * (3.0 - 2.0 * uOpen));

  // Evaluate all 9 blades in 3D space
  float maxEdgeDist = -1e5;
  int activeBlade = 0;
  float activeU = 0.0;
  float activeV = 0.0;
  vec2 activeNormal2D = vec2(1.0, 0.0);
  vec2 activeTangent2D = vec2(0.0, 1.0);
  float overlapShadow = 1.0;

  // First pass: find polygonal aperture boundary (intersection of 9 half-planes)
  for (int i = 0; i < BLADES; i++) {
    float fi = float(i);
    float theta = (fi * TAU) / float(BLADES) + twist;
    vec2 n = vec2(cos(theta), sin(theta));
    float d = dot(p, n) - apertureRadius;
    if (d > maxEdgeDist) {
      maxEdgeDist = d;
    }
  }

  // Smooth anti-aliased edge for the inner aperture opening
  float pxScale = 1.5 / max(min(uResolution.x, uResolution.y), 1.0);
  float bladeCoverage = smoothstep(-pxScale, pxScale, maxEdgeDist);

  if (bladeCoverage <= 0.001) {
    outColor = vec4(0.0);
    return;
  }

  // Determine which physical blade is on top at point p and compute inter-blade overlap shadow
  // Polar angle of pixel relative to blade twist
  float ang = atan(p.y, p.x) - twist;
  float sectorFloat = mod(ang, TAU) / (TAU / float(BLADES));
  int sectorIdx = int(floor(sectorFloat));

  // Check the primary sector blade and its two neighbors for accurate overlap priority
  float bestScore = -1e5;
  float secondEdgeDist = 1e5;

  for (int offset = -2; offset <= 2; offset++) {
    int idx = (sectorIdx + offset + BLADES * 2) % BLADES;
    float fi = float(idx);
    float theta = (fi * TAU) / float(BLADES) + twist;
    vec2 n = vec2(cos(theta), sin(theta));
    vec2 t = vec2(-sin(theta), cos(theta));

    // Curve the blade edge subtly for realism
    float v = dot(p, t);
    float u = dot(p, n) - apertureRadius + 0.035 * v * v;

    // Blade covers region where u >= -pxScale * 2.0 and v is within the leading edge
    float leadingEdge = v + 0.36 * apertureRadius + 0.08;
    if (u >= -pxScale * 4.0 && leadingEdge >= 0.0) {
      // Cyclic overlap: the blade whose leading edge is closest (smallest positive leadingEdge) sits on top
      float score = -leadingEdge;
      if (score > bestScore) {
        if (bestScore > -1e4) {
          secondEdgeDist = min(secondEdgeDist, abs(leadingEdge));
        }
        bestScore = score;
        activeBlade = idx;
        activeU = max(u, 0.0);
        activeV = v;
        activeNormal2D = n;
        activeTangent2D = t;
      } else {
        secondEdgeDist = min(secondEdgeDist, abs(leadingEdge));
      }
    }
  }

  // Seam distance to the overlapping neighboring blade (creates realistic 3D step + cast shadow)
  float nextTheta = (float((activeBlade + 1) % BLADES) * TAU) / float(BLADES) + twist;
  vec2 nextN = vec2(cos(nextTheta), sin(nextTheta));
  vec2 nextT = vec2(-sin(nextTheta), cos(nextTheta));
  float nextU = dot(p, nextN) - apertureRadius;
  float nextLeading = dot(p, nextT) + 0.36 * apertureRadius + 0.08;
  float seamDist = abs(nextLeading);

  // Cast shadow from the overlapping neighbor blade
  float seamShadow = smoothstep(0.0, 0.055, seamDist);
  float innerStepShadow = smoothstep(0.0, 0.04, abs(nextU));
  overlapShadow = mix(0.42, 1.0, max(seamShadow, 1.0 - step(0.0, nextU)));

  // 3D Surface Normal construction for the active blade
  // 1. Inner cutting-edge brass chamfer (bevel)
  float innerBevelWidth = 0.016;
  float innerBevel = 1.0 - smoothstep(0.0, innerBevelWidth, activeU);

  // 2. Seam edge chamfer where blades overlap
  float seamBevel = 1.0 - smoothstep(0.0, 0.009, seamDist);

  // 3. Anisotropic brushed metal micro-grooves along blade tangent
  float grooveFreq = 190.0;
  float brushed = sin(activeV * grooveFreq + float(activeBlade) * 2.1) * 0.5
                + sin(activeV * grooveFreq * 2.7 - activeU * 40.0) * 0.25;

  // 4. 3D Blade tilt: each blade pitches slightly in Z so light catches different blades distinctly
  float bladeAngle = (float(activeBlade) * TAU) / float(BLADES) + twist * 0.6;
  vec2 bladeTilt = vec2(cos(bladeAngle), sin(bladeAngle)) * 0.22;
  vec2 bevelTilt = -activeNormal2D * (innerBevel * 0.85) + activeTangent2D * (seamBevel * 0.55);
  vec2 microTilt = activeNormal2D * (brushed * 0.035);

  vec3 normal = normalize(vec3(bladeTilt + bevelTilt + microTilt, 1.0));

  // 3D Lighting Setup (Key Light + Warm Brass Rim Light + Ambient)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 keyLight = normalize(vec3(-0.45, 0.55, 0.70));
  vec3 rimLight = normalize(vec3(0.52, -0.42, 0.74));

  float diffKey = max(dot(normal, keyLight), 0.0);
  float diffRim = max(dot(normal, rimLight), 0.0);

  vec3 halfKey = normalize(keyLight + viewDir);
  vec3 halfRim = normalize(rimLight + viewDir);

  float specKey = pow(max(dot(normal, halfKey), 0.0), 42.0);
  float specRim = pow(max(dot(normal, halfRim), 0.0), 28.0);

  // Palette grounded in SELAH 2026: deep anodized maroon-obsidian, warm brass/gold, and cream
  vec3 obsidian = vec3(0.095, 0.028, 0.065);   // #180710
  vec3 maroonMetal = vec3(0.24, 0.075, 0.155); // #3d1327
  vec3 brass = vec3(0.788, 0.655, 0.416);      // #c9a76a
  vec3 cream = vec3(1.0, 0.945, 0.796);        // #fff1cb
  vec3 oliveTint = vec3(0.388, 0.459, 0.180);  // #63752e

  // Base metallic reflectance varies per blade angle for unmistakable 3D facet separation
  float bladeFacet = 0.5 + 0.5 * cos(bladeAngle - 0.7);
  vec3 baseMetal = mix(obsidian, maroonMetal, bladeFacet * 0.75 + diffKey * 0.25);
  baseMetal += oliveTint * (0.06 * diffRim);

  // Brushed texture modulation
  baseMetal *= (0.94 + 0.06 * brushed);

  // Add specular highlights & beveled brass edge catch-lights
  vec3 color = baseMetal * (0.45 + 0.75 * diffKey) * overlapShadow;
  color += cream * (specKey * 0.48 * overlapShadow);
  color += brass * (specRim * 0.35 * overlapShadow);

  // Bright machined brass chamfer along the inner cutting edge of each blade
  float edgeHighlight = smoothstep(innerBevelWidth, 0.0, activeU);
  color = mix(color, mix(brass, cream, 0.45), edgeHighlight * 0.82);

  // Subtle seam line highlight
  color += brass * (seamBevel * 0.28);

  // Mechanical outer lens mount ring & pivot rivets near the outer perimeter
  float ringZone = smoothstep(0.72, 0.74, r) * (1.0 - smoothstep(0.755, 0.77, r));
  color = mix(color, brass * 0.55, ringZone * 0.45);

  // Radial vignette for 3D depth inside the lens chamber
  float vignette = 1.0 - 0.38 * smoothstep(0.15, 1.05, r);
  color *= vignette;

  // Subtle film grain + closure flash
  float grain = (hash(gl_FragCoord.xy + uTime * 60.0) - 0.5) * 0.028;
  color += grain;
  color = mix(color, cream, uFlash * 0.32);

  // Optical glass rim glow on the inner edge of the aperture
  float innerGlow = exp(-max(maxEdgeDist, 0.0) * 55.0) * (1.0 - closeAmount * 0.5);
  color += brass * innerGlow * 0.22;

  outColor = vec4(clamp(color, 0.0, 1.0) * bladeCoverage, bladeCoverage);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Aperture shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ApertureTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation state read by WebGL render loop
  const animStateRef = useRef({
    open: 1.0, // 1.0 = fully open (hidden), 0.0 = fully closed (covering full page)
    flash: 0.0,
    centerX: 0.5,
    centerY: 0.5,
    active: false,
    waitingForRoute: false,
    targetPath: "",
  });

  const renderFnRef = useRef<(() => void) | null>(null);
  const tweenRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const prevPathnameRef = useRef(pathname);

  // Set up WebGL2 context and shader program
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Aperture program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uCenter = gl.getUniformLocation(program, "uCenter");
    const uOpen = gl.getUniformLocation(program, "uOpen");
    const uFlash = gl.getUniformLocation(program, "uFlash");
    const uTime = gl.getUniformLocation(program, "uTime");

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(window.innerWidth * dpr));
      const h = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const render = () => {
      const state = animStateRef.current;
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (state.open >= 0.999) {
        return;
      }

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uCenter, state.centerX, state.centerY);
      gl.uniform1f(uOpen, state.open);
      gl.uniform1f(uFlash, state.flash);
      gl.uniform1f(uTime, performance.now() * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    renderFnRef.current = render;
    syncSize();
    render();

    const onResize = () => {
      syncSize();
      render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderFnRef.current = null;
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  // Helper to animate the aperture blades opening fully across the page
  const playOpenAnimation = useCallback(() => {
    const state = animStateRef.current;
    tweenRef.current?.kill();

    const tl = gsap.timeline({
      onUpdate: () => {
        renderFnRef.current?.();
      },
      onComplete: () => {
        state.open = 1.0;
        state.flash = 0.0;
        state.active = false;
        state.waitingForRoute = false;
        renderFnRef.current?.();
        setIsTransitioning(false);
      },
    });

    tweenRef.current = tl;

    // Slight pause at full closure so the new page layout settles, then 3D blades spiral open across the full screen
    tl.to(
      state,
      {
        flash: 0.0,
        duration: 0.12,
        ease: "power2.out",
      },
      0,
    ).to(
      state,
      {
        open: 1.0,
        centerX: 0.5,
        centerY: 0.5,
        duration: 0.88,
        ease: "expo.inOut",
      },
      0.06,
    );
  }, []);

  // Detect when route changes to the photos page (or back) while blades are closed, then open the blades!
  useEffect(() => {
    const state = animStateRef.current;
    const pathChanged = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    if (state.waitingForRoute && pathChanged) {
      state.waitingForRoute = false;
      playOpenAnimation();
      return;
    }

    // If user lands directly on /gallery/[eventId] without an active transition, play the opening iris reveal
    const isEventDetail =
      pathname?.startsWith("/gallery/") && pathname !== "/gallery";
    if (isEventDetail && !state.active) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reduceMotion) {
        state.active = true;
        state.open = 0.0;
        state.flash = 0.0;
        state.centerX = 0.5;
        state.centerY = 0.5;
        setIsTransitioning(true);
        renderFnRef.current?.();
        playOpenAnimation();
      }
    }
  }, [pathname, playOpenAnimation]);

  const triggerTransition = useCallback(
    (href: string, origin?: { x: number; y: number }) => {
      const state = animStateRef.current;
      if (state.active) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        router.push(href);
        return;
      }

      // Convert pixel origin (e.g. lens center) to WebGL UV coordinates (0..1, Y up)
      const startX =
        origin && window.innerWidth > 0
          ? origin.x / window.innerWidth
          : 0.5;
      const startY =
        origin && window.innerHeight > 0
          ? 1.0 - origin.y / window.innerHeight
          : 0.5;

      state.active = true;
      state.waitingForRoute = true;
      state.targetPath = href;
      state.open = 1.0;
      state.flash = 0.0;
      state.centerX = startX;
      state.centerY = startY;
      setIsTransitioning(true);

      tweenRef.current?.kill();

      const tl = gsap.timeline({
        onUpdate: () => {
          renderFnRef.current?.();
        },
        onComplete: () => {
          // Full page is now covered by closed 3D aperture blades; navigate to photos page
          router.push(href);
          // Fallback safety timer in case route is identical or already loaded
          window.setTimeout(() => {
            if (animStateRef.current.waitingForRoute) {
              animStateRef.current.waitingForRoute = false;
              playOpenAnimation();
            }
          }, 420);
        },
      });

      tweenRef.current = tl;

      // Phase 1: Close the 9 3D aperture blades from full-screen open (1.0) to locked shut (0.0)
      tl.to(
        state,
        {
          open: 0.0,
          centerX: 0.5,
          centerY: 0.5,
          duration: 0.68,
          ease: "power3.inOut",
        },
        0,
      )
        .to(
          state,
          {
            flash: 1.0,
            duration: 0.08,
            ease: "power2.in",
          },
          0.54,
        )
        .to(
          state,
          {
            flash: 0.15,
            duration: 0.08,
            ease: "power2.out",
          },
          0.62,
        );
    },
    [playOpenAnimation, router],
  );

  return (
    <ApertureTransitionContext.Provider
      value={{ triggerTransition, isTransitioning }}
    >
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="gallery-aperture-webgl"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 500,
          pointerEvents: isTransitioning ? "auto" : "none",
          opacity: isTransitioning ? 1 : 0,
          transition: "opacity 0.05s linear",
        }}
      />
    </ApertureTransitionContext.Provider>
  );
}

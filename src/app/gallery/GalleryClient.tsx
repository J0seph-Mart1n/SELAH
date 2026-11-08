"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import gsap from "gsap";
import { galleryItems, type GalleryItem } from "./data/galleryItems";

type Filter = "all" | "sport" | "cultural";

export const ITEMS = galleryItems;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sport", label: "Sport" },
  { id: "cultural", label: "Cultural" },
];

const DIAL_ROTATION: Record<Filter, number> = {
  all: -18,
  sport: 0,
  cultural: 18,
};

const FALLBACK_ACCENT: Record<"sport" | "cultural", string> = {
  sport: "rgb(148 142 62 / 0.5)",
  cultural: "rgb(163 74 99 / 0.5)",
};

const APERTURE_HOLE = "156,100 128,148.5 72,148.5 44,100 72,51.5 128,51.5";

const APERTURE_SEAMS = [
  "156,100 200,100",
  "128,148.5 150,186.6",
  "72,148.5 50,186.6",
  "44,100 0,100",
  "72,51.5 50,13.4",
  "128,51.5 150,13.4",
];

export default function GalleryClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShuttering, setIsShuttering] = useState(false);
  const [ambient, setAmbient] = useState(FALLBACK_ACCENT.sport);
  const router = useRouter();
  const pathname = usePathname();
  const filtered = useMemo(
    () =>
      ITEMS.filter((item) => filter === "all" || item.type === filter),
    [filter],
  );
  const active = filtered[activeIndex] ?? filtered[0];
  const stageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);
  const holeRef = useRef<SVGPolygonElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });
  const suppressClick = useRef(false);
  const suppressTimer = useRef<number | null>(null);
  const shutteringRef = useRef(false);
  const wheelLock = useRef(0);
  const filmDrag = useRef({ x: 0, left: 0, moved: false });
  const filmSuppress = useRef(false);
  const filmTimer = useRef<number | null>(null);

  const frame = String(activeIndex + 1).padStart(2, "0");
  const total = String(filtered.length).padStart(2, "0");
  const mode = active?.type === "sport" ? "SPORT" : "CULTURAL";

  const changeFilter = useCallback((next: Filter) => {
    setFilter(next);
    setActiveIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const step = useCallback(
    (direction: number) => {
      if (filtered.length < 2) return;
      setActiveIndex(
        (current) =>
          (current + direction + filtered.length) % filtered.length,
      );
    },
    [filtered.length],
  );

  const onDialKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    const index = FILTERS.findIndex((option) => option.id === filter);
    const next =
      FILTERS[(index + direction + FILTERS.length) % FILTERS.length];
    changeFilter(next.id);
  };

  const resetShutterVisuals = useCallback(() => {
    shutteringRef.current = false;
    timelineRef.current?.kill();
    timelineRef.current = null;

    if (holeRef.current) {
      gsap.set(holeRef.current, { scale: 1, svgOrigin: "100px 100px" });
    }
    if (mediaRef.current) {
      gsap.set(mediaRef.current, { scale: 1, filter: "none" });
    }
    if (flashRef.current) {
      gsap.set(flashRef.current, { opacity: 0 });
    }
    wipeRef.current?.style.removeProperty("--iris-x");
    wipeRef.current?.style.removeProperty("--iris-y");
    wipeRef.current?.style.removeProperty("--iris-r");
  }, []);

  const resetShutter = useCallback(() => {
    resetShutterVisuals();
    setIsShuttering(false);
  }, [resetShutterVisuals]);

  const runShutter = useCallback(
    (item: GalleryItem) => {
      if (shutteringRef.current) return;
      shutteringRef.current = true;
      setIsShuttering(true);

      // The iris wipe starts and ends in CSS; keep its origin tied to the lens.
      const wipe = wipeRef.current;
      const lensRect = lensRef.current?.getBoundingClientRect();
      if (wipe && lensRect) {
        const cx = lensRect.left + lensRect.width / 2;
        const cy = lensRect.top + lensRect.height / 2;
        // Cover the farthest corner exactly so the 400ms wipe stays visible.
        const radius =
          Math.hypot(
            Math.max(cx, window.innerWidth - cx),
            Math.max(cy, window.innerHeight - cy),
          ) + 4;

        wipe.style.setProperty("--iris-x", `${cx}px`);
        wipe.style.setProperty("--iris-y", `${cy}px`);
        wipe.style.setProperty("--iris-r", `${radius}px`);
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        router.push(`/gallery/${item.id}`);
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => router.push(`/gallery/${item.id}`),
      });
      timelineRef.current = timeline;

      if (holeRef.current) {
        timeline.to(
          holeRef.current,
          {
            scale: 0,
            svgOrigin: "100px 100px",
            duration: 0.5,
            ease: "power3.inOut",
          },
          0,
        );
      }

      if (mediaRef.current) {
        timeline.to(
          mediaRef.current,
          {
            scale: 1.06,
            filter: "blur(2px)",
            duration: 0.5,
            ease: "power3.inOut",
          },
          0,
        );
      }

      if (flashRef.current) {
        timeline.to(
          flashRef.current,
          { opacity: 0.9, duration: 0.05, ease: "power1.in" },
          0.4,
        );
        timeline.to(
          flashRef.current,
          { opacity: 0, duration: 0.05, ease: "power1.out" },
          0.45,
        );
      }

      // Wipe runs 0.5s -> 0.9s; route only after it has fully covered the page.
      timeline.to({}, { duration: 0.4 }, 0.5);
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener("pageshow", resetShutter);
    return () => window.removeEventListener("pageshow", resetShutter);
  }, [resetShutter]);

  useEffect(() => {
    // Route changes remount this component with a fresh shutter state.
    resetShutterVisuals();
  }, [pathname, resetShutterVisuals]);

  useEffect(() => {
    if (active) router.prefetch(`/gallery/${active.id}`);
  }, [active, router]);

  useEffect(() => {
    return () => {
      if (suppressTimer.current) window.clearTimeout(suppressTimer.current);
      if (filmTimer.current) window.clearTimeout(filmTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (indexOpen) {
        if (event.key === "Escape") setIndexOpen(false);
        return;
      }

      if (shutteringRef.current) return;

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(
        "button, a, input, textarea, select, [contenteditable='true']",
      );

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }

      if (event.key === "Enter" && active && !interactive) {
        runShutter(active);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, indexOpen, runShutter, step]);

  useEffect(() => {
    if (!indexOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [indexOpen]);

  // Sample the active artwork and use it as the ambient light behind the lens.
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const image = new window.Image();
    image.decoding = "async";

    image.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(image, 0, 0, 16, 16);
        const data = context.getImageData(0, 0, 16, 16).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let weight = 0;
        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          // Favour colourful pixels so the glow does not turn muddy grey.
          const w = 0.12 + ((max - min) / 255) * 1.9;
          r += pr * w;
          g += pg * w;
          b += pb * w;
          weight += w;
        }
        if (!weight) return;
        const clamp = (value: number) =>
          Math.round(Math.min(235, Math.max(24, value)));
        setAmbient(
          `rgb(${clamp((r / weight) * 1.02)} ${clamp(
            (g / weight) * 1.02,
          )} ${clamp((b / weight) * 1.02)} / 0.52)`,
        );
      } catch {
        // Canvas can fail on cross-origin artwork; keep the type fallback.
      }
    };

    image.src = active.coverImage;
    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, [active]);

  // Mouse parallax for the glass; touch and reduced-motion keep it still.
  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = lens.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      lens.style.setProperty("--px", String(Math.max(-1, Math.min(1, x))));
      lens.style.setProperty("--py", String(Math.max(-1, Math.min(1, y))));
    };

    const onLeave = () => {
      lens.style.setProperty("--px", "0");
      lens.style.setProperty("--py", "0");
    };

    lens.addEventListener("pointermove", onMove);
    lens.addEventListener("pointerleave", onLeave);
    return () => {
      lens.removeEventListener("pointermove", onMove);
      lens.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Keep the active frame centered in the film strip.
  useEffect(() => {
    const track = filmRef.current;
    if (!track) return;
    const node = track.querySelector<HTMLElement>(
      `[data-frame="${activeIndex}"]`,
    );
    if (!node) return;
    const target =
      node.offsetLeft - (track.clientWidth - node.offsetWidth) / 2;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: Math.max(0, target),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeIndex, filter]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
    suppressClick.current = false;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const distance = Math.hypot(
      event.clientX - pointerStart.current.x,
      event.clientY - pointerStart.current.y,
    );
    if (distance <= 6) return;

    // Capture only once a real drag starts, so taps still reach the lens.
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    suppressClick.current = true;
    setIsDragging(true);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const distance = Math.hypot(
      event.clientX - pointerStart.current.x,
      event.clientY - pointerStart.current.y,
    );
    const isClick = distance < 6;

    if (!isClick) {
      suppressClick.current = true;
      if (distance >= 6) {
        step(event.clientX < pointerStart.current.x ? 1 : -1);
      }
      // Clear stale suppression when no follow-up click is dispatched.
      if (suppressTimer.current) window.clearTimeout(suppressTimer.current);
      suppressTimer.current = window.setTimeout(() => {
        suppressClick.current = false;
      }, 350);
    }

    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerCancel = () => {
    setIsDragging(false);
    suppressClick.current = true;
    if (suppressTimer.current) window.clearTimeout(suppressTimer.current);
    suppressTimer.current = window.setTimeout(() => {
      suppressClick.current = false;
    }, 350);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || shutteringRef.current) return;

      // React attaches wheel handlers passively, so listen natively to stop
      // the page from scrolling while the pointer is over the lens.
      event.preventDefault();
      const amount = Math.abs(event.deltaX) + Math.abs(event.deltaY);
      if (amount < 12) return;

      const now = Date.now();
      if (now - wheelLock.current < 450) return;
      wheelLock.current = now;
      step(event.deltaX + event.deltaY > 0 ? 1 : -1);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [step]);

  const onFilmPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    filmDrag.current = {
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
      moved: false,
    };
    filmSuppress.current = false;
  };

  const onFilmPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const delta = event.clientX - filmDrag.current.x;
    if (Math.abs(delta) < 6) return;
    filmDrag.current.moved = true;
    filmSuppress.current = true;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.currentTarget.scrollLeft = filmDrag.current.left - delta;
  };

  const onFilmPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!filmDrag.current.moved) return;
    if (filmTimer.current) window.clearTimeout(filmTimer.current);
    filmTimer.current = window.setTimeout(() => {
      filmSuppress.current = false;
    }, 220);
  };

  const selectFrame = (index: number) => {
    if (filmSuppress.current) {
      filmSuppress.current = false;
      return;
    }
    setActiveIndex(index);
  };

  const openActive = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (active) runShutter(active);
  };

  const cameraStyle = { "--ambient": ambient } as CSSProperties;

  return (
    <div className="selah-gallery">
      <main className="gallery-home gallery-camera-page">
        <header className="gallery-camera__heading">
          <p className="gallery-camera__eyebrow">
            SELAH 2026 / Official lookbook / Pune
          </p>
          <div className="gallery-camera__heading-row">
            <h1
              id="gallery-title"
              className="gallery-camera__title"
              aria-live="polite"
            >
              {active?.title ?? "SELAH Gallery"}
            </h1>
            <span className="gallery-camera__type">{mode}</span>
          </div>
        </header>

        <section
          className={`gallery-camera ${isDragging ? "is-dragging" : ""}`}
          aria-labelledby="gallery-title"
          aria-busy={isShuttering}
          data-shuttering={isShuttering ? "true" : "false"}
          style={cameraStyle}
        >
          <div className="gallery-camera__chassis">
            <span className="gallery-camera__hump" aria-hidden="true">
              <span className="gallery-camera__hump-label">SELAH</span>
            </span>
            <span className="gallery-camera__grain" aria-hidden="true" />

            <header className="gallery-camera__plate">
              <div className="gallery-camera__plate-left">
                <span className="camera-viewfinder" aria-hidden="true" />
                <div className="gallery-camera__brand">
                  <span className="gallery-camera__brand-mark">SELAH</span>
                  <span className="gallery-camera__brand-sub">
                    Official lookbook / Pune
                  </span>
                </div>
              </div>

              <span className="gallery-camera__plate-serial" aria-hidden="true">
                Camera / 01 &nbsp;·&nbsp; 35mm
              </span>

              <div className="gallery-camera__plate-right">
                <div className="camera-mode" onKeyDown={onDialKeyDown}>
                  <div
                    className="camera-mode__labels"
                    role="group"
                    aria-label="Filter gallery"
                  >
                    {FILTERS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => changeFilter(option.id)}
                        aria-pressed={filter === option.id}
                        className={
                          filter === option.id ? "is-active" : undefined
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <span className="camera-mode__dial" aria-hidden="true">
                    <span
                      className="camera-mode__knurl"
                      style={{
                        transform: `rotate(${DIAL_ROTATION[filter]}deg)`,
                      }}
                    >
                      <span className="camera-mode__cap" />
                      <span className="camera-mode__notch" />
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  className="gallery-camera__index"
                  onClick={() => setIndexOpen(true)}
                >
                  Film index <span aria-hidden="true">↗</span>
                </button>

                <button
                  type="button"
                  className="camera-release"
                  onClick={openActive}
                  aria-label={`Open ${active?.title ?? "SELAH"} gallery`}
                >
                  <span className="camera-release__ring" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="gallery-camera__face">
              <div
                ref={stageRef}
                className="gallery-camera__lens-stage"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
              >
                <div ref={lensRef} className="gallery-camera__lens-frame">
                  <button
                    type="button"
                    className="gallery-lens"
                    onClick={openActive}
                    aria-label={`Open ${active?.title ?? "SELAH"} gallery`}
                    aria-disabled={isShuttering}
                  >
                    <span
                      className="gallery-lens__barrel"
                      aria-hidden="true"
                    />
                    <span
                      key={`knurl-${active?.id ?? "empty"}`}
                      className="gallery-lens__knurl"
                      aria-hidden="true"
                    />
                    <span
                      className="gallery-lens__engraving"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 200 200" focusable="false">
                        <defs>
                          <path
                            id="lens-engrave-top"
                            d="M 17 100 A 83 83 0 0 1 183 100"
                          />
                          <path
                            id="lens-engrave-bottom"
                            d="M 17 100 A 83 83 0 0 0 183 100"
                          />
                        </defs>
                        <text>
                          <textPath
                            href="#lens-engrave-top"
                            startOffset="50%"
                            textAnchor="middle"
                          >
                            SELAH OPTICAL · 35mm · 1:1.8
                          </textPath>
                        </text>
                        <text>
                          <textPath
                            href="#lens-engrave-bottom"
                            startOffset="50%"
                            textAnchor="middle"
                          >
                            SPORTS &amp; CULTURE · PUNE
                          </textPath>
                        </text>
                      </svg>
                    </span>

                    <span className="gallery-lens__glass">
                      <span className="gallery-lens__shift">
                        <span
                          key={active?.id ?? "empty"}
                          ref={mediaRef}
                          className="gallery-lens__media"
                        >
                          {active ? (
                            <Image
                              src={active.coverImage}
                              alt={active.alt}
                              fill
                              priority
                              draggable={false}
                              sizes="(max-width: 767px) 82vw, 620px"
                            />
                          ) : null}
                        </span>
                      </span>
                      <span
                        className="gallery-lens__coating"
                        aria-hidden="true"
                      />
                      <span
                        className="gallery-lens__reflections"
                        aria-hidden="true"
                      />
                      <span
                        className="gallery-lens__vignette"
                        aria-hidden="true"
                      />
                      <span
                        key={`flare-${active?.id ?? "empty"}`}
                        className="gallery-lens__flare"
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      className="gallery-lens__hud"
                      aria-hidden="true"
                    >
                      <span className="gallery-lens__brackets" />
                      <span className="gallery-lens__rec">
                        REC<span className="gallery-lens__rec-dot" />
                      </span>
                      <span className="gallery-lens__af">AF</span>
                      <span
                        key={`focus-${active?.id ?? "empty"}`}
                        className="gallery-lens__focus"
                      />
                    </span>

                    <Aperture holeRef={holeRef} />
                    <span
                      ref={flashRef}
                      className="gallery-lens__flash"
                      aria-hidden="true"
                    />
                    <span className="gallery-lens__open" aria-hidden="true">
                      Open ↗
                    </span>
                  </button>
                </div>
              </div>

              <div className="gallery-camera__controls">
                <div className="gallery-camera__rewind">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous event"
                    data-tip="Previous"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next event"
                    data-tip="Next"
                  >
                    →
                  </button>
                </div>

                <div className="gallery-camera__readout">
                  <span className="gallery-camera__frame" aria-live="polite">
                    <RollText value={frame} />
                    <i aria-hidden="true">/</i>
                    <span className="gallery-camera__frame-total">
                      {total}
                    </span>
                  </span>
                  <span className="gallery-camera__specs">
                    f/1.8 <i aria-hidden="true">·</i> 1/250{" "}
                    <i aria-hidden="true">·</i> ISO 400
                  </span>
                </div>

                <button
                  type="button"
                  className="gallery-camera__shutter"
                  onClick={openActive}
                  aria-label={`Open ${active?.title ?? "SELAH"} gallery`}
                >
                  <span
                    className="gallery-camera__shutter-dot"
                    aria-hidden="true"
                  />
                  Press to open gallery
                </button>
              </div>

              <span className="gallery-camera__grip" aria-hidden="true" />
            </div>
          </div>

          <div
            className="gallery-film"
            role="group"
            aria-label="Film strip preview"
          >
            <div
              ref={filmRef}
              className="gallery-film__track"
              onPointerDown={onFilmPointerDown}
              onPointerMove={onFilmPointerMove}
              onPointerUp={onFilmPointerUp}
              onPointerCancel={onFilmPointerUp}
            >
              {filtered.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  data-frame={index}
                  className={`gallery-film__frame ${
                    index === activeIndex ? "is-active" : ""
                  }`}
                  onClick={() => selectFrame(index)}
                  aria-label={`Preview ${item.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  <span className="gallery-film__thumb">
                    <Image
                      src={item.coverImage}
                      alt=""
                      fill
                      draggable={false}
                      sizes="(max-width: 767px) 30vw, 180px"
                    />
                  </span>
                  <span className="gallery-film__no" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            ref={wipeRef}
            className="gallery-shutter-wipe"
            aria-hidden="true"
          />
        </section>
      </main>

      {indexOpen ? (
        <IndexOverlay
          items={ITEMS}
          onClose={() => setIndexOpen(false)}
          onOpen={(item) => {
            setIndexOpen(false);
            runShutter(item);
          }}
        />
      ) : null}
    </div>
  );
}

function RollText({ value }: { value: string }) {
  return (
    <span className="gallery-roll">
      <span key={value} className="gallery-roll__inner">
        {value}
      </span>
    </span>
  );
}

function Aperture({
  holeRef,
}: {
  holeRef: RefObject<SVGPolygonElement | null>;
}) {
  return (
    <svg
      className="gallery-lens__aperture"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask
          id="gallery-aperture-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="200"
        >
          <rect width="200" height="200" fill="#fff" />
          <polygon
            ref={holeRef}
            className="gallery-lens__aperture-hole"
            points={APERTURE_HOLE}
            fill="#000"
          />
        </mask>
      </defs>
      <g mask="url(#gallery-aperture-mask)">
        <circle
          cx="100"
          cy="100"
          r="100"
          fill="var(--shutter-color)"
        />
        {APERTURE_SEAMS.map((points) => {
          const [x1, y1, x2, y2] = points.split(" ");
          return (
            <line
              key={points}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 241, 203, 0.16)"
              strokeWidth="1.2"
            />
          );
        })}
      </g>
    </svg>
  );
}

function IndexOverlay({
  items,
  onClose,
  onOpen,
}: {
  items: GalleryItem[];
  onClose: () => void;
  onOpen: (item: GalleryItem) => void;
}) {
  return (
    <div
      className="gallery-index"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-index-title"
      onClick={onClose}
    >
      <div className="gallery-index__bar">
        <p>SELAH Gallery / Index</p>
        <button type="button" onClick={onClose} autoFocus>
          Close ×
        </button>
      </div>

      <div
        className="gallery-index__inner"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="gallery-eyebrow">
          {items.length} events / 2026 / Pune
        </p>
        <h2 id="gallery-index-title">Every event.</h2>

        <div className="gallery-index__list">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onOpen(item)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>
                {item.type === "sport" ? "Sport" : "Cultural"} · 2026 · Pune
              </small>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

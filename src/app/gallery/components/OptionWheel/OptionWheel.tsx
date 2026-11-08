"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./OptionWheel.css";

interface OptionWheelProps {
  items?: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  onActivate?: (index: number, item: string) => void;
  textColor?: string;
  activeColor?: string;
  side?: "left" | "right";
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  wheelEnabled?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  className?: string;
  ariaLabel?: string;
}

interface WheelConfig {
  count: number;
  items: string[];
  rowH: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: "left" | "right";
  loop: boolean;
  smoothing: number;
  draggable: boolean;
  wheelEnabled: boolean;
  soundUrl: string;
  soundVolume: number;
}

const DEFAULT_ITEMS = [
  "Ambient",
  "House",
  "Techno",
  "Jazz",
  "Lo-Fi",
  "Synthwave",
  "Trance",
  "Funk",
  "Disco",
  "Hip-Hop",
  "Chillwave",
  "Drum & Bass",
];

function readRemPx() {
  if (typeof window === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

export default function OptionWheel({
  items = DEFAULT_ITEMS,
  defaultSelected = 3,
  onChange,
  onActivate,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  wheelEnabled = true,
  soundUrl = "",
  soundVolume = 0.5,
  className = "",
  ariaLabel = "Option wheel",
}: OptionWheelProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const initialSelected = Math.min(
    Math.max(defaultSelected, 0),
    Math.max(items.length - 1, 0),
  );
  const posRef = useRef(initialSelected);
  const targetRef = useRef(initialSelected);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const cfgRef = useRef<WheelConfig>({
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * 16, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    wheelEnabled,
    soundUrl,
    soundVolume,
  });
  const onChangeRef = useRef(onChange);
  const onActivateRef = useRef(onActivate);
  const selectedRef = useRef(initialSelected);
  const wheelTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef("");
  const lastTickRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(initialSelected);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onActivateRef.current = onActivate;
  }, [onActivate]);

  // Single rAF loop that eases the wheel position toward its target with
  // frame-rate independent exponential smoothing, then lays every option out
  // along the curve based on its distance from the current position.
  const runFrame = useCallback(function frame(now: number) {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const cfg = cfgRef.current;
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    const target = targetRef.current;
    const cur = posRef.current;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    posRef.current = next;

    const els = itemRefs.current;
    const n = cfg.count;
    const mirror = cfg.side === "right" ? -1 : 1;
    // Options sit on a circle whose radius keeps the arc length between two
    // neighbors equal to one row height, so tilt controls how tightly it curls.
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const radius = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (!el) continue;
      let distance = i - next;
      if (cfg.loop && n > 1) {
        distance = ((distance % n) + n) % n;
        if (distance > n / 2) distance -= n;
      }
      const dist = Math.abs(distance);
      let x = 0;
      let y = distance * cfg.rowH;
      let rotation = 0;

      if (radius > 0) {
        const angle = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, distance * tiltRad),
        );
        y = radius * Math.sin(angle);
        x = -mirror * radius * (1 - Math.cos(angle)) * cfg.curve;
        rotation = (mirror * angle * 180) / Math.PI;
      }

      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter =
        cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : "none";
      el.style.setProperty(
        "--ow-p",
        Math.max(0, 1 - Math.min(dist, 1)).toFixed(4),
      );
    }

    rafRef.current = settled ? null : requestAnimationFrame(frame);
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  // Optional tick on selection change, throttled so fast scrolling can't spam
  // it, and with playback failures (e.g. autoplay policies) silently ignored.
  const playTick = useCallback(() => {
    const { soundUrl: nextSoundUrl, soundVolume: nextVolume } = cfgRef.current;
    if (!nextSoundUrl) return;
    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;
    if (!audioRef.current || audioUrlRef.current !== nextSoundUrl) {
      audioRef.current = new Audio(nextSoundUrl);
      audioRef.current.preload = "auto";
      audioUrlRef.current = nextSoundUrl;
    }
    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(nextVolume, 0), 1);
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }, []);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const cfg = cfgRef.current;
      if (cfg.count === 0) return;
      let next = value;
      if (!cfg.loop) {
        next = Math.min(Math.max(next, 0), Math.max(cfg.count - 1, 0));
      }
      if (snap) next = Math.round(next);
      targetRef.current = next;
      const index = ((Math.round(next) % cfg.count) + cfg.count) % cfg.count;
      if (index !== selectedRef.current) {
        selectedRef.current = index;
        setSelectedIndex(index);
        onChangeRef.current?.(index, cfg.items[index]);
        playTick();
      }
      startLoop();
    },
    [playTick, startLoop],
  );

  // Keep the live config in a ref so the rAF loop always reads fresh values
  // without restarting on every render.
  useEffect(() => {
    const remPx = readRemPx();
    cfgRef.current = {
      count: items.length,
      items,
      rowH: Math.max(fontSize * spacing * remPx, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
      draggable,
      wheelEnabled,
      soundUrl,
      soundVolume,
    };
    applyTarget(targetRef.current, false);
  }, [
    applyTarget,
    blur,
    curve,
    draggable,
    fade,
    fontSize,
    items,
    loop,
    minOpacity,
    side,
    smoothing,
    soundUrl,
    soundVolume,
    spacing,
    tilt,
    wheelEnabled,
  ]);

  // Wheel / touchpad scrolling, registered manually so it can be non-passive.
  // At the first/last option the event is released so the page can scroll.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const cfg = cfgRef.current;
      if (!cfg.wheelEnabled || cfg.count === 0) return;

      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      if (delta === 0) return;

      const atStart = !cfg.loop && targetRef.current <= 0 && delta < 0;
      const atEnd =
        !cfg.loop && targetRef.current >= cfg.count - 1 && delta > 0;

      if (atStart || atEnd) return;

      event.preventDefault();
      // Cap each event at one step so notchy mouse wheels move exactly one
      // option per click, while touchpads still scroll continuously.
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(
        () => applyTarget(targetRef.current, true),
        140,
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!cfgRef.current.draggable || cfgRef.current.count === 0) return;
      dragRef.current = {
        y: event.clientY,
        start: targetRef.current,
        id: event.pointerId,
      };
      dragMovedRef.current = false;
      setIsDragging(true);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dy = event.clientY - drag.y;

      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true;
        // Capture only once a real drag starts, so plain clicks still reach
        // the items and navigate to them.
        rootRef.current?.setPointerCapture(drag.id);
      }

      if (dragMovedRef.current) {
        applyTarget(drag.start - dy / cfgRef.current.rowH, false);
      }
    },
    [applyTarget],
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    (index: number) => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      if (cfg.count === 0) return;
      const current = targetRef.current;
      let delta = index - (((current % cfg.count) + cfg.count) % cfg.count);

      if (cfg.loop && cfg.count > 1) {
        if (delta > cfg.count / 2) delta -= cfg.count;
        else if (delta < -cfg.count / 2) delta += cfg.count;
      }

      applyTarget(current + delta, true);
    },
    [applyTarget],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      let delta: number | null = null;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") delta = -1;
      else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        delta = 1;
      }

      if (delta != null) {
        event.preventDefault();
        applyTarget(Math.round(targetRef.current) + delta, true);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const cfg = cfgRef.current;
        onActivateRef.current?.(
          selectedRef.current,
          cfg.items[selectedRef.current],
        );
      }
    },
    [applyTarget],
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      audioRef.current?.pause();
    },
    [],
  );

  const activeOptionId =
    items.length > 0 ? `${listboxId}-option-${selectedIndex}` : undefined;
  const rootStyle = {
    "--ow-text-color": textColor,
    "--ow-active-color": activeColor,
    "--ow-font-size": `${fontSize}rem`,
    "--ow-inset": `${inset}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      role="listbox"
      aria-label={ariaLabel}
      aria-orientation="vertical"
      aria-activedescendant={activeOptionId}
      tabIndex={0}
      className={`option-wheel${side === "right" ? " option-wheel--right" : ""}${isDragging ? " option-wheel--dragging" : ""}${className ? ` ${className}` : ""}`}
      style={rootStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          id={`${listboxId}-option-${index}`}
          role="option"
          aria-selected={selectedIndex === index}
          className={`option-wheel__item${selectedIndex === index ? " option-wheel__item--selected" : ""}`}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

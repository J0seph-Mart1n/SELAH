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
} from "react";
import { useApertureTransition } from "./components/ApertureTransition";
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

const DIAL_DETENT_DEG = 24;
const DIAL_TICKS = Array.from({ length: 60 }, (_, i) => i * 6);

export default function GalleryClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShuttering, setIsShuttering] = useState(false);
  const [ambient, setAmbient] = useState(FALLBACK_ACCENT.sport);
  const [dialAngle, setDialAngle] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { triggerTransition } = useApertureTransition();
  const filtered = useMemo(
    () =>
      ITEMS.filter((item) => filter === "all" || item.type === filter),
    [filter],
  );
  const active = filtered[activeIndex] ?? filtered[0];
  const stageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const dialAngleRef = useRef(0);
  const dialDragRef = useRef({
    active: false,
    centerX: 0,
    centerY: 0,
    lastAngle: 0,
    accumulatedAngle: 0,
    baseDialAngle: 0,
    stepsTaken: 0,
  });
  const suppressClick = useRef(false);
  const suppressTimer = useRef<number | null>(null);
  const shutteringRef = useRef(false);
  const filmDrag = useRef({ active: false, x: 0, left: 0, moved: false });
  const filmSuppress = useRef(false);
  const filmTimer = useRef<number | null>(null);

  const frame = String(activeIndex + 1).padStart(2, "0");
  const total = String(filtered.length).padStart(2, "0");
  const mode = active?.type === "sport" ? "SPORT" : "CULTURAL";

  const updateDialAngle = useCallback((nextAngle: number) => {
    dialAngleRef.current = nextAngle;
    setDialAngle(nextAngle);
  }, []);

  const changeFilter = useCallback(
    (next: Filter) => {
      setFilter(next);
      setActiveIndex(0);
      updateDialAngle(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateDialAngle],
  );

  const step = useCallback(
    (direction: number, rotateDial = true) => {
      if (filtered.length < 2) return;
      setActiveIndex(
        (current) =>
          (current + direction + filtered.length) % filtered.length,
      );
      if (rotateDial) {
        updateDialAngle(dialAngleRef.current + direction * DIAL_DETENT_DEG);
      }
    },
    [filtered.length, updateDialAngle],
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

      const lensRect = lensRef.current?.getBoundingClientRect();
      const origin = lensRect
        ? {
            x: lensRect.left + lensRect.width / 2,
            y: lensRect.top + lensRect.height / 2,
          }
        : undefined;

      // Trigger the full-page WebGL 3D aperture blades close -> navigate -> open animation
      triggerTransition(`/gallery/${item.id}`, origin);
    },
    [triggerTransition],
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
    if (shutteringRef.current) return;
    const rect =
      lensRef.current?.getBoundingClientRect() ??
      event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const outerRadius = rect.width / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distFromCenter = Math.hypot(dx, dy);

    // Only initiate dial rotation when grabbing the outer dial ring (outside the inner lens glass)
    if (outerRadius <= 0 || distFromCenter / outerRadius < 0.72) {
      dialDragRef.current.active = false;
      suppressClick.current = false;
      return;
    }

    const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    dialDragRef.current = {
      active: true,
      centerX,
      centerY,
      lastAngle: initialAngle,
      accumulatedAngle: 0,
      baseDialAngle: dialAngleRef.current,
      stepsTaken: 0,
    };
    suppressClick.current = true;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dialDragRef.current;
    if (!drag.active) return;

    const dxCenter = event.clientX - drag.centerX;
    const dyCenter = event.clientY - drag.centerY;
    const radius = Math.hypot(dxCenter, dyCenter);
    if (radius < 24) return;

    const currentAngle = Math.atan2(dyCenter, dxCenter) * (180 / Math.PI);

    let angleDelta = currentAngle - drag.lastAngle;
    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;

    drag.lastAngle = currentAngle;
    drag.accumulatedAngle += angleDelta;

    if (Math.abs(drag.accumulatedAngle) <= 2.5) {
      return;
    }

    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    suppressClick.current = true;
    setIsDragging(true);

    updateDialAngle(drag.baseDialAngle + drag.accumulatedAngle);

    const targetSteps = Math.trunc(drag.accumulatedAngle / DIAL_DETENT_DEG);
    if (targetSteps !== drag.stepsTaken) {
      const stepDiff = targetSteps - drag.stepsTaken;
      drag.stepsTaken = targetSteps;
      step(stepDiff, false);
    }
  };

  const finishDialDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    const drag = dialDragRef.current;
    if (!drag.active) return;
    drag.active = false;

    if (suppressClick.current) {
      // Snap dial cleanly to the current detent stop
      const snappedAngle =
        drag.baseDialAngle + drag.stepsTaken * DIAL_DETENT_DEG;
      updateDialAngle(snappedAngle);

      if (suppressTimer.current) window.clearTimeout(suppressTimer.current);
      suppressTimer.current = window.setTimeout(() => {
        suppressClick.current = false;
      }, 350);
    }

    setIsDragging(false);
    if (
      event &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDialDrag(event);
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDialDrag(event);
  };

  const onFilmPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    filmDrag.current = {
      active: true,
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
      moved: false,
    };
    filmSuppress.current = false;
  };

  const onFilmPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!filmDrag.current.active) return;
    if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
      filmDrag.current.active = false;
      return;
    }
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
    if (!filmDrag.current.active) return;
    filmDrag.current.active = false;
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
    const diff = index - activeIndex;
    setActiveIndex(index);
    updateDialAngle(dialAngleRef.current + diff * DIAL_DETENT_DEG);
  };

  const openActive = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (active) runShutter(active);
  };

  const cameraStyle = {
    "--ambient": ambient,
    "--dial-angle": `${dialAngle}deg`,
  } as CSSProperties;

  return (
    <div className="selah-gallery">
      <main className="gallery-home gallery-camera-page">
        <header className="gallery-camera__heading">
          <div className="gallery-camera__meta-pill">
            <span className="gallery-camera__meta-tag">{mode}</span>
            <span className="gallery-camera__meta-dot" aria-hidden="true" />
            <span className="gallery-camera__meta-count">
              Event {frame} of {total}
            </span>
          </div>
          <h1
            id="gallery-title"
            className="gallery-camera__title"
            aria-live="polite"
          >
            {active?.title ?? "SELAH Gallery"}
          </h1>
        </header>

        <section
          className={`gallery-camera ${isDragging ? "is-dragging" : ""}`}
          aria-labelledby="gallery-title"
          aria-busy={isShuttering}
          data-shuttering={isShuttering ? "true" : "false"}
          style={cameraStyle}
        >
          <div className="gallery-camera__shell">
            <div className="gallery-camera__chassis">
              <header className="gallery-camera__plate">
                <div
                  className="camera-mode"
                  onKeyDown={onDialKeyDown}
                  role="group"
                  aria-label="Filter gallery"
                >
                  {FILTERS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => changeFilter(option.id)}
                      aria-pressed={filter === option.id}
                      className={filter === option.id ? "is-active" : undefined}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="gallery-camera__readout" aria-live="polite">
                  <span className="gallery-camera__frame">
                    <RollText value={frame} />
                    <i aria-hidden="true">/</i>
                    <span className="gallery-camera__frame-total">{total}</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="gallery-camera__index"
                  onClick={() => setIndexOpen(true)}
                >
                  <span>Index</span>
                  <span className="gallery-camera__index-icon" aria-hidden="true">
                    ↗
                  </span>
                </button>
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
                    <span
                      className="gallery-lens__index-mark"
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="gallery-lens"
                      onClick={openActive}
                      aria-label={`Rotate dial ring to switch events or press center to open ${active?.title ?? "SELAH"} gallery`}
                      aria-disabled={isShuttering}
                    >
                      <span
                        className="gallery-lens__barrel"
                        aria-hidden="true"
                      />
                      <span
                        className="gallery-lens__knurl"
                        aria-hidden="true"
                      />
                      <span
                        className="gallery-lens__engraving"
                        aria-hidden="true"
                      >
                        <svg
                          className="gallery-lens__dial-ring"
                          viewBox="0 0 200 200"
                          focusable="false"
                        >
                          {DIAL_TICKS.map((deg) => {
                            const isMajor = deg % DIAL_DETENT_DEG === 0;
                            const isOrigin = deg === 0;
                            return (
                              <line
                                key={deg}
                                x1="100"
                                y1={isOrigin ? "10.5" : isMajor ? "12" : "13.8"}
                                x2="100"
                                y2={isOrigin ? "19" : isMajor ? "17.8" : "16.5"}
                                className={
                                  isOrigin
                                    ? "gallery-lens__tick gallery-lens__tick--origin"
                                    : isMajor
                                    ? "gallery-lens__tick gallery-lens__tick--major"
                                    : "gallery-lens__tick"
                                }
                                transform={`rotate(${deg} 100 100)`}
                              />
                            );
                          })}
                          <circle
                            cx="100"
                            cy="14.8"
                            r="2.1"
                            className="gallery-lens__dial-pip"
                          />
                        </svg>
                      </span>

                      <span className="gallery-lens__glass">
                        <span className="gallery-lens__media">
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
                        <span
                          className="gallery-lens__vignette"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="gallery-camera__controls">
                  <button
                    type="button"
                    className="gallery-camera__step-btn"
                    onClick={() => step(-1)}
                    aria-label="Previous event"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    className="gallery-camera__shutter"
                    onClick={openActive}
                    aria-label={`Open ${active?.title ?? "SELAH"} gallery`}
                  >
                    <span>Open Gallery</span>
                    <span
                      className="gallery-camera__shutter-icon"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </button>

                  <button
                    type="button"
                    className="gallery-camera__step-btn"
                    onClick={() => step(1)}
                    aria-label="Next event"
                  >
                    →
                  </button>
                </div>
              </div>
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

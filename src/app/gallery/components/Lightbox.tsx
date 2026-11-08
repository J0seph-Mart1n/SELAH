"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useGalleryReducedMotion } from "../hooks/useGalleryReducedMotion";
import type { Photo } from "../data/photos";

interface LightboxProps {
  open: boolean;
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const CATEGORY_LABEL: Record<Photo["category"], string> = {
  sports: "Sports",
  cultural: "Cultural",
};

const CLOSE_DURATION = 240;

export default function Lightbox({
  open,
  photos,
  index,
  onIndexChange,
  onClose,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeTimerRef = useRef<number | null>(null);
  const closingRef = useRef(false);
  const reduceMotion = useGalleryReducedMotion();

  const active = photos[index];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (photos.length === 0) return;
      const wrapped = (nextIndex + photos.length) % photos.length;
      onIndexChange(wrapped);
    },
    [onIndexChange, photos.length],
  );

  const previous = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  const closeDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closingRef.current) return;

    if (reduceMotion) {
      dialog.close();
      return;
    }

    closingRef.current = true;
    dialog.setAttribute("data-closing", "true");
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      if (!closingRef.current) return;
      closingRef.current = false;
      dialog.removeAttribute("data-closing");
      if (dialog.open) dialog.close();
    }, CLOSE_DURATION);
  }, [reduceMotion]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      closingRef.current = false;
      dialog.removeAttribute("data-closing");
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      if (!dialog.open) dialog.showModal();
    } else {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (dialog.open) dialog.close();
      lastFocusedRef.current?.focus({ preventScroll: true });
      lastFocusedRef.current = null;
    }
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (closingRef.current) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDialog, next, open, previous]);

  useEffect(() => {
    if (!open || photos.length < 2) return;

    const targets = [
      (index + 1) % photos.length,
      (index - 1 + photos.length) % photos.length,
    ];
    targets.forEach((target) => {
      const image = new window.Image();
      image.src = photos[target].src;
    });
  }, [index, open, photos]);

  useEffect(() => {
    if (!open) return;
    thumbRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [index, open, reduceMotion]);

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeDialog();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) next();
      else previous();
    }
  }

  const progress = photos.length > 0 ? ((index + 1) / photos.length) * 100 : 0;

  return (
    <dialog
      ref={dialogRef}
      className="gallery-lightbox"
      aria-labelledby="gallery-lightbox-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={onClose}
      onClick={handleDialogClick}
    >
      <div className="flex h-[100dvh] w-full flex-col bg-[#1a0813]/96">
        <header className="flex shrink-0 items-center justify-between gap-4 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[#63752e] sm:block" />
            <p className="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-[#fff1cb]/65">
              SELAH 2026 · Lookbook
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#fff1cb]/65">
              {photos.length > 0 ? String(index + 1).padStart(2, "0") : "00"} /{" "}
              {String(photos.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close gallery viewer"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#fff1cb]/15 text-[#fff1cb]/75 transition-colors hover:border-[#fff1cb]/40 hover:text-[#fff1cb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff1cb]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="relative h-px w-full overflow-hidden bg-[#fff1cb]/10">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 bg-[#63752e] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {active ? (
          <>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-1 sm:px-16">
              <div
                className="relative h-full w-full max-w-[1280px] touch-pan-y select-none"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  swipeStartRef.current = null;
                }}
              >
                <Image
                  key={active.id}
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="100vw"
                  priority
                  className="gallery-lightbox-image object-contain"
                  draggable={false}
                />
              </div>

              <button
                type="button"
                onClick={previous}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#fff1cb]/15 bg-[#1a0813]/55 text-[#fff1cb]/80 backdrop-blur-md transition-colors hover:border-[#fff1cb]/40 hover:text-[#fff1cb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff1cb] sm:left-3"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#fff1cb]/15 bg-[#1a0813]/55 text-[#fff1cb]/80 backdrop-blur-md transition-colors hover:border-[#fff1cb]/40 hover:text-[#fff1cb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff1cb] sm:right-3"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <footer className="shrink-0 border-t border-[#fff1cb]/10 bg-[#1a0813]/85 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:px-6">
              <div className="mx-auto flex w-full max-w-[1280px] items-end justify-between gap-6">
                <div key={active.id} className="gallery-lightbox-caption min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/65">
                    Frame {String(index + 1).padStart(2, "0")} ·{" "}
                    {CATEGORY_LABEL[active.category]}
                  </p>
                  <h2
                    id="gallery-lightbox-title"
                    className="gallery-display mt-1.5 truncate text-lg font-semibold tracking-[-0.02em] text-[#fff1cb] sm:text-2xl"
                  >
                    {active.title}
                  </h2>
                  <p className="mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-[#fff1cb]/65">
                    {active.subtitle}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right md:block">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/50">
                    Use ← → to move · Esc to close
                  </p>
                  <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/35">
                    Swipe on touch
                  </p>
                </div>
              </div>

              <div className="gallery-rail mx-auto mt-4 hidden w-full max-w-[1280px] gap-2 overflow-x-auto pb-1 sm:flex">
                {photos.map((photo, photoIndex) => (
                  <button
                    key={photo.id}
                    ref={(node) => {
                      thumbRefs.current[photoIndex] = node;
                    }}
                    type="button"
                    onClick={() => goTo(photoIndex)}
                    aria-label={`View ${photo.title}`}
                    aria-current={photoIndex === index ? "true" : undefined}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden border transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff1cb] ${
                      photoIndex === index
                        ? "border-[#63752e] opacity-100"
                        : "border-[#fff1cb]/10 opacity-45 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-sm text-[#fff1cb]/50">No frame selected.</p>
          </div>
        )}
      </div>
    </dialog>
  );
}

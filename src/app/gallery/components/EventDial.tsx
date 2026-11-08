"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import OptionWheel from "./OptionWheel/OptionWheel";
import { useGalleryMediaQuery } from "../hooks/useGalleryMediaQuery";
import { useGalleryReducedMotion } from "../hooks/useGalleryReducedMotion";
import { getAct, type GalleryEvent } from "../data/events";

interface EventDialProps {
  events: GalleryEvent[];
  onOpenEvent: (event: GalleryEvent) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function EventDial({ events, onOpenEvent }: EventDialProps) {
  const reduceMotion = useGalleryReducedMotion();
  const isDesktop = useGalleryMediaQuery("(min-width: 1024px)");
  const defaultIndex = useMemo(() => {
    const firstArtwork = events.findIndex((event) => event.photo);
    return firstArtwork >= 0 ? firstArtwork : 0;
  }, [events]);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const wheelItems = useMemo(() => events.map((event) => event.name), [events]);
  const activeEvent = events[activeIndex] ?? events[0];

  if (!activeEvent) return null;

  const photo = activeEvent.photo;
  const act = getAct(activeEvent.act);

  return (
    <div id="event-index" className="scroll-mt-40 md:scroll-mt-44">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="gallery-display text-[clamp(1.8rem,3.2vw,3rem)] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-[#fff1cb]">
            Choose an event.
          </h3>
        </div>
        <p className="max-w-md text-sm leading-7 text-[#fff1cb]/60 sm:text-right">
          Use the wheel to browse sports and cultural events.
        </p>
      </div>

      <div className="gallery-event-index-grid mt-7 grid gap-3 lg:grid-cols-[0.38fr_0.62fr] lg:items-stretch">
        <div className="gallery-event-wheel-panel order-2 flex flex-col overflow-hidden border border-[#fff1cb]/12 bg-[#1a0813]/18 backdrop-blur-sm lg:order-1 lg:h-full">
          <div className="gallery-event-wheel-canvas relative min-h-[300px] flex-1 sm:min-h-[340px]">
            <OptionWheel
              items={wheelItems}
              defaultSelected={defaultIndex}
              onChange={(index) => setActiveIndex(index)}
              onActivate={(index) => {
                const nextEvent = events[index];
                if (nextEvent) onOpenEvent(nextEvent);
              }}
              textColor="rgba(255,241,203,0.34)"
              activeColor="#fff1cb"
              side="left"
              fontSize={isDesktop ? 2.55 : 1.55}
              spacing={isDesktop ? 1.42 : 1.38}
              curve={0.82}
              tilt={4.6}
              blur={1.4}
              fade={0.24}
              minOpacity={0.1}
              smoothing={reduceMotion ? 1 : 190}
              inset={isDesktop ? 22 : 14}
              loop
              draggable={isDesktop}
              wheelEnabled={isDesktop}
              ariaLabel="SELAH event index"
              className="event-wheel"
            />
          </div>

          <div className="flex items-center border-t border-[#fff1cb]/10 px-4 py-3 sm:px-5">
            <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-[#fff1cb]/70">
              {activeEvent.name}
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:h-full">
          <div className="gallery-event-stage relative h-full overflow-hidden border border-[#fff1cb]/12 bg-[#1a0813]/30">
            <AnimatePresence initial={false} mode="sync">
              {photo ? (
                <motion.div
                  key={activeEvent.id}
                  initial={
                    reduceMotion ? false : { opacity: 0, scale: 1.025 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.62,
                    ease: EASE,
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0813]/90 via-[#1a0813]/20 to-[#1a0813]/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a0813]/55 via-transparent to-transparent" />
                </motion.div>
              ) : (
                <motion.div
                  key={activeEvent.id}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4 }}
                  className="gallery-event-opening absolute inset-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0813]/85 via-transparent to-[#1a0813]/20" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between p-5 sm:p-7 lg:min-h-0">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/55">
                  {act.label}
                </p>
              </div>

              <div className="max-w-2xl">
                <h4 className="gallery-display text-[clamp(2.6rem,7vw,6.2rem)] font-bold uppercase leading-[0.84] tracking-[-0.065em] text-[#fff1cb]">
                  {activeEvent.name}
                </h4>
                <p className="mt-3 max-w-lg text-sm leading-6 text-[#fff1cb]/65">
                  {photo
                    ? photo.title !== activeEvent.name
                      ? `${photo.title} · Event artwork`
                      : photo.subtitle
                    : "Official inauguration artwork is not in the archive yet. This chapter is held open for it."}
                </p>

                <button
                  type="button"
                  onClick={() => onOpenEvent(activeEvent)}
                  aria-label={`${photo ? "Open" : "Jump to"} ${activeEvent.name}`}
                  className="group mt-6 inline-flex min-h-11 items-center gap-3 border-b border-[#fff1cb]/25 pb-2 !text-[10px] !font-bold uppercase tracking-[0.14em] text-[#fff1cb] transition-colors hover:border-[#fff1cb]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff1cb]"
                >
                  {photo ? "Open this event" : "Jump to opening"}
                  <ArrowDown
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              Selected event: {activeEvent.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

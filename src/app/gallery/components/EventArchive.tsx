"use client";

import {
  useCallback,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ArrowUpRight } from "lucide-react";
import Masonry, { type MasonryItem } from "./Masonry/Masonry";
import {
  EVENT_ACTS,
  type EventActId,
  type GalleryEvent,
} from "../data/events";
import type { Photo } from "../data/photos";

interface EventArchiveProps {
  events: GalleryEvent[];
  onOpen: (photo: Photo) => void;
}

interface OpeningCardProps {
  event: GalleryEvent;
}

function OpeningCard({ event }: OpeningCardProps) {
  return (
    <div className="gallery-event-opening-card relative overflow-hidden border border-[#fff1cb]/15 bg-[#1a0813]/20 px-6 py-7 sm:px-9 sm:py-9 lg:px-12 lg:py-12">
      <div className="gallery-grain absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex flex-col gap-10 sm:gap-14">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/50">
            Opening chapter
          </p>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#63752e]" />
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/50">
              The chapter before the first event
            </p>
          </div>
          <h4 className="gallery-display mt-4 text-[clamp(2.8rem,8vw,7rem)] font-bold uppercase leading-[0.82] tracking-[-0.065em] text-[#fff1cb]">
            {event.name}
          </h4>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#fff1cb]/65 sm:text-base">
            Official inauguration artwork is not in the archive yet. This
            chapter is held open for it. No photograph or poster has been
            invented to fill the gap.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#fff1cb]/12 pt-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/45">
            05 December 2026
          </p>
          <p className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#fff1cb]/45">
            Carmel Parish, Pune
            <ArrowUpRight className="h-3 w-3 text-[#63752e]" aria-hidden="true" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EventArchive({ events, onOpen }: EventArchiveProps) {
  const photosById = useMemo(() => {
    const map = new Map<string, Photo>();
    events.forEach((event) => {
      if (event.photo) map.set(event.photo.id, event.photo);
    });
    return map;
  }, [events]);

  const itemsByAct = useMemo(() => {
    const result = new Map<EventActId, MasonryItem[]>();

    EVENT_ACTS.forEach((act) => {
      const items = events
        .filter(
          (event): event is GalleryEvent & { photo: Photo } =>
            event.act === act.id && event.photo !== null,
        )
        .map((event) => {
          const photo = event.photo;

          return {
            id: photo.id,
            img: photo.src,
            width: photo.width,
            height: photo.height,
            title: event.name,
            description:
              photo.title !== event.name
                ? `${photo.title} · Event artwork`
                : "Event artwork",
            alt: photo.alt,
            anchor: `event-${event.id}`,
          };
        });

      result.set(act.id, items);
    });

    return result;
  }, [events]);

  const openArtwork = useCallback(
    (
      item: MasonryItem,
      _index: number,
      event: ReactMouseEvent<HTMLElement>,
    ) => {
      event.preventDefault();
      const photo = photosById.get(item.id);
      if (photo) onOpen(photo);
    },
    [onOpen, photosById],
  );

  return (
    <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
      {EVENT_ACTS.map((act) => {
        const actEvents = events.filter((event) => event.act === act.id);
        if (actEvents.length === 0) return null;

        const masonryItems = itemsByAct.get(act.id) ?? [];
        const isOpening = act.id === "opening";

        return (
          <section
            key={act.id}
            id={`chapter-${act.id}`}
            aria-labelledby={`chapter-${act.id}-title`}
            className="scroll-mt-28 md:scroll-mt-32"
          >
            <div className="grid gap-5 border-t border-[#fff1cb]/15 pt-5 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
              <div>
                <h3
                  id={`chapter-${act.id}-title`}
                  className="gallery-display text-[clamp(2.4rem,6vw,4.8rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em] text-[#fff1cb]"
                >
                  {act.label}
                </h3>
              </div>
              <div className="lg:pt-1 lg:text-right">
                <p className="text-sm leading-7 text-[#fff1cb]/60">
                  {act.blurb}
                </p>
              </div>
            </div>

            {isOpening ? (
              <div className="mt-7">
                {actEvents.map((event) => (
                  <OpeningCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Masonry
                className="gallery-event-masonry mt-7"
                items={masonryItems}
                columns="auto"
                columnWidth={340}
                gap={16}
                radius={2}
                animateFrom="bottom"
                stagger={0.04}
                duration={0.55}
                bounce={0.12}
                blurToFocus
                revealOnScroll
                hoverEffect="zoom"
                focusOnHover={false}
                captions="always"
                parallax={0.08}
                lightbox={false}
                draggable={false}
                onItemClick={openArtwork}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}

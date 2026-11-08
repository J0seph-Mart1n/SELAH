"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { Photo } from "../data/photos";

interface HeroProps {
  photos: Photo[];
}

export default function Hero({ photos }: HeroProps) {
  const lead = photos[0];

  return (
    <section
      aria-labelledby="gallery-hero-title"
      className="gallery-grain relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pb-12 md:min-h-[72svh] md:pt-28"
    >
      {lead ? (
        <div className="gallery-hero-visual absolute inset-0 -z-10">
          <Image
            src={lead.src}
            alt={lead.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#611e3c] via-[#611e3c]/55 to-[#611e3c]/15" />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-[1520px] items-end justify-between gap-8">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#fff1cb]/70">
            SELAH 2026
          </p>
          <h1
            id="gallery-hero-title"
            className="gallery-display mt-4 text-[clamp(4.5rem,15vw,13rem)] font-bold uppercase leading-[0.78] tracking-[-0.07em] text-[#fff1cb]"
          >
            Gallery
          </h1>
        </div>

        <a
          href="#archive"
          className="group mb-2 inline-flex shrink-0 items-center gap-3 border-b border-[#fff1cb]/35 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#fff1cb] transition-colors hover:border-[#fff1cb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff1cb]"
        >
          Browse events
          <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

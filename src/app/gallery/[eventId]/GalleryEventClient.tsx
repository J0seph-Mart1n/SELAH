"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useApertureTransition } from "../components/ApertureTransition";
import type { GalleryAsset, GalleryItem } from "../data/galleryItems";

export default function GalleryEventClient({ item, next }: { item: GalleryItem; next: GalleryItem }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStart = useRef(0);
  const activeAsset = lightboxIndex === null ? null : item.gallery[lightboxIndex];
  const { triggerTransition } = useApertureTransition();

  const close = useCallback(() => setLightboxIndex(null), []);
  const move = useCallback((direction: number) => {
    setLightboxIndex((current) => current === null ? current : (current + direction + item.gallery.length) % item.gallery.length);
  }, [item.gallery.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [close, lightboxIndex, move]);

  return (
    <article className="selah-gallery gallery-event-page">
      <main>
        <header className="gallery-event-header">
          <Link
            href="/gallery"
            className="gallery-event-back"
            onClick={(event) => {
              event.preventDefault();
              triggerTransition("/gallery");
            }}
          >
            ← Back to Selah
          </Link>
          <p className="gallery-kicker">{item.type === "sport" ? "Sports" : "Cultural Events"} / SELAH 2026</p>
          <h1>{item.title}</h1>
        </header>

        <section className="gallery-event-lookbook" aria-label="SELAH 2026 official lookbook">
          <div className="gallery-event-lookbook__head">
            <p className="gallery-kicker">SELAH 2026 / Official lookbook</p>
            <p>{item.gallery.length} artworks from the 2026 programme</p>
          </div>
          <div className="gallery-event-grid">
            {item.gallery.map((asset, index) => (
              <GalleryTile key={`${asset.src}-${index}`} asset={asset} index={index} onOpen={() => setLightboxIndex(index)} />
            ))}
          </div>
        </section>

        <footer className="gallery-event-footer">
          <Link
            href={`/gallery/${next.id}`}
            onClick={(event) => {
              event.preventDefault();
              triggerTransition(`/gallery/${next.id}`);
            }}
          >
            Next event <span>→</span><strong>{next.title}</strong>
          </Link>
          <small>© Selah Gallery · Pune</small>
        </footer>
      </main>

      {activeAsset && lightboxIndex !== null ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${item.title} image viewer`} onClick={close} onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? 0; }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX ?? touchStart.current; if (Math.abs(end - touchStart.current) > 40) move(end < touchStart.current ? 1 : -1); }}>
          <button className="gallery-lightbox__close" onClick={close} aria-label="Close gallery">×</button>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--left" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous image">←</button>
          <div className="gallery-lightbox__content" onClick={(event) => event.stopPropagation()}>
            {activeAsset.type === "video" ? <video src={activeAsset.src} controls autoPlay playsInline /> : <img src={activeAsset.src} alt={activeAsset.alt} className="gallery-lightbox__image" />}
            <div className="gallery-lightbox__caption"><span>{activeAsset.caption}</span><span>{lightboxIndex + 1} / {item.gallery.length}</span></div>
          </div>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--right" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next image">→</button>
        </div>
      ) : null}
    </article>
  );
}

function GalleryTile({ asset, index, onOpen }: { asset: GalleryAsset; index: number; onOpen: () => void }) {
  return (
    <button className="gallery-event-tile" style={{ "--tile-delay": `${Math.min(index, 8) * 55}ms` } as CSSProperties} onClick={onOpen} aria-label={`Open ${asset.caption}`}>
      <img src={asset.src} alt={asset.alt} loading="lazy" />
      {asset.type === "video" ? <span className="gallery-event-tile__play">▶</span> : null}
      <span className="gallery-event-tile__caption">{asset.caption}</span>
    </button>
  );
}

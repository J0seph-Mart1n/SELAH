"use client";

import { useParams } from "next/navigation";
import GalleryEventClient from "./GalleryEventClient";
import { galleryItems } from "../data/galleryItems";
import Navbar from "@/components/web/Navbar";
import GalleryBackground from "../GalleryBackground";

export default function GalleryEventPage() {
  const params = useParams<{ eventId: string }>();
  const item = galleryItems.find((candidate) => candidate.id === params.eventId) ?? galleryItems[0];
  const next = galleryItems[(galleryItems.findIndex((candidate) => candidate.id === item.id) + 1) % galleryItems.length];

  return (
    <div className="gallery-route-shell">
      <GalleryBackground />
      <Navbar />
      <GalleryEventClient item={item} next={next} />
    </div>
  );
}

"use client";

import Silk from "@/components/ui/Silk";

export default function GalleryBackground() {
  return (
    <div className="gallery-live-bg" aria-hidden="true">
      <Silk color="#611e3c" sheenColor="#fff1cb" speed={2.5} scale={1} noiseIntensity={1.5} rotation={0} sheen={0.8} depth={0.6} glow={0.3} wave={1.5} />
    </div>
  );
}

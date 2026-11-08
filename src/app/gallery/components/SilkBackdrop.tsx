"use client";

import Silk from "@/components/ui/Silk";
import { useGalleryReducedMotion } from "../hooks/useGalleryReducedMotion";

interface SilkBackdropProps {
  dimmed?: boolean;
}

export default function SilkBackdrop({ dimmed = false }: SilkBackdropProps) {
  const reduceMotion = useGalleryReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`gallery-silk${dimmed ? " is-dimmed" : ""}`}
    >
      <div className="gallery-silk-fallback" />
      <Silk
        color="#611e3c"
        sheenColor="#fff1cb"
        speed={1.15}
        scale={1.35}
        noiseIntensity={0.9}
        rotation={-0.08}
        sheen={0.82}
        depth={0.55}
        glow={0.3}
        ripple={0.9}
        wave={1.2}
        variation={0.4}
        mouseInteraction
        interactionStrength={0.95}
        clickRipple
        intro
        fade={0.08}
        paused={Boolean(reduceMotion || dimmed)}
      />
      <div className="gallery-silk-wash" />
      <div className="gallery-silk-dim" />
    </div>
  );
}

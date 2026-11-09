import type { Metadata } from "next";
import { ApertureTransitionProvider } from "./components/ApertureTransition";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Gallery | SELAH 2026",
  description:
    "The SELAH 2026 lookbook: official event artwork, the Carmel Youth Association team, and a cinematic archive for one day in Pune.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApertureTransitionProvider>{children}</ApertureTransitionProvider>;
}

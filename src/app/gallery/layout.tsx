import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | SELAH 2026",
  description: "Official media and photo gallery of SELAH 2026. High-definition highlights, cultural performances, and sports photography",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

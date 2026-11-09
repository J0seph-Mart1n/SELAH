import GalleryClient from "./GalleryClient";
import GalleryRevealingSoon from "./components/GalleryRevealingSoon";
import Navbar from "@/components/web/Navbar";
import GalleryBackground from "./GalleryBackground";

export default function GalleryPage() {
  const isGalleryRevealed = true;

  return (
    <div className="gallery-route-shell">
      <GalleryBackground />
      <Navbar />
      {isGalleryRevealed ? <GalleryClient /> : <GalleryRevealingSoon />}
    </div>
  );
}

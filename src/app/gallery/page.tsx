import GalleryClient from "./GalleryClient";
import Navbar from "@/components/web/Navbar";
import GalleryBackground from "./GalleryBackground";

export default function GalleryPage() {
  return (
    <div className="gallery-route-shell">
      <GalleryBackground />
      <Navbar />
      <GalleryClient />
    </div>
  );
}

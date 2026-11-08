import { archivePhotos, type Photo } from "./photos";

export interface GalleryAsset {
  src: string;
  alt: string;
  caption: string;
  type: "image" | "video";
}

export interface GalleryItem {
  id: string;
  type: "sport" | "cultural";
  title: string;
  titleLine1: string;
  titleLine2: string;
  organisedBy: string;
  date: string;
  venue: string;
  category: string;
  language: string;
  duration: string;
  featuring: string[];
  description: string;
  highlights: string[];
  quotes: { text: string; source: string }[];
  coverImage: string;
  heroImage: string;
  alt: string;
  watchUrl: string;
  ticketsUrl: string;
  gallery: GalleryAsset[];
}

const sports = new Set(["futsal", "100m-race", "throwball", "mixed-relay", "tug-of-war", "blitz-chess"]);

function titleLines(title: string) {
  const words = title.split(" ");
  if (words.length < 2) return [title, ""];
  const split = Math.ceil(words.length / 2);
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

function makeItem(photo: Photo): GalleryItem {
  const type = sports.has(photo.id) ? "sport" : "cultural";
  const [titleLine1, titleLine2] = titleLines(photo.title);
  const start = archivePhotos.findIndex((entry) => entry.id === photo.id);
  return {
    id: photo.id,
    type,
    title: photo.title,
    titleLine1,
    titleLine2,
    organisedBy: type === "sport" ? "CYA Sports Council" : "Carmel Youth Association",
    date: "05 December 2026",
    venue: "Carmel Parish, Pune",
    category: type === "sport" ? "Sports event" : "Cultural event",
    language: "English / Malayalam",
    duration: type === "sport" ? "Day programme" : "Live programme",
    featuring: type === "sport" ? ["Parish teams", "CYA Sports Council"] : ["CYA Cultural Council", "Local artists", "Youth ensemble"],
    description: `${photo.title} is part of SELAH 2026, a day of sport, art and shared energy at Carmel Parish. This gallery holds the visual identity of the event before the first cue, whistle or performance begins.`,
    highlights: [
      `${type === "sport" ? "EVENT FORMAT" : "PROGRAMME"}: SELAH 2026`,
      "LOCATION: Carmel Parish, Pune",
      "EDITION: 01 / 2026",
      "FRAME: Official event artwork",
    ],
    quotes: [
      { text: "The day, held in one frame.", source: "SELAH 2026" },
      { text: "Selah means pause. Take one.", source: "Official lookbook" },
    ],
    coverImage: photo.src,
    heroImage: photo.src,
    alt: photo.alt,
    watchUrl: `/gallery#${photo.id}`,
    ticketsUrl: "/register",
    // The lookbook rotates through the official artwork of the programme,
    // starting with this event. Event-day photography can replace it later.
    gallery: Array.from({ length: 6 }, (_, offset) => {
      const entry = archivePhotos[(start + offset) % archivePhotos.length];
      return {
        src: entry.src,
        alt: `${entry.title} official event artwork for SELAH 2026.`,
        caption: `${entry.title} · Official artwork`,
        type: "image" as const,
      };
    }),
  };
}

export const galleryItems = archivePhotos.map(makeItem);

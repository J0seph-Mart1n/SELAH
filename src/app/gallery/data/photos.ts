export type Category = "sports" | "cultural";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  category: Category;
  width: number;
  height: number;
  priority?: boolean;
}

/**
 * Event artwork is used honestly as artwork — these are the official event
 * visuals, not photographs taken on the day. Event-day photographs can be
 * added to this manifest after 5 December 2026 without touching the layout.
 */
export const archivePhotos: Photo[] = [
  {
    id: "futsal",
    src: "/events/Football.jpg",
    alt: "Futsal event artwork for SELAH 2026.",
    title: "Futsal",
    subtitle: "Event artwork",
    category: "sports",
    width: 1600,
    height: 900,
  },
  {
    id: "group-dance",
    src: "/events/GroupDance.jpg",
    alt: "Group Dance event artwork for SELAH 2026.",
    title: "The Big Picture",
    subtitle: "Group Dance · Event artwork",
    category: "cultural",
    width: 612,
    height: 408,
  },
  {
    id: "live-canvas",
    src: "/events/Painting.jpg",
    alt: "Live Canvas event artwork for SELAH 2026.",
    title: "The Art of the Moment",
    subtitle: "Live Canvas · Event artwork",
    category: "cultural",
    width: 736,
    height: 729,
  },
  {
    id: "100m-race",
    src: "/events/100mRace.png",
    alt: "100 M Race event artwork for SELAH 2026.",
    title: "100 M Race",
    subtitle: "Event artwork",
    category: "sports",
    width: 600,
    height: 400,
  },
  {
    id: "street-play",
    src: "/events/StreetPlay.jpg",
    alt: "Street Play event artwork for SELAH 2026.",
    title: "Nukkad Natak",
    subtitle: "Street Play · Event artwork",
    category: "cultural",
    width: 1023,
    height: 683,
  },
  {
    id: "throwball",
    src: "/events/Throwball.jpg",
    alt: "Throwball event artwork for SELAH 2026.",
    title: "Throwball",
    subtitle: "Event artwork",
    category: "sports",
    width: 400,
    height: 299,
  },
  {
    id: "solo-dance",
    src: "/events/SoloDancing.avif",
    alt: "Solo Dance event artwork for SELAH 2026.",
    title: "Dance Unleashed",
    subtitle: "Solo Dance · Event artwork",
    category: "cultural",
    width: 492,
    height: 740,
  },
  {
    id: "mixed-relay",
    src: "/events/MixedRelay.jpg",
    alt: "Mixed Relay event artwork for SELAH 2026.",
    title: "Mixed Relay",
    subtitle: "Event artwork",
    category: "sports",
    width: 1200,
    height: 675,
  },
  {
    id: "music-band",
    src: "/events/MusicBand.jpg",
    alt: "Battle of the Bands event artwork for SELAH 2026.",
    title: "Battle of the Bands",
    subtitle: "Music Band · Event artwork",
    category: "cultural",
    width: 612,
    height: 407,
  },
  {
    id: "tug-of-war",
    src: "/events/TugOfWar.jpg",
    alt: "Tug of War event artwork for SELAH 2026.",
    title: "Tug of War",
    subtitle: "Event artwork",
    category: "sports",
    width: 612,
    height: 408,
  },
  {
    id: "mono-act",
    src: "/events/MonoAct.avif",
    alt: "Mono Act event artwork for SELAH 2026.",
    title: "Alter Ego",
    subtitle: "Mono Act · Event artwork",
    category: "cultural",
    width: 400,
    height: 267,
  },
  {
    id: "short-film",
    src: "/events/ShortFilm.jpg",
    alt: "Short Film event artwork for SELAH 2026.",
    title: "Frame by Frame",
    subtitle: "Short Film · Event artwork",
    category: "cultural",
    width: 755,
    height: 502,
  },
  {
    id: "solo-singing",
    src: "/events/SoloSinging.jpeg",
    alt: "Solo Singing event artwork for SELAH 2026.",
    title: "Pitch Perfect",
    subtitle: "Solo Singing · Event artwork",
    category: "cultural",
    width: 450,
    height: 450,
  },
  {
    id: "blitz-chess",
    src: "/events/chess.jpg",
    alt: "Blitz Chess event artwork for SELAH 2026.",
    title: "Blitz Chess",
    subtitle: "Event artwork",
    category: "sports",
    width: 612,
    height: 408,
  },
  {
    id: "photography",
    src: "/events/Photography.jpg",
    alt: "Photography event artwork for SELAH 2026.",
    title: "Perspectives",
    subtitle: "Photography · Event artwork",
    category: "cultural",
    width: 612,
    height: 408,
  },
];

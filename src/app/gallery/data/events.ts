import { archivePhotos, type Photo } from "./photos";

export type EventActId = "opening" | "sport" | "stage" | "showcase";

export interface EventAct {
  id: EventActId;
  label: string;
  blurb: string;
}

export interface GalleryEvent {
  id: string;
  name: string;
  act: EventActId;
  photo: Photo | null;
}

/**
 * Editorial chapters, not a claimed running order. The inauguration entry is
 * intentionally text-only until official artwork exists in the archive.
 */
export const EVENT_ACTS: EventAct[] = [
  {
    id: "opening",
    label: "Opening",
    blurb: "The chapter before the first event.",
  },
  {
    id: "sport",
    label: "Sport",
    blurb: "Six events. Six artworks.",
  },
  {
    id: "stage",
    label: "Stage",
    blurb: "Five acts. Five artworks.",
  },
  {
    id: "showcase",
    label: "Showcase",
    blurb: "Four disciplines. Four artworks.",
  },
];

function eventWithPhoto(
  id: string | null,
  eventId: string,
  name: string,
  act: EventActId,
): GalleryEvent {
  if (!id) {
    return { id: eventId, name, act, photo: null };
  }

  const photo = archivePhotos.find((item) => item.id === id);

  if (!photo) {
    throw new Error(`Missing archive artwork for event "${eventId}" (photo "${id}").`);
  }

  return { id: eventId, name, act, photo };
}

export const SELAH_EVENTS: GalleryEvent[] = [
  eventWithPhoto(null, "inauguration", "Inauguration", "opening"),
  eventWithPhoto("futsal", "futsal", "Futsal", "sport"),
  eventWithPhoto("100m-race", "100m-race", "100 M Race", "sport"),
  eventWithPhoto("throwball", "throwball", "Throwball", "sport"),
  eventWithPhoto("mixed-relay", "mixed-relay", "Mixed Relay", "sport"),
  eventWithPhoto("tug-of-war", "tug-of-war", "Tug of War", "sport"),
  eventWithPhoto("blitz-chess", "blitz-chess", "Blitz Chess", "sport"),
  eventWithPhoto("group-dance", "group-dance", "Group Dance", "stage"),
  eventWithPhoto("solo-dance", "solo-dance", "Solo Dance", "stage"),
  eventWithPhoto("music-band", "music-band", "Music Band", "stage"),
  eventWithPhoto("solo-singing", "solo-singing", "Solo Singing", "stage"),
  eventWithPhoto("mono-act", "mono-act", "Mono Act", "stage"),
  eventWithPhoto("live-canvas", "live-canvas", "Live Canvas", "showcase"),
  eventWithPhoto("street-play", "street-play", "Street Play", "showcase"),
  eventWithPhoto("short-film", "short-film", "Short Film", "showcase"),
  eventWithPhoto("photography", "photography", "Photography", "showcase"),
];

export const SELAH_EVENT_COUNT = SELAH_EVENTS.length;
export const SELAH_ARTWORK_COUNT = archivePhotos.length;

export function getAct(actId: EventActId) {
  return EVENT_ACTS.find((act) => act.id === actId) ?? EVENT_ACTS[0];
}

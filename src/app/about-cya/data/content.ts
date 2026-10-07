/*
 * ALL editable content for the /about-cya page (team intro).
 * Every spot worth replacing is marked with an `EDIT:` comment.
 */

export interface HeroContent {
  // EDIT: eyebrow above the headline
  eyebrow: string;
  // EDIT: italic accent word inside the headline
  accentWord: string;
  // EDIT: one-line introduction
  intro: string;
}

export const hero: HeroContent = {
  eyebrow: "Carmel Youth Association",
  accentWord: "the",
  intro: "Twelve hearts, one mission. Faces you will recognise.",
};

export type TeamGroup = "Director" | "Guides" | "Office Bearers" | "Executives & Key Army";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  photo: string;
}

export const teamGroups: TeamGroup[] = [
  "Director",
  "Guides",
  "Office Bearers",
  "Executives & Key Army",
];

export const team: TeamMember[] = [
  {
    id: "fr-joy-kakkanatu",
    name: "Fr. Joy Kakkanatu",
    role: "Director",
    group: "Director",
    // EDIT: swap for "/team/fr-joy-kakkanatu.jpg" once the real photo is uploaded
    photo: "",
  },
  {
    id: "br-jeeson",
    name: "Br. Jeeson",
    role: "Animator",
    group: "Guides",
    // EDIT: swap for "/team/br-jeeson.jpg" once the real photo is uploaded
    photo: "/cya/avatar-12.jpg",
  },
  {
    id: "br-amalek",
    name: "Br. Amalek",
    role: "Co-Animator",
    group: "Guides",
    // EDIT: swap for "/team/br-amalek.jpg" once the real photo is uploaded
    photo: "/cya/avatar-53.jpg",
  },
  {
    id: "celesia-francis",
    name: "Celesia Francis",
    role: "President",
    group: "Office Bearers",
    // EDIT: swap for "/team/celesia-francis.jpg" once the real photo is uploaded
    photo: "/cya/avatar-44.jpg",
  },
  {
    id: "ajin-shaji",
    name: "Ajin Shaji",
    role: "Vice President",
    group: "Office Bearers",
    // EDIT: swap for "/team/ajin-shaji.jpg" once the real photo is uploaded
    photo: "/cya/avatar-33.jpg",
  },
  {
    id: "joseph-martin",
    name: "Joseph Martin",
    role: "Treasurer",
    group: "Office Bearers",
    // EDIT: swap for "/team/joseph-martin.jpg" once the real photo is uploaded
    photo: "/cya/avatar-11.jpg",
  },
  {
    id: "megha-varghese",
    name: "Megha Varghese",
    role: "Secretary",
    group: "Office Bearers",
    // EDIT: swap for "/team/megha-varghese.jpg" once the real photo is uploaded
    photo: "/cya/avatar-47.jpg",
  },
  {
    id: "albis-ipe",
    name: "Albis Ipe",
    role: "Joint Secretary",
    group: "Office Bearers",
    // EDIT: swap for "/team/albis-ipe.jpg" once the real photo is uploaded
    photo: "/cya/avatar-15.jpg",
  },
  {
    id: "merlyn",
    name: "Merlyn",
    role: "Forane Executive 1",
    group: "Executives & Key Army",
    // EDIT: swap for "/team/merlyn.jpg" once the real photo is uploaded
    photo: "/cya/avatar-45.jpg",
  },
  {
    id: "ashwin",
    name: "Ashwin",
    role: "Forane Executive 2",
    group: "Executives & Key Army",
    // EDIT: swap for "/team/ashwin.jpg" once the real photo is uploaded
    photo: "/cya/avatar-68.jpg",
  },
  {
    id: "kirthi",
    name: "Kirthi",
    role: "Key Army 1",
    group: "Executives & Key Army",
    // EDIT: swap for "/team/kirthi.jpg" once the real photo is uploaded
    photo: "/cya/avatar-26.jpg",
  },
  {
    id: "aneetta",
    name: "Aneetta",
    role: "Key Army 2",
    group: "Executives & Key Army",
    // EDIT: swap for "/team/aneetta.jpg" once the real photo is uploaded
    photo: "/cya/avatar-9.jpg",
  },
];

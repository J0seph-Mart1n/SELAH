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

export type TeamGroup = "Director" | "Animators" | "Youth Members";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  photo: string;
}

export const teamGroups: TeamGroup[] = [
  "Director",
  "Animators",
  "Youth Members",
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
    group: "Animators",
    // EDIT: swap for "/team/br-jeeson.jpg" once the real photo is uploaded
    photo: "/cya/Br._Jeeson.png",
  },
  {
    id: "br-amalek",
    name: "Br. Amalek",
    role: "Co-Animator",
    group: "Animators",
    // EDIT: swap for "/team/br-amalek.jpg" once the real photo is uploaded
    photo: "/cya/avatar-53.jpg",
  },
  {
    id: "celesia-francis",
    name: "Celsia Francis",
    role: "President",
    group: "Youth Members",
    // EDIT: swap for "/team/celesia-francis.jpg" once the real photo is uploaded
    photo: "/cya/Celsia.png",
  },
  {
    id: "ajin-shaji",
    name: "Ajin Shaji",
    role: "Vice President",
    group: "Youth Members",
    // EDIT: swap for "/team/ajin-shaji.jpg" once the real photo is uploaded
    photo: "/cya/Ajin.png",
  },
  {
    id: "joseph-martin",
    name: "Joseph Martin",
    role: "Treasurer",
    group: "Youth Members",
    // EDIT: swap for "/team/joseph-martin.jpg" once the real photo is uploaded
    photo: "/cya/Joseph.png",
  },
  {
    id: "megha-varghese",
    name: "Megha Varghese",
    role: "Secretary",
    group: "Youth Members",
    // EDIT: swap for "/team/megha-varghese.jpg" once the real photo is uploaded
    photo: "/cya/Megha.png",
  },
  {
    id: "albis-ipe",
    name: "Albis Ipe",
    role: "Joint Secretary",
    group: "Youth Members",
    // EDIT: swap for "/team/albis-ipe.jpg" once the real photo is uploaded
    photo: "/cya/avatar-15.jpg",
  },
  {
    id: "merlyn",
    name: "Merlyn Rosario",
    role: "Forane Executive 1",
    group: "Youth Members",
    // EDIT: swap for "/team/merlyn.jpg" once the real photo is uploaded
    photo: "/cya/avatar-45.jpg",
  },
  {
    id: "ashwin",
    name: "Ashwin Sasi",
    role: "Forane Executive 2",
    group: "Youth Members",
    // EDIT: swap for "/team/ashwin.jpg" once the real photo is uploaded
    photo: "/cya/Ashwin.png",
  },
  {
    id: "kirthi",
    name: "Kirthi Dominic",
    role: "Key Army 1",
    group: "Youth Members",
    // EDIT: swap for "/team/kirthi.jpg" once the real photo is uploaded
    photo: "/cya/Kirthi.png",
  },
  {
    id: "aneetta",
    name: "Aneetta Sabu",
    role: "Key Army 2",
    group: "Youth Members",
    // EDIT: swap for "/team/aneetta.jpg" once the real photo is uploaded
    photo: "/cya/Aneetta.png",
  },
];

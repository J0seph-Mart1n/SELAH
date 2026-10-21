export type EventType = "group" | "individual";
export type EventCategory = "sports" | "cultural";

export interface Participant {
  id: string;
  name: string;
  gender: "Male" | "Female" | "";
  role: string;
  notes?: string;
}

export interface RegistrationEventConfig {
  id: string;
  pdfNumber: number;
  title: string;
  category: EventCategory;
  type: EventType;
  fee: number; // 800 for group, 250 for individual
  specification: string;
  descriptionHint: string;
  minParticipants: number;
  maxParticipants: number;
  requiredBoys?: number;
  requiredGirls?: number;
  maxSubstitutes?: number;
  genderRestriction?: "boys-only" | "girls-only" | "mixed-2b2g" | "any";
  defaultRoles: string[];
  defaultRows: Array<{ gender: "Male" | "Female" | ""; role: string; notes?: string }>;
}

export const REGISTRATION_EVENTS: RegistrationEventConfig[] = [
  // ==========================================
  // SPORTS EVENTS (PDF Page 2 & 3)
  // ==========================================
  {
    id: "mixed-relay",
    pdfNumber: 5,
    title: "Mixed Relay",
    category: "sports",
    type: "group",
    fee: 800,
    specification: "2 Boys, 2 Girls Team (1 Team Per Parish)",
    descriptionHint: "Must have exactly 2 Boys and 2 Girls. Designate one Captain.",
    minParticipants: 4,
    maxParticipants: 4,
    requiredBoys: 2,
    requiredGirls: 2,
    genderRestriction: "mixed-2b2g",
    defaultRoles: ["Runner", "Captain"],
    defaultRows: [
      { gender: "Male", role: "Captain" },
      { gender: "Male", role: "Runner" },
      { gender: "Female", role: "Runner" },
      { gender: "Female", role: "Runner" },
    ],
  },
  {
    id: "100m-race",
    pdfNumber: 6,
    title: "100 M Race",
    category: "sports",
    type: "individual",
    fee: 250,
    specification: "Limit Up to 5 Participants Per Parish",
    descriptionHint: "Individual sprint. Max 5 participants per parish.",
    minParticipants: 1,
    maxParticipants: 5,
    genderRestriction: "any",
    defaultRoles: ["Participant"],
    defaultRows: [{ gender: "", role: "Participant" }],
  },
  {
    id: "blitz-chess",
    pdfNumber: 7,
    title: "Blitz Chess",
    category: "sports",
    type: "individual",
    fee: 250,
    specification: "Limit Up to 3 Participants Per Parish",
    descriptionHint: "Speed chess tournament with digital clocks. Max 3 players.",
    minParticipants: 1,
    maxParticipants: 3,
    genderRestriction: "any",
    defaultRoles: ["Player"],
    defaultRows: [{ gender: "", role: "Player" }],
  },
  {
    id: "tug-of-war",
    pdfNumber: 8,
    title: "Tug Of War",
    category: "sports",
    type: "group",
    fee: 800,
    specification: "2 Boys, 2 Girls Team (3 Substitutes)",
    descriptionHint: "4 Main Playing (2 Boys, 2 Girls) + up to 3 Substitutes (Total max 7).",
    minParticipants: 4,
    maxParticipants: 7,
    requiredBoys: 2,
    requiredGirls: 2,
    maxSubstitutes: 3,
    genderRestriction: "mixed-2b2g",
    defaultRoles: ["Player", "Captain", "Substitute", "Anchor"],
    defaultRows: [
      { gender: "Male", role: "Captain" },
      { gender: "Male", role: "Player" },
      { gender: "Female", role: "Player" },
      { gender: "Female", role: "Player" },
    ],
  },
  {
    id: "throwball",
    pdfNumber: 9,
    title: "Throwball",
    category: "sports",
    type: "group",
    fee: 800,
    specification: "All Girls 6 Players Team (3 Substitutes)",
    descriptionHint: "6 Main Players (All Girls) + up to 3 Substitutes (Total max 9).",
    minParticipants: 6,
    maxParticipants: 9,
    requiredGirls: 6,
    maxSubstitutes: 3,
    genderRestriction: "girls-only",
    defaultRoles: ["Player", "Captain", "Substitute"],
    defaultRows: [
      { gender: "Female", role: "Captain" },
      { gender: "Female", role: "Player" },
      { gender: "Female", role: "Player" },
      { gender: "Female", role: "Player" },
      { gender: "Female", role: "Player" },
      { gender: "Female", role: "Player" },
    ],
  },
  {
    id: "futsal",
    pdfNumber: 10,
    title: "Futsal",
    category: "sports",
    type: "group",
    fee: 800,
    specification: "All Boys 5 Players Team (3 Substitutes)",
    descriptionHint: "5 Main Players (All Boys) + up to 3 Substitutes (Total max 8).",
    minParticipants: 5,
    maxParticipants: 8,
    requiredBoys: 5,
    maxSubstitutes: 3,
    genderRestriction: "boys-only",
    defaultRoles: ["Player", "Captain", "Goalkeeper", "Substitute"],
    defaultRows: [
      { gender: "Male", role: "Captain" },
      { gender: "Male", role: "Goalkeeper" },
      { gender: "Male", role: "Player" },
      { gender: "Male", role: "Player" },
      { gender: "Male", role: "Player" },
    ],
  },

  // ==========================================
  // CULTURAL EVENTS (PDF Page 3 & 4)
  // ==========================================
  {
    id: "group-dance",
    pdfNumber: 11,
    title: "The Big Picture (Group Dance)",
    category: "cultural",
    type: "group",
    fee: 800,
    specification: "Minimum 4 Participants required in the group",
    descriptionHint: "Choreographed thematic group dance. At least 4 members.",
    minParticipants: 4,
    maxParticipants: 20,
    genderRestriction: "any",
    defaultRoles: ["Dancer", "Captain / Lead", "Choreographer"],
    defaultRows: [
      { gender: "", role: "Captain / Lead" },
      { gender: "", role: "Dancer" },
      { gender: "", role: "Dancer" },
      { gender: "", role: "Dancer" },
    ],
  },
  {
    id: "short-film",
    pdfNumber: 12,
    title: "Frame By Frame (Short Film)",
    category: "cultural",
    type: "group",
    fee: 800,
    specification: "No Offensive and Political themes | 3rd Dec Last Submission Date",
    descriptionHint: "Submit creative crew names. Video file submission deadline is 3rd Dec.",
    minParticipants: 1,
    maxParticipants: 10,
    genderRestriction: "any",
    defaultRoles: ["Director", "Cinematographer", "Editor", "Writer", "Lead Cast", "Crew Member"],
    defaultRows: [
      { gender: "", role: "Director" },
      { gender: "", role: "Editor" },
    ],
  },
  {
    id: "live-canvas",
    pdfNumber: 13,
    title: "The Art Of The Moment (Live Canvas)",
    category: "cultural",
    type: "individual",
    fee: 250,
    specification: "Any form of Art (Painting or Sketch)",
    descriptionHint: "Live painting/sketching on canvas. Up to 3 participants per parish.",
    minParticipants: 1,
    maxParticipants: 3,
    genderRestriction: "any",
    defaultRoles: ["Artist"],
    defaultRows: [{ gender: "", role: "Artist" }],
  },
  {
    id: "solo-singing",
    pdfNumber: 14,
    title: "Pitch Perfect (Solo Singing)",
    category: "cultural",
    type: "individual",
    fee: 250,
    specification: "Maximum 3 Participants per Parish",
    descriptionHint: "Acoustic or instrumental backing track. Max 3 singers per parish.",
    minParticipants: 1,
    maxParticipants: 3,
    genderRestriction: "any",
    defaultRoles: ["Vocalist"],
    defaultRows: [{ gender: "", role: "Vocalist" }],
  },
  {
    id: "solo-dance",
    pdfNumber: 15,
    title: "Dance Unleashed (Solo Dance)",
    category: "cultural",
    type: "individual",
    fee: 250,
    specification: "Limit Up to 3 Participants Per Parish",
    descriptionHint: "Expressive solo dance showcase. Max 3 dancers per parish.",
    minParticipants: 1,
    maxParticipants: 3,
    genderRestriction: "any",
    defaultRoles: ["Dancer"],
    defaultRows: [{ gender: "", role: "Dancer" }],
  },
  {
    id: "nukkad-natak",
    pdfNumber: 16,
    title: "Nukkad Natak (Street Play)",
    category: "cultural",
    type: "group",
    fee: 800,
    specification: "Minimum 5 Participants and Maximum 7 Participants per Parish",
    descriptionHint: "High energy socially conscious street theatre. 5 to 7 actors.",
    minParticipants: 5,
    maxParticipants: 7,
    genderRestriction: "any",
    defaultRoles: ["Actor", "Team Leader", "Musician / Percussionist"],
    defaultRows: [
      { gender: "", role: "Team Leader" },
      { gender: "", role: "Actor" },
      { gender: "", role: "Actor" },
      { gender: "", role: "Actor" },
      { gender: "", role: "Actor" },
    ],
  },
  {
    id: "mono-act",
    pdfNumber: 17,
    title: "Alter Ego (Mono Act)",
    category: "cultural",
    type: "individual",
    fee: 250,
    specification: "Limit Up to 3 participants per parish",
    descriptionHint: "Solo dramatic acting performance. Max 3 participants.",
    minParticipants: 1,
    maxParticipants: 3,
    genderRestriction: "any",
    defaultRoles: ["Actor"],
    defaultRows: [{ gender: "", role: "Actor" }],
  },
  {
    id: "photography",
    pdfNumber: 18,
    title: "Perspectives (Photography)",
    category: "cultural",
    type: "individual",
    fee: 250,
    specification: "3 Pictures, One Story",
    descriptionHint: "Visual narrative storytelling through 3 curated photographs. Max 3 photographers.",
    minParticipants: 1,
    maxParticipants: 3,
    genderRestriction: "any",
    defaultRoles: ["Photographer"],
    defaultRows: [{ gender: "", role: "Photographer" }],
  },
  {
    id: "battle-of-bands",
    pdfNumber: 19,
    title: "Battle of the Bands (Music Band)",
    category: "cultural",
    type: "group",
    fee: 800,
    specification: "Minimum 4 Participants (4 Jacks and 4 Mics will be provided)",
    descriptionHint: "Live inter-church band clash. Minimum 4 musicians.",
    minParticipants: 4,
    maxParticipants: 12,
    genderRestriction: "any",
    defaultRoles: ["Vocalist", "Guitarist", "Drummer", "Bassist", "Keyboardist", "Band Leader"],
    defaultRows: [
      { gender: "", role: "Band Leader" },
      { gender: "", role: "Vocalist" },
      { gender: "", role: "Guitarist" },
      { gender: "", role: "Drummer" },
    ],
  },
];

export const CONTACT_INCHARGES = [
  { role: "CYA President", name: "Celsia Francis", phone: "+91 74480 96143", rawPhone: "+917448096143" },
  { role: "Vice President", name: "Ajin Shaji", phone: "+91 98604 21459", rawPhone: "+919860421459" },
  { role: "Cultural Incharge", name: "Merlyn Rosario", phone: "+91 76206 71149", rawPhone: "+917620671149" },
  { role: "Sports Incharge", name: "Albis Ipe", phone: "+91 95524 43588", rawPhone: "+919552443588" },
  { role: "Registration Head", name: "Aswathy", phone: "+91 85529 53947", rawPhone: "+918552953947" },
];

export const PAYMENT_DETAILS = {
  recipientName: "Joseph Martin",
  phone: "9172232178",
  upiId: "9172232178.etb@icici",
  bankName: "ICICI Bank",
  qrImagePath: "/payment/selah_payment_qr.png",
  groupFee: 800,
  individualFee: 250,
};

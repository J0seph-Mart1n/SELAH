export type EventCategory = "sports" | "cultural";

export interface JudgingCriterion {
  criterion: string;
  weight: number;
  description?: string;
}

export interface EventRule {
  id: string;
  title: string;
  category: EventCategory;
  categoryLabel: string;
  image: string;
  tagline: string;
  teamSize: string;
  duration: string;
  venue: string;
  format: string;
  overview: string;
  keyHighlights: string[];
  rules: string[];
  judgingCriteria?: JudgingCriterion[];
}

export interface GeneralGuideline {
  icon: string;
  title: string;
  description: string;
}

export interface RulePointer {
  title: string;
  description: string;
}

export const CULTURAL_RULES: RulePointer[] = [
  {
    title: "Reporting & Sound Check",
    description: "All solo performers and team captains must report to the stage coordinator 45 minutes prior to their scheduled slot. USB pen drives with high-quality tracks (MP3/WAV) must be submitted at the audio console upon reporting.",
  },
  {
    title: "Time Limit & Warning Bells",
    description: "Strict adherence to allotted time limits is mandatory. A warning bell will chime prior to the limit, followed by a final bell. Exceeding the time limit incurs a penalty deduction from the total score.",
  },
  {
    title: "Stage Setup & Props Policy",
    description: "Teams are granted 2 minutes for stage setup and 1 minute for swift clearance. The organisers reserve the right to modify event arrangements when necessary, with prior communication to participating parishes.",
  },
  {
    title: "Track & Live Music Guidelines",
    description: "All content, music, dialogue, costumes and props must be appropriate for the event. Bands and live accompanists must adhere to sound check allocations.",
  },
  {
    title: "Finality of Judges' Decision",
    description: "In the event of a tie, the organisers and judges may use the highest score in the principal judging criterion to determine the winner. Their scoring and rankings are final and binding; no appeals or arguments at the stage or sound console will be entertained.",
  },
];

export const SPORT_RULES: RulePointer[] = [
  {
    title: "Reporting Time",
    description: "Teams must present their squad sheet to the event volunteers 30 minutes before match kickoff. The team should be present 10-minute before the match starts.",
  },
  {
    title: "Wearables and Accessories",
    description: "Remove your Watches, rings, chains, metal accessories, and loose eyewear before the match starts.",
  },
  {
    title: "Fair Play & Disciplinary Cards",
    description: "SELAH upholds Christian sportsmanship. Dissent, aggressive conduct, vulgar language, or intentional fouls will incur yellow/red cards. Two yellow cards across the tournament or a red card warrants a match ban.",
  },
  {
    title: "Referee Decisions & Knockout Ties",
    description: "The appointed referees hold absolute authority over all match events. Knockout games ending in a draw proceed directly to tie-breakers / penalty shootouts as designated in event-specific formats.",
  },
];

export const GENERAL_GUIDELINES: GeneralGuideline[] = [
  {
    icon: "BadgeCheck",
    title: "Official Verification & ID Badges",
    description: "Every participant must carry their official SELAH delegate card or a valid Church/Parish verification identity. Verification will occur at registration desks.",
  },
  {
    icon: "Clock",
    title: "Strict 45-Min Prior Reporting",
    description: "Participants and team captains must report to their respective event venue at least 45 minutes prior to scheduled start time. Late arrivals may result in walkovers.",
  },
  {
    icon: "HeartHandshake",
    title: "Spirit of Fellowship & Sportsmanship",
    description: "SELAH is built on unity, respect, and Christian brotherhood. Any unsportsmanlike conduct, derogatory remarks, or aggressive confrontation will cause immediate disqualification.",
  },
  {
    icon: "Scale",
    title: "Finality of Officials' Decisions",
    description: "The rulings of appointed referees, panel judges, and the SELAH Executive Disciplinary Committee are final and legally binding across all events.",
  },
  {
    icon: "ShieldAlert",
    title: "Zero Tolerance Policy",
    description: "Consumption of alcohol, cigarettes, vaping, or contraband on festival grounds is strictly banned and will lead to police referral and parish delegation de-registration.",
  },
  {
    icon: "Sparkles",
    title: "Overall Parish Championship",
    description: "Points will be awarded for 1st (100 pts), 2nd (70 pts), and 3rd (40 pts) in each event. The parish with the highest cumulative score will lift the SELAH 2026 Rolling Trophy.",
  },
];

export const EVENT_RULES: EventRule[] = [
  // ==========================================
  // SPORTS EVENTS
  // ==========================================
  {
    id: "football",
    title: "Futsal (5-a-side Match)",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/Football.jpg",
    tagline: "Rapid-fire turf football celebrating pace, tactical discipline, and team brotherhood.",
    teamSize: "5 Playing + 3 Substitutes (Rolling)",
    duration: "10 Minutes (5 min halves + 2 min break)",
    venue: "College Ground, Parking Ground",
    format: "Knockout Format",
    overview: "5-a-side football match with the max time limit of 20 mins. Designed for fast breaks, quick passing, and intense competitive spirit.",
    keyHighlights: [
      "Rolling substitutions allowed at dead-ball intervals",
      "No sliding tackles permitted on turf surfaces",
      "Direct kick-ins from touchlines within 4 seconds",
    ],
    rules: [
      "Each team consists of 5 players on the pitch (including 1 goalkeeper) and a maximum of 3 rolling substitutes.",
      "Matches will have two 5-minute halves with a 2-minute halftime. If the matches get tied in normal time then the match will proceed straight to penalty shootout.",
      "Sliding tackles are strictly prohibited for player safety on turf. Any intentional slide toward an opponent is treated as a foul and may warrant a yellow card.",
      "No offside rule",
      "Fouls would result in either a free kick or a penalty.",
      "If any confusion or dispute during the match, then only the Team Captain is allowed to approach the Referee regarding the query.",
      "Goalkeepers cannot kick the ball directly from their hands across the halfway line on the fly; it must touch the ground or a player first.",
      "Rolling substitutions may occur during any dead-ball situation after informing the assistant referee.",
    ],
  },
  {
    id: "chess",
    title: "Blitz Chess",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/chess.jpg",
    tagline: "A clash of intellectual endurance, tactical foresight, and calm calculation on 64 squares.",
    teamSize: "Individual (Up to 3 players per Parish)",
    duration: "5 mins",
    venue: "College Classroom",
    format: "TBD",
    overview: "Competitive rapid chess game conducted with a digital clocks.",
    keyHighlights: [
      "Touch-move rule strictly enforced",
      "Digital clocks with Fischer 10-second increment",
      "No mobile devices or smart watches inside tournament hall",
    ],
    rules: [
      "A Standard Blitz Chess where each player would get 5mins to play their game.",
      "Mixed Game: No separate division for Male and Female Participants.",
      "Player has to checkmate the opponent player before the time runs out.",
      "Maximum of two illegal moves are allowed. Third illegal move would directly result in a forfeit.",
      "The player whose timer runs out regardless of the upper hand with pieces would be declared defeated ",
      "Smartphones, smartwatches, and all electronic devices are strictly prohibited. Possession of a transmitting device during play leads to immediate expulsion.",
    ],
  },
  {
    id: "throwball",
    title: "Throwball",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/Throwball.jpg",
    tagline: "High-flying rallies, strategic court placement, and explosive team coordination.",
    teamSize: "6 Playing + 3 Substitutes",
    duration: "Single Set of 21 Points",
    venue: "Volleyball Court",
    format: "Knockout Format",
    overview: "21 Points Fast-paced Throwball game with a side change after 10 Points.",
    keyHighlights: [
      "Ball must be caught with both hands and released within 3 seconds",
      "Jump services must be released before landing inside the line",
      "Rally point scoring system with a 2-point lead required",
    ],
    rules: [
      "Each team consists of 6 players on court and up to 3 substitutes.",
      "The game is strictly only for female participants.",
      "A team would be awarded a point when the opposite team fails to catch the ball or drops the ball within the court.",
      "Service must be executed from behind the endline within 5 seconds of the referee's whistle without stepping on the baseline.",
      "Catching & Throwing: The ball must be caught cleanly with both hands simultaneously without bobbling or double touch.",
      "The ball must be thrown over the net with one hand only (either left or right). Two-handed throws are a direct foul.",
      "No touching the net by any part of the body or clothing during a play.",
      "The ball cannot touch any body part below the waist (foot or knee contact is a foul).",
      "A throw cannot be blocked at the net like volleyball; the ball must cross into the opponent's court before being fielded.",
      "The final decision/calls will lie solely with the Referee",
      "If any confusion or dispute during the match, then only the Team Captain is allowed to approach the Referee regarding the query."
    ],
  },
  {
    id: "tug-of-war",
    title: "Tug Of War",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/TugOfWar.jpg",
    tagline: "The supreme test of grit, collective power, balance, and unbreakable parish unity.",
    teamSize: "6 Pullers (4 Boys + 2 Girls) + 3 Substitutes",
    duration: "Best of 3 Pulls",
    venue: "College Ground",
    format: "Knockout Format",
    overview: "Best of 3 pulls among both the teams will be the winner.",
    keyHighlights: [
      "Cumulative team weight verification prior to bracket draw",
      "Strict prohibition of spikes, metal cleats, or sticky adhesives",
      "Anchor is the only member permitted to secure rope across back",
    ],
    rules: [
      "A team consists of 6 active pullers on the rope (4 boys and 2 girls) plus up to 3 registered substitutes.",
      "There is no weigh-in required to participant.",
      "Matches are contested as Best of 3 pulls. Teams change sides after each pull with a 2-minute breather in between.",
      "Victory is achieved when the center cloth of the rope crosses the marking on the opposing side.",
      "Grip: Rope must be gripped with bare hands using an underhand or standard palm grip.",
      "The Anchor must grip the rope and allow it to pass around one hip and across the back.",
    ],
  },
  {
    id: "mixed-relay",
    title: "Mixed Relay (4x100m)",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/MixedRelay.jpg",
    tagline: "Lightning speed, seamless baton exchanges, and pulse-pounding track excitement.",
    teamSize: "4 Runners (2 Male + 2 Female)",
    duration: "Heats into Grand Final",
    venue: "Parking Ground",
    format: "Heats & 6-Lane Finals",
    overview: "The Mixed Relay will be conducted in 4x100m run. The order can be decided among the runners",
    keyHighlights: [
      "Compulsory composition: 2 Male and 2 Female runners per team",
      "Baton exchange must happen strictly within the 30m zone",
      "Spikes up to 6mm permitted on track",
    ],
    rules: [
      "Each team must field exactly 4 runners: 2 Men and 2 Women. The running order (e.g. M-F-M-F or F-M-F-M) is at the team's discretion but must be registered 20 minutes prior.",
      "Each runner completes a 100-meter leg with an official regulation aluminum baton.",
      "If the baton is dropped, only the athlete who dropped it may retrieve it. The athlete may leave their lane to retrieve the baton provided no other runner is obstructed.",
      "Lane Discipline: Runners on legs 1, 2, and 3 must strictly remain within their assigned lane markers throughout the turn.",
      "If there are a lot of participants then timer would be used to finalize the last remaining teams for the final round.",
    ],
  },
  {
    id: "100m-race",
    title: "100 M Race",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/100mRace.png",
    tagline: "Pure speed, explosive acceleration, and the crowning of the fastest parish sprinters.",
    teamSize: "Individual (Up to 5 participants per Parish)",
    duration: "Heats into Grand Final",
    venue: "Parking Ground",
    format: "Heats & Finals",
    overview: "100m individual sprint race. Preliminary heats will be conducted followed by the finals.",
    keyHighlights: [
      "Individual 100m sprint competition",
      "Up to 5 participants allowed per parish",
      "Strict lane discipline throughout the race",
    ],
    rules: [
      "Each parish can register up to a maximum of 5 participants for the 100 M Race.",
      "The event will have preliminary heats, and the fastest runners will qualify for the finals.",
      "Runners must strictly stay in their assigned lanes throughout the race from start to finish.",
      "The race will be separate for boys and girls.",
      "If there are a lot of participants, a timer will be used to finalize the top participants for the final round.",
      "The final call and decision will lie solely with the track referee.",
    ],
  },

  // ==========================================
  // CULTURAL EVENTS
  // ==========================================
  {
    id: "group-dance",
    title: "The Big Picture (Group Dance)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/GroupDance.jpg",
    tagline: "Magnificent synchronicity, thematic storytelling, and soul-stirring worship in motion.",
    teamSize: "4 to 16 Dancers",
    duration: "4 Minutes (+ 1 min setup & clearance)",
    venue: "Chavara Hall",
    format: "Score Based",
    overview: "The theme of the group dance is 'The Big Fat Indian Wedding'.",
    keyHighlights: [
      "Themes centered on fellowship, resurrection, redemption, or praise",
      "Audio tracks submitted in MP3 format 2 hours before event",
      "Modest attire and tasteful props encouraged",
    ],
    rules: [
      "The maximum performance duration is 4 minutes.",
      "Stage dimensions will be communicated to all participating parishes before the event.",
      "Participants may use props, provided they are safe and do not obstruct the stage or cause inconvenience to other performers.",
      "Music must be submitted in MP3 format before the deadline communicated by the organisers.",
      "Music files must be named GD_ParishName.mp3.",
      "Music must be appropriate for the event, without explicit or offensive lyrics.",
      "Participants must arrange their own costumes and props.",
    ],
    judgingCriteria: [
      { criterion: "Choreography & Creativity", weight: 25 },
      { criterion: "Synchronisation & Coordination", weight: 20 },
      { criterion: "Expressions & Stage Presence", weight: 20 },
      { criterion: "Interpretation of the theme", weight: 20 },
      { criterion: "Musicality & Transitions", weight: 15 },
    ],
  },
  {
    id: "short-film",
    title: "Frame By Frame (Short Film)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/ShortFilm.jpg",
    tagline: "Cinematic narratives exploring faith, resilience, and transformation in modern youth culture.",
    teamSize: "Production Crew (Director + Cast)",
    duration: "5 to 7 Minutes (Including opening & closing credits)",
    venue: "Chavara Hall",
    format: "Score Based",
    overview: "The theme for Short Film should be related to Faith",
    keyHighlights: [
      "Full HD (1080p / 4K) MP4 or MOV delivery via drive link",
      "Submission deadline: 48 hours prior to festival opening",
      "Copyright-free or original background score mandatory",
    ],
    rules: [
      "Submission deadline: 3 December.",
      "Films must be submitted in the format and through the channel specified by the organisers.",
      "The film may explore any appropriate theme, genre or storyline.",
      "Political themes and offensive content are not permitted.",
      "Films must not contain discriminatory, defamatory or otherwise inappropriate material.",
      "Original scripts, concepts and productions are encouraged. Any third-party music, footage or other material used must be appropriately authorised.",
      "The film must be submitted in a playable, good-quality video format.",
      "The parish name and film title must be included with the submission.",
      "Films submitted after the deadline may be disqualified unless an extension is approved by the organisers."
    ],
    judgingCriteria: [
      { criterion: "Storyline & Scriptwriting", weight: 25, description: "Narrative structure, character development, and emotional weight." },
      { criterion: "Creativity & Originality", weight: 20, description: "Pacing, authentic performances, and scene staging." },
      { criterion: "Direction & Execution", weight: 20, description: "Framing, lighting, camera movement, dialogue clarity, and sound design." },
      { criterion: "Acting & Character Portrayal", weight: 15, description: "Alignment with SELAH core vision and moral upliftment." },
      { criterion: "Cinematography & Visual Composition", weight: 10, description: "Alignment with SELAH core vision and moral upliftment." },
      { criterion: "Editing, Sound & Overall Presentation", weight: 10, description: "Alignment with SELAH core vision and moral upliftment." },
    ],
  },
  {
    id: "live-painting",
    title: "The Art Of The Moment (Live Canvas)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/Painting.jpg",
    tagline: "Transforming blank canvas into a spiritual masterpiece under the clock.",
    teamSize: "Individual (Up to 3 Artists per Parish)",
    duration: "90 Minutes",
    venue: "College Classroom",
    format: "Score Based",
    overview: "The theme for the event will be announced on spot.",
    keyHighlights: [
      "Theme revealed at the start of the 90-minute countdown",
      "Standard A2 size canvas sheets provided by organizers",
      "Artist brings their own brushes, acrylics, or watercolors",
    ],
    rules: [
      "The theme will be announced at the beginning of the competition.",
      "Participants may create artwork through painting, sketching, drawing or other suitable artistic techniques. The event is not limited to the use of colours.",
      "Canvas/sheets will be provided by the organising committee. Participants must bring their own art materials.",
      "The artwork must be created entirely during the competition. Pre-drawn, partially completed or pre-painted artwork is not permitted.",
      "Tracing or copying is not allowed.",
      "Participants must submit their artwork within the allotted time.",
      "Participants are responsible for maintaining cleanliness and ensuring that the venue is not damaged.",
      "Artists must write their name and parish on the rear of the canvas.",
    ],
    judgingCriteria: [
      { criterion: "Relevance to the Announced Theme", weight: 25, description: "Unique conceptual angle on the announced scripture/theme." },
      { criterion: "Artistic Technique & Skill in the Chosen Medium", weight: 25, description: "Brushwork, balance, perspective, and mastery of medium." },
      { criterion: "Composition, Proportions & Perspective", weight: 20, description: "Tonal values, contrast, palette cohesion, and visual impact." },
      { criterion: "Creativity & Originality in Interpretation", weight: 15, description: "Finished presentation within the allotted 90 minutes." },
      { criterion: "Detailing, precision and finishing", weight: 15, description: "Finished presentation within the allotted 90 minutes." },
    ],
  },
  {
    id: "solo-singing",
    title: "Pitch Perfect (Solo Singing)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/SoloSinging.jpeg",
    tagline: "Vocal power, pitch precision, and deep reverent praise from a single heart.",
    teamSize: "Individual Vocalist",
    duration: "2 Minutes",
    venue: "Parish Hall",
    format: "Score Based",
    overview: "The vocalist can sing any songs from any language but it should not contain any vulgar or offensive lyrics",
    keyHighlights: [
      "Christian devotional, worship, or sacred gospel song choices",
      "Option of 1 acoustic instrument accompaniment OR backing track",
      "Languages: English, Hindi, Malayalam, or Tamil",
    ],
    rules: [
      "Individual participation only (1 vocalist).",
      "Participants may choose their own song and perform in any language.",
      "The event will be conducted in the parish hall.",
      "Participants must perform live without karaoke, instrumental backing tracks or any external musical accompaniment",
      "A warning bell will be given at 1 minute 30 seconds.",
      "Participants must conclude their performance within 2 minutes.",
      "Offensive, inappropriate or vulgar content will not be permitted.",
      "Exceeding the allotted time may result in deduction of marks.",
    ],
    judgingCriteria: [
      { criterion: "Pitch & Tonal Accuracy", weight: 25, description: "Intonation, key retention, interval accuracy, and vocal stability." },
      { criterion: "Voice Quality, Clarity & Breath Control", weight: 25, description: "Vocal range, timbre, breath control, and expressive dynamics." },
      { criterion: "Rhythm & Timing (Taal)", weight: 20, description: "Sync with tempo, groove, meter consistency, and phrasing." },
      { criterion: "Voice Modulation & Emotional Expression", weight: 15, description: "Authenticity, lyrical connection, poise, and audience engagement." },
      { criterion: "Pronunciation & Clarity of Lyrics", weight: 10, description: "Authenticity, lyrical connection, poise, and audience engagement." },
      { criterion: "Confidence & Presentation", weight: 5, description: "Authenticity, lyrical connection, poise, and audience engagement." },
    ],
  },
  {
    id: "solo-dance",
    title: "Dance Unleashed (Solo Dance)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/SoloDancing.avif",
    tagline: "An evocative solo movement piece blending grace, energy, and artistic storytelling.",
    teamSize: "Individual Performer",
    duration: "3 Minutes",
    venue: "Chavara Hall",
    format: "Score Based",
    overview: "Participant can choose any song that does not contain any vulgar or offensive languages.",
    keyHighlights: [
      "Contemporary, Semi-Classical, Lyrical, or Gospel Hip-Hop styles",
      "Audio track submitted 2 hours in advance in high bitrate MP3",
      "Modest attire maintaining festival decorum",
    ],
    rules: [
      "Each participant will perform individually.",
      "Participants are free to choose their dance style and music.",
      "Participants must arrange their own music and costumes.",
      "Props are permitted, provided they are safe and manageable.",
      "Fire, sharp objects or any dangerous materials are not permitted.",
      "A warning bell will be given 30 seconds before the time limit.",
      "Offensive, inappropriate or vulgar content will not be permitted.",
      "Exceeding the allotted time may result in deduction of marks."
    ],
    judgingCriteria: [
      { criterion: "Dance Technique, Precision & Execution", weight: 25, description: "Difficulty, posture, flexibility, transitions, and style execution." },
      { criterion: "Rhythm, Timing & Coordination with Music", weight: 20, description: "Musicality, beat hitting, tempo control, and footwork clarity." },
      { criterion: "Choreography, Transitions & Flow of Movements", weight: 20, description: "Emotional projection, character immersion, and narrative communication." },
      { criterion: "Facial Expressions & Emotional Interpretation", weight: 15, description: "Use of floor space, costume elegance, and overall visual aesthetics." },
      { criterion: "Overall presentation and costume suitability", weight: 10, description: "Use of floor space, costume elegance, and overall visual aesthetics." },
    ],
  },
  {
    id: "street-play",
    title: "Nukkad Natak (Street Play)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/StreetPlay.jpg",
    tagline: "Vibrant acoustic theatre on the pavement tackling real-world social and moral issues.",
    teamSize: "5 to 7 Actors",
    duration: "5 Minutes",
    venue: "Open Stage (Near College Ground)",
    format: "Score Based",
    overview: "The theme for Street Play is Faith",
    keyHighlights: [
      "360-degree audience circle without electronic microphones or speakers",
      "Live acoustic instruments (dhol, dafli, cymbals, flute, harmonium) only",
      "Social or spiritual theme delivering clear moral consciousness",
    ],
    rules: [
      "The maximum performance duration is 5 minutes.",
      "The performance must explore the theme of Faith. Teams are free to interpret the theme creatively through storytelling, satire, drama, humour or an original narrative.",
      "Teams may explore faith in everyday life, personal struggles, hope, relationships, community or other relevant perspectives.",
      "The use of props is permitted, provided they are safe and practical.",
      "The performance should be suitable for a parish audience and must not contain offensive, discriminatory or disrespectful content.",
      "Teams must arrange their own props and costumes.",
      "Pre-recorded dialogue or audio should not replace live acting.",
    ],
    judgingCriteria: [
      { criterion: "Interpretation of the Theme", weight: 25, description: "Strength of message, creative writing, clarity of climax and solution." },
      { criterion: "Originality & Creativity of the Storyline", weight: 20, description: "Vocal power, clarity of dialogues without microphones, chorus unison." },
      { criterion: "Acting & Character Portrayal", weight: 20, description: "Circle utilization, sharp physical freezes, transitions, and rhythm." },
      { criterion: "Dialogue Delivery & Audience Engagement", weight: 15, description: "Ability to command the open-air circle and stir the audience." },
      { criterion: "Team Coordination & Use of the Performance Space", weight: 10, description: "Ability to command the open-air circle and stir the audience." },
      { criterion: "Overall Impact & Effectiveness of the Message", weight: 10, description: "Ability to command the open-air circle and stir the audience." },
    ],
  },
  {
    id: "mono-act",
    title: "Alter Ego (Mono Act)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/MonoAct.avif",
    tagline: "One actor, limitless souls. Compelling dramatic range through voice, gesture, and raw emotion.",
    teamSize: "Individual Actor",
    duration: "3 Minutes",
    venue: "Parish Hall",
    format: "Score Based",
    overview: "An individual performer portrays single or multiple characters to tell a gripping story from bible.",
    keyHighlights: [
      "Individual actor playing single or multi-character narrative",
      "Live voice projection with stage headset mic provided",
      "Dialogue in English, Hindi, or Malayalam",
    ],
    rules: [
      "The maximum performance duration is 3 minutes.",
      "The act must be based on a biblical story, character, event or teaching.",
      "Participants are encouraged to present their interpretation creatively through characterisation, voice modulation, expressions and movement.",
      "Minimal props are permitted, provided they can be managed by the performer and do not require additional stage setup.",
      "The performance must remain respectful of the biblical subject and appropriate for the event.",
      "Participants must arrange their own costumes and props.",
    ],
    judgingCriteria: [
      { criterion: "Interpretation of the Biblical Theme", weight: 25, description: "Authenticity of personas, physical transformations, and facial gestures." },
      { criterion: "Acting & Characterisation", weight: 25, description: "Clarity, pacing, inflection, emotional range, and pause control." },
      { criterion: "Voice Modulation & Dialogue Delivery", weight: 20, description: "Story arcs, intellectual engagement, and compelling climax." },
      { criterion: "Expressions & Stage Presence", weight: 15, description: "Confidence, memory retention, and audience grip." },
      { criterion: "Creativity & Overall Impact", weight: 15, description: "Confidence, memory retention, and audience grip." },
    ],
  },
  {
    id: "photography",
    title: "Perspectives (Photography)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/Photography.jpg",
    tagline: "Freezing the sacred spirit, raw emotion, and glorious brotherhood of SELAH 2026.",
    teamSize: "Individual Participant",
    duration: "Day-Long Event (Morning Kickoff to 6:00 PM)",
    venue: "Carmel Parish",
    format: "Score Based",
    overview: "Photographers can roam near the College and Church premises for photos.",
    keyHighlights: [
      "Photos must be taken on festival grounds during competition hours",
      "Theme revealed at morning inauguration (e.g. 'Faces of Fellowship')",
      "Original unedited RAW/JPEG + 1 moderately edited JPEG submitted",
    ],
    rules: [
      "Each participant must submit three photographs that collectively tell one story related to the theme.",
      "All photographs must be captured by the participant using a mobile phone or camera.",
      "Basic editing, such as cropping, exposure adjustment and colour correction, is permitted.",
      "AI-generated images and photographs taken by another person or downloaded from the internet will not be accepted.",
      "Participants must obtain appropriate consent when photographing identifiable individuals.",
      "All photographs must be submitted by 6:00 PM.",
      "The organising committee reserves the right to reject entries that do not comply with the competition guidelines.",
    ],
    judgingCriteria: [
      { criterion: "Relevance to the Theme", weight: 25, description: "Emotional depth, narrative power, and capturing the human spirit." },
      { criterion: "Storytelling & Continuity across the Three Photographs", weight: 25, description: "Rule of thirds, leading lines, perspective, and background isolation." },
      { criterion: "Composition, Framing & Perspective", weight: 20, description: "Exposure accuracy, color fidelity, focus sharpness, and tonal depth." },
      { criterion: "Lighting, Focus & Technical Quality", weight: 15, description: "Fresh perspective, timing of the decisive candid moment." },
      { criterion: "Emotional impact and message conveyed", weight: 15, description: "Fresh perspective, timing of the decisive candid moment." },
    ],
  },
  {
    id: "music-band",
    title: "Battle of the Bands (Music Band)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/MusicBand.jpg",
    tagline: "Soaring guitars, thunderous drums, tight vocal harmonies, and unchained praise.",
    teamSize: "4 to 8 Musicians (Vocals & Instruments)",
    duration: "10 Minutes (5 min line check + 5 min performance)",
    venue: "Chavara Hall",
    format: "Score Based",
    overview: "The band can choose song from any genre but it should not contain any vulgar and offensive languages.",
    keyHighlights: [
      "Band performs 2 songs (1 fast/uptempo praise + 1 worship anthem)",
      "Professional drum kit, keyboard stands, and backline amplifiers provided",
      "Original compositions or rearranged hymns earn bonus points",
    ],
    rules: [
      "Team composition: 4 to 8 band members on stage.",
      "Time Limit: Total stage slot of 10 minutes (Strictly 5 minutes for line check/patch-in + 5 minutes for live performance). Timing stops when music ends.",
      "Gear to Bring: Guitars, basses, keyboards/synths, effect processors, cables, drumsticks, and cymbals/snare (if preferred).",
      "No Backing Tracks: Strictly 100% live performance. Pre-recorded backing tracks, sequencers, or autotune devices are forbidden.",
      "Exceeding time: Point deductions will apply if the performance extends beyond 8 minutes.",
    ],
    judgingCriteria: [
      { criterion: "Tightness, Harmony & Arrangement", weight: 30, description: "Band cohesion, rhythm section lock, vocal harmonies, and dynamic builds." },
      { criterion: "Vocal Mastery & Pitch Stability", weight: 25, description: "Lead and backing vocal accuracy, range, clarity, and tone." },
      { criterion: "Originality & Musical Execution", weight: 25, description: "Unique song arrangements, instrument mastery, solos, and style." },
      { criterion: "Stage Presence & Atmosphere", weight: 20, description: "Energy, team joy, connection with crowd, and spiritual uplift." },
    ],
  },
];

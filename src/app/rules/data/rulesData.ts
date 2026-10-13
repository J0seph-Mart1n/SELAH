export type EventCategory = "sports" | "cultural";

export interface JudgingCriterion {
  criterion: string;
  weight: number;
  description: string;
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
  importantNotes: string[];
}

export interface GeneralGuideline {
  icon: string;
  title: string;
  description: string;
}

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
    title: "Football (5-a-side Turf)",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/Football.jpg",
    tagline: "Rapid-fire turf football celebrating pace, tactical discipline, and team brotherhood.",
    teamSize: "5 Playing + 3 Substitutes (Rolling)",
    duration: "20 Minutes (10 min halves + 3 min break)",
    venue: "SELAH Central Pro Turf Arena",
    format: "Group Stages into Direct Knockouts",
    overview: "5-a-side rink football contested on high-grade artificial turf under FIFA modified small-sided guidelines. Designed for fast breaks, quick passing, and intense competitive spirit.",
    keyHighlights: [
      "Rolling substitutions allowed at dead-ball intervals",
      "No sliding tackles permitted on turf surfaces",
      "Direct kick-ins from touchlines within 4 seconds",
    ],
    rules: [
      "Each team consists of 5 players on the pitch (including 1 goalkeeper) and a maximum of 3 rolling substitutes.",
      "Matches will have two 10-minute halves with a 3-minute halftime. In playoff rounds, matches tied in normal time proceed straight to a 3-penalty shootout, followed by sudden death.",
      "Sliding tackles are strictly prohibited for player safety on turf. Any intentional slide toward an opponent is treated as a foul and may warrant a yellow card.",
      "Goalkeepers cannot kick the ball directly from their hands across the halfway line on the fly; it must touch the ground or a player first.",
      "Back-pass rule applies: Goalkeeper cannot handle a deliberate back-pass played off a teammate's foot.",
      "All free kicks are direct or indirect as signaled by the referee. Defensive wall must stand at least 5 meters away.",
      "Rolling substitutions may occur during any dead-ball situation after informing the assistant referee.",
      "Disciplinary cards: Yellow card serves as a warning; two yellow cards or a straight red card results in ejection for the remainder of the match, and the team plays one man down for 2 minutes or until a goal is conceded.",
      "Mandatory gear: Matching squad jerseys with numbers, turf shoes or rubber molded studs (metal studs are strictly forbidden), and shin pads.",
    ],
    judgingCriteria: [
      { criterion: "Goals Scored", weight: 60, description: "Direct match scoreline determining winners." },
      { criterion: "Fair Play Rating", weight: 20, description: "Penalty card count factored into group tiebreakers." },
      { criterion: "Goal Difference", weight: 20, description: "Primary tiebreaker for tied group positions." },
    ],
    importantNotes: [
      "Teams must report in full match gear 30 minutes before kickoff.",
      "Metal spikes or hard cleat boots are strictly barred from the turf.",
      "Captain is the sole player permitted to address the match referee.",
    ],
  },
  {
    id: "chess",
    title: "Chess Championship",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/chess.jpg",
    tagline: "A clash of intellectual endurance, tactical foresight, and calm calculation on 64 squares.",
    teamSize: "Individual (Up to 2 players per Parish)",
    duration: "15 mins + 10s increment (Rapid FIDE)",
    venue: "Mind Sports & Board Hall (Indoor AC)",
    format: "5-Round Swiss System / Knockouts",
    overview: "Competitive rapid chess conducted under standard International Chess Federation (FIDE) rules. Players battle over 5 rounds with electronic clocks to crown the SELAH Grandmaster.",
    keyHighlights: [
      "Touch-move rule strictly enforced",
      "Digital clocks with Fischer 10-second increment",
      "No mobile devices or smart watches inside tournament hall",
    ],
    rules: [
      "The championship will follow FIDE Rapid Chess regulations with digital chess clocks.",
      "Time control: 15 minutes base time per player with a 10-second increment per move from move 1.",
      "The 'Touch-Move' rule is strictly in effect: If a player touches their own piece with intent to move, they must move it if a legal move exists. Touching an opponent's piece mandates capturing it if legally possible.",
      "Illegal Moves: The first illegal move results in a 2-minute time bonus awarded to the opponent. A second illegal move by the same player results in immediate forfeiture of the game.",
      "Both players must press the clock button with the same hand used to move the chess piece.",
      "Smartphones, smartwatches, and all electronic devices are strictly prohibited. Possession of a transmitting device during play leads to immediate expulsion.",
      "Tie-break criteria in Swiss standings: 1. Direct Encounter, 2. Buchholz Cut-1, 3. Sonneborn-Berger, 4. Greater number of wins.",
      "Arbiters hold ultimate authority on disputes, illegal claims, and threefold repetition verification.",
    ],
    judgingCriteria: [
      { criterion: "Match Points", weight: 70, description: "1 pt for Win, 0.5 pt for Draw, 0 pt for Loss." },
      { criterion: "Buchholz Score", weight: 20, description: "Strength of schedule calculation across all rounds." },
      { criterion: "Sonneborn-Berger", weight: 10, description: "Secondary metric evaluating performance against defeated opponents." },
    ],
    importantNotes: [
      "Silence must be maintained in the hall at all times.",
      "Players must remain seated until an arbiter records and signs the scoresheet.",
      "Spectators and eliminated participants are not permitted in the playing area.",
    ],
  },
  {
    id: "throwball",
    title: "Throwball Tournament",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/Throwball.jpg",
    tagline: "High-flying rallies, strategic court placement, and explosive team coordination.",
    teamSize: "7 Playing + 3 Substitutes",
    duration: "Best of 3 Sets (25-25-15 rally points)",
    venue: "Outdoor Volleyball / Throwball Court 1",
    format: "Double Elimination Bracket",
    overview: "Fast-paced, high-intensity tournament pitting parish squads in strategic aerial rallies. Requiring pinpoint catching accuracy, rapid release, and agile defensive shifting.",
    keyHighlights: [
      "Ball must be caught with both hands and released within 3 seconds",
      "Jump services must be released before landing inside the line",
      "Rally point scoring system with a 2-point lead required",
    ],
    rules: [
      "Each team consists of 7 players on court and up to 3 substitutes. Rotations follow clockwise format upon receiving service.",
      "Matches are played as Best of 3 sets: First two sets to 25 points, third deciding set to 15 points (must lead by 2 clear points).",
      "Service must be executed from behind the endline within 5 seconds of the referee's whistle without stepping on the baseline.",
      "Catching & Throwing: The ball must be caught cleanly with both hands simultaneously without bobbling or double touch. The ball must be thrown back across the net within 3 seconds.",
      "The ball must be thrown over the net with one hand only (either left or right). Two-handed throws are a direct foul.",
      "No touching the net by any part of the body or clothing during a play.",
      "The ball cannot touch any body part below the waist (foot or knee contact is a foul).",
      "A throw cannot be blocked at the net like volleyball; the ball must cross into the opponent's court before being fielded.",
      "Substitutions: Up to 3 substitutions per set are allowed during referee stoppages.",
    ],
    judgingCriteria: [
      { criterion: "Sets Won", weight: 70, description: "Match victory determined by 2 out of 3 sets." },
      { criterion: "Point Differential", weight: 20, description: "Net positive points across group sets." },
      { criterion: "Sportsmanship Conduct", weight: 10, description: "Discipline on court regarding referee decisions." },
    ],
    importantNotes: [
      "Non-marking rubber shoes are recommended for the outdoor hardcourt.",
      "Teams must wear numbered shirts; identical team colors mandatory.",
    ],
  },
  {
    id: "tug-of-war",
    title: "Tug of War",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/TugOfWar.jpg",
    tagline: "The supreme test of grit, collective power, balance, and unbreakable parish unity.",
    teamSize: "8 Pullers + 1 Anchor + 1 Coach",
    duration: "Best of 3 Pulls (with 3-min recovery interval)",
    venue: "Main Stadium Grass Arena",
    format: "Knockout Bracket",
    overview: "The most electric spectacle of SELAH 2026. Eight pullers lock in lockstep rhythm against their rivals, pulling the heavy hemp rope across the white boundary marker.",
    keyHighlights: [
      "Cumulative team weight verification prior to bracket draw",
      "Strict prohibition of spikes, metal cleats, or sticky adhesives",
      "Anchor is the only member permitted to secure rope across back",
    ],
    rules: [
      "A team consists of 8 active pullers on the rope plus 1 registered anchor (last puller) and 1 non-playing coach directing cadence.",
      "All teams must undergo official weigh-in 1 hour before the tournament. Maximum cumulative squad weight will be announced in delegacy briefing.",
      "Matches are contested as Best of 3 pulls. Teams change sides after each pull with a 3-minute breather in between.",
      "Victory is achieved when the center tape of the rope crosses the 4-meter marker on the opposing side.",
      "Grip: Rope must be gripped with bare hands using an underhand or standard palm grip. Resin, chalk, or sticky tapes are not permitted (pure magnesium gym chalk allowed).",
      "Infractions & Disqualifications: Sitting on the ground, intentionally locking feet in deep dug trenches beforehand, or elbow locking will receive an immediate warning. Two infractions forfeit the pull.",
      "The Anchor must grip the rope and allow it to pass around one hip and across the back. No knots or rope loops around the body are permitted for safety.",
      "Footwear: Standard flat-sole athletic sneakers only. Boots with metal spikes, cleats, or deep outdoor studs are strictly prohibited and will be checked prior to entry.",
    ],
    judgingCriteria: [
      { criterion: "Pulls Won", weight: 80, description: "2 out of 3 victorious pulls." },
      { criterion: "Technical Compliance", weight: 20, description: "Zero warnings for sitting or illegal anchoring." },
    ],
    importantNotes: [
      "Gloves without grip-enhancing chemicals are recommended to avoid rope burn.",
      "Rope diameter is standard 32mm regulation Manila hemp.",
    ],
  },
  {
    id: "mixed-relay",
    title: "Mixed Sprint Relay (4x100m)",
    category: "sports",
    categoryLabel: "Sports",
    image: "/events/MixedRelay.jpg",
    tagline: "Lightning speed, seamless baton exchanges, and pulse-pounding track excitement.",
    teamSize: "4 Runners (2 Male + 2 Female)",
    duration: "Heats into Grand Final",
    venue: "Athletics Synthetic Track (Cinder/Poly)",
    format: "Timed Heats & 8-Lane Finals",
    overview: "The signature track event of SELAH 2026. Bringing together the fastest male and female sprinters from each delegation to carry the parish baton across 400 meters of pure adrenaline.",
    keyHighlights: [
      "Compulsory composition: 2 Male and 2 Female runners per team",
      "Baton exchange must happen strictly within the 30m zone",
      "Spikes up to 6mm permitted on track",
    ],
    rules: [
      "Each team must field exactly 4 runners: 2 Men and 2 Women. The running order (e.g. M-F-M-F or F-M-F-M) is at the team's discretion but must be registered 20 minutes prior.",
      "Each runner completes a 100-meter leg with an official regulation aluminum baton.",
      "The baton exchange must take place entirely within the designated 30-meter exchange zone. Passing the baton outside the zone results in immediate disqualification.",
      "If the baton is dropped, only the athlete who dropped it may retrieve it. The athlete may leave their lane to retrieve the baton provided no other runner is obstructed.",
      "Lane Discipline: Runners on legs 1, 2, and 3 must strictly remain within their assigned lane markers throughout the turn.",
      "False Start Rule: World Athletics single false-start rule applies. Any runner causing a false start on the heat leads to disqualification.",
      "Footwear: Running flats or track spikes (maximum 6mm ceramic/pyramid pins) are authorized.",
    ],
    judgingCriteria: [
      { criterion: "Official Gun-to-Tape Time", weight: 100, description: "Electronic / laser timing determines rankings." },
    ],
    importantNotes: [
      "Athletes must warm up in the designated warm-up track 20 minutes before heats.",
      "Teams must wear matching parish bibs or color-coded running tops.",
    ],
  },

  // ==========================================
  // CULTURAL EVENTS
  // ==========================================
  {
    id: "group-dance",
    title: "Group Dance",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/GroupDance.jpg",
    tagline: "Magnificent synchronicity, thematic storytelling, and soul-stirring worship in motion.",
    teamSize: "6 to 16 Dancers (+ 2 Crew)",
    duration: "6 to 8 Minutes (+ 1 min setup & clearance)",
    venue: "Main Auditorium Grand Stage",
    format: "Single-Round Championship",
    overview: "A flagship cultural showcase celebrating artistic choreographies that convey Christian faith, biblical narratives, or spiritual triumph through contemporary, classical, or folk expressions.",
    keyHighlights: [
      "Themes centered on fellowship, resurrection, redemption, or praise",
      "Audio tracks submitted in MP3 format 2 hours before event",
      "Modest attire and tasteful props encouraged",
    ],
    rules: [
      "Team size must strictly be between 6 and 16 dancers on stage. Up to 2 backstage technical crew members allowed for props.",
      "Performance duration: Minimum 6 minutes, maximum 8 minutes. Timing begins with the first movement or music cue. A deduction of 2 marks per 30 seconds over/under time applies.",
      "Genre: Western Contemporary, Cinematic, Lyrical, Indo-Contemporary, or Folk. The presentation must carry a dignified and uplifting Christian spiritual or moral theme.",
      "Attire: Costumes must be modest, dignified, and respectful of the Christian festival spirit. Revealing or offensive attire will cause immediate disqualification.",
      "Props: Handheld and freestanding props are permitted but must be declared at reporting. Fire, open flames, water, glass, or slippery substances on stage are strictly barred.",
      "Music Track: High-bitrate audio (MP3/WAV, min 320kbps) must be submitted on a clean USB drive to the sound technician 2 hours before the event. A backup copy on mobile is required.",
      "Stage Clearance: Teams have 60 seconds to clear props after their performance.",
    ],
    judgingCriteria: [
      { criterion: "Choreography & Synchronization", weight: 30, description: "Precision, formations, uniformity, and movement complexity." },
      { criterion: "Theme Concept & Expression", weight: 25, description: "Depth of spiritual narrative, emotional resonance, and facial expression." },
      { criterion: "Rhythm & Musicality", weight: 25, description: "Transitions, beat matching, and dynamic energy flow." },
      { criterion: "Costume & Prop Creativity", weight: 20, description: "Visual elegance, thematic relevance, and effective stage design." },
    ],
    importantNotes: [
      "Stage dimensions: 40ft wide x 30ft deep with wooden dance flooring.",
      "Light cues must be basic (Static Wash / Follow Spot / Warm Gospel lighting).",
    ],
  },
  {
    id: "short-film",
    title: "Short Film Contest",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/ShortFilm.jpg",
    tagline: "Cinematic narratives exploring faith, resilience, and transformation in modern youth culture.",
    teamSize: "Delegation Production Crew (Director + Cast)",
    duration: "3 to 7 Minutes (Including opening & closing credits)",
    venue: "Media Screening Hall / Audio-Visual Theatre",
    format: "Jury Pre-Screening & Grand Festival Showcase",
    overview: "A platform for visionary young filmmakers to produce moving cinematic stories reflecting the festival theme: 'Pause. Reflect. Lift Up.' Exploring mental health, faith dilemmas, grace, and redemption.",
    keyHighlights: [
      "Full HD (1080p / 4K) MP4 or MOV delivery via drive link",
      "Submission deadline: 48 hours prior to festival opening",
      "Copyright-free or original background score mandatory",
    ],
    rules: [
      "The short film must be created specifically for SELAH 2026 or produced within the current academic year by youth delegation members.",
      "Duration: Strictly between 3 and 7 minutes, including opening and end credits. Any film exceeding 7:00 will incur point deductions.",
      "Language: English, Hindi, or Malayalam. English subtitles are mandatory for all non-English dialogues.",
      "Theme: 'Pause. Reflect. Lift Up' — Stories addressing faith, personal restoration, purpose, fellowship, or overcoming contemporary youth struggles.",
      "Technical Specs: Video resolution minimum 1080p (1920x1080) at 24/25/30 fps in MP4 (H.264) or MOV format. Clean audio mix (stereo, -14 LUFS target).",
      "Copyright: All music, sound effects, and imagery must be royalty-free, licensed, or originally composed. Films featuring copyrighted commercial music will be disqualified.",
      "Content Integrity: No vulgarity, explicit scenes, blasphemous content, or brand advertisements permitted.",
      "Submission: Uploaded to a high-speed Google Drive link and submitted to the media committee 48 hours prior to the festival.",
    ],
    judgingCriteria: [
      { criterion: "Storytelling & Screenplay", weight: 30, description: "Narrative structure, character development, and emotional weight." },
      { criterion: "Direction & Acting", weight: 25, description: "Pacing, authentic performances, and scene staging." },
      { criterion: "Technical Cinematography & Audio", weight: 25, description: "Framing, lighting, camera movement, dialogue clarity, and sound design." },
      { criterion: "Theme Resonance & Inspiration", weight: 20, description: "Alignment with SELAH core vision and moral upliftment." },
    ],
    importantNotes: [
      "Top 5 selected films will be screened on the massive LED auditorium screen.",
      "Winning films will be featured on official CYA YouTube & social media channels.",
    ],
  },
  {
    id: "live-painting",
    title: "Live Painting (On-the-Spot)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/Painting.jpg",
    tagline: "Transforming blank canvas into a spiritual masterpiece under the clock.",
    teamSize: "1 Artist per Parish",
    duration: "90 Minutes",
    venue: "Art Gallery & Open Courtyard",
    format: "Live On-the-Spot Competition",
    overview: "Artists receive a biblical theme or scripture passage on the spot and have 90 minutes to capture their visual interpretation on canvas using color harmony, symbolism, and brush technique.",
    keyHighlights: [
      "Theme revealed at the start of the 90-minute countdown",
      "Standard A2 size canvas sheets provided by organizers",
      "Artist brings their own brushes, acrylics, or watercolors",
    ],
    rules: [
      "Participation is individual (maximum 2 participants per parish).",
      "The topic/scripture prompt will be announced precisely 5 minutes before the timer starts.",
      "Time duration is 90 minutes. No extra time will be provided.",
      "Materials Provided: Organizers will provide high-grade A2 / 300 GSM drawing sheet/canvas board and an easel.",
      "Materials Brought by Participant: Artists must bring their own paints (Acrylics, Watercolors, Gouache, Oil pastels, or Charcoal), palettes, brushes, and mixing bowls.",
      "Digital Assistance: Mobile phones, tablets, sketches, reference photos, and tracing paper are strictly prohibited at the workspace.",
      "All paintings must be original works conceived and created in real time during the competition.",
      "Artists must sign their registration code on the rear of the canvas, not their name or parish identity.",
    ],
    judgingCriteria: [
      { criterion: "Originality & Interpretation", weight: 35, description: "Unique conceptual angle on the announced scripture/theme." },
      { criterion: "Artistic Technique & Composition", weight: 35, description: "Brushwork, balance, perspective, and mastery of medium." },
      { criterion: "Color Harmony & Aesthetics", weight: 20, description: "Tonal values, contrast, palette cohesion, and visual impact." },
      { criterion: "Neatness & Completion", weight: 10, description: "Finished presentation within the allotted 90 minutes." },
    ],
    importantNotes: [
      "Paintings will be exhibited at the SELAH Art Walk throughout the festival.",
      "Water points and cleaning stations will be available nearby.",
    ],
  },
  {
    id: "solo-singing",
    title: "Solo Vocal Championship",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/SoloSinging.jpeg",
    tagline: "Vocal power, pitch precision, and deep reverent praise from a single heart.",
    teamSize: "Individual Vocalist (+ 1 optional accompanist)",
    duration: "4 Minutes (+ 1 min soundcheck)",
    venue: "Acoustic Concert Hall",
    format: "Live Solo Showcase",
    overview: "A celebration of gifted voices performing Christian devotional hymns, gospel anthems, or contemporary worship melodies with emotional authenticity and technical vocal mastery.",
    keyHighlights: [
      "Christian devotional, worship, or sacred gospel song choices",
      "Option of 1 acoustic instrument accompaniment OR backing track",
      "Languages: English, Hindi, Malayalam, or Tamil",
    ],
    rules: [
      "Individual participation only (1 vocalist).",
      "Time limit: Maximum 4 minutes for performance. A short 30-second mic sound check is permitted before beginning.",
      "Song Selection: Song must strictly be a Christian gospel song, contemporary worship ballad, or traditional hymn. Secular songs are barred.",
      "Accompaniment: The singer may perform either:",
      "a) With a single acoustic accompaniment (Acoustic Guitar or Keyboard played by the singer or one accompanist).",
      "b) With a pre-recorded backing track (Karaoke) with NO backing vocals or pitch guides.",
      "Backing tracks must be submitted on a USB drive in MP3/WAV format during morning registration.",
      "Judgment is based solely on the vocalist's singing ability; accompaniment will not add or subtract from individual vocal scores.",
      "Languages permitted: English, Hindi, Malayalam, or Tamil.",
    ],
    judgingCriteria: [
      { criterion: "Pitch & Vocal Accuracy (Sur)", weight: 30, description: "Intonation, key retention, interval accuracy, and vocal stability." },
      { criterion: "Tone & Voice Modulation", weight: 25, description: "Vocal range, timbre, breath control, and expressive dynamics." },
      { criterion: "Rhythm & Timing (Taal)", weight: 25, description: "Sync with tempo, groove, meter consistency, and phrasing." },
      { criterion: "Stage Presence & Spiritual Feeling", weight: 20, description: "Authenticity, lyrical connection, poise, and audience engagement." },
    ],
    importantNotes: [
      "Two condenser/dynamic mics will be available on stage.",
      "Judges will stop any performance exceeding 4 minutes 30 seconds.",
    ],
  },
  {
    id: "solo-dance",
    title: "Solo Dance",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/SoloDancing.avif",
    tagline: "An evocative solo movement piece blending grace, energy, and artistic storytelling.",
    teamSize: "1 Performer",
    duration: "3 to 4 Minutes",
    venue: "Main Auditorium Grand Stage",
    format: "Championship Round",
    overview: "Solo dancers express faith, spiritual struggle, overcoming darkness, and praise through expressive contemporary, classical, or urban dance forms.",
    keyHighlights: [
      "Contemporary, Semi-Classical, Lyrical, or Gospel Hip-Hop styles",
      "Audio track submitted 2 hours in advance in high bitrate MP3",
      "Modest attire maintaining festival decorum",
    ],
    rules: [
      "Individual performance only.",
      "Time limit: 3 to 4 minutes. A 10-second grace buffer is provided; exceeding 4:10 results in point deductions.",
      "Dance Forms: Contemporary, Lyrical, Classical/Semi-Classical, Folk, or Gospel Urban. Performance must be dignified and artistic.",
      "Music Track: Christian worship tracks or clean inspirational instrumental scores only. Backing track submitted via USB 2 hours prior to start.",
      "Costume & Presentation: Costumes must be modest and appropriate for Christian fellowship. No offensive gestures or lyrics permitted.",
      "Props: Handheld props (e.g. fabric, flags, ribbons) are allowed if brought and removed immediately by the dancer.",
    ],
    judgingCriteria: [
      { criterion: "Choreography & Technique", weight: 30, description: "Difficulty, posture, flexibility, transitions, and style execution." },
      { criterion: "Rhythm & Body Coordination", weight: 25, description: "Musicality, beat hitting, tempo control, and footwork clarity." },
      { criterion: "Facial Expressions (Bhavas)", weight: 25, description: "Emotional projection, character immersion, and narrative communication." },
      { criterion: "Stage Utilization & Costume", weight: 20, description: "Use of floor space, costume elegance, and overall visual aesthetics." },
    ],
    importantNotes: [
      "Dancers must report in full costume 30 minutes prior to call time.",
      "Barefoot or soft dance shoes permitted on stage.",
    ],
  },
  {
    id: "street-play",
    title: "Street Play (Nukkad Natak)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/StreetPlay.jpg",
    tagline: "Vibrant acoustic theatre on the pavement tackling real-world social and moral issues.",
    teamSize: "8 to 15 Actors",
    duration: "8 to 10 Minutes",
    venue: "Open-Air Circular Amphitheater",
    format: "Acoustic 360° Circular Arena",
    overview: "Electrifying open-air theatre that cuts straight to the heart. Utilizing live rhythm instruments, voice choruses, and sharp satire to address social concerns such as youth addiction, depression, social media vanity, and Christ's living truth.",
    keyHighlights: [
      "360-degree audience circle without electronic microphones or speakers",
      "Live acoustic instruments (dhol, dafli, cymbals, flute, harmonium) only",
      "Social or spiritual theme delivering clear moral consciousness",
    ],
    rules: [
      "Team size: 8 to 15 performers.",
      "Time limit: 8 to 10 minutes. A warning bell will ring at 8 minutes; a final bell at 10 minutes.",
      "Format: True street theatre (Nukkad Natak) performed inside a marked circular arena with a 360-degree surrounding audience.",
      "Sound & Music: Strictly acoustic. No electronic microphones, PAs, or recorded tracks permitted. Teams must use natural voice projection.",
      "Live instruments like dholak, dafli, ghungroo, cymbals, or djembe are highly encouraged and played by team members.",
      "Props: Minimal, handheld everyday props only (e.g. dupattas, placards, sticks, cloth). No heavy sets or electronic lighting.",
      "Content: Themes must address social issues (e.g. mental health, family restoration, environmental stewardship, truth in society). No personal political attacks or defamation allowed.",
      "Attire: Uniform dress code (such as black/white kurtas with colored dupattas) is customary.",
    ],
    judgingCriteria: [
      { criterion: "Script & Social Impact", weight: 30, description: "Strength of message, creative writing, clarity of climax and solution." },
      { criterion: "Voice Projection & Energy", weight: 25, description: "Vocal power, clarity of dialogues without microphones, chorus unison." },
      { criterion: "Team Coordination & Formations", weight: 25, description: "Circle utilization, sharp physical freezes, transitions, and rhythm." },
      { criterion: "Crowd Engagement & Authenticity", weight: 20, description: "Ability to command the open-air circle and stir the audience." },
    ],
    importantNotes: [
      "Performances will take place outdoors on smooth paved grounds.",
      "Teams are assigned performance order via a random lot draw.",
    ],
  },
  {
    id: "mono-act",
    title: "Mono Act (Dramatic Solo)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/MonoAct.avif",
    tagline: "One actor, limitless souls. Compelling dramatic range through voice, gesture, and raw emotion.",
    teamSize: "1 Actor",
    duration: "4 to 5 Minutes",
    venue: "Studio Black Box Theatre",
    format: "Solo Stage Monologue",
    overview: "A solo theatrical tour de force. An individual performer portrays single or multiple characters to tell a gripping story of moral dilemma, biblical figures, conviction, or redemption.",
    keyHighlights: [
      "Individual actor playing single or multi-character narrative",
      "Live voice projection with stage headset mic provided",
      "Dialogue in English, Hindi, or Malayalam",
    ],
    rules: [
      "Solo performance only (1 actor).",
      "Time limit: 4 to 5 minutes. Bell at 4 minutes; final bell at 5 minutes.",
      "Content: Biblical narratives, social themes, historical figures, or original dramatic monologues with inspiring moral depth.",
      "Multi-character transitions: If transitioning between multiple characters, modulations in body posture, voice pitch, and stance must be clear.",
      "Costume & Props: Single costume with simple additions (e.g. shawl, spectacles, cap). Minimal hand props only; no elaborate furniture.",
      "Audio / SFX: Background music is permitted but must remain subtle and submitted beforehand. Lip-syncing is strictly prohibited.",
      "Language: English, Hindi, or Malayalam. Slang and offensive language are strictly barred.",
    ],
    judgingCriteria: [
      { criterion: "Characterization & Body Modulation", weight: 35, description: "Authenticity of personas, physical transformations, and facial gestures." },
      { criterion: "Dialogue Delivery & Diction", weight: 25, description: "Clarity, pacing, inflection, emotional range, and pause control." },
      { criterion: "Script Originality & Substance", weight: 20, description: "Story arcs, intellectual engagement, and compelling climax." },
      { criterion: "Stage Impact & Poise", weight: 20, description: "Confidence, memory retention, and audience grip." },
    ],
    importantNotes: [
      "A wireless collar or headset microphone will be provided.",
      "Prompting from offstage will incur a 10-point penalty.",
    ],
  },
  {
    id: "photography",
    title: "Festival Photography Contest",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/Photography.jpg",
    tagline: "Freezing the sacred spirit, raw emotion, and glorious brotherhood of SELAH 2026.",
    teamSize: "1 Photographer per Parish",
    duration: "Day-Long Event (Morning Kickoff to 4:00 PM)",
    venue: "Entire Festival Grounds & Stadium Campus",
    format: "On-the-Spot Submission",
    overview: "Photographers roam the vibrant festival grounds to capture evocative candid moments of joy, competitive sweat, heartfelt prayer, and united fellowship. Submitted on-the-spot for jury review.",
    keyHighlights: [
      "Photos must be taken on festival grounds during competition hours",
      "Theme revealed at morning inauguration (e.g. 'Faces of Fellowship')",
      "Original unedited RAW/JPEG + 1 moderately edited JPEG submitted",
    ],
    rules: [
      "Individual competition (up to 2 photographers per delegation).",
      "Theme will be announced during the morning festival assembly.",
      "All photos must be captured on the official festival grounds on the day of SELAH 2026 between 8:00 AM and 4:00 PM.",
      "Equipment: DSLR, Mirrorless, or High-end Smartphone cameras allowed. Drones are prohibited without aerial clearance.",
      "Submission: Each participant must submit exactly TWO best frames in digital format before 4:30 PM at the Media Room desk.",
      "Authenticity & Metadata: Photos must retain intact EXIF metadata proving time, date, camera model, and settings.",
      "Editing Rules: Basic corrections (color temperature, contrast, cropping, sharpening) are allowed. Heavy compositing, AI replacement, object deletion, or HDR surreal filters are disqualified.",
      "Plagiarism: Submitting photos taken by others or using AI-generated imagery leads to immediate disqualification and delegation penalty.",
    ],
    judgingCriteria: [
      { criterion: "Adherence to Theme & Storytelling", weight: 30, description: "Emotional depth, narrative power, and capturing the human spirit." },
      { criterion: "Composition & Framing", weight: 25, description: "Rule of thirds, leading lines, perspective, and background isolation." },
      { criterion: "Lighting & Technical Quality", weight: 25, description: "Exposure accuracy, color fidelity, focus sharpness, and tonal depth." },
      { criterion: "Visual Creativity & Uniqueness", weight: 20, description: "Fresh perspective, timing of the decisive candid moment." },
    ],
    importantNotes: [
      "Bring your own memory card and card reader / data cable for submission.",
      "Selected winning entries will be featured in the official SELAH 2026 Commemorative Photo Album.",
    ],
  },
  {
    id: "music-band",
    title: "Battle of the Bands (Worship Band)",
    category: "cultural",
    categoryLabel: "Cultural",
    image: "/events/MusicBand.jpg",
    tagline: "Soaring guitars, thunderous drums, tight vocal harmonies, and unchained praise.",
    teamSize: "4 to 9 Musicians (Vocals & Instruments)",
    duration: "12 Minutes (4 min line check + 8 min performance)",
    venue: "Main Auditorium Concert Stage",
    format: "Live Band Battle & Worship Showcase",
    overview: "The grand finale of SELAH 2026 cultural arena. Parish worship bands take the stage with live instruments, original arrangements, and roaring contemporary praise sets.",
    keyHighlights: [
      "Band performs 2 songs (1 fast/uptempo praise + 1 worship anthem)",
      "Professional drum kit, keyboard stands, and backline amplifiers provided",
      "Original compositions or rearranged hymns earn bonus points",
    ],
    rules: [
      "Team composition: 4 to 9 band members on stage.",
      "Time Limit: Total stage slot of 12 minutes (Strictly 4 minutes for line check/patch-in + 8 minutes for live performance). Timing stops when music ends.",
      "Song Requirement: Bands must perform a 2-song set: One uptempo praise track and one deep worship ballad.",
      "Genre: Christian Contemporary, Gospel Rock, Acoustic Worship, or Fusion Hymns. Lyrics must align with Christian doctrine.",
      "Backline Provided: Professional 5-piece acoustic drum kit, bass amplifier, 2 guitar combo amps, keyboard stand, DI boxes, and vocal microphones.",
      "Gear to Bring: Guitars, basses, keyboards/synths, effect processors, cables, drumsticks, and cymbals/snare (if preferred).",
      "No Backing Tracks: Strictly 100% live performance. Pre-recorded backing tracks, sequencers, or autotune devices are forbidden.",
      "Exceeding time: Point deductions will apply if the performance extends beyond 8 minutes.",
    ],
    judgingCriteria: [
      { criterion: "Tightness, Harmony & Arrangement", weight: 30, description: "Band cohesion, rhythm section lock, vocal harmonies, and dynamic builds." },
      { criterion: "Vocal Mastery & Pitch Stability", weight: 25, description: "Lead and backing vocal accuracy, range, clarity, and tone." },
      { criterion: "Originality & Musical Execution", weight: 25, description: "Unique song arrangements, instrument mastery, solos, and style." },
      { criterion: "Stage Presence & Worship Atmosphere", weight: 20, description: "Energy, team joy, connection with crowd, and spiritual uplift." },
    ],
    importantNotes: [
      "Stage plot and input channel list must be submitted during morning sound briefing.",
      "Drummers must use the provided kit; changing hardware sets is restricted to save changeover time.",
    ],
  },
];

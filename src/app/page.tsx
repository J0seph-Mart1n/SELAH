"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/ui/sparkles-text";
import Navbar from "@/components/web/Navbar";
import Silk from "@/components/ui/Silk";
import { MorphingText } from "@/components/ui/morphing-text";
import BorderGlow from "@/components/ui/BorderGlow";
import ScrollVelocity from "@/components/ui/ScrollVelocity";
import MagicBento from "@/components/ui/MagicBento";
import AnimatedContent from "@/components/ui/AnimatedContent";
import Counter from "@/components/ui/Counter";
import ThemeMusicPlayer from "@/components/web/ThemeMusicPlayer";
import Footer from "@/components/web/Footer";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crown,
  Download,
  Headphones,
  HeartHandshake,
  Medal,
  Music2,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";

type Track = "sports" | "culture";

type EventCard = {
  title: string;
  description: string;
  image: string;
};

const eventCards: Record<Track, EventCard[]> = {
  sports: [
    {
      title: "Blitz Chess",
      description:
        "Standard FIDE rules with digital chess clocks and touch-move regulations.",
      image:
        "/events/chess.jpg",
    },
    {
      title: "Throwball",
      description:
        "One set of 20 points with Knockout format.",
      image:
        "events/Throwball.jpg",
    },
    {
      title: "Futsal",
      description:
        "Rapid 20-minute Match on turf surfaces.",
      image:
        "/events/Football.jpg",
    },
    {
      title: "Tug of War",
      description:
        "Best of 3 sets match with Knockout format.",
      image:
        "/events/TugOfWar.jpg",
    },
    {
      title: "Mixed Relay",
      description:
        "2 Boys and 2 Girls Team.",
      image:
        "/events/MixedRelay.jpg",
    },
    {
      title: "100 M Race",
      description:
        "Individual 100m sprint showdown. Up to 5 participants per parish.",
      image:
        "/events/100mRace.png",
    },
  ],
  culture: [
    {
      title: "The Big Picture",
      description:
        "Group Dance event with the theme as Big Indian Wedding.",
      image:
        "/events/GroupDance.jpg",
    },
    {
      title: "Frame By Frame",
      description:
        "Make a Short Flim with no political and offensive theme.",
      image:
        "/events/ShortFilm.jpg",
    },
    {
      title: "The Art of the Moment",
      description:
        "Live Canvas Art with the theme to be said on the event day.",
      image:
        "/events/Painting.jpg",
    },
    {
      title: "Pitch Perfect",
      description:
        "Solo Singing event with open ended song.",
      image:
        "/events/SoloSinging.jpeg",
    },
    {
      title: "Dance Unleashed",
      description:
        "Solo Dance event with open ended theme.",
      image:
        "/events/SoloDancing.avif",
    },
    {
      title: "Nukkad Natak",
      description:
        "Street Play with the theme as Faith.",
      image:
        "events/StreetPlay.jpg",
    },
    {
      title: "Alter Ego",
      description:
        "Mono Act event with a biblical theme.",
      image:
        "/events/MonoAct.avif",
    },
    {
      title: "Perspectives",
      description:
        "Photography event. Take 3 Pictures and tell a story about it.",
      image:
        "/events/Photography.jpg",
    },
    {
      title: "Battle of the Bands",
      description:
        "Music Band Event. 4 Jacks and 4 Mics will be provided to the band.",
      image:
        "/events/MusicBand.jpg",
    },
  ],
};

const timelineEvents: {
  title: string;
  start: number; // hour (8-20)
  duration: number; // in hours
  column: "cultural" | "sports" | "both";
  color: string;
  description: string;
}[] = [
    // Sports Events
    
    { title: "Relay and 100M Sprint", start: 9, duration: 2, column: "sports", color: "#63752e", description: "Group stage matches across courts" },
    { title: "Throwball", start: 13, duration: 3, column: "sports", color: "#63752e", description: "Pool matches across 8 parish squads" },
    { title: "Futsal", start: 13, duration: 3, column: "sports", color: "#63752e", description: "Rapid 20-min halves on pro turf" },
    { title: "Chess", start: 13, duration: 3, column: "sports", color: "#63752e", description: "Singles & doubles championship" },
    { title: "Tug of War", start: 16, duration: 1.5, column: "sports", color: "#63752e", description: "Championship match under lights" },
    
    // Cultural Events
    { title: "Solo Dance", start: 10, duration: 3, column: "cultural", color: "#63752e", description: "Sacred hymnody & four-part harmony" },
    { title: "Solo Singing", start: 10.5, duration: 2, column: "cultural", color: "#fff1cb", description: "Individual vocal performances" },
    { title: "Group Dance", start: 8.5, duration: 1.5, column: "cultural", color: "#63752e", description: "Choreographed cultural dance" },
    { title: "Mono Act", start: 8.5, duration: 2, column: "cultural", color: "#fff1cb", description: "Original rhythmic narratives" },
    { title: "Street Play", start: 10.5, duration: 2.5, column: "cultural", color: "#63752e", description: "Sacred drama & theatrical showcase" },
    { title: "Live Painting", start: 13, duration: 1.5, column: "cultural", color: "#fff1cb", description: "Original compositions & hymn covers" },
    { title: "Battle of Bands", start: 17.5, duration: 1.5, column: "cultural", color: "#63752e", description: "Best performances & Spirit awards" },

    // Common Events
    { title: "Opening Ceremony", start: 8, duration: 0.5, column: "both", color: "#63752e", description: "Flag march & sportsmanship oath" },
    { title: "Short Film & Photography Glimpes", start: 19, duration: 0.5, column: "both", color: "#63752e", description: "Flag march & sportsmanship oath" },
    { title: "Prize Distribution & Conclusion", start: 19.5, duration: 1.5, column: "both", color: "#63752e", description: "Flag march & sportsmanship oath" },
  ];

type TimelineEvent = typeof timelineEvents[0];

interface LayoutEvent extends TimelineEvent {
  lane: number;
  totalLanes: number;
  colSpan: number;
}

function computeEventLayout(events: TimelineEvent[]): LayoutEvent[] {
  if (events.length === 0) return [];

  // Sort events by start time ascending, then duration descending
  const sorted = events.slice().sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.duration - a.duration;
  });

  // Group into connected collision clusters
  const clusters: TimelineEvent[][] = [];
  let currentCluster: TimelineEvent[] = [];
  let clusterEnd = -1;

  for (const event of sorted) {
    if (currentCluster.length === 0) {
      currentCluster.push(event);
      clusterEnd = event.start + event.duration;
    } else if (event.start < clusterEnd) {
      currentCluster.push(event);
      clusterEnd = Math.max(clusterEnd, event.start + event.duration);
    } else {
      clusters.push(currentCluster);
      currentCluster = [event];
      clusterEnd = event.start + event.duration;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const result: LayoutEvent[] = [];

  for (const cluster of clusters) {
    const laneEnds: number[] = [];
    const clusterEventsWithLane: { event: TimelineEvent; lane: number }[] = [];

    for (const event of cluster) {
      let assignedLane = -1;
      for (let i = 0; i < laneEnds.length; i++) {
        if (laneEnds[i] <= event.start) {
          assignedLane = i;
          laneEnds[i] = event.start + event.duration;
          break;
        }
      }
      if (assignedLane === -1) {
        assignedLane = laneEnds.length;
        laneEnds.push(event.start + event.duration);
      }
      clusterEventsWithLane.push({ event, lane: assignedLane });
    }

    const totalLanes = Math.max(1, laneEnds.length);

    for (const { event, lane } of clusterEventsWithLane) {
      // Check if this event can expand into empty adjacent lanes to the right
      let colSpan = 1;
      while (lane + colSpan < totalLanes) {
        const nextLane = lane + colSpan;
        const hasConflict = clusterEventsWithLane.some(
          (other) =>
            other.lane === nextLane &&
            other.event.start < event.start + event.duration &&
            other.event.start + other.event.duration > event.start
        );
        if (hasConflict) break;
        colSpan++;
      }

      result.push({
        ...event,
        lane,
        totalLanes,
        colSpan,
      });
    }
  }

  return result;
}

const formatTimelineHour = (h: number) => {
  const hourNum = Math.floor(h);
  const minutes = Math.round((h - hourNum) * 60);
  const minStr = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  if (hourNum === 12) return `12${minStr} PM`;
  return hourNum < 12 ? `${hourNum}${minStr} AM` : `${hourNum - 12}${minStr} PM`;
};

const formatEventTime = (h: number) => {
  const hourNum = Math.floor(h);
  const minutes = Math.round((h - hourNum) * 60);
  const minStr = `:${String(minutes).padStart(2, '0')}`;
  const period = hourNum >= 12 && hourNum < 24 ? 'PM' : 'AM';
  const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  return `${displayHour}${minStr} ${period}`;
};

const getEventTheme = (column: "cultural" | "sports" | "both") => {
  if (column === "cultural") {
    return {
      bg: "#fce7f3", // soft rose / pink
      stripe: "#c239b3", // Teams magenta
      border: "1px solid rgba(194, 57, 179, 0.3)",
      textTitle: "#3d0f28", // dark wine
      textTime: "#86198f", // magenta
    };
  }
  if (column === "sports") {
    return {
      bg: "#e0e9fe", // soft periwinkle / lavender blue
      stripe: "#4f52b2", // Teams indigo / royal blue
      border: "1px solid rgba(79, 82, 178, 0.3)",
      textTitle: "#1b1c3a", // deep navy
      textTime: "#4338ca", // indigo
    };
  }
  // column === 'both' (Joint / Common Events)
  return {
    bg: "#fff2c8", // warm cream / butter
    stripe: "#d97706", // warm amber
    border: "1px solid rgba(217, 119, 6, 0.35)",
    textTitle: "#451a03", // dark espresso
    textTime: "#b45309", // rich amber
  };
};

// Track whether the user has already entered during this browser session
let hasEnteredSession = false;

function App() {
  const isChiefGuestFinalized = false;
  const showSponsors = false;
  const [track, setTrack] = useState<Track>("sports");

  const culturalEventsWithLayout = useMemo(
    () => computeEventLayout(timelineEvents.filter((e) => e.column === 'cultural')),
    []
  );

  const sportsEventsWithLayout = useMemo(
    () => computeEventLayout(timelineEvents.filter((e) => e.column === 'sports')),
    []
  );

  const [hasEntered, setHasEntered] = useState<boolean>(hasEnteredSession);

  useEffect(() => {
    if (
      hasEnteredSession ||
      (typeof window !== "undefined" &&
        (sessionStorage.getItem("selah_has_entered") === "true" ||
          document.documentElement.classList.contains("selah-entered")))
    ) {
      setHasEntered(true);
      hasEnteredSession = true;
    }
  }, []);

  const handleSiteEnter = () => {
    setHasEntered(true);
    hasEnteredSession = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selah_has_entered", "true");
      document.documentElement.classList.add("selah-entered");
    }
  };

  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [anthemPlaying, setAnthemPlaying] = useState(false);
  const target = useMemo(() => new Date("2026-12-05T00:00:00+05:30"), []);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Live time tracker for schedule timeline
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const eventDateStr = "2026-12-05"; // YYYY-MM-DD of the event

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (todayStr === eventDateStr) {
        const hourDecimal = now.getHours() + now.getMinutes() / 60;
        // Only show tracker between 8 AM and 9 PM
        if (hourDecimal >= 8 && hourDecimal <= 21) {
          setCurrentHour(hourDecimal);
        } else {
          setCurrentHour(null);
        }
      } else {
        setCurrentHour(null);
      }
      // setCurrentHour(15.5);
    };
    updateTime();
    const trackerTimer = window.setInterval(updateTime, 60000); // update every minute
    return () => window.clearInterval(trackerTimer);
  }, [eventDateStr]);

  useEffect(() => {
    const update = () => {
      const difference = Math.max(0, target.getTime() - Date.now());
      setCountdown({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);



  useEffect(() => {
    if (!anthemPlaying) return;
    const timer = window.setTimeout(() => setAnthemPlaying(false), 5000);
    return () => window.clearTimeout(timer);
  }, [anthemPlaying]);

  const visibleEvents = eventCards[track];

  return (
    <div className="app-shell bg-transparent">
      {/* Floating FIFA Theme Music Player with Welcome Overlay rendered first */}
      <ThemeMusicPlayer hasEntered={hasEntered} onEnter={handleSiteEnter} />

      {/* Main Page Content - Animations start after welcome button click */}
      <motion.div
        initial={false}
        animate={hasEntered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col min-h-screen"
      >
        <Navbar hideHome />

      <main id="top" className="!pt-0">
        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Silk 
              color="#611e3c"
              sheenColor="#fff1cb"
              speed={2.5}
              scale={1}
              noiseIntensity={1.5}
              rotation={0}
              sheen={0.8}
              depth={0.6}
              glow={0.3}
              wave={1.5}
            />
          </div>
          <section className="hero relative z-10 !pt-28 md:!pt-32 min-h-screen" id="about">
            <div className="glow glow-coral" />
            <div className="glow glow-gold" />
            <div className="glow glow-cyan" />
            <AnimatedContent
              key={hasEntered ? "hero-entered" : "hero-initial"}
              distance={60}
              duration={2.6}
              ease="power3.out"
              threshold={0.1}
              className="w-full flex justify-center items-center"
            >
              <div className="hero-inner flex flex-col items-center justify-center text-center mx-auto">
                <h1 className="text-center w-full flex flex-col items-center justify-center">
                  <MorphingText texts={["SELAH", "सेलाह", "സേലാ", "סֶלָה", "SELAH"]} />
                  <span>2026</span>
                </h1>
                <p className="hero-subtitle text-center mx-auto" >
                  Pause. Explore. Renew
                  <br className="desktop-only" />{" "}
                </p>
                <div className="text-[#fff1cb] font-semibold tracking-widest text-sm mt-8 uppercase text-center w-full">
                  Starting In
                </div>
                <div className="countdown mx-auto" aria-label="Countdown to SELAH festival">
                  {(
                    [
                      ["days", countdown.days],
                      ["hours", countdown.hours],
                      ["minutes", countdown.minutes],
                      ["seconds", countdown.seconds],
                    ] as const
                  ).map(([label, value], index) => (
                    <div
                      className={
                        index === 0 || index === 3
                          ? "count-cell highlight"
                          : "count-cell"
                      }
                      key={label}
                    >
                      <strong className="flex justify-center items-center">
                        <Counter
                          value={value}
                          minDigits={2}
                          fontSize={28}
                          fontWeight="700"
                          textColor="#fff1cb"
                          gap={2}
                          fade={0.2}
                          direction="down"
                        />
                      </strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-actions flex !flex-row !flex-nowrap w-full max-w-xs sm:max-w-md mx-auto justify-center items-center gap-3">
                  <Link
                    className="button button-primary button-large flex-1 sm:flex-none flex items-center justify-center gap-2 whitespace-nowrap px-4"
                    href="/register"
                  >
                    <Users size={17} /> Register
                  </Link>
                  <a className="button button-outline button-large flex-1 sm:flex-none flex items-center justify-center gap-2 whitespace-nowrap px-4" href="#events">
                    <Trophy size={17} /> Explore Events
                  </a>
                </div>
              </div>
            </AnimatedContent>
          </section>
        </div>

        <section className="section prize-pool relative py-24" id="prizepool">
          <div className="absolute inset-0 bg-[#611e3c] z-[-1]" />
          <div className="glow glow-gold opacity-30" />
          <div className="glow glow-cyan opacity-20" />

          <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
            <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-20 px-4">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-[#fff1cb] leading-tight">
                Mega Prize Pool
              </h2>
              <SparklesText
                className="text-4xl md:text-5xl font-black mb-1 leading-tight"
                colors={{ first: "#fff1cb", second: "#63752e" }}
                sparklesCount={12}
              >
                ₹45,000
              </SparklesText>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-8 lg:gap-8 xl:gap-10 max-w-6xl mx-auto px-4 lg:px-8 mt-16 relative z-10 pb-8">
              {/* 2nd Prize */}
              <div className="w-full lg:flex-1 max-w-md lg:max-w-none order-2 lg:order-1 relative lg:-mt-10 lg:hover:-translate-y-4 transition-transform duration-500 z-10">
                <BorderGlow 
                  glowColor="99 117 46" // Olive
                  backgroundColor="#fff1cb"
                  colors={["#63752e", "#fff1cb", "#63752e"]}
                  className="w-full shadow-2xl h-full lg:h-[320px]"
                >
                  <div className="relative rounded-[30px] p-8 flex flex-col items-center justify-center text-center overflow-hidden h-full bg-[#fff1cb] border border-[#63752e]/30">
                    <div className="absolute -right-4 -top-8 opacity-10 pointer-events-none select-none">
                      <span className="text-[250px] font-black italic text-[#611e3c]">2</span>
                    </div>
                    <div className="mb-6 flex justify-center drop-shadow-[0_0_15px_rgba(99,117,46,0.3)]">
                       <Medal className="text-[#63752e]" size={56} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[#611e3c]/90 text-xl font-bold tracking-[0.2em] uppercase mb-2">2nd Prize</h3>
                    <div className="text-3xl lg:text-4xl font-black text-[#611e3c] tracking-tight">₹15,000</div>
                  </div>
                </BorderGlow>
              </div>

              {/* 1st Prize */}
              <div className="w-full lg:flex-1 max-w-md lg:max-w-none order-1 lg:order-2 relative z-20 lg:-translate-y-6 lg:scale-105 lg:hover:-translate-y-10 transition-transform duration-500">
                <BorderGlow 
                  glowColor="99 117 46" // Olive
                  backgroundColor="#fff1cb"
                  colors={["#63752e", "#611e3c", "#63752e"]}
                  animated={true}
                  glowIntensity={2}
                  className="w-full shadow-[0_0_50px_rgba(99,117,46,0.4)] h-full lg:h-[380px]"
                >
                  <div className="relative rounded-[30px] p-10 flex flex-col items-center justify-center text-center overflow-hidden h-full border-2 border-[#63752e] bg-[#fff1cb]">
                    <div className="absolute -right-2 -top-10 opacity-10 pointer-events-none select-none">
                      <span className="text-[300px] font-black italic text-[#63752e]">1</span>
                    </div>
                    <div className="mb-8 flex justify-center drop-shadow-[0_0_20px_rgba(99,117,46,0.4)]">
                       <Crown className="text-[#63752e]" size={80} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[#611e3c] text-2xl font-black tracking-[0.25em] uppercase mb-2">1st Prize</h3>
                    <div className="text-3xl lg:text-4xl font-black text-[#611e3c] tracking-tight">₹20,000</div>
                  </div>
                </BorderGlow>
              </div>

              {/* 3rd Prize */}
              <div className="w-full lg:flex-1 max-w-md lg:max-w-none order-3 lg:order-3 relative lg:-mt-10 lg:hover:-translate-y-4 transition-transform duration-500 z-10">
                <BorderGlow 
                  glowColor="99 117 46" // Olive
                  backgroundColor="#fff1cb"
                  colors={["#63752e", "#fff1cb", "#63752e"]}
                  className="w-full shadow-2xl h-full lg:h-[320px]"
                >
                  <div className="relative rounded-[30px] p-8 flex flex-col items-center justify-center text-center overflow-hidden h-full bg-[#fff1cb] border border-[#63752e]/30">
                    <div className="absolute -right-4 -top-8 opacity-10 pointer-events-none select-none">
                      <span className="text-[250px] font-black italic text-[#611e3c]">3</span>
                    </div>
                    <div className="mb-6 flex justify-center drop-shadow-[0_0_15px_rgba(99,117,46,0.3)]">
                       <Medal className="text-[#63752e]" size={56} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[#611e3c]/90 text-xl font-bold tracking-[0.2em] uppercase mb-2">3rd Prize</h3>
                    <div className="text-3xl lg:text-4xl font-black text-[#611e3c] tracking-tight">₹10,000</div>
                  </div>
                </BorderGlow>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="section relative py-24" id="chief-guest">
          <div className="absolute inset-0 bg-[#611e3c] z-[-1]" />
          <div className="glow glow-gold opacity-20" />
          <div className="glow glow-coral opacity-10" />

          <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-[#fff1cb] leading-tight">
                  Special Chief Guest
                </h2>
              </div>

              {/* Chief Guest Feature Card */}
              <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-[32px] bg-[#fff1cb] text-[#611e3c] border border-[#63752e]/30 shadow-2xl relative overflow-hidden backdrop-blur-sm">

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                  {isChiefGuestFinalized ? (
                    <>
                      {/* Avatar / Dignitary Portrait Placeholder */}
                      <div className="lg:col-span-4 flex flex-col items-center text-center">
                        <div className="relative">
                          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#611e3c] p-1 shadow-[0_0_40px_rgba(99,117,46,0.25)]">
                            <div className="w-full h-full rounded-2xl bg-[#611e3c] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
                              <UserRound className="text-[#fff1cb] mb-3" size={64} strokeWidth={1.5} />
                              <span className="text-[10px] sm:text-xs font-bold text-[#fff1cb] uppercase tracking-widest">Metropolitan &amp; Archbishop</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dignitary Bio & Keynote Details */}
                      <div className="lg:col-span-8 flex flex-col">

                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#611e3c] mb-2 leading-tight text-center lg:text-left">
                          Most Rev. Dr. Alexander Mor Baselios
                        </h3>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                          <span className="px-3 py-1 rounded-md bg-[#63752e] text-[#fff1cb] text-[10px] sm:text-xs font-bold uppercase tracking-widest">Chief Guest of Honor</span>
                          <span className="px-3 py-1 rounded-md bg-[#611e3c] text-[#fff1cb] text-[10px] sm:text-xs font-bold uppercase tracking-widest">Olympic Ambassador</span>
                        </div>

                        <p className="text-[#611e3c]/85 text-sm md:text-base leading-relaxed mb-8 text-center lg:text-left font-medium">
                          Dr. Alexander Mor Baselios has spearheaded ecumenical youth movements across four continents, championing character-driven athletics and liturgical renewal. Joining him on the dais is former Olympic sprinter and Christian Youth Ambassador <span className="text-[#611e3c] font-black">Marcus Vance</span>, leading the Opening Ceremony Dedication and Oath of Sportsmanship.
                        </p>

                      </div>
                    </>
                  ) : (
                    <>
                      <div className="lg:col-span-4 flex flex-col items-center text-center">
                        <div className="relative">
                          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#611e3c]/5 border-2 border-dashed border-[#63752e]/40 p-1 flex items-center justify-center shadow-lg">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#63752e]/10 to-transparent flex flex-col items-center justify-center p-4 text-center">
                              <ShieldCheck className="text-[#63752e] mb-3" size={64} strokeWidth={1.5} />
                              <span className="text-[10px] sm:text-xs font-bold text-[#611e3c]/70 uppercase tracking-widest">To Be Revealed</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left py-6">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#611e3c] mb-4 leading-tight">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#611e3c] to-[#63752e]">Revealing Soon</span>
                        </h3>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </AnimatedContent>
        </section>

        {/* SPONSORSHIP SECTION */}
        <section className="section relative py-24" id="sponsors">
          <div className="absolute inset-0 bg-[#611e3c] z-[-1]" />

          <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#fff1cb] leading-tight">
                  Our Sponsors
                </h2>
              </div>

              {showSponsors ? (
                <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden py-4">
                  <ScrollVelocity
                    scrollContainerRef={undefined}
                    parallaxStyle={undefined}
                    scrollerStyle={undefined}
                    velocity={100}
                    numCopies={6}
                    damping={50}
                    stiffness={400}
                    texts={[
                      "Sponsor 1 • Sponsor 2 •",
                      "Sponsor 3 • Sponsor 4 •"
                    ] as any}
                    className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb]/60 via-[#fff1cb] to-[#fff1cb]/60 tracking-[0.2em] uppercase inline-block py-2 mb-4 drop-shadow-[0_0_15px_rgba(255,241,203,0.2)]"
                  />
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fff1cb] tracking-wider uppercase drop-shadow-md">
                    Revealing Soon
                  </p>
                </div>
              )}

              <div className="mt-16 text-center">
                <a
                  href="https://forms.gle/7W1qgAMWSL1w7K3o8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#fff1cb]/40 group"
                  aria-label="Become a Sponsor (Opens in a new tab)"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fff1cb_0%,#63752e_50%,#fff1cb_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#611e3c] px-5 py-1 text-sm font-bold text-[#fff1cb] backdrop-blur-3xl group-hover:bg-[#63752e] transition-colors">
                    Become a Sponsor
                  </span>
                </a>
              </div>
            </div>
          </AnimatedContent>
        </section>

        {/* Father Vicar's Message Section */}
        <section className="section relative py-24" id="vicar-message">
          <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#fff1cb] leading-tight">
                  Father Vicar's Message
                </h2>
              </div>
              
              <div className="max-w-5xl mx-auto bg-[#fff1cb] text-[#611e3c] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-[#63752e]/30 relative overflow-hidden flex flex-col md:flex-row group">
                {/* Left Side - Full Height Image */}
                <div className="w-full md:w-5/12 min-h-[350px] relative flex-shrink-0">
                  <img 
                    src="/cya/Fr._Joy_New.jpeg"
                    alt="Father Vicar" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                </div>

                {/* Right Side - Quote Content */}
                <div className="w-full md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center relative">
                  <div className="h-10 md:h-12 flex items-start mb-6">
                    <span className="text-[100px] md:text-[120px] font-serif text-[#63752e] leading-[0.6] tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
                      “
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-[28px] font-extrabold text-[#611e3c] mb-5 leading-[1.3] tracking-tight">
                    I am delighted to welcome you to SELAH 2026. This Event is a celebration of our youth's talent, energy, and dedication.
                  </h3>
                  
                  <p className="text-[#611e3c]/90 text-base md:text-lg leading-relaxed mb-8 font-medium">
                    Let us come together to witness the incredible performances, foster fellowship, and glorify His name through arts and sports. May this event inspire and uplift everyone involved.
                  </p>
                  
                  <div>
                    <span className="text-[#611e3c] font-bold text-base">
                      — Fr. Joy Philip Kakkanattu,
                    </span>
                    <span className="text-[#63752e] font-bold text-base ml-1">
                      Vicar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="section arena-section" id="events">
          <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
            <div className="center-heading">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#fff1cb] leading-tight">Cultural and Sport Events</h2>
              <p className="!text-base md:!text-[18px] !max-w-xl text-[#fff1cb]/85 leading-relaxed mx-auto">
                Explore the different Cultural and Sport events in SELAH 2026. Click on the event card for further information and rules about the event.
              </p>
            </div>
            <div className="flex justify-center mt-12 mb-14 px-4">
              <div className="relative flex items-center p-1.5 bg-[#fff1cb] border border-[#63752e]/30 rounded-full shadow-2xl max-w-full overflow-x-auto hide-scrollbar">
                {(
                  [
                    ["sports", "Sports", <Medal size={18} key="med" />],
                    ["culture", "Cultural", <Music2 size={18} key="mus" />],
                  ] as [Track, string, React.ReactNode][]
                ).map(([value, label, icon]) => (
                  <button
                    key={value}
                    onClick={() => setTrack(value)}
                    className={`
                      relative z-10 flex items-center gap-2.5 px-6 py-3 md:px-8 md:py-3.5 rounded-full text-sm md:text-base font-semibold transition-colors duration-300 ease-out whitespace-nowrap
                      ${track === value ? "text-[#fff1cb]" : "text-[#611e3c]/75 hover:text-[#611e3c]"}
                    `}
                  >
                    {track === value && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-[#63752e] rounded-full shadow-[0_0_20px_rgba(99,117,46,0.4)] z-[-1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <MagicBento
              // @ts-expect-error inferred never[] from jsx component default prop
              cards={visibleEvents as any[]}
              gridClassName="event-grid"
              cardClassName="event-bento-card group"
              enableTilt={false}
              enableBorderGlow={true}
              enableMagnetism
              enableStars={false}
              enableSpotlight
              spotlightRadius={460}
              glowColor="99, 117, 46"
              renderItem={(event: any) => (
                <EventCardView card={event} />
              )}
            />
          </AnimatedContent>
        </section>

        {/* Teams-style Calendar Timeline */}
        <section className="section relative py-24" id="schedule">
          <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#fff1cb] leading-tight">
                  Event Schedule
                </h2>
                <p className="!text-base md:!text-[18px] !max-w-xl text-[#fff1cb]/85 leading-relaxed mx-auto">
                  A full day schedule of cultural performances and sports tournaments.
                </p>
              </div>

              {/* Mobile Swipe Hint */}
              <div className="flex md:hidden items-center justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-medium text-[#fff1cb]/80 bg-[#fff1cb]/10 border border-[#fff1cb]/15 backdrop-blur-sm shadow-sm">
                  <span className="animate-pulse">←</span>
                  <span>Swipe horizontally to view full schedule</span>
                  <span className="animate-pulse">→</span>
                </span>
              </div>

              {/* Horizontally Scrollable Calendar Wrapper on Mobile */}
              <div className="w-full overflow-x-auto overscroll-x-contain pb-4 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0 schedule-scrollbar [-webkit-overflow-scrolling:touch]">
                {/* Calendar Container */}
                <div className="relative min-w-[780px] md:min-w-0 max-w-5xl mx-auto" style={{ height: `${13 * 72 + 48}px` }}>

                  {/* Column Headers - sits above the grid */}
                  <div className="absolute top-0 left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] grid grid-cols-2 h-[44px] z-10 rounded-full overflow-hidden shadow-lg border border-[#63752e]/50 bg-[#63752e]">
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 border-r border-[#fff1cb]/20 px-1">
                      <Music2 size={15} className="text-[#fff1cb] shrink-0" />
                      <span className="text-xs md:text-sm font-bold text-[#fff1cb] tracking-wider truncate">Cultural Events</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 px-1">
                      <Medal size={15} className="text-[#fff1cb] shrink-0" />
                      <span className="text-xs md:text-sm font-bold text-[#fff1cb] tracking-wider truncate">Sport Events</span>
                    </div>
                  </div>

                  {/* Time labels + grid lines (spanning full width) */}
                  {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                    <div key={hour} className="absolute left-0 right-0" style={{ top: `${48 + (hour - 8) * 72}px` }}>
                      {/* Left time label */}
                      <span className="absolute left-0 w-[32px] sm:w-[44px] md:w-[68px] text-right pr-1 md:pr-2 text-[10px] md:text-xs text-[#fff1cb]/70 font-medium tabular-nums" style={{ transform: 'translateY(-50%)' }}>
                        {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                      </span>
                      {/* Grid line */}
                      <div className="absolute left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] border-t border-[#fff1cb]/15" />
                      {/* Right time label */}
                      <span className="absolute right-0 w-[32px] sm:w-[44px] md:w-[68px] text-left pl-1 md:pl-2 text-[10px] md:text-xs text-[#fff1cb]/70 font-medium tabular-nums" style={{ transform: 'translateY(-50%)' }}>
                        {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                      </span>
                    </div>
                  ))}

                {/* Live Time Tracker Line */}
                {currentHour !== null && (
                  <div
                    className="absolute left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] z-20 pointer-events-none"
                    style={{ top: `${48 + (currentHour - 8) * 72}px` }}
                  >
                    {/* Dot */}
                    <div className="absolute left-0 w-3 h-3 rounded-full bg-[#63752e] border-2 border-[#fff1cb] shadow-[0_0_8px_rgba(99,117,46,0.8)]" style={{ transform: 'translate(-50%, -50%)' }} />
                    {/* Line */}
                    <div className="absolute left-0 right-0 border-t-2 border-[#63752e] shadow-[0_0_6px_rgba(99,117,46,0.6)]" />
                  </div>
                )}

                {/* Event Columns */}
                <div className="absolute top-[48px] left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] bottom-0">
                  {/* Column divider */}
                  <div className="absolute top-0 bottom-0 left-1/2 border-l border-[#fff1cb]/15 z-[1]" />

                  {/* Joint / Spanning Events (column === 'both') */}
                  {timelineEvents
                    .filter((e) => e.column === 'both')
                    .map((event) => {
                      const isActive = currentHour !== null && currentHour >= event.start && currentHour < event.start + event.duration;
                      const theme = getEventTheme("both");
                      return (
                        <div
                          key={event.title}
                          className={`absolute left-1 right-1 md:left-2 md:right-2 rounded-md md:rounded-lg overflow-hidden flex cursor-pointer transition-all duration-200 hover:brightness-105 hover:z-20 shadow-sm z-[3] ${isActive ? '!z-[5] ring-2 ring-[#d97706] shadow-md' : ''}`}
                          style={{
                            top: `${(event.start - 8) * 72 + 2}px`,
                            height: `${event.duration * 72 - 3}px`,
                            backgroundColor: theme.bg,
                            border: theme.border,
                            boxShadow: isActive ? '0 0 16px rgba(217,119,6,0.4), inset 0 0 12px rgba(217,119,6,0.1)' : '0 1px 4px rgba(0,0,0,0.12)',
                          }}
                          title={`${event.title} (${formatEventTime(event.start)} - ${formatEventTime(event.start + event.duration)}): ${event.description}`}
                        >
                          {/* Teams-style Left Accent Stripe */}
                          <div
                            className="w-[5px] shrink-0 h-full"
                            style={{ backgroundColor: theme.stripe }}
                          />

                          <div className="flex-1 min-w-0 px-2.5 py-1 md:px-3 md:py-1.5 flex flex-col justify-center h-full">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[11px] md:text-xs font-bold leading-tight truncate" style={{ color: theme.textTitle }}>
                                  {event.title}
                                </span>
                              </div>
                              <div className="text-[9.5px] md:text-[11px] font-semibold shrink-0 whitespace-nowrap" style={{ color: theme.textTime }}>
                                {formatEventTime(event.start)} – {formatEventTime(event.start + event.duration)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* 2-Column Grid for Cultural & Sports Events */}
                  <div className="absolute inset-0 grid grid-cols-2 pointer-events-none">
                    {/* Cultural Events Column */}
                    <div className="relative h-full pl-1 pr-1.5 md:pl-2 md:pr-3 pointer-events-auto">
                      {culturalEventsWithLayout.map((event) => {
                        const isActive = currentHour !== null && currentHour >= event.start && currentHour < event.start + event.duration;
                        const leftPercent = (event.lane / event.totalLanes) * 100;
                        const widthPercent = (event.colSpan / event.totalLanes) * 100;
                        const theme = getEventTheme("cultural");

                        return (
                          <div
                            key={`${event.title}-${event.start}`}
                            className="absolute px-0.5 md:px-1 transition-all duration-300"
                            style={{
                              top: `${(event.start - 8) * 72 + 2}px`,
                              height: `${event.duration * 72 - 3}px`,
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              zIndex: isActive ? 15 : event.lane + 2,
                            }}
                            title={`${event.title} (${formatEventTime(event.start)} - ${formatEventTime(event.start + event.duration)}): ${event.description}`}
                          >
                            <div
                              className={`w-full h-full rounded-md md:rounded-lg overflow-hidden flex cursor-pointer transition-all duration-200 hover:brightness-105 hover:shadow-md ${isActive ? 'ring-2 ring-[#c239b3] shadow-md' : ''}`}
                              style={{
                                backgroundColor: theme.bg,
                                border: theme.border,
                                boxShadow: isActive ? '0 0 16px rgba(194,57,179,0.4), inset 0 0 12px rgba(194,57,179,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                              }}
                            >
                              {/* Teams-style Left Accent Stripe */}
                              <div
                                className="w-[5px] shrink-0 h-full"
                                style={{ backgroundColor: theme.stripe }}
                              />

                              <div className="flex-1 min-w-0 px-1.5 py-1 md:px-2 md:py-1.5 flex flex-col justify-start">
                                <div className="text-[10.5px] md:text-xs font-bold leading-tight line-clamp-2" style={{ color: theme.textTitle }}>
                                  {event.title}
                                </div>
                                <div
                                  className="text-[9px] sm:text-[9.5px] md:text-[10.5px] font-semibold leading-tight mt-0.5 flex flex-wrap items-center gap-x-1"
                                  style={{ color: theme.textTime }}
                                >
                                  <span className="whitespace-nowrap">{formatEventTime(event.start)}</span>
                                  <span className="opacity-60">–</span>
                                  <span className="whitespace-nowrap">{formatEventTime(event.start + event.duration)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sports Events Column */}
                    <div className="relative h-full pl-1.5 pr-1 md:pl-3 md:pr-2 pointer-events-auto">
                      {sportsEventsWithLayout.map((event) => {
                        const isActive = currentHour !== null && currentHour >= event.start && currentHour < event.start + event.duration;
                        const leftPercent = (event.lane / event.totalLanes) * 100;
                        const widthPercent = (event.colSpan / event.totalLanes) * 100;
                        const theme = getEventTheme("sports");

                        return (
                          <div
                            key={`${event.title}-${event.start}`}
                            className="absolute px-0.5 md:px-1 transition-all duration-300"
                            style={{
                              top: `${(event.start - 8) * 72 + 2}px`,
                              height: `${event.duration * 72 - 3}px`,
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              zIndex: isActive ? 15 : event.lane + 2,
                            }}
                            title={`${event.title} (${formatEventTime(event.start)} - ${formatEventTime(event.start + event.duration)}): ${event.description}`}
                          >
                            <div
                              className={`w-full h-full rounded-md md:rounded-lg overflow-hidden flex cursor-pointer transition-all duration-200 hover:brightness-105 hover:shadow-md ${isActive ? 'ring-2 ring-[#4f52b2] shadow-md' : ''}`}
                              style={{
                                backgroundColor: theme.bg,
                                border: theme.border,
                                boxShadow: isActive ? '0 0 16px rgba(79,82,178,0.4), inset 0 0 12px rgba(79,82,178,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                              }}
                            >
                              {/* Teams-style Left Accent Stripe */}
                              <div
                                className="w-[5px] shrink-0 h-full"
                                style={{ backgroundColor: theme.stripe }}
                              />

                              <div className="flex-1 min-w-0 px-1.5 py-1 md:px-2 md:py-1.5 flex flex-col justify-start">
                                <div className="text-[10.5px] md:text-xs font-bold leading-tight line-clamp-2" style={{ color: theme.textTitle }}>
                                  {event.title}
                                </div>
                                <div
                                  className="text-[9px] sm:text-[9.5px] md:text-[10.5px] font-semibold leading-tight mt-0.5 flex flex-wrap items-center gap-x-1"
                                  style={{ color: theme.textTime }}
                                >
                                  <span className="whitespace-nowrap">{formatEventTime(event.start)}</span>
                                  <span className="opacity-60">–</span>
                                  <span className="whitespace-nowrap">{formatEventTime(event.start + event.duration)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </AnimatedContent>
        </section>
      </main>

      <AnimatedContent distance={40} duration={0.8} ease="power3.out" threshold={0.1}>
        <Footer />
      </AnimatedContent>
      </motion.div>
    </div>
  );
}


function EventCardView({ card }: { card: EventCard }) {
  const slugMap: Record<string, string> = {
    "Chess": "chess",
    "Blitz Chess": "chess",
    "Throwball": "throwball",
    "Football": "football",
    "Futsal": "football",
    "Tug of War": "tug-of-war",
    "Mixed Relay": "mixed-relay",
    "100 M Race": "100m-race",
    "100m Race": "100m-race",
    "Group Dance": "group-dance",
    "The Big Picture": "group-dance",
    "Short Film": "short-film",
    "Frame By Frame": "short-film",
    "Live Painting": "live-painting",
    "The Art of the Moment": "live-painting",
    "Solo Singing": "solo-singing",
    "Pitch Perfect": "solo-singing",
    "Solo Dance": "solo-dance",
    "Dance Unleashed": "solo-dance",
    "Street Play / Nukkad Natak": "street-play",
    "Nukkad Natak": "street-play",
    "Mono Act": "mono-act",
    "Alter Ego": "mono-act",
    "Photography": "photography",
    "Perspectives": "photography",
    "Music Band": "music-band",
    "Battle of the Bands": "music-band",
  };
  const slug = slugMap[card.title] || "";
  const ruleUrl = slug ? `/rules#${slug}` : "/rules";

  return (
    <>
      {/* Clickable Overlay Link to Rules */}
      <Link 
        href={ruleUrl} 
        className="absolute inset-0 z-30 cursor-pointer block" 
        aria-label={`View rules for ${card.title}`} 
      />

      {/* Background Image integrated beneath MagicBento's content */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out md:opacity-80 opacity-80 md:group-hover:scale-110 md:group-hover:opacity-60 mix-blend-screen pointer-events-none z-0"
        style={{ backgroundImage: `url(${card.image})` }}
      />

      {/* Gradient overlay to ensure text remains highly readable */}
      <div className="absolute inset-0 pointer-events-none z-0" />

      {/* MagicBento native layout structure */}
      <div className="relative z-10 flex flex-col h-full justify-end pointer-events-none">
        <div className="magic-bento-card__content">
          <h2 className="magic-bento-card__title !font-bold !text-[#fff1cb] !text-xl !mb-2 drop-shadow-md pr-12">{card.title}</h2>
          <p className="magic-bento-card__description !text-[13px] !leading-snug !text-[#fff1cb] !opacity-100 line-clamp-3 pr-12">{card.description}</p>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 opacity-100 translate-x-0 bg-[#63752e]/30 border border-[#63752e] shadow-[0_0_15px_rgba(99,117,46,0.4)] md:opacity-0 md:-translate-x-4 md:bg-transparent md:border-transparent md:shadow-none md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:bg-[#63752e]/30 md:group-hover:border-[#63752e] md:group-hover:shadow-[0_0_15px_rgba(99,117,46,0.4)] pointer-events-none">
        <ArrowRight className="text-[#fff1cb] w-5 h-5 transition-transform duration-300 md:group-hover:translate-x-0.5" />
      </div>

    </>
  );
}

export default App;

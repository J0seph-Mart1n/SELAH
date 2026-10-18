"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/ui/sparkles-text"
import {
  Navbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/StaggeredMenu";
import Silk from "@/components/Silk";
import { MorphingText } from "@/components/ui/morphing-text";
import BorderGlow from "@/components/BorderGlow";
import ScrollVelocity from "@/components/ScrollVelocity";
import MagicBento from "@/components/MagicBento";
import AnimatedContent from "@/components/AnimatedContent";
import Footer from "@/components/Footer";
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
      title: "Chess",
      description:
        "Full-court FIBA rules, shot clock enforced, with regional officials and sudden-death overtime.",
      image:
        "/events/chess.jpg",
    },
    {
      title: "Throwball",
      description:
        "Best of three sets with group double elimination leading to the stadium finals.",
      image:
        "events/Throwball.jpg",
    },
    {
      title: "Football",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      image:
        "/events/Football.jpg",
    },
    {
      title: "Tug of War",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      image:
        "/events/TugOfWar.jpg",
    },
    {
      title: "Mixed Relay",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      image:
        "/events/MixedRelay.jpg",
    },
  ],
  culture: [
    {
      title: "Group Dance",
      description:
        "Sacred hymnody reimagined through four-part harmony and original congregational ballads.",
      image:
        "/events/GroupDance.jpg",
    },
    {
      title: "Short Film",
      description:
        "Original composition plus a classic hymn arrangement, scored for musicality and resonance.",
      image:
        "/events/ShortFilm.jpg",
    },
    {
      title: "Live Painting",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "/events/Painting.jpg",
    },
    {
      title: "Solo Singing",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "/events/SoloSinging.jpeg",
    },
    {
      title: "Solo Dance",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "/events/SoloDancing.avif",
    },
    {
      title: "Street Play / Nukkad Natak",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "events/StreetPlay.jpg",
    },
    {
      title: "Mono Act",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "/events/MonoAct.avif",
    },
    {
      title: "Photography",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "/events/Photography.jpg",
    },
    {
      title: "Music Band",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "/events/MusicBand.jpg",
    },
  ],
};

const timelineEvents: {
  title: string;
  start: number; // hour (8-20)
  duration: number; // in hours
  column: "cultural" | "sports";
  color: string;
  description: string;
}[] = [
    // Sports Events
    { title: "Opening March & Oath", start: 8, duration: 1, column: "sports", color: "#63752e", description: "Flag march & sportsmanship oath" },
    { title: "Basketball Qualifiers", start: 9, duration: 2, column: "sports", color: "#63752e", description: "Group stage matches across courts" },
    { title: "Volleyball Pool Rounds", start: 11, duration: 1.5, column: "sports", color: "#63752e", description: "Pool matches across 8 parish squads" },
    { title: "Lunch Break", start: 12.5, duration: 0.5, column: "sports", color: "#fff1cb", description: "Refreshments & rest" },
    { title: "Futsal Semi-Finals", start: 13, duration: 2, column: "sports", color: "#63752e", description: "Rapid 20-min halves on pro turf" },
    { title: "Table Tennis Finals", start: 15, duration: 1.5, column: "sports", color: "#63752e", description: "Singles & doubles championship" },
    { title: "Basketball Finals", start: 17, duration: 2, column: "sports", color: "#63752e", description: "Championship match under lights" },
    { title: "Trophy Ceremony", start: 19, duration: 1, column: "sports", color: "#fff1cb", description: "Awards & closing for sports" },

    // Cultural Events
    { title: "Registration & Briefing", start: 8, duration: 1, column: "cultural", color: "#fff1cb", description: "Participant check-in & stage briefing" },
    { title: "Choral Choir", start: 9, duration: 1.5, column: "cultural", color: "#63752e", description: "Sacred hymnody & four-part harmony" },
    { title: "Solo Singing", start: 10.5, duration: 1.5, column: "cultural", color: "#fff1cb", description: "Individual vocal performances" },
    { title: "Group Dance", start: 12, duration: 1.5, column: "cultural", color: "#63752e", description: "Choreographed cultural dance" },
    { title: "Spoken Word & Poetry", start: 13.5, duration: 1, column: "cultural", color: "#fff1cb", description: "Original rhythmic narratives" },
    { title: "Skit / Drama", start: 14.5, duration: 2, column: "cultural", color: "#63752e", description: "Sacred drama & theatrical showcase" },
    { title: "Worship Band Showcase", start: 16.5, duration: 1.5, column: "cultural", color: "#fff1cb", description: "Original compositions & hymn covers" },
    { title: "Cultural Awards", start: 18, duration: 1, column: "cultural", color: "#63752e", description: "Best performances & Spirit awards" },
    { title: "Grand Worship Night", start: 19, duration: 1, column: "cultural", color: "#fff1cb", description: "Multi-church worship concert finale" },
  ];

function App() {
  const isChiefGuestFinalized = false;
  const [track, setTrack] = useState<Track>("sports");

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
        // Only show tracker between 8 AM and 8 PM
        if (hourDecimal >= 8 && hourDecimal <= 20) {
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
      <Navbar className="selah-rnav">
        <NavBody>
          <a
            className="brand relative z-20 flex items-center gap-2.5 transition-all duration-300 group-data-[shrunk=true]:gap-0"
            href="#top"
            aria-label="SELAH 2026 home"
            style={{ textDecoration: "none" }}
          >
            <Image
              src="/top_page/Selah_Logo.png"
              alt="SELAH 2026 Logo"
              width={40}
              height={40}
              priority
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-contain shrink-0 transition-transform duration-200 hover:scale-105"
            />
            <div className="transition-all duration-300 group-data-[shrunk=true]:w-0 group-data-[shrunk=true]:opacity-0 overflow-hidden whitespace-nowrap">
              <strong className="text-2xl text-[#fff1cb]">
                SELAH <span className="text-[#63752e]">2026</span>
              </strong>
            </div>
          </a>
          <NavItems
            items={[
              { name: "Register", link: "#events" },
              { name: "Rules", link: "/rules" },
              { name: "Core Team", link: "/about-cya" },
              { name: "Gallery", link: "#faq" },
            ]}
          />
        </NavBody>
      </Navbar>

      <div className="relative z-50 lg:hidden selah-smenu">
        <StaggeredMenu
          isFixed={true}
          logo={
            <div className="brand relative z-20 flex items-center">
              <a href="#top" aria-label="SELAH 2026 home" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
                <Image
                  src="/top_page/Selah_Logo.png"
                  alt="SELAH 2026 Logo"
                  width={34}
                  height={34}
                  priority
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-contain shrink-0"
                />
                <strong className="text-2xl text-[#fff1cb]">
                  SELAH <span className="text-[#63752e]">2026</span>
                </strong>
              </a>
            </div>
          }
          items={[
            { label: "Register", link: "#events" },
            { label: "Rules", link: "/rules" },
            { label: "Core Team", link: "/about-cya" },
            { label: "Gallery", link: "#faq" },
          ] as any}
          colors={['#611e3c', '#63752e', '#fff1cb', '#611e3c']}
          accentColor="#63752e"
          menuButtonColor="#fff1cb"
          openMenuButtonColor="#fff1cb"
        />
      </div>

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
            <AnimatedContent distance={40} duration={0.8} ease="power3.out" threshold={0.1}>
              <div className="hero-inner">
                <h1>
                <MorphingText texts={["SELAH", "सेलाह", "സേലാ", "סֶלָה", "SELAH"]} />
                  <br />
                  <span>2026</span>
                </h1>
                <p className="hero-subtitle">
                  Pause. Reflect and Lift Up
                  <br className="desktop-only" />{" "}
                </p>
                <div className="text-[#fff1cb] font-semibold tracking-widest text-sm mt-8 uppercase text-center w-full">
                  Starting In
                </div>
                <div className="countdown" aria-label="Countdown to SELAH festival">
                  {[
                    ["days", countdown.days],
                    ["hours", countdown.hours],
                    ["minutes", countdown.minutes],
                    ["seconds", countdown.seconds],
                  ].map(([label, value], index) => (
                    <div
                      className={
                        index === 0 || index === 3
                          ? "count-cell highlight"
                          : "count-cell"
                      }
                      key={label}
                    >
                      <strong>{String(value).padStart(2, "0")}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-actions flex !flex-row !flex-nowrap w-full sm:w-auto justify-center gap-3">
                  <a className="button button-primary button-large flex-1 sm:flex-none flex items-center justify-center gap-2 whitespace-nowrap px-2" href="#pricing">
                    <Users size={17} /> Register
                  </a>
                  <a className="button button-outline button-large flex-1 sm:flex-none flex items-center justify-center gap-2 whitespace-nowrap px-2" href="#events">
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
                Mega <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] to-[#63752e]">Prize Pool</span>
              </h2>
              <SparklesText
                className="text-4xl md:text-5xl font-black mb-1 leading-tight"
                colors={{ first: "#fff1cb", second: "#63752e" }}
                sparklesCount={12}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] to-[#63752e]">₹45,000</span>
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
                  Special Chief <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] to-[#63752e]">Guest</span>
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
                  Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] to-[#63752e]">Sponsors</span>
                </h2>
              </div>

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
                    "Sponser 1 • Sponser 2 •",
                    "Sponsor 3 • Sponsor 4 •"
                  ] as any}
                  className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb]/60 via-[#fff1cb] to-[#fff1cb]/60 tracking-[0.2em] uppercase inline-block py-2 mb-4 drop-shadow-[0_0_15px_rgba(255,241,203,0.2)]"
                />
              </div>

              <div className="mt-16 text-center">
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#fff1cb]/40">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fff1cb_0%,#63752e_50%,#fff1cb_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#611e3c] px-5 py-1 text-sm font-bold text-[#fff1cb] backdrop-blur-3xl hover:bg-[#63752e] transition-colors">
                    Become a Sponsor
                  </span>
                </button>
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
                  Father Vicar's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] to-[#63752e]">Message</span>
                </h2>
              </div>
              
              <div className="max-w-5xl mx-auto bg-[#fff1cb] text-[#611e3c] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-[#63752e]/30 relative overflow-hidden flex flex-col md:flex-row group">
                {/* Left Side - Full Height Image */}
                <div className="w-full md:w-5/12 min-h-[350px] relative flex-shrink-0">
                  <img 
                    src="/cya/Fr._Joy.jpeg"
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
                    I am delighted to welcome you to SELAH 2026. This festival is a celebration of our youth's talent, energy, and dedication.
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
              <h2>Cultural and Sport Events</h2>
              <p>
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
                  Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] to-[#63752e]">Schedule</span>
                </h2>
                <p className="text-[#fff1cb]/70 text-sm md:text-base leading-relaxed">
                  A full day schedule of cultural performances and sports tournaments.
                </p>
              </div>

              {/* Calendar Container */}
              <div className="relative max-w-5xl mx-auto" style={{ height: `${12 * 72 + 48}px` }}>

                {/* Column Headers - sits above the grid */}
                <div className="absolute top-0 left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] grid grid-cols-2 h-[44px] z-10 rounded-full overflow-hidden shadow-lg border border-[#63752e]/50 bg-[#63752e]">
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 border-r border-[#fff1cb]/20 px-1">
                    <Music2 size={15} className="text-[#fff1cb] shrink-0" />
                    <span className="text-xs md:text-sm font-bold text-[#fff1cb] tracking-wider truncate">Cultural<span className="hidden sm:inline"> Events</span></span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 px-1">
                    <Medal size={15} className="text-[#fff1cb] shrink-0" />
                    <span className="text-xs md:text-sm font-bold text-[#fff1cb] tracking-wider truncate">Sport<span className="hidden sm:inline"> Events</span></span>
                  </div>
                </div>

                {/* Time labels + grid lines (spanning full width) */}
                {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                  <div key={hour} className="absolute left-0 right-0" style={{ top: `${48 + (hour - 8) * 72}px` }}>
                    {/* Time label */}
                    <span className="absolute left-0 w-[32px] sm:w-[44px] md:w-[68px] text-right pr-1 md:pr-2 text-[10px] md:text-xs text-[#fff1cb]/70 font-medium tabular-nums" style={{ transform: 'translateY(-50%)' }}>
                      {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                    </span>
                    {/* Grid line */}
                    <div className="absolute left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] border-t border-[#fff1cb]/15" />
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
                <div className="absolute top-[48px] left-[36px] sm:left-[48px] md:left-[72px] right-[36px] sm:right-[48px] md:right-[72px] bottom-0 grid grid-cols-2">
                  {/* Column divider */}
                  <div className="absolute top-0 bottom-0 left-1/2 border-l border-[#fff1cb]/15 z-[1]" />

                  {/* Cultural Events Column */}
                  <div className="relative">
                    {timelineEvents
                      .filter((e) => e.column === 'cultural')
                      .map((event) => {
                        const formatHour = (h: number) => {
                          if (h === 12) return '12 PM';
                          return h < 12 ? `${h} AM` : `${h - 12} PM`;
                        };
                        const isActive = currentHour !== null && currentHour >= event.start && currentHour < event.start + event.duration;
                        return (
                          <div
                            key={event.title}
                            className={`absolute left-1 right-1.5 md:left-2 md:right-3 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-105 hover:z-10 shadow-sm border border-[#63752e]/25 ${isActive ? 'z-[5] ring-2 ring-[#63752e] shadow-md' : ''}`}
                            style={{
                              top: `${(event.start - 8) * 72 + 2}px`,
                              height: `${event.duration * 72 - 3}px`,
                              backgroundColor: '#fff1cb',
                              borderLeft: '4px solid #63752e',
                              boxShadow: isActive ? '0 0 16px rgba(99,117,46,0.4), inset 0 0 12px rgba(99,117,46,0.1)' : '0 2px 6px rgba(0,0,0,0.15)',
                            }}
                          >
                            <div className="px-2 py-1.5 h-full flex flex-col justify-start">
                              <div className={`text-[11px] md:text-xs font-bold leading-tight truncate text-[#611e3c]`}>{event.title}</div>
                              {event.duration >= 1 && (
                                <div className="text-[10px] md:text-[11px] text-[#63752e] font-semibold leading-tight mt-0.5 truncate">
                                  {formatHour(event.start)} - {formatHour(event.start + event.duration)}
                                </div>
                              )}
                              {event.duration >= 1.5 && (
                                <div className="text-[10px] md:text-[11px] mt-0.5 leading-tight truncate text-[#611e3c]/80">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Sports Events Column */}
                  <div className="relative">
                    {timelineEvents
                      .filter((e) => e.column === 'sports')
                      .map((event) => {
                        const formatHour = (h: number) => {
                          if (h === 12) return '12 PM';
                          return h < 12 ? `${h} AM` : `${h - 12} PM`;
                        };
                        const isActive = currentHour !== null && currentHour >= event.start && currentHour < event.start + event.duration;
                        return (
                          <div
                            key={event.title}
                            className={`absolute left-1.5 right-1 md:left-3 md:right-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-105 hover:z-10 shadow-sm border border-[#63752e]/25 ${isActive ? 'z-[5] ring-2 ring-[#63752e] shadow-md' : ''}`}
                            style={{
                              top: `${(event.start - 8) * 72 + 2}px`,
                              height: `${event.duration * 72 - 3}px`,
                              backgroundColor: '#fff1cb',
                              borderLeft: '4px solid #63752e',
                              boxShadow: isActive ? '0 0 16px rgba(99,117,46,0.4), inset 0 0 12px rgba(99,117,46,0.1)' : '0 2px 6px rgba(0,0,0,0.15)',
                            }}
                          >
                            <div className="px-2 py-1.5 h-full flex flex-col justify-start">
                              <div className={`text-[11px] md:text-xs font-bold leading-tight truncate text-[#611e3c]`}>{event.title}</div>
                              {event.duration >= 1 && (
                                <div className="text-[10px] md:text-[11px] text-[#63752e] font-semibold leading-tight mt-0.5 truncate">
                                  {formatHour(event.start)} - {formatHour(event.start + event.duration)}
                                </div>
                              )}
                              {event.duration >= 1.5 && (
                                <div className="text-[10px] md:text-[11px] mt-0.5 leading-tight truncate text-[#611e3c]/80">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
    </div>
  );
}


function EventCardView({ card }: { card: EventCard }) {
  const slugMap: Record<string, string> = {
    "Chess": "chess",
    "Throwball": "throwball",
    "Football": "football",
    "Tug of War": "tug-of-war",
    "Mixed Relay": "mixed-relay",
    "Group Dance": "group-dance",
    "Short Film": "short-film",
    "Live Painting": "live-painting",
    "Solo Singing": "solo-singing",
    "Solo Dance": "solo-dance",
    "Street Play / Nukkad Natak": "street-play",
    "Mono Act": "mono-act",
    "Photography": "photography",
    "Music Band": "music-band",
  };
  const slug = slugMap[card.title] || "";
  const ruleUrl = slug ? `/rules#${slug}` : "/rules";

  return (
    <>
      {/* Clickable Overlay Link to Rules */}
      <a 
        href={ruleUrl} 
        className="absolute inset-0 z-30 cursor-pointer" 
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
          <p className="magic-bento-card__description !text-[#fff1cb]/85 !opacity-100 line-clamp-3 pr-12">{card.description}</p>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 opacity-100 translate-x-0 bg-[#63752e]/30 border border-[#63752e] shadow-[0_0_15px_rgba(99,117,46,0.4)] md:opacity-0 md:-translate-x-4 md:bg-transparent md:border-transparent md:shadow-none md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:bg-[#63752e]/30 md:group-hover:border-[#63752e] md:group-hover:shadow-[0_0_15px_rgba(99,117,46,0.4)] pointer-events-none">
        <ArrowRight className="text-[#fff1cb] w-5 h-5 transition-transform duration-300 md:group-hover:translate-x-0.5" />
      </div>

    </>
  );
}

export default App;

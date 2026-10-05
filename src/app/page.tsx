"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import { SparklesText } from "@/components/ui/sparkles-text"
import {
  Navbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/StaggeredMenu";
import PrismaticBurst from "@/components/PrismaticBurst";
import { MorphingText } from "@/components/ui/morphing-text";
import BorderGlow from "@/components/BorderGlow";
import ScrollVelocity from "@/components/ScrollVelocity";
import MagicBento from "@/components/MagicBento";
import ParticleText from '@/components/ParticleText';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Church,
  Download,
  Flame,
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

type Track = "sports" | "culture" | "worship";

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
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD_MgBQqlCaE0D9s9ikq9urx3TVRvWK4d_CXayjhBvlE4cma1QhTLrnABflk_QhfrS53J-VwSQNvpFUjgVir3mS37ZZKPb8jJXpagiQQw4Nj-f5GAHat9f2l9773nFtBAVvq9cMNX626l3FJe2-x1xE6yxrYIK_I_cDTvHA4q0U5HraS3NpXF4hnKfX-zspP268oCVxVMLbFfPrR5V2-uOGEYkPi-_cL1qXBEjwj5sM6gekATqtcYq9mQ",
    },
    {
      title: "Throwball",
      description:
        "Best of three sets with group double elimination leading to the stadium finals.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1mLa9BPurNBgrm_siweKjUq5MdGfVpMihs3s7po7Zjm36ZuM45dSl0PMqVhBXPP8dpOLFgO1-dP7o3B6oZEzGRg6Dp5EgBzNuN4wa_mBrlZO8t9PlgDceSp8oJMG-zQN7WcsvZXD_P_zAQ26zc-a6vvqWzRFaoopdqp_tamBB_m_HBTf1TUCiBivmhJWLxzymom_HcvGPNhH3I8HG9-kPjS0l3sBoPjHLmc3W8Y2b-hGPyK_4BsSb8w",
    },
    {
      title: "Football",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBSxQNHKGeYPkw7aYNJFG69KqXRdf0_Gv3tMkvC_nw5eQAV4_ua-4DP1SXo496cum1ys80Z4OKE39Ggxx0YS-OKvprWtjX34bwrjdkIlkZKsRoryo_VVfmCYZavPwv_r-QBxOqDUXdpdfbfALFiqCiGLCVbGrKmxG2LMVZ2JeYbw730AANbEeXhgvVcrQEcF60S9bbv-T9aqxel8bYxQQZ2fNdnMpS2Ae9reeTSQ2PID2PgtcwPvmdmWw",
    },
    {
      title: "Tug of War",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBSxQNHKGeYPkw7aYNJFG69KqXRdf0_Gv3tMkvC_nw5eQAV4_ua-4DP1SXo496cum1ys80Z4OKE39Ggxx0YS-OKvprWtjX34bwrjdkIlkZKsRoryo_VVfmCYZavPwv_r-QBxOqDUXdpdfbfALFiqCiGLCVbGrKmxG2LMVZ2JeYbw730AANbEeXhgvVcrQEcF60S9bbv-T9aqxel8bYxQQZ2fNdnMpS2Ae9reeTSQ2PID2PgtcwPvmdmWw",
    },
    {
      title: "Mixed Relay",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBSxQNHKGeYPkw7aYNJFG69KqXRdf0_Gv3tMkvC_nw5eQAV4_ua-4DP1SXo496cum1ys80Z4OKE39Ggxx0YS-OKvprWtjX34bwrjdkIlkZKsRoryo_VVfmCYZavPwv_r-QBxOqDUXdpdfbfALFiqCiGLCVbGrKmxG2LMVZ2JeYbw730AANbEeXhgvVcrQEcF60S9bbv-T9aqxel8bYxQQZ2fNdnMpS2Ae9reeTSQ2PID2PgtcwPvmdmWw",
    },
  ],
  culture: [
    {
      title: "A Cappella & Choral Symphony",
      description:
        "Sacred hymnody reimagined through four-part harmony and original congregational ballads.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCxGZxptsdpFYn8UC0NxBBJg2jsmri_oPNZM-ev2bsLnPxLCM0uaXVrtIgYCI4toDiSlc7aAT7AyiwUdfbi_Fk__A_R-Lhg8pk8aZTFlTgSsvlIDwFkT2oInxssjN_4DvTngPYFZFsxOXWWyRoad5Dp2DFTEVgdTSJn8PDKMaWBBew95xve4lu1JDzV-0QNnOzuxBbZVCQSAdZpNp8z7h77W09Tv1MNoYrB_1GhLmcOUmGN3WeXv9Hfbw",
    },
    {
      title: "Contemporary Worship Battle",
      description:
        "Original composition plus a classic hymn arrangement, scored for musicality and resonance.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBroCxqgPOErw5rNoGbrtLdsfPVz8jOa9N7Z9hCZwQAOnSAr7M2Labw3MGEw_XNzQAleLoAnE4q6m5aeQQ7_y-W1--EQHK_wSxx_HFuV7HL3PIkJg5gKw8S1mpMv0DsKZAaxKi3NZyIDVbtNOHNph89vMfNfEuGPMUMvInYbvvah1AzbxxVBNtegs0x-_LN99HMV6f3CIoLwYEbKU4E9hJNjdPExCLABbXsrBwMH2pSki9R_H1E2ugmyA",
    },
    {
      title: "Gospel Poetry & Sacred Drama",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBYZLrutwH34A0Twoz6lajNO8lX6qCwANKRY_ApV6eMW-PNZdb8QdipYDrdZEboe5fyvZXDWfAhvyoDjz27cIUd93X8W_GxWp-mdkBcAlgLSuX9iKhwHXKtXsAe6qLvSReVTbkelvKXqgYf-CGAdxenP8m20N0ATZn4aW6p3aVwamlm6oyQuZrKU_jM5fMWGsklj7CwZXxFAYPVNE8aOk9_w9LexCRZb_KHLrpWqObMY8bAci4Z9XeR6w",
    },
  ],
  worship: [],
};

const delegations = [
  {
    initials: "GC",
    name: "Grace City Chapel",
    location: "Metro Central · 64 Athletes",
    badge: "2024 Champion",
    tags: ["Basketball", "Volleyball", "Gospel Choir"],
    accent: "gold",
  },
  {
    initials: "RU",
    name: "Redeemer United",
    location: "North Bay Diocese · 52 Athletes",
    badge: "Runner Up",
    tags: ["Futsal", "Track Sprint", "Worship Band"],
    accent: "coral",
  },
  {
    initials: "ZY",
    name: "Zion Youth Cathedral",
    location: "South Ridge · 40 Athletes",
    badge: "New Entry",
    tags: ["Basketball", "Spoken Word", "Sacred Arts"],
    accent: "cyan",
  },
  {
    initials: "TF",
    name: "Trinity Metro Fellowship",
    location: "West Valley · 48 Athletes",
    badge: "Arts Cup Winner",
    tags: ["Choral Choir", "Badminton", "Drama"],
    accent: "gold",
  },
];

const timelineEvents: {
  title: string;
  start: number; // hour (8-20)
  duration: number; // in hours
  column: "cultural" | "sports";
  color: string;
  description: string;
}[] = [
  // Sports Events
  { title: "Opening March & Oath", start: 8, duration: 1, column: "sports", color: "#00b8e8", description: "Flag march & sportsmanship oath" },
  { title: "Basketball Qualifiers", start: 9, duration: 2, column: "sports", color: "#00b8e8", description: "Group stage matches across courts" },
  { title: "Volleyball Pool Rounds", start: 11, duration: 1.5, column: "sports", color: "#3b82f6", description: "Pool matches across 8 parish squads" },
  { title: "Lunch Break", start: 12.5, duration: 0.5, column: "sports", color: "#8b9abb", description: "Refreshments & rest" },
  { title: "Futsal Semi-Finals", start: 13, duration: 2, column: "sports", color: "#00b8e8", description: "Rapid 20-min halves on pro turf" },
  { title: "Table Tennis Finals", start: 15, duration: 1.5, column: "sports", color: "#3b82f6", description: "Singles & doubles championship" },
  { title: "Basketball Finals", start: 17, duration: 2, column: "sports", color: "#00b8e8", description: "Championship match under lights" },
  { title: "Trophy Ceremony", start: 19, duration: 1, column: "sports", color: "#f69b22", description: "Awards & closing for sports" },

  // Cultural Events
  { title: "Registration & Briefing", start: 8, duration: 1, column: "cultural", color: "#f69b22", description: "Participant check-in & stage briefing" },
  { title: "Choral Choir", start: 9, duration: 1.5, column: "cultural", color: "#fa6347", description: "Sacred hymnody & four-part harmony" },
  { title: "Solo Singing", start: 10.5, duration: 1.5, column: "cultural", color: "#f69b22", description: "Individual vocal performances" },
  { title: "Group Dance", start: 12, duration: 1.5, column: "cultural", color: "#fa6347", description: "Choreographed cultural dance" },
  { title: "Spoken Word & Poetry", start: 13.5, duration: 1, column: "cultural", color: "#f69b22", description: "Original rhythmic narratives" },
  { title: "Skit / Drama", start: 14.5, duration: 2, column: "cultural", color: "#fa6347", description: "Sacred drama & theatrical showcase" },
  { title: "Worship Band Showcase", start: 16.5, duration: 1.5, column: "cultural", color: "#f69b22", description: "Original compositions & hymn covers" },
  { title: "Cultural Awards", start: 18, duration: 1, column: "cultural", color: "#fa6347", description: "Best performances & Spirit awards" },
  { title: "Grand Worship Night", start: 19, duration: 1, column: "cultural", color: "#f69b22", description: "Multi-church worship concert finale" },
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

  const filteredDelegations = delegations.filter(
    (delegation) =>
      delegation.name.toLowerCase().includes(query.toLowerCase()) ||
      delegation.location.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleEvents = eventCards[track];

  return (
    <div className="app-shell bg-transparent">
      <Navbar>
        <NavBody>
          <a className="brand relative z-20" href="#top" aria-label="SELAH 2026 home">
            <div className="transition-all duration-300 group-data-[shrunk=true]:w-0 group-data-[shrunk=true]:opacity-0 overflow-hidden whitespace-nowrap">
              <strong className="text-2xl">
                SELAH <span className="text-[#f69b22]">2026</span>
              </strong>
            </div>
          </a>
          <NavItems 
            items={[
              { name: "Registration", link: "#events" },
              { name: "Rules", link: "#delegations" },
              { name: "About CYA", link: "#faq" },
              { name: "Gallery", link: "#faq" },
            ]} 
          />
        </NavBody>
      </Navbar>

      <div className="relative z-50 lg:hidden">
        <StaggeredMenu
          isFixed={true}
          logo={
            <div className="brand relative z-20 flex items-center">
              <a href="#top" aria-label="SELAH 2026 home" style={{ textDecoration: 'none' }}>
                <strong className="text-2xl text-white">
                  SELAH <span className="text-[#f69b22]">2026</span>
                </strong>
              </a>
            </div>
          }
          items={[
            { label: "Registration", link: "#events" },
            { label: "Rules", link: "#delegations" },
            { label: "About CYA", link: "#faq" },
            { label: "Gallery", link: "#faq" },
          ] as any}
          colors={['#060d23', '#00b8e8', '#f69b22', '#fa6347']}
          accentColor="#00b8e8"
          menuButtonColor="#93a2c4"
          openMenuButtonColor="#fff"
        />
      </div>

      <main id="top">
        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <PrismaticBurst 
              colors={["#00b8e8", "#f69b22", "#fa6347"]}
              intensity={4}
              speed={0.6}
              rayCount={5}
            />
          </div>
          <section className="hero relative z-10" id="about">
          <div className="glow glow-coral" />
          <div className="glow glow-gold" />
          <div className="glow glow-cyan" />
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
            <div className="text-[#f69b22] font-semibold tracking-widest text-sm mt-8 uppercase text-center w-full">
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
        </section>
        </div>

        <section className="section prize-pool relative py-24" id="prizepool">
          <div className="absolute inset-0 bg-[#060d23] z-[-1]" />
          <div className="glow glow-gold opacity-30" />
          <div className="glow glow-cyan opacity-20" />
          
          <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-20 px-4">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
              Mega <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347]">Prize Pool</span>
            </h2>
            <SparklesText 
              className="text-4xl md:text-5xl font-black mb-1 leading-tight"
              colors={{ first: "#f69b22", second: "#fa6347" }}
              sparklesCount={12}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347]">₹30,000</span>
            </SparklesText>
           
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto px-4 lg:px-8">
            {/* First Prize */}
            <BorderGlow 
              glowColor="24 93 54" // #f69b22 HSL approximation
              backgroundColor="#060d23"
              colors={["#f69b22", "#fa6347", "#00b8e8"]}
              animated={true}
              glowIntensity={1.5}
              className="h-full w-full shadow-2xl"
            >
              <div className="relative h-full rounded-[30px] p-6 lg:p-10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Trophy className="text-[#f69b22]" size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347] text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase">1st Prize</h3>
                </div>
                <div className="text-5xl lg:text-6xl font-black text-white tracking-tight">₹15,000</div>
              </div>
            </BorderGlow>

            {/* Second Prize */}
            <BorderGlow 
              glowColor="221 34 57" // #8b9abb HSL approx
              backgroundColor="#060d23"
              colors={["#8b9abb", "#ffffff", "#8b9abb"]}
              className="h-full w-full shadow-2xl"
            >
              <div className="relative h-full rounded-[30px] p-6 lg:p-10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Trophy className="text-[#8b9abb]" size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[#8b9abb] text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">2nd Prize</h3>
                </div>
                <div className="text-4xl lg:text-5xl font-black text-white tracking-tight">₹10,000</div>
              </div>
            </BorderGlow>

            {/* Third Prize */}
            <BorderGlow 
              glowColor="28 61 49" // #cd7f32 HSL approx
              backgroundColor="#060d23"
              colors={["#cd7f32", "#e69c55", "#cd7f32"]}
              className="h-full w-full shadow-2xl"
            >
              <div className="relative h-full rounded-[30px] p-6 lg:p-10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Trophy className="text-[#cd7f32]" size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[#cd7f32] text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">3rd Prize</h3>
                </div>
                <div className="text-4xl lg:text-5xl font-black text-white tracking-tight">₹5,000</div>
              </div>
            </BorderGlow>
          </div>
        </section>

        <section className="section relative py-24" id="chief-guest">
          <div className="absolute inset-0 bg-[#060d23] z-[-1]" />
          <div className="glow glow-gold opacity-20" />
          <div className="glow glow-coral opacity-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">
                Special Chief <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347]">Guest</span>
              </h2>
            </div>
            
            {/* Chief Guest Feature Card */}
            <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-[32px] bg-gradient-to-b from-[#8b9abb]/10 to-[#0a1024] border border-[#8b9abb]/20 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {isChiefGuestFinalized ? (
                  <>
                    {/* Avatar / Dignitary Portrait Placeholder */}
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-tr from-[#f69b22] to-[#fa6347] p-1 shadow-[0_0_40px_rgba(246,155,34,0.3)]">
                          <div className="w-full h-full rounded-2xl bg-[#060d23] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
                            <UserRound className="text-[#f69b22] mb-3" size={64} strokeWidth={1.5} />
                            <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest">Metropolitan &amp; Archbishop</span>
                            <div className="absolute inset-0 bg-[#f69b22]/5 pointer-events-none"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dignitary Bio & Keynote Details */}
                    <div className="lg:col-span-8 flex flex-col">
                      
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight text-center lg:text-left">
                        Most Rev. Dr. Alexander Mor Baselios
                      </h3>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                        <span className="px-3 py-1 rounded-md bg-[#00b8e8]/10 border border-[#00b8e8]/20 text-[#00b8e8] text-[10px] sm:text-xs font-bold uppercase tracking-widest">Chief Guest of Honor</span>
                        <span className="px-3 py-1 rounded-md bg-[#f69b22]/10 border border-[#f69b22]/20 text-[#f69b22] text-[10px] sm:text-xs font-bold uppercase tracking-widest">Olympic Ambassador</span>
                      </div>
                      
                      <p className="text-[#8b9abb] text-sm md:text-base leading-relaxed mb-8 text-center lg:text-left">
                        Dr. Alexander Mor Baselios has spearheaded ecumenical youth movements across four continents, championing character-driven athletics and liturgical renewal. Joining him on the dais is former Olympic sprinter and Christian Youth Ambassador <span className="text-white font-bold">Marcus Vance</span>, leading the Opening Ceremony Dedication and Oath of Sportsmanship.
                      </p>
                      
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#060d23] border-2 border-dashed border-[#8b9abb]/30 p-1 flex items-center justify-center shadow-lg">
                          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#8b9abb]/5 to-transparent flex flex-col items-center justify-center p-4 text-center">
                            <ShieldCheck className="text-[#8b9abb]/50 mb-3" size={64} strokeWidth={1} />
                            <span className="text-[10px] sm:text-xs font-bold text-[#8b9abb]/70 uppercase tracking-widest">To Be Revealed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left py-6">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b9abb] to-[#4a5568]">Revealing Soon</span>
                      </h3>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SPONSORSHIP SECTION */}
        <section className="section relative py-24" id="sponsors">
          <div className="absolute inset-0 bg-[#0a1024] z-[-1]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b8e8] to-[#8b9abb]">Sponsors</span>
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
                className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8b9abb] via-[#f69b22] to-[#8b9abb] tracking-[0.2em] uppercase inline-block py-2 mb-4 drop-shadow-[0_0_15px_rgba(246,155,34,0.3)]"
              />
            </div>
            
            <div className="mt-16 text-center">
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white backdrop-blur-3xl">
                  Become a Sponsor
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Father Vicar's Message Section */}
        <section className="section relative py-24" id="vicar-message">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
                Father Vicar's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347]">Message</span>
              </h2>
            </div>
            
            <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-[32px] bg-gradient-to-b from-[#f69b22] to-[#fa6347] border border-[#f69b22]/50 shadow-[0_0_40px_rgba(246,155,34,0.3)] relative overflow-hidden">
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Avatar Placeholder */}
                <div className="lg:col-span-4 flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#060d23] p-1 shadow-2xl">
                      <div className="w-full h-full rounded-2xl bg-[#0a1024] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
                        <Church className="text-[#00b8e8] mb-3" size={64} strokeWidth={1.5} />
                        <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest">Father Vicar</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message Content */}
                <div className="lg:col-span-8 flex flex-col">
                  <h3 className="text-3xl sm:text-4xl lg:text-4xl font-black text-[#060d23] mb-2 leading-tight text-center lg:text-left">
                    Fr. Joy Philip Kakkanattu 
                  </h3>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                    <span className="px-3 py-1 rounded-md bg-[#060d23]/10 border border-[#060d23]/20 text-[#060d23] text-[10px] sm:text-xs font-bold uppercase tracking-widest">Vicar</span>
                  </div>
                  
                  <p className="text-[#0a1024] text-sm md:text-base font-medium leading-relaxed mb-8 text-center lg:text-left">
                    "I am delighted to welcome you to SELAH 2026. This festival is a celebration of our youth's talent, energy, and dedication. Let us come together to witness the incredible performances, foster fellowship, and glorify His name through arts and sports. May this event inspire and uplift everyone involved."
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        <section className="section arena-section" id="events">
          <div className="center-heading">
            <h2>Cultural and Sport Events</h2>
            <p>
              Explore the different Cultural and Sport events in SELAH 2026. Click on the event card for further information and rules about the event.
            </p>
          </div>
          <div className="tabs">
            {(
              [
                ["sports", "Sports Tournaments (12)", <Medal size={16} />],
                ["culture", "Cultural & Arts (8)", <Music2 size={16} />],
              ] as [Track, string, React.ReactNode][]
            ).map(([value, label, icon]) => (
              <button
                className={track === value ? "tab active" : "tab"}
                key={value}
                onClick={() => setTrack(value)}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
          {track === "worship" ? (
            <div className="worship-grid">
              <WorshipCard
                title="The Parade of Delegations & Night of Dedication"
                icon={<Church />}
                text="Every church delegation marches with parish flags into the primary stadium arena. Concluded with united communion, a 400-voice youth band, and pastoral prayer blessing."
                time="Thursday, July 17 · 6:30 PM"
              />
              <WorshipCard
                title="SELAH Grand Elevation Night & Concert"
                icon={<Flame />}
                text="Championship trophies, Spirit & Character Awards, and Kingdom Grants are awarded before an explosive multi-church worship concert."
                time="Sunday, July 20 · 7:00 PM"
              />
            </div>
          ) : (
            <MagicBento 
              cards={visibleEvents}
              gridClassName="event-grid"
              cardClassName="event-bento-card group"
              enableTilt={false}
              enableBorderGlow={true}
              enableMagnetism
              enableStars={false}
              enableSpotlight
              spotlightRadius={460}
              glowColor="59, 130, 246"
              renderItem={(event) => (
                <EventCardView card={event} />
              )}
            />
          )}
        </section>

        {/* Teams-style Calendar Timeline */}
        <section className="section relative py-24" id="schedule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-heading flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-white leading-tight">
                Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347]">Schedule</span>
              </h2>
              <p className="text-[#8b9abb] text-sm md:text-base leading-relaxed">
                A full day schedule of cultural performances and sports tournaments.
              </p>
            </div>

            {/* Calendar Container */}
            <div className="relative max-w-5xl mx-auto" style={{ height: `${12 * 72 + 48}px` }}>

              {/* Column Headers - sits above the grid */}
              <div className="absolute top-0 left-[48px] md:left-[76px] right-0 grid grid-cols-2 h-[48px] z-10">
                <div className="flex items-center justify-center gap-1 md:gap-2 border-b border-r border-[#8b9abb]/20 bg-[#0a1024]/90 backdrop-blur-sm rounded-tl-xl overflow-hidden px-1">
                  <Music2 size={14} className="text-[#f69b22] shrink-0" />
                  <span className="text-xs md:text-sm font-bold text-white tracking-wider truncate">Cultural<span className="hidden sm:inline"> Events</span></span>
                </div>
                <div className="flex items-center justify-center gap-1 md:gap-2 border-b border-[#8b9abb]/20 bg-[#0a1024]/90 backdrop-blur-sm rounded-tr-xl overflow-hidden px-1">
                  <Medal size={14} className="text-[#00b8e8] shrink-0" />
                  <span className="text-xs md:text-sm font-bold text-white tracking-wider truncate">Sport<span className="hidden sm:inline"> Events</span></span>
                </div>
              </div>

              {/* Time labels + grid lines (spanning full width) */}
              {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                <div key={hour} className="absolute left-0 right-0" style={{ top: `${48 + (hour - 8) * 72}px` }}>
                  {/* Time label */}
                  <span className="absolute left-0 w-[44px] md:w-[68px] text-right pr-1 md:pr-2 text-[10px] md:text-xs text-[#8b9abb] font-medium tabular-nums" style={{ transform: 'translateY(-50%)' }}>
                    {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                  </span>
                  {/* Grid line */}
                  <div className="absolute left-[48px] md:left-[76px] right-0 border-t border-[#8b9abb]/15" />
                </div>
              ))}

              {/* Live Time Tracker Line */}
              {currentHour !== null && (
                <div
                  className="absolute left-[48px] md:left-[76px] right-0 z-20 pointer-events-none"
                  style={{ top: `${48 + (currentHour - 8) * 72}px` }}
                >
                  {/* Dot */}
                  <div className="absolute left-0 w-3 h-3 rounded-full bg-[#fa6347] border-2 border-[#fa6347] shadow-[0_0_8px_rgba(250,99,71,0.6)]" style={{ transform: 'translate(-50%, -50%)' }} />
                  {/* Line */}
                  <div className="absolute left-0 right-0 border-t-2 border-[#fa6347] shadow-[0_0_6px_rgba(250,99,71,0.4)]" />
                </div>
              )}

              {/* Event Columns */}
              <div className="absolute top-[48px] left-[48px] md:left-[76px] right-0 bottom-0 grid grid-cols-2">
                {/* Column divider */}
                <div className="absolute top-0 bottom-0 left-1/2 border-l border-[#8b9abb]/15 z-[1]" />

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
                          className={`absolute left-1 right-2 md:left-2 md:right-3 rounded-[4px] overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:z-10 ${isActive ? 'z-[5] ring-1 ring-[#fa6347]/40' : ''}`}
                          style={{
                            top: `${(event.start - 8) * 72 + 2}px`,
                            height: `${event.duration * 72 - 3}px`,
                            backgroundColor: isActive ? `${event.color}55` : `${event.color}30`,
                            borderLeft: `4px solid ${event.color}`,
                            boxShadow: isActive ? `0 0 16px ${event.color}40, inset 0 0 12px ${event.color}15` : 'none',
                          }}
                        >
                          <div className="px-2 py-1.5 h-full flex flex-col">
                            <div className={`text-[11px] md:text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-white'}`}>{event.title}</div>
                            {event.duration >= 1 && (
                              <div className="text-[10px] md:text-[11px] text-[#8b9abb] leading-tight mt-0.5 truncate">
                                {formatHour(event.start)} - {formatHour(event.start + event.duration)}
                              </div>
                            )}
                            {event.duration >= 1.5 && (
                              <div className="text-[10px] md:text-[11px] mt-0.5 leading-tight truncate" style={{ color: `${event.color}cc` }}>
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
                          className={`absolute left-2 right-1 md:left-3 md:right-2 rounded-[4px] overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:z-10 ${isActive ? 'z-[5] ring-1 ring-[#fa6347]/40' : ''}`}
                          style={{
                            top: `${(event.start - 8) * 72 + 2}px`,
                            height: `${event.duration * 72 - 3}px`,
                            backgroundColor: isActive ? `${event.color}55` : `${event.color}30`,
                            borderLeft: `4px solid ${event.color}`,
                            boxShadow: isActive ? `0 0 16px ${event.color}40, inset 0 0 12px ${event.color}15` : 'none',
                          }}
                        >
                          <div className="px-2 py-1.5 h-full flex flex-col">
                            <div className={`text-[11px] md:text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-white'}`}>{event.title}</div>
                            {event.duration >= 1 && (
                              <div className="text-[10px] md:text-[11px] text-[#8b9abb] leading-tight mt-0.5 truncate">
                                {formatHour(event.start)} - {formatHour(event.start + event.duration)}
                              </div>
                            )}
                            {event.duration >= 1.5 && (
                              <div className="text-[10px] md:text-[11px] mt-0.5 leading-tight truncate" style={{ color: `${event.color}cc` }}>
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
        </section>
      </main>

      <footer className="site-footer relative overflow-hidden flex flex-col justify-between min-h-[500px] bg-[#050b20]">
        <div className="footer-grid relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
          <div className="flex flex-col h-full">
            <a className="brand flex items-center gap-3 text-white mb-6" href="#top">
              <div className="brand-mark bg-[#ffbd61] text-[#281506] p-1.5 rounded flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div className="text-xl font-bold tracking-wide">
                SELAH
              </div>
            </a>
            <p className="text-[#8492b1] text-sm leading-relaxed max-w-sm">
              The official biennial inter-church youth cultural & sports
              festival uniting congregations in athletics, creative expression,
              and holy reverence.
            </p>
          </div>
          <FooterColumn
            title="Venues"
            items={[
              "Coliseum Complex",
              "Grace Amphitheater",
              "Festival Grounds",
              "Lodging Campuses",
            ]}
          />
          <FooterColumn
            title="Support"
            items={[
              "Team Portal",
              "Spectator Passes",
              "Rules & Conduct",
              "Contact Us",
            ]}
          />
          <FooterColumn
            title="Legal"
            items={[
              "Sanctioning Info",
              "Festival Charter",
              "Safety Guidelines",
              "Privacy Policy",
            ]}
          />
        </div>

        {/* Massive Background Text */}
        <div className="w-full h-[20vw] min-h-[240px] flex justify-center items-end mt-auto select-none relative z-0 translate-y-[22%] overflow-hidden">
          <ParticleText
            text="SELAH"
            particleSize={2.2}
            density={5}
            color="#ffffff"
            highlightColor="#ffffff"
            scatter={190}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={42}
            repelRadius={120}
            idleDrift={0.8}
            trigger="click"
            fontSize="24vw"
            fontWeight={900}
            fontFamily="inherit"
            className="leading-none tracking-tighter opacity-40"
            glow={false}
          />
        </div>
      </footer>
    </div>
  );
}


function EventCardView({ card }: { card: EventCard }) {
  return (
    <>
      {/* Background Image integrated beneath MagicBento's content */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-30 opacity-80 mix-blend-screen pointer-events-none z-0"
        style={{ backgroundImage: `url(${card.image})` }}
      />
      
      {/* Gradient overlay to ensure text remains highly readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-0" />
      
      {/* MagicBento native layout structure */}
      <div className="relative z-10 flex flex-col h-full justify-end">
        <div className="magic-bento-card__content">
          <h2 className="magic-bento-card__title !font-bold !text-white !text-xl !mb-2 drop-shadow-md pr-12">{card.title}</h2>
          <p className="magic-bento-card__description !text-white/80 !opacity-100 line-clamp-3 pr-12">{card.description}</p>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <ArrowRight className="text-white w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>

    </>
  );
}
function WorshipCard({
  title,
  icon,
  text,
  time,
}: {
  title: string;
  icon: React.ReactNode;
  text: string;
  time: string;
}) {
  return (
    <article className="worship-card">
      <span className="worship-icon">{icon}</span>
      <span className="eyebrow gold-text">OPEN TO ALL ATTENDEES</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <small>{time}</small>
    </article>
  );
}
function PriceCard({
  title,
  eyebrow,
  price,
  suffix,
  text,
  features,
  button,
  featured = false,
}: {
  title: string;
  eyebrow: string;
  price: string;
  suffix: string;
  text: string;
  features: string[];
  button: string;
  featured?: boolean;
}) {
  return (
    <article className={featured ? "price-card featured" : "price-card"}>
      {featured && (
        <span className="popular">MOST POPULAR · FULL DELEGATION</span>
      )}
      <span className="eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <div className="price">
        <strong>{price}</strong>
        <span>{suffix}</span>
      </div>
      <p>{text}</p>
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <Check size={15} /> {feature}
          </li>
        ))}
      </ul>
      <button
        className={featured ? "button button-primary" : "button button-quiet"}
      >
        {button}
      </button>
    </article>
  );
}
function Faq({
  openFaq,
  setOpenFaq,
}: {
  openFaq: number | null;
  setOpenFaq: (value: number | null) => void;
}) {
  const items = [
    [
      "Can two smaller churches combine to form one unified team?",
      "Yes. Under the Unity Accord policy, smaller parishes can submit a joint delegation application under a combined fellowship name.",
    ],
    [
      "What are the age brackets for the sports tournaments?",
      "Competitions run in Junior Division for ages 13 to 17 and Senior Young Adults Division for ages 18 to 35.",
    ],
    [
      "How are the $15,000 Kingdom Impact Grants decided?",
      "Grants consider tournament results and the Spirit of SELAH character score, voted by refs, opposing teams, and volunteer coordinators.",
    ],
  ];
  return (
    <div className="faq" id="faq">
      <h3>Frequently Asked Questions</h3>
      {items.map(([question, answer], index) => (
        <div className="faq-item" key={question}>
          <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
            <span>{question}</span>
            <ChevronDown
              className={openFaq === index ? "rotate" : ""}
              size={16}
            />
          </button>
          {openFaq === index && <p>{answer}</p>}
        </div>
      ))}
    </div>
  );
}
function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="footer-links">
        {items.map((item) => (
          <a href="#top" key={item}>
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;

"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import Link from "next/link";
import { SparklesText } from "@/components/ui/sparkles-text"
import {
  Navbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { GlobalCursor } from "@/components/ui/skiper-ui/skiper61";
import StaggeredMenu from "@/components/StaggeredMenu";
import PrismaticBurst from "@/components/PrismaticBurst";
import { MorphingText } from "@/components/ui/morphing-text";
import BorderGlow from "@/components/BorderGlow";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  Check,
  ChevronDown,
  Church,
  Download,
  Flame,
  Headphones,
  HeartHandshake,
  Hourglass,
  Medal,
  Menu,
  Mic,
  Music2,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Track = "sports" | "culture" | "worship";

type EventCard = {
  title: string;
  meta: string;
  description: string;
  award: string;
  image: string;
  tag: string;
  color: "coral" | "gold" | "cyan";
};

const eventCards: Record<Track, EventCard[]> = {
  sports: [
    {
      title: "SELAH 5v5 Basketball Championship",
      meta: "Coliseum Court Alpha · Squad: 5–10 Players",
      description:
        "Full-court FIBA rules, shot clock enforced, with regional officials and sudden-death overtime.",
      award: "$3,000 Kingdom Trophy",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD_MgBQqlCaE0D9s9ikq9urx3TVRvWK4d_CXayjhBvlE4cma1QhTLrnABflk_QhfrS53J-VwSQNvpFUjgVir3mS37ZZKPb8jJXpagiQQw4Nj-f5GAHat9f2l9773nFtBAVvq9cMNX626l3FJe2-x1xE6yxrYIK_I_cDTvHA4q0U5HraS3NpXF4hnKfX-zspP268oCVxVMLbFfPrR5V2-uOGEYkPi-_cL1qXBEjwj5sM6gekATqtcYq9mQ",
      tag: "8 spots left",
      color: "coral",
    },
    {
      title: "Unity Volleyball Blitz",
      meta: "Pavilion Courts 1–3 · Squad: 6–8 Players",
      description:
        "Best of three sets with group double elimination leading to the stadium finals.",
      award: "$2,000 Fellowship Cup",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1mLa9BPurNBgrm_siweKjUq5MdGfVpMihs3s7po7Zjm36ZuM45dSl0PMqVhBXPP8dpOLFgO1-dP7o3B6oZEzGRg6Dp5EgBzNuN4wa_mBrlZO8t9PlgDceSp8oJMG-zQN7WcsvZXD_P_zAQ26zc-a6vvqWzRFaoopdqp_tamBB_m_HBTf1TUCiBivmhJWLxzymom_HcvGPNhH3I8HG9-kPjS0l3sBoPjHLmc3W8Y2b-hGPyK_4BsSb8w",
      tag: "4 spots left",
      color: "gold",
    },
    {
      title: "7-a-Side Futsal Challenge",
      meta: "East Fieldhouse · Squad: 7–12 Players",
      description:
        "Rapid 20-minute halves on pro turf surfaces. Precision touch, discipline, and teamwork.",
      award: "$2,500 Mission Cup",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBSxQNHKGeYPkw7aYNJFG69KqXRdf0_Gv3tMkvC_nw5eQAV4_ua-4DP1SXo496cum1ys80Z4OKE39Ggxx0YS-OKvprWtjX34bwrjdkIlkZKsRoryo_VVfmCYZavPwv_r-QBxOqDUXdpdfbfALFiqCiGLCVbGrKmxG2LMVZ2JeYbw730AANbEeXhgvVcrQEcF60S9bbv-T9aqxel8bYxQQZ2fNdnMpS2Ae9reeTSQ2PID2PgtcwPvmdmWw",
      tag: "12 teams registered",
      color: "cyan",
    },
  ],
  culture: [
    {
      title: "A Cappella & Choral Symphony",
      meta: "Main Auditorium · 15–40 Voices",
      description:
        "Sacred hymnody reimagined through four-part harmony and original congregational ballads.",
      award: "$2,000 Choral Endowment",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCxGZxptsdpFYn8UC0NxBBJg2jsmri_oPNZM-ev2bsLnPxLCM0uaXVrtIgYCI4toDiSlc7aAT7AyiwUdfbi_Fk__A_R-Lhg8pk8aZTFlTgSsvlIDwFkT2oInxssjN_4DvTngPYFZFsxOXWWyRoad5Dp2DFTEVgdTSJn8PDKMaWBBew95xve4lu1JDzV-0QNnOzuxBbZVCQSAdZpNp8z7h77W09Tv1MNoYrB_1GhLmcOUmGN3WeXv9Hfbw",
      tag: "Grace Amphitheater",
      color: "gold",
    },
    {
      title: "Contemporary Worship Battle",
      meta: "Stage Beta · 4–8 Musicians",
      description:
        "Original composition plus a classic hymn arrangement, scored for musicality and resonance.",
      award: "$2,500 Studio Grant",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBroCxqgPOErw5rNoGbrtLdsfPVz8jOa9N7Z9hCZwQAOnSAr7M2Labw3MGEw_XNzQAleLoAnE4q6m5aeQQ7_y-W1--EQHK_wSxx_HFuV7HL3PIkJg5gKw8S1mpMv0DsKZAaxKi3NZyIDVbtNOHNph89vMfNfEuGPMUMvInYbvvah1AzbxxVBNtegs0x-_LN99HMV6f3CIoLwYEbKU4E9hJNjdPExCLABbXsrBwMH2pSki9R_H1E2ugmyA",
      tag: "Auditorium B",
      color: "coral",
    },
    {
      title: "Gospel Poetry & Sacred Drama",
      meta: "Upper Room Stage · Solo / Duo",
      description:
        "Original rhythmic narratives addressing redemption, mental health, and contemporary faith.",
      award: "$1,000 Author Award",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBYZLrutwH34A0Twoz6lajNO8lX6qCwANKRY_ApV6eMW-PNZdb8QdipYDrdZEboe5fyvZXDWfAhvyoDjz27cIUd93X8W_GxWp-mdkBcAlgLSuX9iKhwHXKtXsAe6qLvSReVTbkelvKXqgYf-CGAdxenP8m20N0ATZn4aW6p3aVwamlm6oyQuZrKU_jM5fMWGsklj7CwZXxFAYPVNE8aOk9_w9LexCRZb_KHLrpWqObMY8bAci4Z9XeR6w",
      tag: "Gallery Loft",
      color: "cyan",
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

const scheduleByDay: Record<
  number,
  {
    time: string;
    label: string;
    title: string;
    detail: string;
    status: string;
  }[]
> = {
  1: [
    {
      time: "09:00 AM",
      label: "Delegation Logistics · Pavilion Hall",
      title: "Arrival, Accreditation & Village Check-In",
      detail:
        "Badge verification, lodging keys, jersey stamping, and coach briefing packets.",
      status: "All Delegations",
    },
    {
      time: "02:00 PM",
      label: "Athletics Prelims · Courts A & B",
      title: "Volleyball & Table Tennis Group Rounds",
      detail:
        "Opening pool matches across 16 parish squads. Live point scoring broadcast in app.",
      status: "Live Broadcast",
    },
    {
      time: "06:30 PM",
      label: "Main Coliseum Arena",
      title: "The Awakening Opening Ceremony",
      detail:
        "Sportsmanship oath, flag ceremonies, and a worship keynote rally.",
      status: "Keynote Event",
    },
  ],
  2: [
    {
      time: "08:30 AM",
      label: "East Fieldhouse",
      title: "Futsal & Basketball Qualifiers",
      detail: "The first full day of competition begins across every court.",
      status: "Open Courts",
    },
    {
      time: "01:00 PM",
      label: "Grace Amphitheater",
      title: "Choral Symphony Showcase",
      detail:
        "Voices from across the region gather for an afternoon of sacred music.",
      status: "Featured Stage",
    },
    {
      time: "07:00 PM",
      label: "Prayer Tent",
      title: "Night of Reflection",
      detail:
        "A quiet gathering for worship leaders, coaches, and young adults.",
      status: "Open to All",
    },
  ],
  3: [
    {
      time: "10:00 AM",
      label: "Coliseum Courts",
      title: "Semi-Finals & Character Awards",
      detail:
        "The final four teams in each discipline compete for a place in Sunday finals.",
      status: "Championship Run",
    },
    {
      time: "03:30 PM",
      label: "The Upper Room Stage",
      title: "Gospel Poetry & Sacred Drama",
      detail:
        "A curated showcase of new voices, stories, and sacred imagination.",
      status: "Ticketed Stage",
    },
    {
      time: "08:00 PM",
      label: "Main Arena",
      title: "Pastors & Coaches Exhibition",
      detail:
        "A friendly showcase match with an important message about joy and unity.",
      status: "Family Event",
    },
  ],
  4: [
    {
      time: "11:00 AM",
      label: "All Arenas",
      title: "Grand Championship Finals",
      detail: "The best of SELAH meet under the lights for the final trophies.",
      status: "Finals Day",
    },
    {
      time: "04:00 PM",
      label: "Festival Village",
      title: "Kingdom Grant Presentations",
      detail: "Celebrating the teams whose character carries beyond the arena.",
      status: "Awards",
    },
    {
      time: "07:00 PM",
      label: "Main Coliseum Arena",
      title: "SELAH Grand Elevation Night",
      detail:
        "Trophies, prayer, and a multi-church worship concert close the festival.",
      status: "Livestreamed",
    },
  ],
};

function App() {
  const isChiefGuestFinalized = false;
  const [track, setTrack] = useState<Track>("sports");
  const [day, setDay] = useState(1);
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [anthemPlaying, setAnthemPlaying] = useState(false);
  const target = useMemo(() => new Date("2026-12-05T00:00:00+05:30"), []);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f69b22] to-[#fa6347]">₹25,000</span>
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
                <div className="text-5xl lg:text-6xl font-black text-white tracking-tight">₹12,000</div>
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
                <div className="text-4xl lg:text-5xl font-black text-white tracking-tight">₹8,000</div>
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
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f69b22]/10 border border-[#f69b22]/30 text-[#f69b22] text-xs font-bold tracking-[0.1em] uppercase mb-6">
                        <Sparkles className="w-4 h-4" />
                        Announcement Pending
                      </div>
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

        <section className="section arena-section" id="events">
          <div className="center-heading">
            <span className="eyebrow coral-text">
              COMPETITION & WORSHIP HUB
            </span>
            <h2>Dual-Arena Festival Tracks</h2>
            <p>
              Explore sanctioned athletic tournaments and accredited creative
              arts stages. Toggle below to review brackets, squad sizes, and
              current spots.
            </p>
          </div>
          <div className="tabs">
            {(
              [
                ["sports", "Sports Tournaments (12)", <Medal size={16} />],
                ["culture", "Cultural & Arts (8)", <Music2 size={16} />],
                [
                  "worship",
                  "Sacred Gatherings (4)",
                  <HeartHandshake size={16} />,
                ],
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
            <div className="event-grid">
              {visibleEvents.map((event) => (
                <EventCardView card={event} key={event.title} />
              ))}
            </div>
          )}
        </section>

        <section className="section schedule-section" id="schedule">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow gold-text">THE 4-DAY JOURNEY</span>
              <h2>Festival Master Schedule</h2>
            </div>
            <div className="day-tabs">
              {[1, 2, 3, 4].map((item) => (
                <button
                  className={day === item ? "active" : ""}
                  key={item}
                  onClick={() => setDay(item)}
                >
                  Day {item}: Jul {16 + item}
                </button>
              ))}
            </div>
          </div>
          <div className="schedule-list">
            {scheduleByDay[day].map((item) => (
              <div className="schedule-row" key={item.title}>
                <span className="time-box">{item.time}</span>
                <div className="schedule-copy">
                  <span className="eyebrow cyan-text">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
                <span className="status-pill">{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section delegations-section" id="delegations">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow coral-text">DELEGATION DIRECTORY</span>
              <h2>Confirmed Church Fellowships</h2>
              <p>
                Over 35 congregations across 14 dioceses and independent
                fellowships have fielded squads.
              </p>
            </div>
            <label className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or city..."
              />
            </label>
          </div>
          <div className="filter-row">
            <span>QUICK FILTER:</span>
            <button className="selected">All (35+)</button>
            <button>Grace City Chapel</button>
            <button>Redeemer United</button>
            <button>Zion Youth Cathedral</button>
            <button>Trinity Metro Fellowship</button>
          </div>
          <div className="delegation-grid">
            {filteredDelegations.map((delegation) => (
              <div className="delegation-card" key={delegation.name}>
                <div className="delegation-top">
                  <span className={`initials ${delegation.accent}`}>
                    {delegation.initials}
                  </span>
                  <span className={`mini-badge ${delegation.accent}`}>
                    {delegation.badge}
                  </span>
                </div>
                <h3>{delegation.name}</h3>
                <p>{delegation.location}</p>
                <div className="tag-list">
                  {delegation.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <small>Spirit Award Holder</small>
              </div>
            ))}
          </div>
        </section>

        <section className="section pricing-section" id="pricing">
          <div className="center-heading">
            <span className="eyebrow gold-text">ENROLLMENT PORTAL</span>
            <h2>Official Delegation Tiers</h2>
            <p>
              Subsidized entry packages for youth groups, sanctioned multi-team
              delegations, and general spectators.
            </p>
          </div>
          <div className="pricing-grid">
            <PriceCard
              title="Spectator & Supporter"
              eyebrow="COMMUNITY PASS"
              price="$25"
              suffix="/ individual pass"
              text="Full access to 4 days of sports arenas, concerts, community dining, and praise rallies."
              features={[
                "All Sports Court General Bleacher Access",
                "SELAH Elevation Concert Entry",
                "Festival Badge & Lanyard",
              ]}
              button="Get Spectator Badges"
            />
            <PriceCard
              featured
              title="Church Delegation Pack"
              eyebrow="FULL PARISH ACCESS"
              price="$490"
              suffix="/ whole church delegation"
              text="Complete entry for your church youth ministry with sport rosters, arts stages, and 30 spectator passes."
              features={[
                "Up to 4 Sports Tournaments",
                "Choir & Worship Band Entries",
                "Parade Banner Rights & Stage Entry",
                "30 Free Youth Spectator Lanyards",
                "Eligible for Kingdom Impact Grants",
              ]}
              button="Enroll Church Delegation"
            />
            <PriceCard
              title="Single Team Roster"
              eyebrow="SINGLE DISCIPLINE"
              price="$160"
              suffix="/ specific squad"
              text="For one sports team or arts squad representing an affiliated church body."
              features={[
                "1 Sanctioned Tournament Registration",
                "Official Referee & Scoring Fees",
                "Athlete Passes for 12 Athletes + 2 Coaches",
              ]}
              button="Register Single Squad"
            />
          </div>
          <Faq openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </section>

        <section className="section crew-section">
          <div className="crew-panel">
            <div>
              <span className="eyebrow gold-text">SERVANT LEADERSHIP</span>
              <h2>Serve on the 2026 SELAH Crew</h2>
              <p>
                It takes over 200 volunteer leaders to make SELAH happen — from
                medical first responders and scorekeepers to stage tech crew and
                the 24-hour prayer tent team.
              </p>
              <div className="crew-list">
                <span>
                  <ShieldCheck /> Medical & Safety
                </span>
                <span>
                  <Trophy /> Court Referees
                </span>
                <span>
                  <Headphones /> Audio & Visual Tech
                </span>
                <span>
                  <HeartHandshake /> Chaplaincy & Prayer
                </span>
              </div>
              <button className="button button-gold">
                Apply as Volunteer Crew <ArrowRight size={16} />
              </button>
            </div>
            <blockquote>
              <span className="quote-mark">“</span>
              <p>
                SELAH wasn't just another tournament where churches competed
                fiercely and left strangers. In the semi-finals, both teams
                knelt together at center court to pray.
              </p>
              <footer>
                <span className="avatar">MV</span>
                <span>
                  <strong>Pastor Marcus Vance</strong>
                  <small>Youth Director, Redeemer Fellowship</small>
                </span>
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow coral-text">THE HISTORIC GATHERING</span>
          <h2>
            Unite with 3,000+
            <br />
            Believers.
          </h2>
          <p>
            Registration closes June 15, 2026. Guarantee your church's banner in
            the arena parade and tournament brackets today.
          </p>
          <div>
            <a className="button button-primary button-large" href="#pricing">
              <HeartHandshake size={17} /> Claim Delegation Spot
            </a>
            <button className="button button-outline button-large">
              <Download size={17} /> Download 2026 Rulebook PDF
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <a className="brand" href="#top">
              <div className="brand-mark">
                <Sparkles size={17} />
              </div>
              <div>
                <strong>
                  SELAH <span>2026</span>
                </strong>
                <small>FEST · ARENA · STAGE</small>
              </div>
            </a>
            <p>
              The official biennial inter-church youth cultural & sports
              festival uniting congregations in athletics, creative expression,
              and holy reverence.
            </p>
            <span className="footer-chip">PAUSE · REFLECT · LIFT UP</span>
          </div>
          <FooterColumn
            title="Arena & Stage Hubs"
            items={[
              "Memorial Coliseum Complex",
              "Grace Amphitheater & Arts Center",
              "Tournament Brackets & Schedule",
              "Delegation Lodging & Campuses",
            ]}
          />
          <FooterColumn
            title="Delegation Support"
            items={[
              "Team Registration Portal",
              "Spectator Badging & Passes",
              "Code of Conduct & Rules",
              "Federation Desk: contact@selah2026.org",
            ]}
          />
          <div>
            <h3>Sanctioning Body</h3>
            <p>
              Sanctioned by the United Inter-Church Athletic & Arts Council.
              Powered by youth ministries across 14 regional fellowships.
            </p>
            <span className="verified">
              <ShieldCheck size={16} /> Official Festival Ground
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SELAH Festival Council. All rights reserved.</span>
          <span>Festival Charter · Safety Guidelines · Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <div className="stat">
      <span>{icon}</span>
      <div>
        <strong>{number}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

function EventCardView({ card }: { card: EventCard }) {
  return (
    <article className="event-card">
      <div
        className="event-image"
        style={{ backgroundImage: `url(${card.image})` }}
      >
        <span className={`event-tag ${card.color}`}>
          {card.color === "coral"
            ? "Men & Women Div"
            : card.color === "gold"
              ? "Mixed Co-Ed"
              : "Open Youth"}
        </span>
        <span className="spots">{card.tag}</span>
      </div>
      <div className="event-content">
        <span className="event-meta">{card.meta}</span>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <div className="event-footer">
          <strong>{card.award}</strong>
          <button>Rules & Roster</button>
        </div>
      </div>
    </article>
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

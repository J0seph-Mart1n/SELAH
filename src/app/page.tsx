"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import Link from "next/link";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { GlobalCursor } from "@/components/ui/skiper-ui/skiper61";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MorphingText } from "@/components/ui/morphing-text";
import {
  ArrowRight,
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
  const [track, setTrack] = useState<Track>("sports");
  const [day, setDay] = useState(1);
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [anthemPlaying, setAnthemPlaying] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const target = useMemo(() => new Date("2026-07-17T09:00:00"), []);
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
    if (!audioPlaying) return;
    const timer = window.setInterval(() => {
      setAudioProgress((value) => {
        if (value >= 100) {
          setAudioPlaying(false);
          return 0;
        }
        return value + 12.5;
      });
    }, 300);
    return () => window.clearInterval(timer);
  }, [audioPlaying]);

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
      <GlobalCursor />
      <Navbar>
        <NavBody>
          <a className="brand relative z-20" href="#top" aria-label="SELAH 2026 home">
            <div className="brand-mark text-[#00b8e8]">
              <Sparkles size={19} />
            </div>
            <div className="transition-all duration-300 group-data-[shrunk=true]:w-0 group-data-[shrunk=true]:opacity-0 overflow-hidden whitespace-nowrap">
              <strong>
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

        <MobileNav>
          <MobileNavHeader className="justify-start gap-4">
            <MobileNavToggle isOpen={mobileNav} onClick={() => setMobileNav(!mobileNav)} />
            <a className="brand relative z-20" href="#top" aria-label="SELAH 2026 home">
              <div className="brand-mark text-[#00b8e8]">
                <Sparkles size={19} />
              </div>
              <div>
                <strong>
                  SELAH <span className="text-[#f69b22]">2026</span>
                </strong>
              </div>
            </a>
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileNav} onClose={() => setMobileNav(false)}>
            {[
              { name: "Registration", link: "#events" },
              { name: "Rules", link: "#delegations" },
              { name: "About CYA", link: "#faq" },
              { name: "Gallery", link: "#faq" },
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                onClick={() => setMobileNav(false)}
                className="text-lg font-medium text-[#93a2c4] hover:text-[#00b8e8]"
              >
                {item.name}
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main id="top">
        <AuroraBackground className="!h-auto !min-h-0 w-full">
          <section className="hero" id="about">
          <div className="glow glow-coral" />
          <div className="glow glow-gold" />
          <div className="glow glow-cyan" />
          <div className="hero-inner">
            <h1>
              <MorphingText texts={["सेलाह", "സേലാ", "סֶלָה", "SELAH"]} />{" "}
              <span>2026</span>
            </h1>
            <p className="hero-subtitle">
              Pause. Reflect and Lift Up
              <br className="desktop-only" />{" "}
            </p>
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
            <div className="hero-actions">
              <a className="button button-primary button-large" href="#pricing">
                <Users size={17} /> Register
              </a>
              <a className="button button-outline button-large" href="#events">
                <Trophy size={17} /> Explore Events
              </a>
            </div>
          </div>
        </section>
        </AuroraBackground>

        <section className="section foundation" id="foundation">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow gold-text">
                THE SPIRITUAL FOUNDATION
              </span>
              <h2>
                Understanding ‘<span className="script-word">סֶלָה</span>’
              </h2>
            </div>
            <p>
              A timeless musical and meditative term found over 70 times in the
              Psalms. It commands an intentional break: to weigh God's word,
              recalibrate our hearts, and launch forward in victory.
            </p>
          </div>
          <div className="pillar-grid">
            <Pillar
              number="01"
              title="PAUSE"
              icon={<Hourglass />}
              tone="cyan"
              text="Step away from the secular grind, screens, and isolation. Stand side-by-side with young believers to breathe, fellowship, and recalibrate soul focus."
              verse="Psalm 46:10"
              quote="Be still, and know that I am God..."
            />
            <Pillar
              number="02"
              title="REFLECT"
              icon={<Sparkles />}
              tone="gold"
              text="Honor God through raw discipline, court etiquette, and artistic integrity. Every gift mirrors the Creator's heart."
              verse="1 Cor. 9:24"
              quote="Run in such a way as to get the prize."
            />
            <Pillar
              number="03"
              title="LIFT UP"
              icon={<Flame />}
              tone="coral"
              text="Triumphant united worship. We celebrate not personal ego, but the elevation of Jesus Christ through prayer huddles and festival benediction."
              verse="Psalm 3:3"
              quote="You are the lifter of my head."
            />
          </div>
          <div className="audio-bar">
            <button
              className="play-disc"
              onClick={() => setAudioPlaying(!audioPlaying)}
              aria-label="Play Hebrew pronunciation"
            >
              {audioPlaying ? <Pause size={19} /> : <Play size={19} />}
            </button>
            <div className="audio-copy">
              <strong>Hear the Ancient Hebrew Liturgical Intonation</strong>
              <span>
                Pronunciation: ‘seh-law’ · Liturgical Hebrew cantillation by
                Cantor David Levi
              </span>
            </div>
            <div className="audio-progress">
              <div className="progress-track">
                <span style={{ width: `${audioProgress}%` }} />
              </div>
              <small>0:0{Math.floor(audioProgress / 12.5)} / 0:08</small>
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
function Pillar({
  number,
  title,
  icon,
  tone,
  text,
  verse,
  quote,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  tone: string;
  text: string;
  verse: string;
  quote: string;
}) {
  return (
    <article className={`pillar ${tone}`}>
      <div>
        <div className="pillar-top">
          <span>PILLAR {number}</span>
          {icon}
        </div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <footer>
        <small>KEYNOTE VERSE: {verse}</small>
        <em>&ldquo;{quote}&rdquo;</em>
      </footer>
    </article>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import {
  EVENT_RULES,
  CULTURAL_RULES,
  SPORT_RULES,
  EventCategory,
  EventRule,
} from "./data/rulesData";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Info,
  MapPin,
  Medal,
  Music2,
  Printer,
  Scale,
  Search,
  Share2,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";

export default function RulesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | EventCategory | "guidelines">("guidelines");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [activeEventHash, setActiveEventHash] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize all cards expanded by default for direct readability, but allow toggling
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    EVENT_RULES.forEach((event) => {
      initial[event.id] = true;
    });
    setExpandedEvents(initial);
  }, []);

  // Handle URL hash navigation (e.g. /rules#football)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveEventHash(hash);
        setExpandedEvents((prev) => ({ ...prev, [hash]: true }));
        const targetEvent = EVENT_RULES.find((e) => e.id === hash);
        if (targetEvent) {
          setSelectedCategory(targetEvent.category);
        }
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const toggleEvent = (id: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    EVENT_RULES.forEach((e) => {
      all[e.id] = true;
    });
    setExpandedEvents(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    EVENT_RULES.forEach((e) => {
      all[e.id] = false;
    });
    setExpandedEvents(all);
  };

  const copyEventLink = (id: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/rules#${id}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return EVENT_RULES.filter((event) => {
      const matchesCategory =
        selectedCategory === "all" ||
        selectedCategory === "guidelines" ||
        event.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.tagline.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.teamSize.toLowerCase().includes(q) ||
        event.rules.some((r) => r.toLowerCase().includes(q)) ||
        event.keyHighlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const sportsCount = EVENT_RULES.filter((e) => e.category === "sports").length;
  const culturalCount = EVENT_RULES.filter((e) => e.category === "cultural").length;

  return (
    <div className="min-h-screen bg-[#060d23] text-white flex flex-col font-sans selection:bg-[#f69b22]/30 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#00b8e8]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#f69b22]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#fa6347]/10 rounded-full blur-[150px]" />
      </div>

      {/* Main Desktop Navbar */}
      <div className="relative z-50">
        <Navbar>
          <NavBody>
            <Link className="brand relative z-20" href="/" aria-label="SELAH 2026 home">
              <div className="transition-all duration-300 group-data-[shrunk=true]:w-0 group-data-[shrunk=true]:opacity-0 overflow-hidden whitespace-nowrap">
                <strong className="text-2xl text-white">
                  SELAH <span className="text-[#f69b22]">2026</span>
                </strong>
              </div>
            </Link>
            <NavItems
              items={[
                { name: "Home", link: "/" },
                { name: "Events", link: "/#events" },
                { name: "Rules", link: "/rules" },
                { name: "About CYA", link: "/about-cya" },
                { name: "Register", link: "/#pricing" },
              ]}
            />
          </NavBody>
        </Navbar>

        {/* Mobile Navigation */}
        <div className="relative z-50 lg:hidden">
          <StaggeredMenu
            isFixed={true}
            logo={
              <div className="brand relative z-20 flex items-center">
                <Link href="/" aria-label="SELAH 2026 home" style={{ textDecoration: "none" }}>
                  <strong className="text-2xl text-white">
                    SELAH <span className="text-[#f69b22]">2026</span>
                  </strong>
                </Link>
              </div>
            }
            items={[
              { label: "Home", link: "/" },
              { label: "Events", link: "/#events" },
              { label: "Rules", link: "/rules" },
              { label: "About CYA", link: "/about-cya" },
              { label: "Register", link: "/#pricing" },
            ] as any}
            colors={["#060d23", "#00b8e8", "#f69b22", "#fa6347"]}
            accentColor="#00b8e8"
            menuButtonColor="#93a2c4"
            openMenuButtonColor="#fff"
          />
        </div>
      </div>

      <main className="relative z-10 flex-1 pt-28 md:pt-36 pb-24">
        {/* Header Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6 pt-14">
              Event Rules
            </h1>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#101935] hover:bg-[#1a2852] border border-[#8b9abb]/20 text-[#d1dcff] hover:text-white transition-all shadow-sm"
              >
                <Printer size={15} />  Download Brochure
              </button>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#f69b22] to-[#fa6347] text-white hover:brightness-110 shadow-lg shadow-[#f69b22]/20 transition-all"
              >
                <Users size={15} /> Register Delegation
              </Link>
            </div>
          </div>


          {/* Interactive Search & Filter Controls */}
          <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter Pills */}
            <div className="flex items-center p-1.5 bg-[#0a1024]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-xl overflow-x-auto max-w-full">
              {[
                { key: "guidelines", label: "General Guidelines", icon: <ShieldAlert size={15} /> },
                { key: "sports", label: `Sports (${sportsCount})`, icon: <Medal size={15} /> },
                { key: "cultural", label: `Cultural (${culturalCount})`, icon: <Music2 size={15} /> },
              ].map((tab) => {
                const isActive = selectedCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key as any)}
                    className={`relative z-10 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      isActive ? "text-white" : "text-[#8492b1] hover:text-white/80"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRulesTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] z-[-1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b9abb]" size={17} />
              <input
                type="text"
                placeholder="Search events, rules, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#0a1024]/90 border border-white/10 rounded-full text-xs sm:text-sm text-white placeholder-[#8b9abb]/70 focus:outline-none focus:border-[#00b8e8] focus:ring-2 focus:ring-[#00b8e8]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8b9abb] hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* General Guidelines Banner (Shown when selected or on 'all' view) */}
          {(selectedCategory === "all" || selectedCategory === "guidelines") && !searchQuery && (
            <div className="max-w-5xl mx-auto mb-16 rounded-[28px] bg-gradient-to-b from-[#101935] to-[#0a1024] border border-[#8b9abb]/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#f69b22]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#00b8e8]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">General Rules</h2>
                </div>
                <div className="text-xs sm:text-sm text-[#8b9abb] max-w-sm">
                  Universal guidelines applicable to every participant, official, and supporter throughout the tournament.
                </div>
              </div>

              <div className="space-y-12">
                {/* Cultural Rules Sub-section */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-[#f69b22]/15 border border-[#f69b22]/30 flex items-center justify-center text-[#f69b22] shrink-0 shadow-[0_0_12px_rgba(246,155,34,0.2)]">
                      <Music2 size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                        Cultural Rules
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {CULTURAL_RULES.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-[#9aa9cb] leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-[#f69b22]/15 border border-[#f69b22]/30 text-[#f69b22] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(246,155,34,0.15)]">
                          <ChevronRight size={13} className="stroke-[2.5]" />
                        </span>
                        <div>
                          <strong className="text-white font-semibold">{rule.title}: </strong>
                          <span>{rule.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sport Rules Sub-section */}
                <div className="border-t border-white/10 pt-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-[#00b8e8]/15 border border-[#00b8e8]/30 flex items-center justify-center text-[#00b8e8] shrink-0 shadow-[0_0_12px_rgba(0,184,232,0.2)]">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                        Sport Rules
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {SPORT_RULES.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-[#9aa9cb] leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-[#00b8e8]/15 border border-[#00b8e8]/30 text-[#00b8e8] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,184,232,0.15)]">
                          <ChevronRight size={13} className="stroke-[2.5]" />
                        </span>
                        <div>
                          <strong className="text-white font-semibold">{rule.title}: </strong>
                          <span>{rule.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick Jump Index Pill Bar */}
          {selectedCategory !== "guidelines" && (
            <div className="max-w-5xl mx-auto mb-10 overflow-x-auto hide-scrollbar pb-2">
              <div className="flex items-center gap-2 whitespace-nowrap text-xs text-[#8b9abb]">
                <span className="font-bold uppercase tracking-wider text-white/50 shrink-0 mr-1">
                  Quick Jump:
                </span>
                {filteredEvents.map((e) => (
                  <a
                    key={e.id}
                    href={`#${e.id}`}
                    onClick={() => setActiveEventHash(e.id)}
                    className={`px-3 py-1.5 rounded-full transition-all border shrink-0 ${
                      activeEventHash === e.id
                        ? "bg-[#00b8e8]/20 border-[#00b8e8] text-white font-bold"
                        : "bg-[#0a1024] border-white/10 text-[#8b9abb] hover:text-white hover:border-white/20"
                    }`}
                  >
                    {e.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Event Rules List */}
          {selectedCategory !== "guidelines" && (
            <div className="max-w-5xl mx-auto space-y-8">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20 px-4 rounded-3xl bg-[#0a1024]/60 border border-white/10">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#8b9abb]">
                    <Search size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No matching events found</h3>
                  <p className="text-sm text-[#8b9abb] mb-6">
                    We couldn't find any events or rules matching &quot;{searchQuery}&quot;.
                  </p>
                </div>
              ) : (
                filteredEvents.map((event, eventIdx) => {
                  const isExpanded = !!expandedEvents[event.id];
                  const isSports = event.category === "sports";
                  const accentColor = isSports ? "#00b8e8" : "#f69b22";

                  return (
                    <article
                      key={event.id}
                      id={event.id}
                      className={`group rounded-[28px] bg-[#0a1024]/90 border transition-all duration-300 overflow-hidden shadow-2xl scroll-mt-28 ${
                        activeEventHash === event.id
                          ? "border-[#f69b22] shadow-[0_0_40px_rgba(246,155,34,0.15)] ring-1 ring-[#f69b22]/50"
                          : "border-[#8b9abb]/20 hover:border-white/30"
                      }`}
                    >
                      {/* Event Card Header with Hero Image Banner */}
                      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-[#060d23]">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          priority={eventIdx < 3}
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                        />
                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1024] via-[#0a1024]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1024]/90 via-[#0a1024]/40 to-transparent" />

                        {/* Title & Tagline in Header */}
                        <div className="absolute bottom-5 left-5 right-5 z-10">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                            {event.title}
                          </h2>
                        </div>
                      </div>

                      {/* Event Overview & Quick Specs Grid */}
                      <div className="p-6 sm:p-8">
                        {/* Quick Spec Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-[#060d23]/60 border border-white/5 text-xs sm:text-sm">
                          <div>
                            <div className="text-[11px] font-bold text-[#8b9abb] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <Users size={13} className="text-[#00b8e8]" /> Squad Size
                            </div>
                            <div className="font-bold text-white text-xs sm:text-sm">{event.teamSize}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#8b9abb] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <Clock size={13} className="text-[#f69b22]" /> Duration
                            </div>
                            <div className="font-bold text-white text-xs sm:text-sm">{event.duration}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#8b9abb] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <MapPin size={13} className="text-[#fa6347]" /> Venue
                            </div>
                            <div className="font-bold text-white text-xs sm:text-sm truncate" title={event.venue}>
                              {event.venue}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#8b9abb] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <Trophy size={13} className="text-yellow-400" /> Format
                            </div>
                            <div className="font-bold text-white text-xs sm:text-sm">{event.format}</div>
                          </div>
                        </div>

                        {/* Summary Description */}
                        <p className="text-sm sm:text-base text-[#aab5d1] leading-relaxed mb-6">
                          {event.overview}
                        </p>

                        {/* Key Highlights Checklist */}
                        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border-l-4 border-[#f69b22]">
                          <div className="text-xs font-bold text-[#ffbd61] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            Critical Highlights
                          </div>
                          <ul className="space-y-1.5 text-xs sm:text-sm text-white/90">
                            {event.keyHighlights.map((hl, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[#f69b22] font-bold">✓</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Expand / Collapse Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <button
                            onClick={() => toggleEvent(event.id)}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-[#00b8e8] transition-colors py-2"
                          >
                            <span>{isExpanded ? "Hide Full Rules & Scoring" : "View Full Rules & Scoring Breakdown"}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>

                        {/* Accordion Expandable Detailed Rules Section */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 mt-4 border-t border-white/5 space-y-6">
                                {/* Complete Rules & Regulations */}
                                <div>
                                  <h3 className="text-base sm:text-lg font-bold text-white mb-4 pb-4 flex items-center gap-2">
                                     Complete Rules & Regulations
                                  </h3>
                                  <ol className="space-y-3">
                                    {event.rules.map((rule, rIdx) => (
                                      <li
                                        key={rIdx}
                                        className="flex items-start gap-3 text-xs sm:text-sm text-[#9aa9cb] leading-relaxed"
                                      >
                                        <span className="w-5 h-5 rounded-full bg-[#00b8e8]/15 border border-[#00b8e8]/30 flex items-center justify-center text-[11px] font-bold text-[#00b8e8] shrink-0 mt-0.5">
                                          {rIdx + 1}
                                        </span>
                                        <span className="text-white/90">{rule}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>

                                {/* Judging & Evaluation Breakdown */}
                                {event.judgingCriteria && event.judgingCriteria.length > 0 && (
                                  <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                                      <Trophy size={18} className="text-[#f69b22]" /> Judging &amp; Scoring Criteria
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                      {event.judgingCriteria.map((crit, cIdx) => (
                                        <div
                                          key={cIdx}
                                          className="p-3.5 rounded-xl bg-[#060d23]/80 border border-white/10"
                                        >
                                          <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-bold text-white text-xs sm:text-sm">
                                              {crit.criterion}
                                            </span>
                                            <span className="text-xs font-black text-[#f69b22] px-2 py-0.5 rounded-full bg-[#f69b22]/15 border border-[#f69b22]/30">
                                              {crit.weight}%
                                            </span>
                                          </div>
                                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                                            <div
                                              className="h-full bg-gradient-to-r from-[#f69b22] to-[#fa6347] rounded-full"
                                              style={{ width: `${crit.weight}%` }}
                                            />
                                          </div>
                                          <p className="text-[11px] text-[#8b9abb] leading-normal">
                                            {crit.description}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

        </div>
      </main>

      {/* Common Shared Footer */}
      <Footer />
    </div>
  );
}

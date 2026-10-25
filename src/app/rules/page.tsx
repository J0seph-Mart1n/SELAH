"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/web/Navbar";
import Footer from "@/components/web/Footer";
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
  // Initialize category based on URL hash if arriving with a specific event target (e.g. /rules#football)
  const [selectedCategory, setSelectedCategory] = useState<"all" | EventCategory | "guidelines">(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      const targetEvent = EVENT_RULES.find((e) => e.id.toLowerCase() === hash);
      if (targetEvent) {
        return targetEvent.category;
      }
    }
    return "guidelines";
  });
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

  // Smoothly scroll to the target event with retries until rendered
  const scrollToEventRule = (hash: string) => {
    if (!hash) return;
    const cleanHash = hash.replace("#", "").toLowerCase();
    const targetEvent = EVENT_RULES.find((e) => e.id.toLowerCase() === cleanHash);
    if (targetEvent) {
      setSelectedCategory(targetEvent.category);
      setExpandedEvents((prev) => ({ ...prev, [targetEvent.id]: true }));
      setActiveEventHash(targetEvent.id);
    } else {
      setActiveEventHash(cleanHash);
    }

    let attempts = 0;
    const maxAttempts = 25;
    const interval = setInterval(() => {
      attempts++;
      const element = document.getElementById(cleanHash) || (targetEvent ? document.getElementById(targetEvent.id) : null);
      if (element) {
        clearInterval(interval);
        // Calculate offset so sticky navbar does not overlap the card title
        const headerOffset = 110;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);
  };

  // Handle URL hash navigation on mount and hashchange
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        scrollToEventRule(window.location.hash);
      }
    };

    // Run on initial page load / client navigation
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
    <div className="min-h-screen bg-[#611e3c] text-[#fff1cb] flex flex-col font-sans selection:bg-[#63752e]/30 selection:text-[#fff1cb]">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#63752e]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#fff1cb]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#611e3c] rounded-full blur-[150px]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 pt-28 md:pt-36 pb-24">
        {/* Header Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#fff1cb] tracking-tight leading-[1.08] mb-6 pt-14">
              Event Rules
            </h1>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#63752e] hover:bg-[#63752e]/85 text-[#fff1cb] shadow-lg shadow-[#63752e]/25 transition-all"
              >
                <Users size={15} /> Register Delegation
              </Link>
            </div>
          </div>


          {/* Interactive Search & Filter Controls */}
          <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter Pills */}
            <div className="flex items-center p-1.5 bg-[#fff1cb] border border-[#63752e]/30 rounded-full shadow-xl overflow-x-auto max-w-full">
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
                      isActive ? "text-[#fff1cb]" : "text-[#611e3c]/80 hover:text-[#611e3c]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRulesTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#63752e] to-[#63752e]/90 rounded-full shadow-[0_0_20px_rgba(99,117,46,0.4)] z-[-1]"
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#611e3c]/70" size={17} />
              <input
                type="text"
                placeholder="Search events, rules, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#fff1cb] border border-[#63752e]/30 focus:border-[#63752e] rounded-full text-xs sm:text-sm text-[#611e3c] placeholder-[#611e3c]/50 focus:outline-none focus:ring-2 focus:ring-[#63752e]/25 shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#611e3c]/70 hover:text-[#611e3c]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* General Guidelines Banner (Shown when selected or on 'all' view) */}
          {(selectedCategory === "all" || selectedCategory === "guidelines") && !searchQuery && (
            <div className="max-w-5xl mx-auto mb-16 rounded-[28px] bg-[#fff1cb] border border-[#63752e]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-[#611e3c]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#63752e]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#611e3c]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#611e3c]/15">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#611e3c]">General Rules</h2>
                </div>
                <div className="text-xs sm:text-sm text-[#611e3c]/75 max-w-sm">
                  Universal guidelines applicable to every participant, official, and supporter throughout the tournament.
                </div>
              </div>

              <div className="space-y-12">
                {/* Cultural Rules Sub-section */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#611e3c]/15">
                    <div className="w-9 h-9 rounded-xl bg-[#63752e] flex items-center justify-center text-[#fff1cb] shrink-0 shadow-md">
                      <Music2 size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#611e3c] tracking-wide">
                        Cultural Rules
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {CULTURAL_RULES.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-[#611e3c]/85 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-[#63752e] text-[#fff1cb] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <ChevronRight size={13} className="stroke-[2.5]" />
                        </span>
                        <div>
                          <strong className="text-[#611e3c] font-bold">{rule.title}: </strong>
                          <span>{rule.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sport Rules Sub-section */}
                <div className="border-t border-[#611e3c]/15 pt-10">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#611e3c]/15">
                    <div className="w-9 h-9 rounded-xl bg-[#63752e] flex items-center justify-center text-[#fff1cb] shrink-0 shadow-md">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#611e3c] tracking-wide">
                        Sport Rules
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {SPORT_RULES.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-[#611e3c]/85 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-[#63752e] text-[#fff1cb] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <ChevronRight size={13} className="stroke-[2.5]" />
                        </span>
                        <div>
                          <strong className="text-[#611e3c] font-bold">{rule.title}: </strong>
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
              <div className="flex items-center gap-2 whitespace-nowrap text-xs text-[#fff1cb]/80">
                <span className="font-bold uppercase tracking-wider text-[#fff1cb]/70 shrink-0 mr-1">
                  Quick Jump:
                </span>
                {filteredEvents.map((e) => (
                  <a
                    key={e.id}
                    href={`#${e.id}`}
                    onClick={(evt) => {
                      evt.preventDefault();
                      window.history.pushState(null, "", `#${e.id}`);
                      scrollToEventRule(e.id);
                    }}
                    style={{ color: activeEventHash === e.id ? '#fff1cb' : '#611e3c' }}
                    className={`px-3 py-1.5 rounded-full transition-all border shrink-0 font-bold ${
                      activeEventHash === e.id
                        ? "bg-[#63752e] border-[#63752e] shadow-[0_0_15px_rgba(99,117,46,0.4)]"
                        : "bg-[#fff1cb] border-[#63752e]/30 hover:border-[#63752e]"
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
                <div className="text-center py-20 px-4 rounded-3xl bg-[#fff1cb] border border-[#63752e]/30 text-[#611e3c]">
                  <div className="w-16 h-16 rounded-full bg-[#63752e]/10 border border-[#63752e]/20 flex items-center justify-center mx-auto mb-4 text-[#63752e]">
                    <Search size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#611e3c] mb-2">No matching events found</h3>
                  <p className="text-sm text-[#611e3c]/70 mb-6">
                    We couldn't find any events or rules matching &quot;{searchQuery}&quot;.
                  </p>
                </div>
              ) : (
                filteredEvents.map((event, eventIdx) => {
                  const isExpanded = !!expandedEvents[event.id];

                  return (
                    <article
                      key={event.id}
                      id={event.id}
                      className={`group rounded-[28px] bg-[#fff1cb] text-[#611e3c] border transition-all duration-300 overflow-hidden shadow-2xl scroll-mt-28 ${
                        activeEventHash === event.id
                          ? "border-[#63752e] shadow-[0_0_40px_rgba(99,117,46,0.3)] ring-2 ring-[#63752e]"
                          : "border-[#63752e]/30 hover:border-[#63752e]"
                      }`}
                    >
                      {/* Event Card Header with Hero Image Banner */}
                      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-[#611e3c]">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          priority={eventIdx < 3}
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                        {/* Title & Tagline in Header */}
                        <div className="absolute bottom-5 left-5 right-5 z-10">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fff1cb] tracking-tight drop-shadow-lg">
                            {event.title}
                          </h2>
                        </div>
                      </div>

                      {/* Event Overview & Quick Specs Grid */}
                      <div className="p-6 sm:p-8">
                        {/* Quick Spec Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-[#611e3c]/5 border border-[#63752e]/25 text-xs sm:text-sm">
                          <div>
                            <div className="text-[11px] font-bold text-[#63752e] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <Users size={13} className="text-[#63752e]" /> Squad Size
                            </div>
                            <div className="font-extrabold text-[#611e3c] text-xs sm:text-sm">{event.teamSize}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#63752e] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <Clock size={13} className="text-[#63752e]" /> Duration
                            </div>
                            <div className="font-extrabold text-[#611e3c] text-xs sm:text-sm">{event.duration}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#63752e] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <MapPin size={13} className="text-[#63752e]" /> Venue
                            </div>
                            <div className="font-extrabold text-[#611e3c] text-xs sm:text-sm truncate" title={event.venue}>
                              {event.venue}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#63752e] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <Trophy size={13} className="text-[#63752e]" /> Format
                            </div>
                            <div className="font-extrabold text-[#611e3c] text-xs sm:text-sm">{event.format}</div>
                          </div>
                        </div>

                        {/* Summary Description */}
                        <p className="text-sm sm:text-base text-[#611e3c]/90 font-medium leading-relaxed mb-6">
                          {event.overview}
                        </p>

                        {/* Expand / Collapse Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#611e3c]/15">
                          <button
                            onClick={() => toggleEvent(event.id)}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#611e3c] hover:text-[#63752e] transition-colors py-2"
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
                              <div className="pt-6 mt-4 border-t border-[#611e3c]/10 space-y-6">
                                {/* Complete Rules & Regulations */}
                                <div>
                                  <h3 className="text-base sm:text-lg font-bold text-[#611e3c] mb-4 pb-4 flex items-center gap-2 border-b border-[#611e3c]/10">
                                     Complete Rules & Regulations
                                  </h3>
                                  <ol className="space-y-3">
                                    {event.rules.map((rule, rIdx) => (
                                      <li
                                        key={rIdx}
                                        className="flex items-start gap-3 text-xs sm:text-sm text-[#611e3c]/90 leading-relaxed font-medium"
                                      >
                                        <span className="w-5 h-5 rounded-full bg-[#63752e] flex items-center justify-center text-[11px] font-bold text-[#fff1cb] shrink-0 mt-0.5 shadow-sm">
                                          {rIdx + 1}
                                        </span>
                                        <span>{rule}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>

                                {/* Judging & Evaluation Breakdown */}
                                {event.judgingCriteria && event.judgingCriteria.length > 0 && (
                                  <div>
                                    <h3 className="text-base sm:text-lg font-bold text-[#611e3c] mb-4 flex items-center gap-2">
                                      <Trophy size={18} className="text-[#63752e]" /> Judging &amp; Scoring Criteria
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                      {event.judgingCriteria.map((crit, cIdx) => (
                                        <div
                                          key={cIdx}
                                          className="p-3.5 rounded-xl bg-[#611e3c]/5 border border-[#63752e]/25"
                                        >
                                          <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-bold text-[#611e3c] text-xs sm:text-sm">
                                              {crit.criterion}
                                            </span>
                                            <span className="text-xs font-black text-[#fff1cb] px-2 py-0.5 rounded-full bg-[#63752e]">
                                              {crit.weight}%
                                            </span>
                                          </div>
                                          <div className="w-full h-1.5 rounded-full bg-[#611e3c]/15 overflow-hidden mb-2">
                                            <div
                                              className="h-full bg-gradient-to-r from-[#63752e] to-[#611e3c] rounded-full"
                                              style={{ width: `${crit.weight}%` }}
                                            />
                                          </div>
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

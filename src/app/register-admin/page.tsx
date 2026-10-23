"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  Copy,
  Check,
  Trophy,
  Users,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  FileSpreadsheet,
  X,
  Building,
  Hash,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  gender?: string;
  role?: string;
  notes?: string;
}

interface EventRegistration {
  eventId: string;
  title: string;
  type?: "group" | "individual";
  fee?: number;
  participants: Participant[];
}

interface RegistrationRecord {
  registrationId: string;
  timestamp: string;
  parishDetails: {
    parishName: string;
    representativeName: string;
    contactNumber: string;
    email: string;
  };
  totalFee: number;
  eventsCount?: number;
  totalParticipants?: number;
  events: Record<string, EventRegistration>;
}

export default function RegisterAdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Data states
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [deleteCandidate, setDeleteCandidate] = useState<RegistrationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState<"newest" | "oldest" | "fee-desc" | "fee-asc">("newest");

  // Fetch registrations on mount or when authenticated
  const fetchRegistrations = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/registrations");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setRegistrations([]);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setRegistrations(data.registrations || []);
        setFirestoreConnected(Boolean(data.firestoreConnected));
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setIsAuthenticated(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
        await fetchRegistrations();
      } else {
        setAuthError(data.error || "Invalid username or password.");
      }
    } catch {
      setAuthError("Failed to connect to authentication service.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuthenticated(false);
    setRegistrations([]);
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle card expansion
  const toggleExpand = (regId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [regId]: !prev[regId],
    }));
  };

  // Expand all / Collapse all
  const toggleAll = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    if (expand) {
      filteredRegistrations.forEach((r) => {
        updated[r.registrationId] = true;
      });
    }
    setExpandedCards(updated);
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: deleteCandidate.registrationId }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.filter((item) => item.registrationId !== deleteCandidate.registrationId)
        );
        setDeleteCandidate(null);
      } else {
        alert(data.error || "Failed to delete registration.");
      }
    } catch (err: any) {
      alert("Error deleting registration: " + err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract all unique events registered across all submissions for filter dropdown
  const allAvailableEvents = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      if (r.events) {
        Object.values(r.events).forEach((ev) => {
          if (ev.title) set.add(ev.title);
        });
      }
    });
    return Array.from(set).sort();
  }, [registrations]);

  // Filter & Sort
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((record) => {
        // Query match
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          record.registrationId?.toLowerCase().includes(q) ||
          record.parishDetails?.parishName?.toLowerCase().includes(q) ||
          record.parishDetails?.representativeName?.toLowerCase().includes(q) ||
          record.parishDetails?.contactNumber?.includes(q) ||
          record.parishDetails?.email?.toLowerCase().includes(q);

        // Event filter match
        let matchesEvent = true;
        if (selectedEventFilter !== "all") {
          matchesEvent = Object.values(record.events || {}).some(
            (ev) => ev.title === selectedEventFilter || ev.eventId === selectedEventFilter
          );
        }

        return matchesQuery && matchesEvent;
      })
      .sort((a, b) => {
        if (selectedSort === "newest") {
          return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
        }
        if (selectedSort === "oldest") {
          return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
        }
        if (selectedSort === "fee-desc") {
          return (b.totalFee || 0) - (a.totalFee || 0);
        }
        if (selectedSort === "fee-asc") {
          return (a.totalFee || 0) - (b.totalFee || 0);
        }
        return 0;
      });
  }, [registrations, searchQuery, selectedEventFilter, selectedSort]);

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalParticipants = 0;
    let totalEventSlots = 0;

    registrations.forEach((r) => {
      totalRevenue += r.totalFee || 0;
      if (r.events) {
        Object.values(r.events).forEach((ev) => {
          totalEventSlots += 1;
          totalParticipants += ev.participants?.length || 0;
        });
      }
    });

    return {
      totalParishes: registrations.length,
      totalRevenue,
      totalParticipants,
      totalEventSlots,
    };
  }, [registrations]);

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    const rows: string[][] = [
      [
        "Registration ID",
        "Submission Timestamp",
        "Parish Name",
        "Representative Name",
        "Contact Number",
        "Email",
        "Event Title",
        "Event Category",
        "Event Type",
        "Event Fee",
        "Participant Name",
        "Participant Gender",
        "Participant Role",
        "Participant Notes",
        "Total Parish Fee",
      ],
    ];

    registrations.forEach((r) => {
      const regId = r.registrationId;
      const time = r.timestamp ? new Date(r.timestamp).toLocaleString("en-IN") : "";
      const pName = r.parishDetails?.parishName || "";
      const repName = r.parishDetails?.representativeName || "";
      const phone = r.parishDetails?.contactNumber || "";
      const email = r.parishDetails?.email || "";
      const totalFee = r.totalFee?.toString() || "0";

      const eventsList = Object.values(r.events || {});
      if (eventsList.length === 0) {
        rows.push([
          regId,
          time,
          `"${pName}"`,
          `"${repName}"`,
          phone,
          email,
          "None",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          totalFee,
        ]);
      } else {
        eventsList.forEach((ev: any) => {
          const evTitle = ev.title || "";
          const evCategory = ev.category || "";
          const evType = ev.type || "";
          const evFee = ev.fee?.toString() || "0";

          if (!ev.participants || ev.participants.length === 0) {
            rows.push([
              regId,
              time,
              `"${pName}"`,
              `"${repName}"`,
              phone,
              email,
              `"${evTitle}"`,
              evCategory,
              evType,
              evFee,
              "No Participants",
              "",
              "",
              "",
              totalFee,
            ]);
          } else {
            ev.participants.forEach((part: Participant) => {
              rows.push([
                regId,
                time,
                `"${pName}"`,
                `"${repName}"`,
                phone,
                email,
                `"${evTitle}"`,
                evCategory,
                evType,
                evFee,
                `"${part.name || ""}"`,
                part.gender || "",
                `"${part.role || ""}"`,
                `"${(part.notes || "").replace(/"/g, '""')}"`,
                totalFee,
              ]);
            });
          }
        });
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SELAH_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07070b] flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full mb-4"
        />
        <p className="text-slate-400 text-sm tracking-wide font-medium">Loading SELAH Admin Portal...</p>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-amber-600/15 via-rose-600/10 to-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10">
          {/* Header Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to SELAH 2026
            </Link>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                SELAH <span className="text-amber-400">Admin</span> Portal
              </h1>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-username-input"
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-submit"
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wide text-white">SELAH 2026</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Admin Console
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    firestoreConnected ? "bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span className="text-[11px] text-slate-400">
                  {firestoreConnected ? "Live Firebase Firestore" : "Local Database Mode"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/register"
              className="text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>View Registration Form</span>
            </Link>

            <button
              onClick={fetchRegistrations}
              disabled={loadingData}
              title="Refresh Firestore Data"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              title="Export all submissions to CSV"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              title="Log out of Admin Portal"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">Total Parishes</span>
              <Building className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{metrics.totalParishes}</div>
            <p className="text-[11px] text-slate-400 mt-1">Parish teams registered</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">Total Revenue</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              ₹{metrics.totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total registration fees</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">Participants</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{metrics.totalParticipants}</div>
            <p className="text-[11px] text-slate-400 mt-1">Youth participants registered</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">Event Entries</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{metrics.totalEventSlots}</div>
            <p className="text-[11px] text-slate-400 mt-1">Sports & Cultural slots</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by parish, representative, ID, phone, email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Event Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 hidden sm:block shrink-0" />
              <select
                id="admin-event-filter"
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-all"
              >
                <option value="all">All Events ({allAvailableEvents.length})</option>
                {allAvailableEvents.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                id="admin-sort-filter"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="fee-desc">Fee: High to Low</option>
                <option value="fee-asc">Fee: Low to High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>
              Showing <strong className="text-white">{filteredRegistrations.length}</strong> of{" "}
              <strong className="text-white">{registrations.length}</strong> registrations
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleAll(true)}
                className="hover:text-amber-400 transition-colors text-[11px]"
              >
                Expand All
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => toggleAll(false)}
                className="hover:text-amber-400 transition-colors text-[11px]"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        {filteredRegistrations.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-12 text-center">
            <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Registrations Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              {searchQuery || selectedEventFilter !== "all"
                ? "No submissions matched your search criteria. Try resetting your search or filter."
                : "No registrations have been received in Firestore yet."}
            </p>
            {(searchQuery || selectedEventFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedEventFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((record) => {
              const regId = record.registrationId;
              const isExpanded = Boolean(expandedCards[regId]);
              const eventList = Object.values(record.events || {});
              const dateStr = record.timestamp
                ? new Date(record.timestamp).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A";

              return (
                <div
                  key={regId}
                  className="bg-slate-900/70 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-slate-700/80 shadow-lg"
                >
                  {/* Card Main Row */}
                  <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Parish Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
                          <Hash className="w-3 h-3 text-amber-400" />
                          {regId}
                        </span>

                        <button
                          onClick={() => handleCopy(regId, `id-${regId}`)}
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                          title="Copy Registration ID"
                        >
                          {copiedId === `id-${regId}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white tracking-wide">
                        {record.parishDetails?.parishName || "Unnamed Parish"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {record.parishDetails?.representativeName || "Representative"}
                        </span>

                        {record.parishDetails?.contactNumber && (
                          <a
                            href={`tel:${record.parishDetails.contactNumber}`}
                            className="flex items-center gap-1 text-amber-400/90 hover:underline"
                          >
                            <Phone className="w-3 h-3 text-amber-400" />
                            {record.parishDetails.contactNumber}
                          </a>
                        )}

                        {record.parishDetails?.email && (
                          <a
                            href={`mailto:${record.parishDetails.email}`}
                            className="flex items-center gap-1 text-slate-400 hover:text-white"
                          >
                            <Mail className="w-3 h-3 text-slate-400" />
                            {record.parishDetails.email}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Middle: Events & Fee Badge */}
                    <div className="flex items-center gap-3 self-start lg:self-center">
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-slate-400">Total Fee</div>
                        <div className="text-xl font-black text-emerald-400">
                          ₹{(record.totalFee || 0).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="h-8 w-px bg-slate-800 hidden sm:block" />

                      <div className="flex flex-col gap-1">
                        <div className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-medium text-center">
                          {eventList.length} {eventList.length === 1 ? "Event" : "Events"}
                        </div>
                      </div>
                    </div>

                    {/* Right: Expand/Collapse & Delete */}
                    <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      <button
                        onClick={() => toggleExpand(regId)}
                        className="flex-1 lg:flex-initial px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteCandidate(record)}
                        title="Delete this registration record"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-800 bg-slate-950/60 p-5 space-y-6"
                      >
                        {/* Section 1: Parish & Registration Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Parish Details Card */}
                          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5" /> Parish & Contact Info
                            </h4>
                            <div className="text-xs space-y-1.5 text-slate-300">
                              <div>
                                <span className="text-slate-500">Parish: </span>
                                <strong className="text-white">{record.parishDetails?.parishName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500">Representative: </span>
                                {record.parishDetails?.representativeName}
                              </div>
                              <div>
                                <span className="text-slate-500">Contact Phone: </span>
                                <a
                                  href={`tel:${record.parishDetails?.contactNumber}`}
                                  className="text-amber-400 hover:underline font-mono"
                                >
                                  {record.parishDetails?.contactNumber}
                                </a>
                              </div>
                              <div>
                                <span className="text-slate-500">Email: </span>
                                <a
                                  href={`mailto:${record.parishDetails?.email}`}
                                  className="text-slate-300 hover:underline"
                                >
                                  {record.parishDetails?.email}
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Registration Fee & Summary Card */}
                          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5" /> Registration Fee Summary
                            </h4>
                            <div className="text-xs space-y-1.5 text-slate-300">
                              <div>
                                <span className="text-slate-500">Total Fee: </span>
                                <strong className="text-emerald-400 font-mono text-sm">
                                  ₹{(record.totalFee || 0).toLocaleString("en-IN")}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-500">Registered Events: </span>
                                <span className="text-slate-200 font-medium">
                                  {eventList.length} {eventList.length === 1 ? "Event" : "Events"}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Submitted On: </span>
                                <span className="text-slate-300">
                                  {record.timestamp ? new Date(record.timestamp).toLocaleString("en-IN") : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Events & Participants List */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Registered Events (
                              {eventList.length})
                            </span>
                            <span className="text-[11px] font-normal text-slate-400">
                              Participants table breakdown
                            </span>
                          </h4>

                          {eventList.map((ev) => (
                            <div
                              key={ev.eventId || ev.title}
                              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden"
                            >
                              <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-white">{ev.title}</span>
                                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                    {ev.type || "event"}
                                  </span>
                                </div>
                                <span className="font-mono text-xs font-semibold text-emerald-400">
                                  ₹{(ev.fee || 0).toLocaleString("en-IN")}
                                </span>
                              </div>

                              {/* Participants Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-950/40 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/60">
                                    <tr>
                                      <th className="py-2 px-4">#</th>
                                      <th className="py-2 px-4">Participant Name</th>
                                      <th className="py-2 px-4">Gender</th>
                                      <th className="py-2 px-4">Role / Category</th>
                                      <th className="py-2 px-4">Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800/50">
                                    {ev.participants && ev.participants.length > 0 ? (
                                      ev.participants.map((p, idx) => (
                                        <tr key={p.id || idx} className="hover:bg-slate-800/20">
                                          <td className="py-2.5 px-4 text-slate-500 font-mono">{idx + 1}</td>
                                          <td className="py-2.5 px-4 font-semibold text-white">{p.name}</td>
                                          <td className="py-2.5 px-4">
                                            {p.gender === "Female" ? (
                                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/30">
                                                Female
                                              </span>
                                            ) : p.gender === "Male" ? (
                                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                                                Male
                                              </span>
                                            ) : (
                                              <span className="text-slate-500">-</span>
                                            )}
                                          </td>
                                          <td className="py-2.5 px-4 text-slate-300">{p.role || "Participant"}</td>
                                          <td className="py-2.5 px-4 text-slate-400 italic">
                                            {p.notes || "-"}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={5} className="py-3 px-4 text-center text-slate-500">
                                          No participants listed
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Delete Registration</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete registration{" "}
                <strong className="text-white font-mono">{deleteCandidate.registrationId}</strong> for{" "}
                <strong className="text-amber-400">{deleteCandidate.parishDetails?.parishName}</strong>?
                This will remove it from both Firebase Cloud Firestore and local storage.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                >
                  {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Delete Record</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

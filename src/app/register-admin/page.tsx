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
  Pencil,
  Plus,
  Save,
} from "lucide-react";
import {
  REGISTRATION_EVENTS,
  PAYMENT_DETAILS,
  RegistrationEventConfig,
} from "@/app/register/data/registrationEvents";

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
  category?: string;
  type?: "group" | "individual";
  fee?: number;
  participants: Participant[];
}

interface RegistrationRecord {
  id?: string;
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
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Edit Registration Modal states
  const [editCandidate, setEditCandidate] = useState<RegistrationRecord | null>(null);
  const [editParishDetails, setEditParishDetails] = useState({
    parishName: "",
    representativeName: "",
    contactNumber: "",
    email: "",
  });
  const [editEvents, setEditEvents] = useState<Record<string, EventRegistration>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Add Event Modal states
  const [addEventRecord, setAddEventRecord] = useState<RegistrationRecord | null>(null);
  const [selectedAddEventId, setSelectedAddEventId] = useState<string>("");
  const [addEventParticipants, setAddEventParticipants] = useState<Participant[]>([]);
  const [isSavingAddEvent, setIsSavingAddEvent] = useState(false);
  const [addEventError, setAddEventError] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState<"newest" | "oldest" | "fee-desc" | "fee-asc">("newest");

  // Fetch registrations on mount or when authenticated
  const fetchRegistrations = async (isManualRefresh = false) => {
    setLoadingData(true);
    try {
      const url = isManualRefresh
        ? "/api/admin/registrations?refresh=true"
        : "/api/admin/registrations";

      const token = typeof window !== "undefined" ? sessionStorage.getItem("selah_admin_token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        headers,
        credentials: "include",
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("selah_admin_token");
        }
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
        credentials: "include",
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token && typeof window !== "undefined") {
          sessionStorage.setItem("selah_admin_token", data.token);
        }
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selah_admin_token");
    }
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
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
    setDeleteError(null);
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("selah_admin_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/admin/registrations", {
        method: "DELETE",
        headers,
        credentials: "include",
        body: JSON.stringify({
          registrationId: deleteCandidate.registrationId,
          id: (deleteCandidate as any).id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) =>
          prev.filter((item) => {
            const matchRegId =
              deleteCandidate.registrationId &&
              item.registrationId === deleteCandidate.registrationId;
            const matchId =
              (deleteCandidate as any).id &&
              ((item as any).id === (deleteCandidate as any).id ||
                item.registrationId === (deleteCandidate as any).id);
            return !matchRegId && !matchId;
          })
        );
        setDeleteCandidate(null);
        setDeleteError(null);
      } else {
        setDeleteError(data.error || "Failed to delete registration.");
      }
    } catch (err: any) {
      setDeleteError("Error deleting registration: " + (err?.message || "Network error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper: Calculate single event fee based on type and participant count
  const computeEventFee = (type: "group" | "individual" | undefined, participantsCount: number) => {
    if (type === "individual") {
      return participantsCount * PAYMENT_DETAILS.individualFee;
    }
    return PAYMENT_DETAILS.groupFee;
  };

  // Helper: Calculate total fee across an events dictionary
  const computeEventsTotalFee = (eventsMap: Record<string, EventRegistration>) => {
    return Object.values(eventsMap).reduce((sum, ev) => {
      const count = ev.participants?.length || 0;
      const fee =
        typeof ev.fee === "number" && !isNaN(ev.fee)
          ? ev.fee
          : computeEventFee(ev.type, count);
      return sum + fee;
    }, 0);
  };

  // Open Edit Modal for a registration entry
  const handleOpenEditModal = (record: RegistrationRecord) => {
    setEditError(null);
    setEditCandidate(record);
    setEditParishDetails({
      parishName: record.parishDetails?.parishName || "",
      representativeName: record.parishDetails?.representativeName || "",
      contactNumber: record.parishDetails?.contactNumber || "",
      email: record.parishDetails?.email || "",
    });
    // Deep clone events so local edits don't mutate card state prior to saving
    const clonedEvents: Record<string, EventRegistration> = {};
    Object.entries(record.events || {}).forEach(([key, ev]) => {
      const evConfig = REGISTRATION_EVENTS.find(
        (c) => c.id === key || c.id === ev.eventId || c.title === ev.title
      );
      const evType = ev.type || evConfig?.type || "group";
      const participants = (ev.participants || []).map((p, idx) => ({
        id: p.id || `${key}-p-${idx}`,
        name: p.name || "",
        gender: p.gender || "",
        role: p.role || "Participant",
        notes: p.notes || "",
      }));
      clonedEvents[key] = {
        ...ev,
        eventId: ev.eventId || key,
        title: ev.title || evConfig?.title || key,
        category: ev.category || evConfig?.category,
        type: evType,
        fee: computeEventFee(evType, participants.length),
        participants,
      };
    });
    setEditEvents(clonedEvents);
  };

  // Edit Modal: Update participant field
  const handleEditParticipantChange = (
    eventKey: string,
    participantId: string,
    field: keyof Participant,
    value: string
  ) => {
    setEditEvents((prev) => {
      const currentEv = prev[eventKey];
      if (!currentEv) return prev;
      const updatedParticipants = currentEv.participants.map((p) =>
        p.id === participantId ? { ...p, [field]: value } : p
      );
      return {
        ...prev,
        [eventKey]: {
          ...currentEv,
          participants: updatedParticipants,
        },
      };
    });
  };

  // Edit Modal: Add participant to an existing event
  const handleEditAddParticipant = (eventKey: string) => {
    setEditEvents((prev) => {
      const currentEv = prev[eventKey];
      if (!currentEv) return prev;
      const evConfig = REGISTRATION_EVENTS.find(
        (c) => c.id === eventKey || c.id === currentEv.eventId || c.title === currentEv.title
      );
      const defaultGender =
        evConfig?.genderRestriction === "boys-only"
          ? "Male"
          : evConfig?.genderRestriction === "girls-only"
          ? "Female"
          : "";
      const defaultRole =
        evConfig &&
        currentEv.participants.length >= evConfig.minParticipants &&
        evConfig.defaultRoles.includes("Substitute")
          ? "Substitute"
          : evConfig?.defaultRoles[0] || "Participant";

      const newParticipant: Participant = {
        id: `${eventKey}-p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: "",
        gender: defaultGender,
        role: defaultRole,
        notes: "",
      };
      const updatedParticipants = [...currentEv.participants, newParticipant];
      return {
        ...prev,
        [eventKey]: {
          ...currentEv,
          fee: computeEventFee(currentEv.type, updatedParticipants.length),
          participants: updatedParticipants,
        },
      };
    });
  };

  // Edit Modal: Remove participant from an existing event
  const handleEditRemoveParticipant = (eventKey: string, participantId: string) => {
    setEditEvents((prev) => {
      const currentEv = prev[eventKey];
      if (!currentEv) return prev;
      if (currentEv.participants.length <= 1) {
        setEditError(`"${currentEv.title}" must have at least 1 participant. Remove the event instead if not needed.`);
        return prev;
      }
      const updatedParticipants = currentEv.participants.filter((p) => p.id !== participantId);
      return {
        ...prev,
        [eventKey]: {
          ...currentEv,
          fee: computeEventFee(currentEv.type, updatedParticipants.length),
          participants: updatedParticipants,
        },
      };
    });
  };

  // Edit Modal: Remove an entire event from registration
  const handleEditRemoveEvent = (eventKey: string) => {
    setEditEvents((prev) => {
      const keys = Object.keys(prev);
      if (keys.length <= 1) {
        setEditError("A registration entry must have at least one registered event.");
        return prev;
      }
      const next = { ...prev };
      delete next[eventKey];
      return next;
    });
  };

  // Save Edited Registration
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCandidate) return;
    setEditError(null);

    if (
      !editParishDetails.parishName.trim() ||
      !editParishDetails.representativeName.trim() ||
      !editParishDetails.contactNumber.trim() ||
      !editParishDetails.email.trim()
    ) {
      setEditError("Please fill in all Parish and Representative details.");
      return;
    }

    const eventEntries = Object.entries(editEvents);
    if (eventEntries.length === 0) {
      setEditError("At least one event is required in the registration.");
      return;
    }

    for (const [, ev] of eventEntries) {
      if (!ev.participants || ev.participants.length === 0) {
        setEditError(`Event "${ev.title}" must have at least one participant.`);
        return;
      }
      for (const p of ev.participants) {
        if (!p.name?.trim()) {
          setEditError(`Please enter a name for all participants in "${ev.title}".`);
          return;
        }
        if (p.gender !== "Male" && p.gender !== "Female") {
          setEditError(`Please select gender (Male or Female) for all participants in "${ev.title}".`);
          return;
        }
      }
    }

    setIsSavingEdit(true);
    try {
      const calculatedTotalFee = computeEventsTotalFee(editEvents);
      const token = typeof window !== "undefined" ? sessionStorage.getItem("selah_admin_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/admin/registrations", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({
          registrationId: editCandidate.registrationId,
          id: editCandidate.id,
          timestamp: editCandidate.timestamp,
          parishDetails: editParishDetails,
          events: editEvents,
          totalFee: calculatedTotalFee,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) =>
          prev.map((item) =>
            item.registrationId === editCandidate.registrationId
              ? {
                  ...item,
                  parishDetails: {
                    parishName: editParishDetails.parishName.trim(),
                    representativeName: editParishDetails.representativeName.trim(),
                    contactNumber: editParishDetails.contactNumber.trim(),
                    email: editParishDetails.email.trim(),
                  },
                  events: editEvents,
                  eventsCount: Object.keys(editEvents).length,
                  totalFee: calculatedTotalFee,
                }
              : item
          )
        );
        setEditCandidate(null);
      } else {
        setEditError(data.error || "Failed to update registration.");
      }
    } catch (err: any) {
      setEditError("Error updating registration: " + (err?.message || "Network error"));
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Build default participants list for a chosen event config
  const buildDefaultParticipantsForEvent = (evConfig: RegistrationEventConfig): Participant[] => {
    return evConfig.defaultRows.map((row, idx) => ({
      id: `${evConfig.id}-p-${Date.now()}-${idx}`,
      name: "",
      gender: row.gender,
      role: row.role,
      notes: row.notes || "",
    }));
  };

  // Open Add Event Modal for a registration entry
  const handleOpenAddEventModal = (record: RegistrationRecord) => {
    setAddEventError(null);
    setAddEventRecord(record);

    const existingKeys = new Set(Object.keys(record.events || {}));
    const existingTitles = new Set(Object.values(record.events || {}).map((e) => e.title));

    const firstUnregistered =
      REGISTRATION_EVENTS.find((ev) => !existingKeys.has(ev.id) && !existingTitles.has(ev.title)) ||
      REGISTRATION_EVENTS[0];

    setSelectedAddEventId(firstUnregistered.id);
    setAddEventParticipants(buildDefaultParticipantsForEvent(firstUnregistered));
  };

  // When admin changes selected event dropdown in Add Event Modal
  const handleSelectAddEventChange = (newEventId: string) => {
    setSelectedAddEventId(newEventId);
    setAddEventError(null);
    const evConfig = REGISTRATION_EVENTS.find((e) => e.id === newEventId);
    if (evConfig) {
      setAddEventParticipants(buildDefaultParticipantsForEvent(evConfig));
    }
  };

  // Add Participant row inside Add Event Modal
  const handleAddEventAddParticipant = () => {
    const evConfig = REGISTRATION_EVENTS.find((e) => e.id === selectedAddEventId);
    if (!evConfig) return;

    const defaultGender =
      evConfig.genderRestriction === "boys-only"
        ? "Male"
        : evConfig.genderRestriction === "girls-only"
        ? "Female"
        : "";
    const defaultRole =
      addEventParticipants.length >= evConfig.minParticipants &&
      evConfig.defaultRoles.includes("Substitute")
        ? "Substitute"
        : evConfig.defaultRoles[0] || "Participant";

    setAddEventParticipants((prev) => [
      ...prev,
      {
        id: `${evConfig.id}-p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: "",
        gender: defaultGender,
        role: defaultRole,
        notes: "",
      },
    ]);
  };

  // Remove Participant row inside Add Event Modal
  const handleAddEventRemoveParticipant = (participantId: string) => {
    if (addEventParticipants.length <= 1) {
      setAddEventError("At least 1 participant is required for the event.");
      return;
    }
    setAddEventParticipants((prev) => prev.filter((p) => p.id !== participantId));
  };

  // Update Participant field inside Add Event Modal
  const handleAddEventParticipantChange = (
    participantId: string,
    field: keyof Participant,
    value: string
  ) => {
    setAddEventParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, [field]: value } : p))
    );
  };

  // Save Newly Added Event to the Registration Record
  const handleSaveAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEventRecord) return;
    setAddEventError(null);

    const evConfig = REGISTRATION_EVENTS.find((ev) => ev.id === selectedAddEventId);
    if (!evConfig) {
      setAddEventError("Please select a valid event to add.");
      return;
    }

    if (addEventParticipants.length === 0) {
      setAddEventError("Please add at least one participant.");
      return;
    }

    for (const p of addEventParticipants) {
      if (!p.name?.trim()) {
        setAddEventError(`Please enter a name for all participants in "${evConfig.title}".`);
        return;
      }
      if (p.gender !== "Male" && p.gender !== "Female") {
        setAddEventError(`Please select gender (Male or Female) for all participants in "${evConfig.title}".`);
        return;
      }
    }

    setIsSavingAddEvent(true);
    try {
      const existingEvents = { ...(addEventRecord.events || {}) };
      const existingEntryForEvent = existingEvents[evConfig.id];

      // If the event is already registered on this record, append the new participants; otherwise add the new event entry
      const mergedParticipants = existingEntryForEvent
        ? [...(existingEntryForEvent.participants || []), ...addEventParticipants]
        : addEventParticipants;

      const eventFee = computeEventFee(evConfig.type, mergedParticipants.length);

      const updatedEvents: Record<string, EventRegistration> = {
        ...existingEvents,
        [evConfig.id]: {
          eventId: evConfig.id,
          title: evConfig.title,
          category: evConfig.category,
          type: evConfig.type,
          fee: eventFee,
          participants: mergedParticipants,
        },
      };

      const updatedTotalFee = computeEventsTotalFee(updatedEvents);

      const token = typeof window !== "undefined" ? sessionStorage.getItem("selah_admin_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/admin/registrations", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({
          registrationId: addEventRecord.registrationId,
          id: addEventRecord.id,
          timestamp: addEventRecord.timestamp,
          parishDetails: addEventRecord.parishDetails,
          events: updatedEvents,
          totalFee: updatedTotalFee,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) =>
          prev.map((item) =>
            item.registrationId === addEventRecord.registrationId
              ? {
                  ...item,
                  events: updatedEvents,
                  eventsCount: Object.keys(updatedEvents).length,
                  totalFee: updatedTotalFee,
                }
              : item
          )
        );
        // Automatically expand the card so the newly added event is visible
        setExpandedCards((prev) => ({
          ...prev,
          [addEventRecord.registrationId]: true,
        }));
        setAddEventRecord(null);
      } else {
        setAddEventError(data.error || "Failed to add event to registration.");
      }
    } catch (err: any) {
      setAddEventError("Error adding event: " + (err?.message || "Network error"));
    } finally {
      setIsSavingAddEvent(false);
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
              type="button"
              onClick={() => fetchRegistrations(true)}
              disabled={loadingData}
              title="Refresh and sync data with Firestore"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
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

                    {/* Right: Actions (Add Event, Edit, Expand/Collapse, Delete) */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddEventModal(record);
                        }}
                        title="Add an event to this registration"
                        className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Add Event</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(record);
                        }}
                        title="Edit parish details, events, and participants"
                        className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(regId)}
                        className="flex-1 lg:flex-initial px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteError(null);
                          setDeleteCandidate(record);
                        }}
                        title="Delete this registration record"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
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
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5" /> Parish & Contact Info
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(record)}
                                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit Details</span>
                              </button>
                            </div>
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
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Registered Events (
                              {eventList.length})
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenAddEventModal(record)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Event</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(record)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit Events / Squads</span>
                              </button>
                            </div>
                          </div>

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
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-semibold text-emerald-400">
                                    ₹{(ev.fee || 0).toLocaleString("en-IN")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(record)}
                                    title={`Edit ${ev.title} participants`}
                                    className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span className="hidden sm:inline">Edit</span>
                                  </button>
                                </div>
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

      {/* Add Event Modal */}
      <AnimatePresence>
        {addEventRecord && (
          <div
            onClick={() => {
              if (!isSavingAddEvent) {
                setAddEventRecord(null);
                setAddEventError(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Add Event to Registration</h3>
                    <p className="text-xs text-slate-400">
                      <span className="text-amber-400 font-semibold">
                        {addEventRecord.parishDetails?.parishName}
                      </span>{" "}
                      • <span className="font-mono">{addEventRecord.registrationId}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isSavingAddEvent}
                  onClick={() => {
                    setAddEventRecord(null);
                    setAddEventError(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveAddEvent} className="flex-1 overflow-y-auto p-6 space-y-5">
                {addEventError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{addEventError}</span>
                  </div>
                )}

                {(() => {
                  const selectedConfig = REGISTRATION_EVENTS.find((ev) => ev.id === selectedAddEventId);
                  const existingKeys = new Set(Object.keys(addEventRecord.events || {}));
                  const existingTitles = new Set(
                    Object.values(addEventRecord.events || {}).map((e) => e.title)
                  );
                  const isAlreadyRegistered =
                    selectedConfig &&
                    (existingKeys.has(selectedConfig.id) || existingTitles.has(selectedConfig.title));
                  const previewEventFee = selectedConfig
                    ? computeEventFee(selectedConfig.type, addEventParticipants.length)
                    : 0;

                  return (
                    <>
                      {/* Event Selector */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                          Select Event to Add
                        </label>
                        <select
                          value={selectedAddEventId}
                          onChange={(e) => handleSelectAddEventChange(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                          <optgroup label="Sports Events">
                            {REGISTRATION_EVENTS.filter((e) => e.category === "sports").map((ev) => {
                              const already =
                                existingKeys.has(ev.id) || existingTitles.has(ev.title);
                              return (
                                <option key={ev.id} value={ev.id}>
                                  {ev.title} ({ev.type === "group" ? "Group - ₹500" : "Individual - ₹200/person"})
                                  {already ? " — [Already Registered: Will Append Participants]" : ""}
                                </option>
                              );
                            })}
                          </optgroup>
                          <optgroup label="Cultural Events">
                            {REGISTRATION_EVENTS.filter((e) => e.category === "cultural").map((ev) => {
                              const already =
                                existingKeys.has(ev.id) || existingTitles.has(ev.title);
                              return (
                                <option key={ev.id} value={ev.id}>
                                  {ev.title} ({ev.type === "group" ? "Group - ₹500" : "Individual - ₹200/person"})
                                  {already ? " — [Already Registered: Will Append Participants]" : ""}
                                </option>
                              );
                            })}
                          </optgroup>
                        </select>

                        {selectedConfig && (
                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                              <div className="text-slate-200 font-semibold">
                                {selectedConfig.specification}
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                {selectedConfig.descriptionHint} (Min: {selectedConfig.minParticipants}, Max:{" "}
                                {selectedConfig.maxParticipants})
                              </div>
                              {isAlreadyRegistered && (
                                <div className="text-amber-400 text-[11px] font-medium pt-0.5">
                                  Note: This parish already has an entry for {selectedConfig.title}. Saving will append these participants to the event.
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-[11px] text-slate-400">Event Fee</div>
                              <div className="text-base font-black text-emerald-400 font-mono">
                                ₹{previewEventFee.toLocaleString("en-IN")}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Participants Editor */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Participants ({addEventParticipants.length})
                          </label>
                          <button
                            type="button"
                            onClick={handleAddEventAddParticipant}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Participant</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {addEventParticipants.map((p, idx) => (
                            <div
                              key={p.id || idx}
                              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                            >
                              <div className="sm:col-span-4">
                                <label className="block text-[10px] uppercase text-slate-500 mb-1">
                                  #{idx + 1} Full Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Participant Name"
                                  value={p.name}
                                  onChange={(e) =>
                                    handleAddEventParticipantChange(p.id, "name", e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] uppercase text-slate-500 mb-1">
                                  Gender *
                                </label>
                                <select
                                  required
                                  value={p.gender || ""}
                                  onChange={(e) =>
                                    handleAddEventParticipantChange(p.id, "gender", e.target.value)
                                  }
                                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                                >
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[10px] uppercase text-slate-500 mb-1">
                                  Role
                                </label>
                                <input
                                  type="text"
                                  placeholder="Role (e.g. Player, Captain)"
                                  value={p.role || ""}
                                  onChange={(e) =>
                                    handleAddEventParticipantChange(p.id, "role", e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] uppercase text-slate-500 mb-1">
                                  Notes
                                </label>
                                <input
                                  type="text"
                                  placeholder="Optional"
                                  value={p.notes || ""}
                                  onChange={(e) =>
                                    handleAddEventParticipantChange(p.id, "notes", e.target.value)
                                  }
                                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div className="sm:col-span-1 flex justify-end sm:pt-4">
                                <button
                                  type="button"
                                  onClick={() => handleAddEventRemoveParticipant(p.id)}
                                  title="Remove participant"
                                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={isSavingAddEvent}
                    onClick={() => {
                      setAddEventRecord(null);
                      setAddEventError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAddEvent}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingAddEvent ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Event...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Event to Entry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Registration Modal */}
      <AnimatePresence>
        {editCandidate && (
          <div
            onClick={() => {
              if (!isSavingEdit) {
                setEditCandidate(null);
                setEditError(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Edit Registration Entry</h3>
                    <p className="text-xs text-slate-400 font-mono">{editCandidate.registrationId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Recalculated Total Fee</div>
                    <div className="text-base font-black text-emerald-400 font-mono">
                      ₹{computeEventsTotalFee(editEvents).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isSavingEdit}
                    onClick={() => {
                      setEditCandidate(null);
                      setEditError(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {editError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                {/* Section 1: Parish & Representative Details */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> Parish & Representative Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Parish Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editParishDetails.parishName}
                        onChange={(e) =>
                          setEditParishDetails({ ...editParishDetails, parishName: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Representative Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editParishDetails.representativeName}
                        onChange={(e) =>
                          setEditParishDetails({
                            ...editParishDetails,
                            representativeName: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Contact Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={editParishDetails.contactNumber}
                        onChange={(e) =>
                          setEditParishDetails({
                            ...editParishDetails,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={editParishDetails.email}
                        onChange={(e) =>
                          setEditParishDetails({ ...editParishDetails, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Registered Events & Participants */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Registered Events (
                      {Object.keys(editEvents).length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const target = editCandidate;
                        setEditCandidate(null);
                        handleOpenAddEventModal(target);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Event</span>
                    </button>
                  </div>

                  {Object.entries(editEvents).map(([eventKey, ev]) => (
                    <div
                      key={eventKey}
                      className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{ev.title}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {ev.type || "group"}
                          </span>
                          <span className="font-mono text-xs font-semibold text-emerald-400">
                            ₹{(ev.fee || 0).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditAddParticipant(eventKey)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Participant</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditRemoveEvent(eventKey)}
                            title="Remove this event from registration"
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Event</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        {ev.participants.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                          >
                            <div className="sm:col-span-4">
                              <label className="block text-[10px] uppercase text-slate-500 mb-0.5">
                                #{idx + 1} Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={p.name}
                                onChange={(e) =>
                                  handleEditParticipantChange(eventKey, p.id, "name", e.target.value)
                                }
                                placeholder="Participant Name"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] uppercase text-slate-500 mb-0.5">
                                Gender *
                              </label>
                              <select
                                required
                                value={p.gender || ""}
                                onChange={(e) =>
                                  handleEditParticipantChange(eventKey, p.id, "gender", e.target.value)
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[10px] uppercase text-slate-500 mb-0.5">
                                Role
                              </label>
                              <input
                                type="text"
                                value={p.role || ""}
                                onChange={(e) =>
                                  handleEditParticipantChange(eventKey, p.id, "role", e.target.value)
                                }
                                placeholder="Role"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] uppercase text-slate-500 mb-0.5">
                                Notes
                              </label>
                              <input
                                type="text"
                                value={p.notes || ""}
                                onChange={(e) =>
                                  handleEditParticipantChange(eventKey, p.id, "notes", e.target.value)
                                }
                                placeholder="Notes"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div className="sm:col-span-1 flex justify-end sm:pt-3.5">
                              <button
                                type="button"
                                onClick={() => handleEditRemoveParticipant(eventKey, p.id)}
                                title="Remove participant"
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={isSavingEdit}
                    onClick={() => {
                      setEditCandidate(null);
                      setEditError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingEdit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteCandidate && (
          <div
            onClick={() => {
              if (!isDeleting) {
                setDeleteCandidate(null);
                setDeleteError(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
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

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteCandidate(null);
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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

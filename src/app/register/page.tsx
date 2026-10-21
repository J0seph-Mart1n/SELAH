"use client";

import React, { useState, useMemo } from "react";
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
import Silk from "@/components/Silk";
import Stepper, { Step } from "@/components/Stepper";
import {
  REGISTRATION_EVENTS,
  CONTACT_INCHARGES,
  PAYMENT_DETAILS,
  Participant,
  RegistrationEventConfig,
} from "./data/registrationEvents";
import {
  Trophy,
  Sparkles,
  Users,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  ChevronDown,
  Upload,
  Info,
} from "lucide-react";

interface ParishDetails {
  email: string;
  parishName: string;
  representativeName: string;
  contactNumber: string;
  alternatePhone?: string;
  notes?: string;
}

interface EventRegistrationState {
  enabled: boolean;
  participants: Participant[];
}

export default function RegisterPage() {
  // Step State: 1 = Parish Info, 2 = Sports Events, 3 = Cultural Events, 4 = Fee & Payment, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Parish / Delegate Information
  const [parishDetails, setParishDetails] = useState<ParishDetails>({
    email: "",
    parishName: "",
    representativeName: "",
    contactNumber: "",
    alternatePhone: "",
    notes: "",
  });

  // Selected Events State
  const [eventsState, setEventsState] = useState<Record<string, EventRegistrationState>>(() => {
    const initial: Record<string, EventRegistrationState> = {};
    REGISTRATION_EVENTS.forEach((event) => {
      initial[event.id] = {
        enabled: false,
        participants: [],
      };
    });
    return initial;
  });

  // Payment State
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [payerName, setPayerName] = useState<string>("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);

  // UI / Submission state
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Toggle an event participation
  const toggleEvent = (event: RegistrationEventConfig) => {
    setEventsState((prev) => {
      const currentState = prev[event.id] || { enabled: false, participants: [] };
      const nextEnabled = !currentState.enabled;

      let nextParticipants = currentState.participants;
      if (nextEnabled && currentState.participants.length === 0) {
        // Pre-fill default template rows
        nextParticipants = event.defaultRows.map((row, idx) => ({
          id: `${event.id}-p-${Date.now()}-${idx}`,
          name: "",
          gender: row.gender,
          role: row.role,
          notes: row.notes || "",
        }));
      }

      return {
        ...prev,
        [event.id]: {
          enabled: nextEnabled,
          participants: nextParticipants,
        },
      };
    });
  };

  // Add participant to an event table
  const addParticipant = (event: RegistrationEventConfig) => {
    setEventsState((prev) => {
      const current = prev[event.id];
      if (!current) return prev;
      if (current.participants.length >= event.maxParticipants) return prev;

      const newParticipant: Participant = {
        id: `${event.id}-p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: "",
        gender:
          event.genderRestriction === "boys-only"
            ? "Male"
            : event.genderRestriction === "girls-only"
            ? "Female"
            : "",
        role: event.defaultRoles[0] || "Participant",
        notes: "",
      };

      return {
        ...prev,
        [event.id]: {
          ...current,
          participants: [...current.participants, newParticipant],
        },
      };
    });
  };

  // Remove participant
  const removeParticipant = (eventId: string, participantId: string) => {
    setEventsState((prev) => {
      const current = prev[eventId];
      if (!current) return prev;

      return {
        ...prev,
        [eventId]: {
          ...current,
          participants: current.participants.filter((p) => p.id !== participantId),
        },
      };
    });
  };

  // Update participant field
  const updateParticipant = (
    eventId: string,
    participantId: string,
    field: keyof Participant,
    value: string
  ) => {
    setEventsState((prev) => {
      const current = prev[eventId];
      if (!current) return prev;

      return {
        ...prev,
        [eventId]: {
          ...current,
          participants: current.participants.map((p) =>
            p.id === participantId ? { ...p, [field]: value } : p
          ),
        },
      };
    });
  };

  // Quick reset to default template
  const resetToTemplate = (event: RegistrationEventConfig) => {
    setEventsState((prev) => ({
      ...prev,
      [event.id]: {
        enabled: true,
        participants: event.defaultRows.map((row, idx) => ({
          id: `${event.id}-p-${Date.now()}-${idx}`,
          name: "",
          gender: row.gender,
          role: row.role,
          notes: row.notes || "",
        })),
      },
    }));
  };

  // Compute fee summary
  const feeSummary = useMemo(() => {
    let groupCount = 0;
    let individualEventsCount = 0;
    let individualParticipantsCount = 0;
    const selectedList: Array<{
      event: RegistrationEventConfig;
      participants: Participant[];
      calculatedFee: number;
    }> = [];

    REGISTRATION_EVENTS.forEach((event) => {
      const state = eventsState[event.id];
      if (state?.enabled) {
        let calculatedFee = 0;
        if (event.type === "group") {
          groupCount += 1;
          calculatedFee = PAYMENT_DETAILS.groupFee;
        } else {
          individualEventsCount += 1;
          const count = state.participants.length;
          individualParticipantsCount += count;
          calculatedFee = count * PAYMENT_DETAILS.individualFee;
        }

        selectedList.push({
          event,
          participants: state.participants,
          calculatedFee,
        });
      }
    });

    const groupTotal = groupCount * PAYMENT_DETAILS.groupFee;
    const individualTotal = individualParticipantsCount * PAYMENT_DETAILS.individualFee;
    const grandTotal = groupTotal + individualTotal;

    return {
      groupCount,
      individualEventsCount,
      individualParticipantsCount,
      individualCount: individualParticipantsCount,
      groupTotal,
      individualTotal,
      grandTotal,
      totalEvents: groupCount + individualEventsCount,
      selectedList,
    };
  }, [eventsState]);

  // Handle screenshot file upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Copy UPI ID
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(PAYMENT_DETAILS.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Validate current step
  const validateStep = (stepNumber: number): { valid: boolean; error?: string } => {
    if (stepNumber === 1) {
      if (!parishDetails.email.trim()) {
        return { valid: false, error: "Email is required." };
      }
      if (!/^\S+@\S+\.\S+$/.test(parishDetails.email.trim())) {
        return { valid: false, error: "Please enter a valid email address." };
      }
      if (!parishDetails.parishName.trim()) {
        return { valid: false, error: "Parish Name is required." };
      }
      if (!parishDetails.representativeName.trim()) {
        return { valid: false, error: "Person filling the form (Representative name) is required." };
      }
      if (!parishDetails.contactNumber.trim() || parishDetails.contactNumber.trim().length < 10) {
        return { valid: false, error: "Valid 10-digit Contact Number is required." };
      }
      return { valid: true };
    }

    if (stepNumber === 2 || stepNumber === 3) {
      // Validate that if an event is enabled, participants have names and meet gender rules
      const category = stepNumber === 2 ? "sports" : "cultural";
      const eventsInCategory = REGISTRATION_EVENTS.filter((e) => e.category === category);

      for (const event of eventsInCategory) {
        const state = eventsState[event.id];
        if (state?.enabled) {
          if (state.participants.length < event.minParticipants) {
            return {
              valid: false,
              error: `${event.title} requires at least ${event.minParticipants} participant(s). Currently added: ${state.participants.length}.`,
            };
          }

          // Check if any participant name is blank
          const emptyName = state.participants.find((p) => !p.name.trim());
          if (emptyName) {
            return {
              valid: false,
              error: `Please enter all participant names in the ${event.title} squad table.`,
            };
          }

          // Check if any participant gender is blank (MANDATORY FOR ALL EVENTS)
          const emptyGender = state.participants.find((p) => !p.gender);
          if (emptyGender) {
            return {
              valid: false,
              error: `Please select the gender (Male / Female) for all participants in ${event.title}.`,
            };
          }

          // Specific gender validations
          if (event.genderRestriction === "mixed-2b2g") {
            const boys = state.participants.filter((p) => p.gender === "Male").length;
            const girls = state.participants.filter((p) => p.gender === "Female").length;
            if (boys < 2 || girls < 2) {
              return {
                valid: false,
                error: `${event.title} must have at least 2 Boys and 2 Girls specified. (Current: ${boys} Boys, ${girls} Girls).`,
              };
            }
          } else if (event.genderRestriction === "boys-only") {
            const nonBoys = state.participants.filter((p) => p.gender !== "Male").length;
            if (nonBoys > 0) {
              return {
                valid: false,
                error: `${event.title} is an All-Boys team. Please set all participant genders to Male.`,
              };
            }
          } else if (event.genderRestriction === "girls-only") {
            const nonGirls = state.participants.filter((p) => p.gender !== "Female").length;
            if (nonGirls > 0) {
              return {
                valid: false,
                error: `${event.title} is an All-Girls team. Please set all participant genders to Female.`,
              };
            }
          }
        }
      }
      return { valid: true };
    }

    if (stepNumber === 4) {
      if (feeSummary.totalEvents === 0) {
        return {
          valid: false,
          error: "You must register for at least one sports or cultural event.",
        };
      }
      if (!utrNumber.trim() || utrNumber.trim().length < 6) {
        return {
          valid: false,
          error: "Please enter a valid Transaction Ref / UTR number from your payment app.",
        };
      }
      return { valid: true };
    }

    return { valid: true };
  };

  const handleNextStep = () => {
    const result = validateStep(currentStep);
    if (!result.valid) {
      setSubmissionError(result.error || "Please resolve validation errors before continuing.");
      return;
    }
    setSubmissionError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setSubmissionError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const handleStepProgression = (targetStep: number) => {
    if (targetStep < currentStep) {
      setSubmissionError(null);
      setCurrentStep(targetStep);
      window.scrollTo({ top: 320, behavior: "smooth" });
      return;
    }
    for (let s = currentStep; s < targetStep; s++) {
      const check = validateStep(s);
      if (!check.valid) {
        setSubmissionError(check.error || `Please complete Step ${s} before continuing.`);
        return;
      }
    }
    setSubmissionError(null);
    setCurrentStep(targetStep);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Submit form handler
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    const step1Check = validateStep(1);
    if (!step1Check.valid) {
      setCurrentStep(1);
      setSubmissionError(step1Check.error || "Please check Parish details.");
      return;
    }

    const step2Check = validateStep(2);
    if (!step2Check.valid) {
      setCurrentStep(2);
      setSubmissionError(step2Check.error || "Please check Sports participants.");
      return;
    }

    const step3Check = validateStep(3);
    if (!step3Check.valid) {
      setCurrentStep(3);
      setSubmissionError(step3Check.error || "Please check Cultural participants.");
      return;
    }

    const step4Check = validateStep(4);
    if (!step4Check.valid) {
      setSubmissionError(step4Check.error || "Please check payment information.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build clean payload with only enabled events
      const cleanRegistrations: Record<string, { eventId: string; title: string; type: string; fee: number; participants: Participant[] }> = {};
      REGISTRATION_EVENTS.forEach((event) => {
        const state = eventsState[event.id];
        if (state?.enabled && state.participants.length > 0) {
          const calculatedFee =
            event.type === "group"
              ? PAYMENT_DETAILS.groupFee
              : state.participants.length * PAYMENT_DETAILS.individualFee;

          cleanRegistrations[event.id] = {
            eventId: event.id,
            title: event.title,
            type: event.type,
            fee: calculatedFee,
            participants: state.participants,
          };
        }
      });

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parishDetails,
          registrations: cleanRegistrations,
          totalFee: feeSummary.grandTotal,
          payment: {
            utrNumber: utrNumber.trim(),
            payerName: payerName.trim() || parishDetails.representativeName,
            screenshotBase64: screenshotPreview,
            screenshotName: screenshotFileName,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      setSubmissionSuccess({
        ...data,
        detailedRegistrations: cleanRegistrations,
      });
      setCurrentStep(5); // Confirmation screen
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setSubmissionError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#611e3c] text-[#fff1cb] relative overflow-x-hidden selection:bg-[#63752e] selection:text-[#fff1cb]">

      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#63752e]/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-[#fff1cb]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Desktop Navigation */}
      <div className="relative z-50">
        <Navbar className="selah-rnav">
          <NavBody>
            <Link
              className="brand relative z-20 flex items-center gap-2.5 transition-all duration-300 group-data-[shrunk=true]:gap-0"
              href="/"
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
            </Link>
            <NavItems
              items={[
                { name: "Home", link: "/" },
                { name: "Register", link: "/register" },
                { name: "Rules", link: "/rules" },
                { name: "Core Team", link: "/about-cya" },
                { name: "Gallery", link: "/gallery" },
              ]}
            />
          </NavBody>
        </Navbar>

        {/* Mobile Navigation */}
        <div className="relative z-50 lg:hidden selah-smenu">
          <StaggeredMenu
            isFixed={true}
            logo={
              <div className="brand relative z-20 flex items-center">
                <Link
                  href="/"
                  aria-label="SELAH 2026 home"
                  className="flex items-center gap-2.5"
                  style={{ textDecoration: "none" }}
                >
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
                </Link>
              </div>
            }
            items={[
              { label: "Home", link: "/" },
              { label: "Register", link: "/register" },
              { label: "Rules", link: "/rules" },
              { label: "Core Team", link: "/about-cya" },
              { label: "Gallery", link: "/gallery" },
            ] as any}
            colors={["#611e3c", "#63752e", "#fff1cb", "#611e3c"]}
            accentColor="#63752e"
            menuButtonColor="#fff1cb"
            openMenuButtonColor="#fff1cb"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-3 sm:px-4 pt-24 sm:pt-28 pb-32 sm:pb-24 max-w-6xl mx-auto w-full">
        {/* Header Hero Section */}
        <div className="w-full text-center mb-10 pt-6 sm:pt-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#fff1cb] mb-8 pb-5 sm:mb-10">
            SELAH 2026 Registration Form
          </h1>

          {/* Event Quick Meta Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto text-left mb-6">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#4a162d]/60 border border-[#fff1cb]/15 backdrop-blur-md shadow-md">
              <Calendar className="w-5 h-5 text-[#63752e] shrink-0" />
              <div>
                <div className="text-xs text-[#fff1cb]/60 font-medium">Event Date</div>
                <div className="text-sm font-semibold text-[#fff1cb]">5th December, 2026</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#4a162d]/60 border border-[#fff1cb]/15 backdrop-blur-md shadow-md">
              <Clock className="w-5 h-5 text-[#63752e] shrink-0" />
              <div>
                <div className="text-xs text-[#fff1cb]/60 font-medium">Event Timing</div>
                <div className="text-sm font-semibold text-[#fff1cb]">8:00 AM – 9:00 PM</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#4a162d]/60 border border-[#fff1cb]/15 backdrop-blur-md sm:col-span-2 lg:col-span-1 shadow-md">
              <MapPin className="w-5 h-5 text-[#63752e] shrink-0" />
              <div>
                <div className="text-xs text-[#fff1cb]/60 font-medium">Venue Address</div>
                <div className="text-sm font-semibold text-[#fff1cb] truncate">Carmel Parish, Wadgaonsheri</div>
              </div>
            </div>
          </div>

          {/* Incharge Hotline Accordion / Badges */}
          <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#63752e]/30 backdrop-blur-md max-w-4xl mx-auto shadow-md">
            <div className="text-xs uppercase tracking-wider text-[#fff1cb]/70 font-semibold mb-2.5 flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#63752e]" />
              For Any Queries, Contact Event Incharges:
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm">
              {CONTACT_INCHARGES.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.rawPhone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4a162d] hover:bg-[#63752e]/40 border border-[#fff1cb]/10 transition-colors flex items-center gap-1.5 text-[#fff1cb]/90 shadow-sm"
                >
                  <span className="text-[#fff1cb]/60 font-medium">{contact.role}:</span>
                  <span className="font-semibold text-[#fff1cb]">{contact.name}</span>
                  <span className="text-[#fff1cb]/80">({contact.phone.replace("+91 ", "")})</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Step Progression Bar (only show if not confirmed) */}
        {currentStep < 5 && (
          <div className="w-full max-w-4xl mb-8 flex justify-center">
            <Stepper
              step={currentStep}
              onStepChange={handleStepProgression}
              showFooter={false}
              hideBody={true}
              width="100%"
              radius={24}
              accentColor="#63752e"
              className="w-full shadow-2xl"
              style={{
                '--stepper-frame': 'rgba(45, 12, 27, 0.75)',
                '--stepper-frame-edge': 'rgba(255, 241, 203, 0.15)',
                '--stepper-frame-highlight': 'rgba(255, 241, 203, 0.08)',
                '--stepper-frame-shadow': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 117, 46, 0.1)',
                '--stepper-well': 'rgba(20, 5, 12, 0.5)',
                '--stepper-tile': 'linear-gradient(135deg, rgba(99, 117, 46, 0.35) 0%, rgba(97, 30, 60, 0.7) 100%)',
                '--stepper-tile-edge': 'rgba(99, 117, 46, 0.6)',
                '--stepper-tile-highlight': 'rgba(255, 241, 203, 0.2)',
                '--stepper-tile-shadow': '0 4px 12px -2px rgba(0, 0, 0, 0.5)',
                '--stepper-ink': '#fff1cb',
                '--stepper-muted': 'rgba(255, 241, 203, 0.55)',
                '--stepper-faint': 'rgba(255, 241, 203, 0.2)',
                '--stepper-solid': '#63752e',
                '--stepper-solid-ink': '#fff1cb',
                '--stepper-hover-fill': 'rgba(255, 241, 203, 0.06)',
              } as React.CSSProperties}
            >
              <Step title="Parish Details" icon={<Mail className="w-3.5 h-3.5" />} />
              <Step title="Sports Squads" icon={<Trophy className="w-3.5 h-3.5" />} />
              <Step title="Cultural Squads" icon={<Sparkles className="w-3.5 h-3.5" />} />
              <Step title="Fee & Payment" icon={<CreditCard className="w-3.5 h-3.5" />} />
            </Stepper>
          </div>
        )}

        {/* Global Error Banner */}
        <AnimatePresence>
          {submissionError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-start gap-3 backdrop-blur-md shadow-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="block font-semibold">Please Note:</strong>
                <span>{submissionError}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Parish & Delegate Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="p-6 md:p-8 rounded-3xl bg-[#4a162d]/80 border border-[#fff1cb]/15 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#fff1cb]/15">
                <div className="w-10 h-10 rounded-2xl bg-[#63752e]/30 flex items-center justify-center text-[#fff1cb] shadow-inner">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#fff1cb]">Step 1: Parish & Representative Details</h2>
                  <p className="text-xs md:text-sm text-[#fff1cb]/70">
                    Fields marked with an asterisk (<span className="text-red-400 font-bold">*</span>) are required as per the official form.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#fff1cb] mb-2">
                    1. Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="official.parish@gmail.com"
                    value={parishDetails.email}
                    onChange={(e) => setParishDetails({ ...parishDetails, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-sm transition-colors"
                  />
                </div>

                {/* 2. Name of the Parish */}
                <div>
                  <label className="block text-sm font-semibold text-[#fff1cb] mb-2">
                    2. Name of the Parish <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Patrick's Cathedral, Pune"
                    value={parishDetails.parishName}
                    onChange={(e) => setParishDetails({ ...parishDetails, parishName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-sm transition-colors"
                  />
                </div>

                {/* 3. Name of person filling form */}
                <div>
                  <label className="block text-sm font-semibold text-[#fff1cb] mb-2">
                    3. Name of the Person Filling Form <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. George Mathew (Youth Coordinator)"
                    value={parishDetails.representativeName}
                    onChange={(e) => setParishDetails({ ...parishDetails, representativeName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-sm transition-colors"
                  />
                </div>

                {/* 4. Contact Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#fff1cb] mb-2">
                    4. Contact Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={parishDetails.contactNumber}
                    onChange={(e) => setParishDetails({ ...parishDetails, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-sm transition-colors"
                  />
                </div>


              </div>

              {/* Action buttons */}
              <div className="flex justify-end mt-8 pt-4 border-t border-[#fff1cb]/15">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-2xl bg-[#63752e] hover:bg-[#839c3d] text-[#fff1cb] font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-[#63752e]/40"
                >
                  Proceed to Sports Events
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Sports Events Squad Tables */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#4a162d]/80 border border-[#fff1cb]/15 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 border-b border-[#fff1cb]/15">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#63752e]/30 flex items-center justify-center text-[#fff1cb] shadow-inner shrink-0 mt-0.5 sm:mt-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#fff1cb]">Step 2: Sports Events Squad Tables</h2>
                    <p className="text-xs sm:text-sm text-[#fff1cb]/70">
                      Check each sport your parish wishes to compete in, then add squad members into the table.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#2d0c1b] border border-[#63752e]/40 text-xs text-[#fff1cb]/90 shrink-0 shadow-sm w-fit self-start sm:self-auto">
                  <span className="font-semibold text-[#63752e]">Sports Fee:</span> Group ₹800 • Individual ₹250/participant
                </div>
              </div>

              {/* Instructions Banner from PDF */}
              <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-[#2d0c1b]/80 border border-[#63752e]/30 text-xs sm:text-sm text-[#fff1cb]/90 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 font-semibold text-[#fff1cb]">
                  <Info className="w-4 h-4 text-[#63752e] shrink-0" />
                  Filling Instructions for Sports Events:
                </div>
                <ul className="list-disc list-inside text-[#fff1cb]/80 pl-1 sm:pl-2 space-y-1">
                  <li>Check the event box to open that sport&apos;s interactive participant table.</li>
                  <li>Specify the <strong>Captain</strong> for group events using the Role dropdown.</li>
                  <li>Indicate <strong>Substitutes</strong> where permitted (e.g. Futsal, Throwball, Tug of War).</li>
                </ul>
              </div>

              {/* Sports Events List */}
              <div className="space-y-4 sm:space-y-6">
                {REGISTRATION_EVENTS.filter((e) => e.category === "sports").map((event) => {
                  const state = eventsState[event.id] || { enabled: false, participants: [] };
                  return (
                    <EventTableCard
                      key={event.id}
                      event={event}
                      state={state}
                      onToggle={() => toggleEvent(event)}
                      onAdd={() => addParticipant(event)}
                      onRemove={(pid) => removeParticipant(event.id, pid)}
                      onUpdate={(pid, field, val) => updateParticipant(event.id, pid, field, val)}
                      onReset={() => resetToTemplate(event)}
                    />
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 sm:mt-8 pt-4 border-t border-[#fff1cb]/15">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-2xl bg-[#2d0c1b] hover:bg-[#1d0711] text-[#fff1cb]/80 hover:text-[#fff1cb] border border-[#fff1cb]/20 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back: Parish Info
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-[#63752e] hover:bg-[#839c3d] text-[#fff1cb] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#63752e]/40"
                >
                  Proceed to Cultural Events
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Cultural Events Squad Tables */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#4a162d]/80 border border-[#fff1cb]/15 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 border-b border-[#fff1cb]/15">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#63752e]/30 flex items-center justify-center text-[#fff1cb] shadow-inner shrink-0 mt-0.5 sm:mt-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#fff1cb]">Step 3: Cultural Events Squad Tables</h2>
                    <p className="text-xs sm:text-sm text-[#fff1cb]/70">
                      Check each cultural showcase your parish wishes to enter, and enter your artists in the tables.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#2d0c1b] border border-[#63752e]/40 text-xs text-[#fff1cb]/90 shrink-0 shadow-sm w-fit self-start sm:self-auto">
                  <span className="font-semibold text-[#63752e]">Cultural Fee:</span> Group ₹800 • Individual ₹250/participant
                </div>
              </div>

              {/* Instructions Banner from PDF */}
              <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-[#2d0c1b]/80 border border-[#63752e]/30 text-xs sm:text-sm text-[#fff1cb]/90 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 font-semibold text-[#fff1cb]">
                  <Info className="w-4 h-4 text-[#63752e] shrink-0" />
                  Official PDF Instructions for Cultural Events:
                </div>
                <ul className="list-disc list-inside text-[#fff1cb]/80 pl-1 sm:pl-2 space-y-1">
                  <li>Fill the participants table under each event you wish to participate.</li>
                  <li>Specify the team lead, director, or instrument role where applicable.</li>
                  <li><strong>Short Film Deadline:</strong> 3rd December last submission date. No offensive/political themes.</li>
                  <li><strong>Battle of the Bands:</strong> 4 Jacks and 4 Mics will be provided on stage.</li>
                </ul>
              </div>

              {/* Cultural Events List */}
              <div className="space-y-4 sm:space-y-6">
                {REGISTRATION_EVENTS.filter((e) => e.category === "cultural").map((event) => {
                  const state = eventsState[event.id] || { enabled: false, participants: [] };
                  return (
                    <EventTableCard
                      key={event.id}
                      event={event}
                      state={state}
                      onToggle={() => toggleEvent(event)}
                      onAdd={() => addParticipant(event)}
                      onRemove={(pid) => removeParticipant(event.id, pid)}
                      onUpdate={(pid, field, val) => updateParticipant(event.id, pid, field, val)}
                      onReset={() => resetToTemplate(event)}
                    />
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 sm:mt-8 pt-4 border-t border-[#fff1cb]/15">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-2xl bg-[#2d0c1b] hover:bg-[#1d0711] text-[#fff1cb]/80 hover:text-[#fff1cb] border border-[#fff1cb]/20 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back: Sports Events
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-[#63752e] hover:bg-[#839c3d] text-[#fff1cb] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#63752e]/40"
                >
                  Proceed to Fee & Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Fee Breakdown & Payment Verification */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl"
          >
            <form onSubmit={handleSubmitRegistration}>
              <div className="p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#4a162d]/80 border border-[#fff1cb]/15 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-8">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 pb-4 border-b border-[#fff1cb]/15">
                  <div className="w-10 h-10 rounded-2xl bg-[#63752e]/30 flex items-center justify-center text-[#fff1cb] shadow-inner shrink-0 mt-0.5 sm:mt-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#fff1cb]">Step 4: Registration Fee & Payment Instructions</h2>
                    <p className="text-xs sm:text-sm text-[#fff1cb]/70">
                      Calculated automatically based on your event participation as outlined in page 4 & 5 of the PDF form.
                    </p>
                  </div>
                </div>

                {/* Live Dynamic Fee Calculation Card */}
                <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#2d0c1b]/90 border border-[#63752e]/40 shadow-inner">
                  <h3 className="text-sm sm:text-base font-bold text-[#fff1cb] mb-3 sm:mb-4 flex items-center justify-between">
                    <span>Participation Fee Breakdown</span>
                    <span className="text-xs font-normal text-[#fff1cb]/60">
                      {feeSummary.totalEvents} Event(s) Selected
                    </span>
                  </h3>

                  {feeSummary.totalEvents === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#4a162d]/40 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>No events selected yet. Please go back to Step 2 or Step 3 to pick your parish events.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Event Row details */}
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs sm:text-sm">
                        {feeSummary.selectedList.map(({ event, participants, calculatedFee }) => (
                          <div
                            key={event.id}
                            className="flex items-start sm:items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#4a162d]/50 border border-[#fff1cb]/10"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider shrink-0 ${
                                    event.category === "sports"
                                      ? "bg-[#63752e]/40 text-[#fff1cb]"
                                      : "bg-purple-900/40 text-purple-200"
                                  }`}
                                >
                                  {event.category}
                                </span>
                                <span className="font-semibold text-[#fff1cb] text-xs sm:text-sm truncate">
                                  {event.title}
                                </span>
                              </div>
                              <span className="text-[#fff1cb]/60 text-[11px] sm:text-xs">
                                ({participants.length} participant{participants.length !== 1 ? "s" : ""}
                                {event.type === "individual" ? " × ₹250" : ""})
                              </span>
                            </div>
                            <div className="font-mono font-bold text-[#fff1cb] text-xs sm:text-sm shrink-0">
                              ₹{calculatedFee}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtotals */}
                      <div className="pt-3 border-t border-[#fff1cb]/15 space-y-1.5 text-xs sm:text-sm text-[#fff1cb]/80">
                        <div className="flex justify-between items-center">
                          <span>Group Events ({feeSummary.groupCount} × ₹800):</span>
                          <span className="font-mono font-semibold text-[#fff1cb]">₹{feeSummary.groupTotal}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>
                            Individual Entries ({feeSummary.individualParticipantsCount} participant{feeSummary.individualParticipantsCount !== 1 ? "s" : ""} × ₹250):
                          </span>
                          <span className="font-mono font-semibold text-[#fff1cb]">₹{feeSummary.individualTotal}</span>
                        </div>
                      </div>

                      {/* Grand Total */}
                      <div className="pt-3 border-t border-[#63752e]/50 flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-[#fff1cb]">
                          Total Payable:
                        </span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-mono text-[#63752e] bg-[#fff1cb] px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-md shrink-0">
                          ₹{feeSummary.grandTotal}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment QR Code & Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#2d0c1b]/80 border border-[#fff1cb]/15 shadow-xl">
                  {/* Left: Official QR Card */}
                  <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#4a162d]/90 border border-[#fff1cb]/20 shadow-md">
                    <div className="text-xs uppercase tracking-wider text-[#63752e] font-bold mb-2 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4" />
                      Official UPI Payment QR
                    </div>
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 bg-white p-2 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-3">
                      <Image
                        src={PAYMENT_DETAILS.qrImagePath}
                        alt="SELAH 2026 Registration Payment QR Code"
                        fill
                        className="object-contain p-2"
                        priority
                      />
                    </div>
                    <div className="text-xs text-[#fff1cb]/90 font-medium">
                      ICICI Bank • {PAYMENT_DETAILS.recipientName}
                    </div>
                    <div className="text-[11px] sm:text-xs font-mono text-[#63752e] bg-[#fff1cb]/10 px-2.5 py-0.5 rounded-full mt-1 break-all">
                      UPI ID: {PAYMENT_DETAILS.upiId}
                    </div>
                  </div>

                  {/* Right: Payment Instructions & Copy Button */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-sm sm:text-base font-bold text-[#fff1cb] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#63752e] shrink-0" />
                      Payment Instructions
                    </h4>

                    <div className="text-xs sm:text-sm text-[#fff1cb]/80 space-y-2.5">
                      <p className="leading-relaxed">
                        Scan the QR code with any UPI app (<strong>Google Pay, PhonePe, Paytm, BHIM</strong>), or transfer to the number below:
                      </p>
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#4a162d] border border-[#fff1cb]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                        <div className="min-w-0">
                          <div className="text-[10px] sm:text-[11px] text-[#fff1cb]/60 uppercase font-medium">GPay / Phone Number</div>
                          <div className="text-xs sm:text-sm font-bold text-[#fff1cb]">
                            {PAYMENT_DETAILS.recipientName}: <span className="font-mono">{PAYMENT_DETAILS.phone}</span>
                          </div>
                        </div>
                        <a
                          href={`tel:+91${PAYMENT_DETAILS.phone}`}
                          className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#63752e] hover:bg-[#839c3d] text-xs font-bold text-[#fff1cb] transition-colors"
                        >
                          Call / Pay
                        </a>
                      </div>

                      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#4a162d] border border-[#fff1cb]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                        <div className="min-w-0">
                          <div className="text-[10px] sm:text-[11px] text-[#fff1cb]/60 uppercase font-medium">Official UPI ID</div>
                          <div className="text-xs sm:text-sm font-mono font-bold text-[#fff1cb] break-all">
                            {PAYMENT_DETAILS.upiId}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUPI}
                          className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#2d0c1b] hover:bg-[#1d0711] border border-[#fff1cb]/20 text-xs font-semibold text-[#fff1cb] flex items-center gap-1.5 transition-colors"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Critical Notes from PDF */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs space-y-1 shadow-md">
                      <div className="font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        Important Guidelines:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 pl-1">
                        <li>
                          <strong>Mention your Parish Name</strong> in the payment description / note.
                        </li>
                        <li>
                          <strong>Complete payment before submitting</strong> this form.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Verification Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                  {/* UTR / Transaction Reference */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#fff1cb] mb-1.5">
                      Transaction UTR / Ref Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428719283719 (12-digit UPI ref)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-xs sm:text-sm font-mono transition-colors"
                    />
                    <span className="text-[11px] text-[#fff1cb]/60 mt-1 block">
                      Found in your GPay / PhonePe payment success details.
                    </span>
                  </div>

                  {/* Payer Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#fff1cb] mb-1.5">
                      Payer Account Name
                    </label>
                    <input
                      type="text"
                      placeholder={`Defaults to ${parishDetails.representativeName || "Representative"}`}
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-xs sm:text-sm transition-colors"
                    />
                    <span className="text-[11px] text-[#fff1cb]/60 mt-1 block">
                      Name appearing on the bank account or UPI app.
                    </span>
                  </div>

                  {/* Payment Screenshot Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-[#fff1cb] mb-1.5">
                      Upload Payment Screenshot (Recommended)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#2d0c1b]/60 border border-dashed border-[#fff1cb]/30 shadow-inner">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4a162d] hover:bg-[#63752e]/40 border border-[#fff1cb]/20 cursor-pointer text-xs font-semibold text-[#fff1cb] transition-colors shrink-0 shadow-sm w-full sm:w-auto">
                        <Upload className="w-4 h-4" />
                        Choose Screenshot Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>

                      {screenshotFileName ? (
                        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs text-[#fff1cb]/80 min-w-0">
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                            <span className="truncate">{screenshotFileName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setScreenshotPreview(null);
                              setScreenshotFileName(null);
                            }}
                            className="text-red-400 hover:text-red-300 text-xs shrink-0 underline ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#fff1cb]/50">
                          Supports PNG, JPG, WEBP. Verifies instant approval by registration desk.
                        </span>
                      )}
                    </div>

                    {screenshotPreview && (
                      <div className="mt-3 relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden border border-[#fff1cb]/20 shadow-md">
                        <Image
                          src={screenshotPreview}
                          alt="Payment Screenshot Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Navigation & Submit */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-[#fff1cb]/15">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-2xl bg-[#2d0c1b] hover:bg-[#1d0711] text-[#fff1cb]/80 hover:text-[#fff1cb] border border-[#fff1cb]/20 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back: Cultural Events
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || feeSummary.totalEvents === 0}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl sm:rounded-2xl bg-[#63752e] hover:bg-[#839c3d] disabled:opacity-50 disabled:cursor-not-allowed text-[#fff1cb] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl hover:shadow-[#63752e]/50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#fff1cb] border-t-transparent rounded-full animate-spin" />
                        Submitting Registration...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        Confirm & Submit Registration (₹{feeSummary.grandTotal})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 5: Submission Success Confirmation & Printable Receipt */}
        {currentStep === 5 && submissionSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
          >
            <div className="p-8 md:p-10 rounded-3xl bg-[#4a162d]/90 border border-[#63752e] backdrop-blur-2xl shadow-2xl space-y-8 print:bg-white print:text-black">
              {/* Top Banner */}
              <div className="text-center space-y-3 pb-6 border-b border-[#fff1cb]/15">
                <div className="w-16 h-16 rounded-full bg-[#63752e]/30 border-2 border-[#63752e] text-[#fff1cb] flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#fff1cb]">
                  Registration Successfully Submitted!
                </h2>
                <p className="text-sm md:text-base text-[#fff1cb]/80 max-w-xl mx-auto">
                  Your parish squad entries have been officially received. Please retain your Registration ID for reporting on 5th December, 2026.
                </p>
                <div className="inline-block px-5 py-2.5 rounded-2xl bg-[#2d0c1b] border border-[#63752e] text-sm md:text-base font-mono font-bold text-[#fff1cb] shadow-md">
                  Registration Token: <span className="text-[#63752e]">{submissionSuccess.registrationId}</span>
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm">
                <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#fff1cb]/10 shadow-sm">
                  <div className="text-[#fff1cb]/50 text-[11px] uppercase">Parish Name</div>
                  <div className="font-semibold text-[#fff1cb] text-sm">{parishDetails.parishName}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#fff1cb]/10 shadow-sm">
                  <div className="text-[#fff1cb]/50 text-[11px] uppercase">Representative</div>
                  <div className="font-semibold text-[#fff1cb] text-sm">{parishDetails.representativeName}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#fff1cb]/10 shadow-sm">
                  <div className="text-[#fff1cb]/50 text-[11px] uppercase">Contact Phone</div>
                  <div className="font-semibold text-[#fff1cb] text-sm">{parishDetails.contactNumber}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#fff1cb]/10 shadow-sm">
                  <div className="text-[#fff1cb]/50 text-[11px] uppercase">Registered Email</div>
                  <div className="font-semibold text-[#fff1cb] text-sm">{parishDetails.email}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#fff1cb]/10 shadow-sm">
                  <div className="text-[#fff1cb]/50 text-[11px] uppercase">Payment Ref / UTR</div>
                  <div className="font-mono font-semibold text-[#fff1cb] text-sm">{utrNumber}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#2d0c1b]/70 border border-[#fff1cb]/10 shadow-sm">
                  <div className="text-[#fff1cb]/50 text-[11px] uppercase">Total Fee Paid</div>
                  <div className="font-mono font-bold text-base text-[#63752e] bg-[#fff1cb] px-2.5 py-0.5 rounded-xl inline-block mt-0.5">
                    ₹{feeSummary.grandTotal}
                  </div>
                </div>
              </div>

              {/* Squads Registered Breakdown Table */}
              <div>
                <h3 className="text-base font-bold text-[#fff1cb] mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#63752e]" />
                  Registered Events & Squad Rosters
                </h3>
                <div className="space-y-4">
                  {Object.entries(submissionSuccess.detailedRegistrations || {}).map(([eventId, data]: [string, any]) => (
                    <div
                      key={eventId}
                      className="p-5 rounded-2xl bg-[#2d0c1b]/80 border border-[#fff1cb]/15 overflow-x-auto shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-bold text-sm text-[#fff1cb]">{data.title}</span>
                        <span className="text-xs font-mono text-[#63752e] bg-[#fff1cb]/10 px-2 py-0.5 rounded-lg">₹{data.fee}</span>
                      </div>
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-[#fff1cb]/15 text-[#fff1cb]/60">
                            <th className="py-1 px-2">#</th>
                            <th className="py-1 px-2">Participant Name</th>
                            <th className="py-1 px-2">Gender</th>
                            <th className="py-1 px-2">Role</th>
                            {data.participants.some((p: any) => p.notes) && (
                              <th className="py-1 px-2">Notes</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {data.participants.map((p: Participant, pIdx: number) => (
                            <tr key={p.id} className="border-b border-[#fff1cb]/5">
                              <td className="py-1.5 px-2 text-[#fff1cb]/50">{pIdx + 1}</td>
                              <td className="py-1.5 px-2 font-semibold text-[#fff1cb]">{p.name}</td>
                              <td className="py-1.5 px-2 text-[#fff1cb]/80">{p.gender || "—"}</td>
                              <td className="py-1.5 px-2 text-[#fff1cb]/80">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                                    p.role === "Captain"
                                      ? "bg-amber-500/30 text-amber-300 font-bold"
                                      : "bg-[#4a162d] text-[#fff1cb]/70"
                                  }`}
                                >
                                  {p.role}
                                </span>
                              </td>
                              {data.participants.some((pItem: any) => pItem.notes) && (
                                <td className="py-1.5 px-2 text-[#fff1cb]/60">{p.notes || "—"}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Print & Back */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#fff1cb]/15 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-2xl bg-[#2d0c1b] hover:bg-[#1d0711] border border-[#fff1cb]/20 text-[#fff1cb] font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save Registration Slip
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/rules"
                    className="px-6 py-2.5 rounded-2xl bg-[#4a162d] hover:bg-[#63752e]/40 border border-[#fff1cb]/20 text-[#fff1cb] font-semibold text-sm transition-colors shadow-sm"
                  >
                    Review Event Rules
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setCurrentStep(1);
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-[#63752e] hover:bg-[#839c3d] text-[#fff1cb] font-bold text-sm transition-colors shadow-lg"
                  >
                    Register Another Parish
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Summary Bar when configuring events (Step 2 & 3) */}
      {(currentStep === 2 || currentStep === 3) && feeSummary.totalEvents > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-2.5 sm:p-3.5 bg-[#2d0c1b]/95 backdrop-blur-xl border-t border-[#63752e]/40 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#63752e] text-[#fff1cb] flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                {feeSummary.totalEvents}
              </div>
              <div className="text-xs sm:text-sm truncate">
                <span className="font-bold text-[#fff1cb]">{feeSummary.totalEvents} Event(s)</span>
                <span className="hidden sm:inline text-[#fff1cb]/60 ml-1.5">
                  ({feeSummary.groupCount} Group{feeSummary.individualParticipantsCount > 0 ? `, ${feeSummary.individualParticipantsCount} Ind. Participant${feeSummary.individualParticipantsCount !== 1 ? "s" : ""}` : ""})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="text-right">
                <div className="text-[9px] sm:text-[10px] uppercase text-[#fff1cb]/60 leading-none mb-0.5">Total Fee</div>
                <div className="font-mono font-bold text-xs sm:text-base text-[#63752e] bg-[#fff1cb] px-2 sm:px-3 py-0.5 rounded-lg sm:rounded-xl shadow-sm">
                  ₹{feeSummary.grandTotal}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  for (let s = 1; s <= 3; s++) {
                    const check = validateStep(s);
                    if (!check.valid) {
                      setCurrentStep(s);
                      setSubmissionError(check.error || "Please check participants before proceeding.");
                      window.scrollTo({ top: 320, behavior: "smooth" });
                      return;
                    }
                  }
                  setSubmissionError(null);
                  setCurrentStep(4);
                  window.scrollTo({ top: 320, behavior: "smooth" });
                }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#63752e] hover:bg-[#839c3d] text-[#fff1cb] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shrink-0"
              >
                <span>Proceed to Pay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ==========================================
// Subcomponent: Event Participant Table Card
// ==========================================
interface EventTableCardProps {
  event: RegistrationEventConfig;
  state: EventRegistrationState;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (participantId: string) => void;
  onUpdate: (participantId: string, field: keyof Participant, value: string) => void;
  onReset: () => void;
}

function EventTableCard({
  event,
  state,
  onToggle,
  onAdd,
  onRemove,
  onUpdate,
  onReset,
}: EventTableCardProps) {
  const isBattleOfBands = event.id === "battle-of-bands";

  // Real-time validation helper
  const validationInfo = useMemo(() => {
    if (!state.enabled) return null;

    const count = state.participants.length;
    const boysCount = state.participants.filter((p) => p.gender === "Male").length;
    const girlsCount = state.participants.filter((p) => p.gender === "Female").length;
    const missingGenderCount = state.participants.filter((p) => !p.gender).length;
    const captainCount = state.participants.filter((p) => p.role === "Captain" || p.role === "Team Leader" || p.role === "Band Leader").length;

    let isValid = true;
    let message = "";

    if (count < event.minParticipants) {
      isValid = false;
      message = `Requires minimum ${event.minParticipants} participant(s). (${count} added)`;
    } else if (missingGenderCount > 0) {
      isValid = false;
      message = `Gender selection required (${missingGenderCount} missing)`;
    } else if (event.genderRestriction === "mixed-2b2g") {
      if (boysCount < 2 || girlsCount < 2) {
        isValid = false;
        message = `Requires at least 2 Boys & 2 Girls (Current: ${boysCount} Boys, ${girlsCount} Girls)`;
      } else {
        message = `Valid squad: ${boysCount} Boys, ${girlsCount} Girls`;
      }
    } else if (event.genderRestriction === "boys-only") {
      const nonBoys = state.participants.filter((p) => p.gender !== "Male").length;
      if (nonBoys > 0) {
        isValid = false;
        message = `All participants must be Male`;
      } else {
        message = `All Boys Squad (${boysCount} players)`;
      }
    } else if (event.genderRestriction === "girls-only") {
      const nonGirls = state.participants.filter((p) => p.gender !== "Female").length;
      if (nonGirls > 0) {
        isValid = false;
        message = `All participants must be Female`;
      } else {
        message = `All Girls Squad (${girlsCount} players)`;
      }
    } else {
      message = `${count} participant(s) (${boysCount} Boys, ${girlsCount} Girls)`;
    }

    return { isValid, message, count, boysCount, girlsCount, captainCount, missingGenderCount };
  }, [state, event]);

  return (
    <div
      className={`rounded-3xl transition-all duration-300 border ${
        state.enabled
          ? "bg-[#2d0c1b]/95 border-[#63752e] shadow-xl"
          : "bg-[#2d0c1b]/50 border-[#fff1cb]/10 hover:border-[#fff1cb]/25"
      }`}
    >
      {/* Event Header Card */}
      <div className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            id={`toggle-${event.id}`}
            checked={state.enabled}
            onChange={onToggle}
            className="mt-1 w-5 h-5 rounded border-[#fff1cb]/30 text-[#63752e] focus:ring-[#63752e] accent-[#63752e] cursor-pointer shrink-0"
          />
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`toggle-${event.id}`}
              className="text-base sm:text-lg font-bold text-[#fff1cb] cursor-pointer flex flex-wrap items-center gap-2"
            >
              <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#4a162d] text-[#fff1cb]/60 border border-[#fff1cb]/10 shrink-0">
                #{event.pdfNumber}
              </span>
              <span className="break-words">{event.title}</span>
            </label>
            <p className="text-xs text-[#fff1cb]/70 mt-1">{event.specification}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#fff1cb]/10 w-full sm:w-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              event.type === "group"
                ? "bg-[#63752e]/30 text-[#fff1cb] border border-[#63752e]/50"
                : "bg-[#fff1cb]/10 text-[#fff1cb]/80 border border-[#fff1cb]/20"
            }`}
          >
            {event.type === "group"
              ? `Group Event • ₹${event.fee}`
              : state.enabled && state.participants.length > 1
              ? `Individual • ₹${state.participants.length * PAYMENT_DETAILS.individualFee} (${state.participants.length} × ₹250)`
              : state.enabled && state.participants.length === 1
              ? `Individual • ₹250`
              : `Individual • ₹250 / participant`}
          </span>

          <button
            type="button"
            onClick={onToggle}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              state.enabled
                ? "bg-[#63752e] text-[#fff1cb] shadow-md"
                : "bg-[#4a162d] text-[#fff1cb]/70 hover:text-[#fff1cb] border border-[#fff1cb]/15"
            }`}
          >
            {state.enabled ? "Selected ✓" : "+ Select"}
          </button>
        </div>
      </div>

      {/* Expandable Participant Squad Section */}
      <AnimatePresence>
        {state.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#fff1cb]/15 p-3.5 sm:p-5 overflow-hidden"
          >
            {/* Table Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-2.5 border-b border-[#fff1cb]/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#63752e] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#fff1cb]">
                    Squad Table ({state.participants.length}/{event.maxParticipants})
                  </span>
                </div>
                {validationInfo && (
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${
                      validationInfo.isValid
                        ? "bg-green-950/70 text-green-300 border border-green-500/30"
                        : "bg-amber-950/70 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {validationInfo.isValid ? (
                      <Check className="w-3 h-3 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3 h-3 shrink-0" />
                    )}
                    <span>{validationInfo.message}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={onReset}
                  title="Reload recommended template rows"
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#4a162d] hover:bg-[#611e3c] border border-[#fff1cb]/15 text-[#fff1cb]/80 transition-colors"
                >
                  Reset Template
                </button>
                <button
                  type="button"
                  onClick={onAdd}
                  disabled={state.participants.length >= event.maxParticipants}
                  className="text-xs px-3.5 py-1.5 rounded-xl bg-[#63752e] hover:bg-[#839c3d] disabled:opacity-40 disabled:cursor-not-allowed text-[#fff1cb] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Participant
                </button>
              </div>
            </div>

            {/* Empty State */}
            {state.participants.length === 0 ? (
              <div className="py-6 text-center text-[#fff1cb]/50 text-xs bg-[#4a162d]/30 rounded-2xl border border-[#fff1cb]/10 p-4">
                No participants added yet. Click &quot;Add Participant&quot; or &quot;Reset Template&quot; above.
              </div>
            ) : (
              <>
                {/* Mobile View: Clean Touch-Friendly Card Stack (< md) */}
                <div className="block md:hidden space-y-3">
                  {state.participants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="p-3.5 rounded-2xl bg-[#4a162d]/50 border border-[#fff1cb]/15 space-y-3 shadow-md"
                    >
                      {/* Card Header: #Index & Remove Button */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#fff1cb]/10">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#2d0c1b] border border-[#fff1cb]/15 flex items-center justify-center font-mono text-xs font-bold text-[#fff1cb]/80">
                            {index + 1}
                          </span>
                          <span className="text-xs font-semibold text-[#fff1cb]">
                            Participant #{index + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(participant.id)}
                          className="px-2.5 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                          title="Remove participant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium">Remove</span>
                        </button>
                      </div>

                      {/* Participant Full Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#fff1cb]/80 mb-1">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. George Mathew"
                          value={participant.name}
                          onChange={(e) => onUpdate(participant.id, "name", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#2d0c1b]/90 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-xs transition-colors"
                        />
                      </div>

                      {/* 2-Column Grid: Gender & Role */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#fff1cb]/80 mb-1">
                            Gender <span className="text-red-400">*</span>
                          </label>
                          <select
                            required
                            value={participant.gender}
                            onChange={(e) =>
                              onUpdate(participant.id, "gender", e.target.value as "Male" | "Female")
                            }
                            className={`w-full px-2.5 py-2 rounded-xl bg-[#2d0c1b] border focus:border-[#63752e] focus:outline-none text-xs transition-colors ${
                              !participant.gender
                                ? "border-amber-400/50 text-[#fff1cb]/60"
                                : "border-[#fff1cb]/20 text-[#fff1cb]"
                            }`}
                          >
                            <option value="" disabled className="bg-[#2d0c1b] text-[#fff1cb]/40">
                              Select Gender *
                            </option>
                            <option value="Male" className="bg-[#2d0c1b] text-[#fff1cb]">
                              Male
                            </option>
                            <option value="Female" className="bg-[#2d0c1b] text-[#fff1cb]">
                              Female
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#fff1cb]/80 mb-1">
                            Role / Status
                          </label>
                          <select
                            value={participant.role}
                            onChange={(e) => onUpdate(participant.id, "role", e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#2d0c1b] border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] text-xs transition-colors"
                          >
                            {event.defaultRoles.map((role) => (
                              <option key={role} value={role} className="bg-[#2d0c1b]">
                                {role}
                              </option>
                            ))}
                            {!event.defaultRoles.includes(participant.role) && participant.role && (
                              <option value={participant.role} className="bg-[#2d0c1b]">
                                {participant.role}
                              </option>
                            )}
                          </select>
                        </div>
                      </div>

                      {/* Notes / Details - Only for Battle of the Bands */}
                      {isBattleOfBands && (
                        <div>
                          <label className="block text-[11px] font-medium text-[#fff1cb]/60 mb-1">
                            Notes / Instrument Details (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Lead, Substitute, Acoustic Guitar..."
                            value={participant.notes || ""}
                            onChange={(e) => onUpdate(participant.id, "notes", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#2d0c1b]/80 border border-[#fff1cb]/15 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-xs transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop View: Structured Table (>= md) */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#fff1cb]/15 bg-[#4a162d]/40 shadow-inner">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-[#4a162d]/80 text-[#fff1cb]/80 border-b border-[#fff1cb]/15">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3 min-w-[180px]">
                          Participant Full Name <span className="text-red-400">*</span>
                        </th>
                        <th className="py-2.5 px-3 min-w-[120px]">
                          Gender <span className="text-red-400">*</span>
                        </th>
                        <th className="py-2.5 px-3 min-w-[140px]">Role / Status</th>
                        {isBattleOfBands && (
                          <th className="py-2.5 px-3 min-w-[140px]">Notes / Details</th>
                        )}
                        <th className="py-2.5 px-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fff1cb]/10">
                      {state.participants.map((participant, index) => (
                        <tr key={participant.id} className="hover:bg-[#fff1cb]/5 transition-colors">
                          <td className="py-2 px-3 text-center text-[#fff1cb]/50 font-mono text-xs">
                            {index + 1}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              required
                              placeholder="e.g. George Mathew"
                              value={participant.name}
                              onChange={(e) => onUpdate(participant.id, "name", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-xs md:text-sm transition-colors"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              required
                              value={participant.gender}
                              onChange={(e) =>
                                onUpdate(participant.id, "gender", e.target.value as "Male" | "Female")
                              }
                              className={`w-full px-3 py-1.5 rounded-xl bg-[#2d0c1b] border focus:border-[#63752e] focus:outline-none text-xs md:text-sm transition-colors ${
                                !participant.gender
                                  ? "border-amber-400/50 text-[#fff1cb]/60"
                                  : "border-[#fff1cb]/20 text-[#fff1cb]"
                              }`}
                            >
                              <option value="" disabled className="bg-[#2d0c1b] text-[#fff1cb]/40">
                                Select Gender *
                              </option>
                              <option value="Male" className="bg-[#2d0c1b] text-[#fff1cb]">
                                Male
                              </option>
                              <option value="Female" className="bg-[#2d0c1b] text-[#fff1cb]">
                                Female
                              </option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={participant.role}
                              onChange={(e) => onUpdate(participant.id, "role", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#2d0c1b] border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] text-xs md:text-sm transition-colors"
                            >
                              {event.defaultRoles.map((role) => (
                                <option key={role} value={role} className="bg-[#2d0c1b]">
                                  {role}
                                </option>
                              ))}
                              {!event.defaultRoles.includes(participant.role) && participant.role && (
                                <option value={participant.role} className="bg-[#2d0c1b]">
                                  {participant.role}
                                </option>
                              )}
                            </select>
                          </td>
                          {isBattleOfBands && (
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                placeholder="e.g. Lead, Guitar, etc."
                                value={participant.notes || ""}
                                onChange={(e) => onUpdate(participant.id, "notes", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-[#2d0c1b]/80 border border-[#fff1cb]/20 focus:border-[#63752e] focus:outline-none text-[#fff1cb] placeholder:text-[#fff1cb]/30 text-xs transition-colors"
                              />
                            </td>
                          )}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => onRemove(participant.id)}
                              title="Remove participant"
                              className="p-1.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Hint footer */}
            <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-[#fff1cb]/60 px-1">
              <span>{event.descriptionHint}</span>
              <span className="font-mono">
                Min: {event.minParticipants} • Max: {event.maxParticipants}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

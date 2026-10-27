"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface WelcomeOverlayProps {
  isOpen: boolean;
  onEnter: (withSound: boolean) => void;
}

// Full-screen background elements shared across both door panels
function DoorBackgroundContent() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(97,30,60,0.65),rgba(18,3,11,0.98))]" />

      {/* Hardware-accelerated ambient glow gradients (zero blur filter cost on 3D perspective) */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(97,30,60,0.55)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(99,117,46,0.45)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,241,203,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,241,203,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,241,203,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

// Animation variants for double door split
const rootVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: {
    opacity: 1,
    transition: {
      duration: 2.5,
      when: "afterChildren",
    },
  },
};

const leftDoorVariants: Variants = {
  initial: {
    rotateY: 0,
    x: "0%",
    opacity: 1,
  },
  animate: {
    rotateY: 0,
    x: "0%",
    opacity: 1,
  },
  exit: {
    rotateY: -95,
    x: "-15%",
    opacity: 0,
    transition: {
      rotateY: {
        type: "spring",
        duration: 2.5,
        bounce: 0.15,
      },
      x: {
        type: "spring",
        duration: 2.5,
        bounce: 0.15,
      },
      opacity: {
        duration: 0.8,
        delay: 1.7,
        ease: "easeOut",
      },
    },
  },
};

const rightDoorVariants: Variants = {
  initial: {
    rotateY: 0,
    x: "0%",
    opacity: 1,
  },
  animate: {
    rotateY: 0,
    x: "0%",
    opacity: 1,
  },
  exit: {
    rotateY: 95,
    x: "15%",
    opacity: 0,
    transition: {
      rotateY: {
        type: "spring",
        duration: 2.5,
        bounce: 0.15,
      },
      x: {
        type: "spring",
        duration: 2.5,
        bounce: 0.15,
      },
      opacity: {
        duration: 0.8,
        delay: 1.7,
        ease: "easeOut",
      },
    },
  },
};

const doorShadowVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0 },
  exit: {
    opacity: 0.7,
    transition: {
      duration: 2.0,
      ease: "easeIn",
    },
  },
};

const lightBurstVariants: Variants = {
  initial: {
    opacity: 0,
    scaleY: 0.4,
    scaleX: 0.5,
  },
  animate: {
    opacity: 0,
    scaleY: 0.4,
    scaleX: 0.5,
  },
  exit: {
    opacity: [0, 1, 0.8, 0],
    scaleY: [0.4, 1, 1, 0.7],
    scaleX: [0.5, 6, 8, 0],
    transition: {
      duration: 1.4,
      ease: "easeOut",
    },
  },
};

const centerContentVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    filter: "blur(8px)",
    transition: {
      duration: 0.32,
      ease: "easeIn",
    },
  },
};

export default function WelcomeOverlay({ isOpen, onEnter }: WelcomeOverlayProps) {
  const [isOpening, setIsOpening] = useState(false);

  // Lock body scroll while overlay is visible
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleEnter = (withSound: boolean = true) => {
    if (isOpening) return;
    setIsOpening(true);
    onEnter(withSound);
  };

  // Support Enter / Space keyboard navigation
  useEffect(() => {
    if (!isOpen || isOpening) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnter(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isOpening]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="selah-welcome-overlay"
          variants={rootVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="selah-welcome-overlay fixed inset-0 z-[9999] overflow-hidden select-none cursor-default"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {/* ========================================================= */}
          {/* LEFT DOOR PANEL (Hinged on the left edge, swinging open)  */}
          {/* ========================================================= */}
          <motion.div
            variants={leftDoorVariants}
            className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden z-10"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform",
            }}
          >
            {/* Full-width canvas aligned to left, clipped to 50% width by door */}
            <div
              className="absolute top-0 left-0 h-full bg-[#12030b] pointer-events-none"
              style={{ width: "100vw" }}
            >
              <DoorBackgroundContent />
            </div>

            {/* Architectural door bevel / framing line */}
            <div className="absolute top-8 bottom-8 right-3 sm:right-6 left-3 sm:left-6 rounded-2xl border border-[#fff1cb]/[0.06] pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]" />

            {/* Vertical center split seam on the right edge of left door */}
            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#fff1cb]/30 to-transparent shadow-[1px_0_15px_rgba(0,0,0,0.8)] pointer-events-none z-20" />

            {/* Center decorative handle / emblem (Left half) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 sm:w-2.5 h-20 sm:h-24 rounded-l-full bg-gradient-to-b from-[#fff1cb]/40 via-[#e4bd64] to-[#fff1cb]/40 border-l border-t border-b border-[#fff1cb]/50 shadow-[-2px_0_12px_rgba(228,189,100,0.35)] pointer-events-none z-20" />

            {/* Dynamic 3D lighting shadow as the door swings open */}
            <motion.div
              variants={doorShadowVariants}
              className="absolute inset-0 bg-black pointer-events-none z-15"
            />
          </motion.div>

          {/* ========================================================== */}
          {/* RIGHT DOOR PANEL (Hinged on the right edge, swinging open) */}
          {/* ========================================================== */}
          <motion.div
            variants={rightDoorVariants}
            className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden z-10"
            style={{
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform",
            }}
          >
            {/* Full-width canvas aligned to right, clipped to 50% width by door */}
            <div
              className="absolute top-0 right-0 h-full bg-[#12030b] pointer-events-none"
              style={{ width: "100vw" }}
            >
              <DoorBackgroundContent />
            </div>

            {/* Architectural door bevel / framing line */}
            <div className="absolute top-8 bottom-8 left-3 sm:left-6 right-3 sm:right-6 rounded-2xl border border-[#fff1cb]/[0.06] pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]" />

            {/* Vertical center split seam on the left edge of right door */}
            <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#fff1cb]/30 to-transparent shadow-[-1px_0_15px_rgba(0,0,0,0.8)] pointer-events-none z-20" />

            {/* Center decorative handle / emblem (Right half) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 sm:w-2.5 h-20 sm:h-24 rounded-r-full bg-gradient-to-b from-[#fff1cb]/40 via-[#e4bd64] to-[#fff1cb]/40 border-r border-t border-b border-[#fff1cb]/50 shadow-[2px_0_12px_rgba(228,189,100,0.35)] pointer-events-none z-20" />

            {/* Dynamic 3D lighting shadow as the door swings open */}
            <motion.div
              variants={doorShadowVariants}
              className="absolute inset-0 bg-black pointer-events-none z-15"
            />
          </motion.div>

          {/* ========================================================= */}
          {/* GOLDEN LIGHT BURST FROM THE SEAM                          */}
          {/* ========================================================= */}
          <motion.div
            variants={lightBurstVariants}
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 sm:w-6 bg-gradient-to-b from-transparent via-[#fff1cb] to-transparent blur-md pointer-events-none z-25"
          />

          {/* ========================================================= */}
          {/* MAIN CENTER CONTENT MODAL                                 */}
          {/* ========================================================= */}
          <motion.div
            variants={centerContentVariants}
            className="relative z-30 flex items-center justify-center h-full w-full pointer-events-none"
          >
            <div className="max-w-xl w-full mx-4 px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center pointer-events-auto">
              {/* Typography: Title & Tagline */}
              <div className="space-y-2 mb-8">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] via-[#f7dda0] to-[#d6aa52] drop-shadow-lg">
                  SELAH 2026
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#fff1cb]/80">
                  Pause • Explore • Renew
                </p>
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto flex flex-col items-center gap-3">
                <button
                  type="button"
                  disabled={isOpening}
                  onClick={() => handleEnter(true)}
                  className="group relative w-full sm:w-72 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-[#18040d] bg-gradient-to-r from-[#fff1cb] via-[#fce6a8] to-[#e4bd64] shadow-[0_0_35px_rgba(255,241,203,0.35)] hover:shadow-[0_0_50px_rgba(255,241,203,0.55)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
                >
                  {/* Glowing light sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform ease-out pointer-events-none" />

                  <span className="tracking-wide">ENTER SELAH 2026</span>
                  <ArrowRight className="w-4 h-4 text-[#611e3c] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

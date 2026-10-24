"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";

interface WelcomeOverlayProps {
  isOpen: boolean;
  onEnter: (withSound: boolean) => void;
}

export default function WelcomeOverlay({ isOpen, onEnter }: WelcomeOverlayProps) {
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

  // Support Enter / Space keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onEnter(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onEnter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="selah-welcome-overlay"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="selah-welcome-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-[#12030b] overflow-hidden select-none cursor-default"
          style={{ willChange: "opacity, transform, filter" }}
        >
          {/* Dynamic Background Gradients & Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(97,30,60,0.65),rgba(18,3,11,0.98))]" />

          {/* Floating Ambient Glow Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#611e3c]/40 blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#63752e]/35 blur-[130px] pointer-events-none"
          />
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

          {/* Main Content Modal */}
          <div className="relative z-10 max-w-xl w-full mx-4 px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center">

            {/* Typography: Title & Tagline */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 mb-8"
            >
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff1cb] via-[#f7dda0] to-[#d6aa52] drop-shadow-lg">
                SELAH 2026
              </h1>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#fff1cb]/80">
                Pause • Explore • Renew
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="w-full sm:w-auto flex flex-col items-center gap-3"
            >
              {/* Primary: Enter with Music */}
              <button
                type="button"
                onClick={() => onEnter(true)}
                className="group relative w-full sm:w-72 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-[#18040d] bg-gradient-to-r from-[#fff1cb] via-[#fce6a8] to-[#e4bd64] shadow-[0_0_35px_rgba(255,241,203,0.35)] hover:shadow-[0_0_50px_rgba(255,241,203,0.55)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
              >
                {/* Glowing light sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform ease-out pointer-events-none" />

                <span className="tracking-wide">ENTER SELAH 2026</span>
                <ArrowRight className="w-4 h-4 text-[#611e3c] transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

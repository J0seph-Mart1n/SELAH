"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeOverlay from "./WelcomeOverlay";

interface ThemeMusicPlayerProps {
  hasEntered?: boolean;
  onEnter?: (withSound?: boolean) => void;
}

export default function ThemeMusicPlayer({
  hasEntered: controlledHasEntered,
  onEnter: controlledOnEnter,
}: ThemeMusicPlayerProps = {}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [internalHasEntered, setInternalHasEntered] = useState(false);

  const isControlled = controlledHasEntered !== undefined;
  const hasEntered = isControlled ? controlledHasEntered : internalHasEntered;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        sessionStorage.getItem("selah_has_entered") === "true" ||
        document.documentElement.classList.contains("selah-entered")
      ) {
        setInternalHasEntered(true);
      }
    }
  }, []);

  useEffect(() => {
    // Only run on the homepage
    if (!isHomepage) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    // Returning to homepage after having entered: resume music if not muted
    if (hasEntered && !isMuted) {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.volume = 0.35;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
    }
  }, [isHomepage, hasEntered, isMuted]);

  // Handle entry from the Welcome Overlay
  const handleEnter = (withSound: boolean = true) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selah_has_entered", "true");
      setTimeout(() => {
        document.documentElement.classList.add("selah-entered");
      }, 2500);
    }

    if (isControlled) {
      controlledOnEnter?.(withSound);
    } else {
      setInternalHasEntered(true);
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (withSound) {
      audio.muted = false;
      audio.volume = 0.35;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((err) => {
          console.warn("Audio play prevented:", err);
          setIsPlaying(false);
          setIsMuted(true);
        });
    } else {
      audio.pause();
      audio.muted = true;
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted || audio.paused) {
      audio.muted = false;
      audio.volume = 0.35;
      audio
        .play()
        .then(() => {
          setIsMuted(false);
          setIsPlaying(true);
        })
        .catch(() => {});
    } else {
      audio.muted = true;
      audio.pause();
      setIsMuted(true);
      setIsPlaying(false);
    }
  };

  // Only render and keep on the homepage
  if (!isHomepage) return null;

  return (
    <>
      {/* Welcome Overlay modal on arrival */}
      <WelcomeOverlay isOpen={!hasEntered} onEnter={handleEnter} />

      {/* Hidden background audio element */}
      <audio
        ref={audioRef}
        src="/top_page/FIFA_World_Cup_Theme.mp3"
        preload="auto"
        loop
        playsInline
      />

      {/* Floating Music Playing Box - Below Navbar on the right, visible once entered */}
      <AnimatePresence>
        {hasEntered && (
          <div className="fixed top-20 right-4 sm:top-22 sm:right-6 md:top-24 md:right-8 z-40 select-none">
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={toggleMute}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMute();
                }
              }}
              aria-label={isMuted ? "Unmute FIFA theme music" : "Mute FIFA theme music"}
              title={isMuted ? "Muted • Click to play" : "Playing • Click to mute"}
              className={`group flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full cursor-pointer backdrop-blur-xl border transition-all duration-300 shadow-xl ${
                !isMuted && isPlaying
                  ? "bg-[#611e3c]/90 border-[#63752e]/60 shadow-[0_4px_20px_rgba(97,30,60,0.5)] hover:border-[#63752e] hover:shadow-[0_4px_25px_rgba(99,117,46,0.45)]"
                  : "bg-[#611e3c]/75 border-[#fff1cb]/20 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-[#fff1cb]/40"
              }`}
            >
              {/* Speaker Icon with pulsating indicator */}
              <div className="relative flex items-center justify-center">
                <button
                  type="button"
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    !isMuted && isPlaying
                      ? "bg-[#63752e] text-[#fff1cb] shadow-sm shadow-[#63752e]/40 group-hover:scale-105"
                      : "bg-[#fff1cb]/10 text-[#fff1cb]/60 group-hover:bg-[#fff1cb]/20 group-hover:text-[#fff1cb]"
                  }`}
                  title={isMuted ? "Click to play/unmute" : "Click to mute"}
                >
                  {!isMuted && isPlaying ? (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
                  )}
                </button>

                {/* Glowing ring while active */}
                {!isMuted && isPlaying && (
                  <span className="absolute -inset-1 rounded-full bg-[#63752e]/25 animate-ping -z-10 pointer-events-none" />
                )}
              </div>

              {/* Animated Equalizer Wave Bars */}
              <div
                className="flex items-end gap-[2px] h-3.5 px-1 pr-1.5"
                aria-hidden="true"
              >
                {[0.4, 0.9, 0.6, 1.0].map((h, i) => (
                  <motion.span
                    key={i}
                    className={`w-[2.5px] rounded-full transition-colors duration-200 ${
                      !isMuted && isPlaying ? "bg-[#fff1cb]" : "bg-[#fff1cb]/30"
                    }`}
                    animate={
                      !isMuted && isPlaying
                        ? { height: ["3px", "14px", "5px", "12px", "3px"] }
                        : { height: "3px" }
                    }
                    transition={{
                      duration: 0.6 + i * 0.15,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

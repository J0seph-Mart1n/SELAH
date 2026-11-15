"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Users, User } from "lucide-react";

interface PriceUpdatePopupProps {
  visible?: boolean;
}

/**
 * Floating bottom-right notification displaying the updated SELAH 2026 registration fees.
 */
export default function PriceUpdatePopup({ visible = true }: PriceUpdatePopupProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const isOpen = visible && !isDismissed;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          role="region"
          aria-label="Updated registration prices notification"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm print:hidden"
        >
          <div className="relative overflow-hidden rounded-3xl bg-[#2d0c1b]/95 border border-[#63752e]/60 text-[#fff1cb] p-4 sm:p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_25px_rgba(99,117,46,0.25)]">
            {/* Subtle decorative corner glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#63752e]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#fff1cb]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[#fff1cb]">
                    Updated Event Prices!
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  aria-label="Close notification"
                  className="p-1.5 rounded-xl bg-[#4a162d]/80 hover:bg-[#611e3c] border border-[#fff1cb]/15 text-[#fff1cb]/75 hover:text-[#fff1cb] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price Rows */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#4a162d]/70 border border-[#fff1cb]/15">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#63752e]/30 border border-[#63752e]/50 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#fff1cb]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-[#fff1cb]">
                        Individual Event
                      </div>
                      <div className="text-[11px] text-[#fff1cb]/65">
                        Per participant
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 shrink-0 font-mono">
                    <span className="text-xs text-[#fff1cb]/45 line-through">
                      ₹250
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#fff1cb] bg-[#63752e] px-2.5 py-0.5 rounded-xl shadow-sm">
                      ₹200
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#4a162d]/70 border border-[#fff1cb]/15">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#63752e]/30 border border-[#63752e]/50 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#fff1cb]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-[#fff1cb]">
                        Group Event
                      </div>
                      <div className="text-[11px] text-[#fff1cb]/65">
                        Per team
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 shrink-0 font-mono">
                    <span className="text-xs text-[#fff1cb]/45 line-through">
                      ₹800
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#fff1cb] bg-[#63752e] px-2.5 py-0.5 rounded-xl shadow-sm">
                      ₹500
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

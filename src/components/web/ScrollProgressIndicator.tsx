"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  
  // Emil Kowalski craft: smooth spring damping for natural physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-black/10">
      <motion.div
        className="h-full bg-gradient-to-r from-[#fff1cb] via-[#9eb845] to-[#63752e] origin-left shadow-[0_0_10px_rgba(255,241,203,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
}


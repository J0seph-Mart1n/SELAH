"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/web/Navbar";
import Footer from "@/components/web/Footer";
import Silk from "@/components/ui/Silk";


export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#611e3c] text-[#fff1cb] relative overflow-x-hidden selection:bg-[#63752e] selection:text-[#fff1cb]">
      {/* Background Silk Simulation */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <Silk
          color="#611e3c"
          sheenColor="#fff1cb"
          speed={2}
          scale={1}
          noiseIntensity={1.2}
          rotation={0}
          sheen={0.7}
          depth={0.5}
          glow={0.3}
          wave={1.2}
        />
      </div>

      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#63752e]/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-[#fff1cb]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-24 min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">

          {/* Central Revealing Soon Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative w-full max-w-3xl mx-auto p-10 sm:p-16 rounded-3xl bg-[#fff1cb]/10 border border-[#fff1cb]/20 backdrop-blur-xl shadow-2xl text-center overflow-hidden flex items-center justify-center"
          >
            {/* Ambient decorative gradient behind the card */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#63752e]/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#fff1cb]/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center">

              {/* Revealing Soon Headline */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-[#fff1cb] uppercase drop-shadow-md m-0">
                Revealing Soon
              </h2>

            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

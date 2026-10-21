"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Navbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/StaggeredMenu";
import Footer from "@/components/Footer";
import Silk from "@/components/Silk";


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

      {/* Desktop Navigation */}
      <div className="relative z-50">
        <Navbar className="selah-rnav">
          <NavBody>
            <Link
              className="brand relative z-20 flex items-center gap-2.5 transition-all duration-300 group-data-[shrunk=true]:gap-0"
              href="/"
              aria-label="SELAH 2026 home"
              style={{ textDecoration: "none" }}
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
                <Link href="/" aria-label="SELAH 2026 home" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
                  <Image
                    src="/top_page/Selah_Logo.png"
                    alt="SELAH 2026 Logo"
                    width={34}
                    height={34}
                    priority
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full object-contain shrink-0"
                  />
                  <strong className="text-2xl text-[#fff1cb]">
                    SELAH 2026
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

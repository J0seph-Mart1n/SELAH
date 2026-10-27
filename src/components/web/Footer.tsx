"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import ParticleText from "@/components/ui/ParticleText";

interface QuickLink {
  label: string;
  href: string;
  target?: string
}

const QUICK_LINKS: QuickLink[] = [
  { label: "Registration Form", href: "/register" },
  { label: "Events", href: "/#events" },
  { label: "Rules", href: "/rules" },
  { label: "About CYA", href: "/about-cya" },
  { label: "Gallery", href: "/gallery" },
];

export default function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden flex flex-col justify-between min-h-[500px] bg-[#611e3c] text-[#fff1cb] border-t border-[#63752e]/30 z-10 font-sans">
      <div className="footer-grid relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
        {/* Brand Column */}
        <div className="flex flex-col h-full">
          <Link className="brand flex items-center gap-3 text-[#fff1cb] mb-6 group w-fit" href="/">
             <Image
                          src="/top_page/Selah_Logo_BG.png"
                          alt="SELAH 2026 Logo"
                          width={40}
                          height={40}
                          priority
                          className="w-9 h-9 md:w-10 md:h-10 rounded-full object-contain shrink-0 transition-transform duration-200 hover:scale-105"
              />
            <div className="text-[22px] font-bold tracking-wide">
              SELAH <span className="text-[#fff1cb]">2026</span>
            </div>
          </Link>
          <p className="text-[#fff1cb]/80 text-sm leading-relaxed max-w-sm">
            The official inter-church youth cultural & sports festival
            uniting congregations in athletics, creative expressions.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="!text-[#fff1cb] !font-sans !font-semibold !text-sm !tracking-wider !uppercase">Quick Links</h3>
          <div className="footer-links flex flex-col gap-3 mt-5">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.target}
                rel="noopener noreferrer"
                className="text-[#fff1cb]/75 hover:text-[#fff1cb] text-sm transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social / Connect Column */}
        <div className="flex flex-col">
          <h3 className="!text-[#fff1cb] !font-sans !font-semibold mb-5 !text-sm !tracking-widest !uppercase">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/cyapune/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CYA Pune on Instagram"
              className="w-10 h-10 rounded-full bg-[#fff1cb]/10 border border-[#fff1cb]/20 flex items-center justify-center text-[#fff1cb]/80 hover:text-[#fff1cb] hover:bg-[#63752e]/30 hover:border-[#63752e]/50 hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <SiInstagram size={18} />
            </a>
          </div>

          
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-center w-full px-6 mt-12 mb-1">
        <p className="text-xs sm:text-sm text-[#fff1cb]/80 flex items-center justify-center gap-1.5 font-medium whitespace-nowrap text-center">
          Made with <span className="text-red-500 inline-block text-sm sm:text-base">❤️</span> by Joseph and Aaron
        </p>
      </div>

      {/* Massive Background Interactive Particle Text */}
      <div className="w-full h-[20vw] min-h-[220px] flex justify-center items-end mt-auto select-none relative z-0 translate-y-[22%] overflow-hidden pointer-events-none">
        <ParticleText
          style={{}}
          text="SELAH"
          particleSize={2.2}
          density={5}
          color="#fff1cb"
          highlightColor="#63752e"
          scatter={190}
          gatherDuration={1600}
          stagger={420}
          pointerRepel={42}
          repelRadius={120}
          idleDrift={0.8}
          trigger="click"
          fontSize="24vw"
          fontWeight={900}
          fontFamily="inherit"
          className="leading-none tracking-tighter opacity-45 pointer-events-auto"
          glow={false}
        />
      </div>

    </footer>
  );
}

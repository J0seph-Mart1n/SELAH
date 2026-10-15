"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import ParticleText from "./ParticleText";

interface QuickLink {
  label: string;
  href: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "Registration Form", href: "/#pricing" },
  { label: "Events", href: "/#events" },
  { label: "Rules", href: "/rules" },
  { label: "About CYA", href: "/about-cya" },
  { label: "Gallery", href: "/#faq" },
];

export default function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden flex flex-col justify-between min-h-[500px] bg-[#050b20] text-white border-t border-white/10 z-10 font-sans">
      <div className="footer-grid relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
        {/* Brand Column */}
        <div className="flex flex-col h-full">
          <Link className="brand flex items-center gap-3 text-white mb-6 group w-fit" href="/">
            <div className="brand-mark bg-[#ffbd61] text-[#281506] p-1.5 rounded flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <Sparkles size={18} />
            </div>
            <div className="text-xl font-bold tracking-wide">
              SELAH <span className="text-[#f69b22]">2026</span>
            </div>
          </Link>
          <p className="text-[#8492b1] text-sm leading-relaxed max-w-sm">
            The official inter-church youth cultural & sports festival
            uniting congregations in athletics, creative expressions.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="!text-white !font-sans !font-semibold !text-sm !tracking-wider !uppercase">Quick Links</h3>
          <div className="footer-links flex flex-col gap-3 mt-5">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#8492b1] hover:text-[#ffbd61] text-sm transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social / Connect Column */}
        <div className="flex flex-col">
          <h3 className="!text-white !font-sans !font-semibold mb-5 !text-sm !tracking-widest !uppercase">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/cyapune/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CYA Pune on Instagram"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#ffbd61] hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <SiInstagram size={18} />
            </a>
          </div>
          <p className="text-[#8492b1] text-xs mt-4 max-w-xs leading-relaxed">
            Stay tuned to official announcements, fixtures, and media drops.
          </p>
        </div>
      </div>

      {/* Massive Background Interactive Particle Text */}
      <div className="w-full h-[20vw] min-h-[220px] flex justify-center items-end mt-auto select-none relative z-0 translate-y-[22%] overflow-hidden pointer-events-none">
        <ParticleText
          style={{}}
          text="SELAH"
          particleSize={2.2}
          density={5}
          color="#ffffff"
          highlightColor="#ffbd61"
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
          className="leading-none tracking-tighter opacity-40 pointer-events-auto"
          glow={false}
        />
      </div>

    </footer>
  );
}

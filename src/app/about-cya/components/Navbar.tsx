"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

// Same links as the SELAH home navbar; hash links point back to the home page.
const NAV_LINKS = [
  { name: "Home", link: "/" },
  { name: "Register", link: "/register" },
  { name: "Rules", link: "/rules" },
  { name: "Core Team", link: "/about-cya" },
  { name: "Gallery", link: "/gallery" },
];

function BrandLogo() {
  return (
    <Link
      className="brand relative z-20 flex items-center gap-2.5 transition-all duration-300 group-data-[shrunk=true]:gap-0"
      href="/"
      aria-label="CYA, back to home"
      style={{ textDecoration: "none" }}
    >
      <Image
        src="/cya/CYA_Logo.png"
        alt="Carmel Youth Association logo"
        width={40}
        height={40}
        priority
        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-contain shrink-0 transition-transform duration-200 hover:scale-105"
      />
      <div className="transition-all duration-300 group-data-[shrunk=true]:w-0 group-data-[shrunk=true]:opacity-0 overflow-hidden whitespace-nowrap">
        <strong className="text-2xl text-[#fff1cb]">
          CYA
        </strong>
      </div>
    </Link>
  );
}

function MobileBrandLogo() {
  return (
    <div className="brand relative z-20 flex items-center">
      <Link
        href="/"
        aria-label="CYA, back to home"
        className="flex items-center gap-2.5"
        style={{ textDecoration: "none" }}
      >
        <Image
          src="/cya/CYA_Logo.png"
          alt="Carmel Youth Association logo"
          width={34}
          height={34}
          priority
          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-contain shrink-0"
        />
        <strong className="text-2xl text-[#fff1cb]">
          CYA
        </strong>
      </Link>
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="relative z-50 cya-nav-shell">
      {/* Desktop Navigation */}
      <ResizableNavbar className="cya-rnav">
        <NavBody>
          <BrandLogo />
          <NavItems items={NAV_LINKS} />
        </NavBody>
      </ResizableNavbar>

      {/* Mobile Navigation */}
      <div className="relative z-50 lg:hidden cya-smenu">
        <StaggeredMenu
          isFixed={true}
          logo={<MobileBrandLogo />}
          items={NAV_LINKS.map(({ name, link }) => ({ label: name, link }))}
          colors={[
            "rgba(97, 30, 60, 0.75)",
            "rgba(99, 117, 46, 0.75)",
            "rgba(255, 241, 203, 0.8)",
            "rgba(97, 30, 60, 0.85)",
          ]}
          accentColor="#63752e"
          menuButtonColor="#fff1cb"
          openMenuButtonColor="#fff1cb"
        />
      </div>
    </div>
  );
}

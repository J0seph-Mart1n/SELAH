"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

export interface NavItem {
  name: string;
  link: string;
  target?: string;
  rel?: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
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
  );
}

function MobileBrandLogo() {
  return (
    <div className="brand relative z-20 flex items-center">
      <Link
        href="/"
        aria-label="SELAH 2026 home"
        className="flex items-center gap-2.5"
        style={{ textDecoration: "none" }}
      >
        <Image
          src="/top_page/Selah_Logo.png"
          alt="SELAH 2026 Logo"
          width={34}
          height={34}
          priority
          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-contain shrink-0"
        />
        <strong className="text-2xl text-[#fff1cb]">
          SELAH <span className="text-[#63752e]">2026</span>
        </strong>
      </Link>
    </div>
  );
}

export interface NavbarProps {
  className?: string;
  items?: NavItem[];
  hideHome?: boolean;
}

export default function Navbar({
  className = "",
  items = DEFAULT_NAV_ITEMS,
  hideHome,
}: NavbarProps) {
  const pathname = usePathname();
  const shouldHideHome = hideHome ?? (pathname === "/");

  const effectiveItems = items.filter((item) => {
    if (shouldHideHome && (item.link === "/" || item.name.toLowerCase() === "home")) {
      return false;
    }
    return true;
  });

  const staggeredItems = effectiveItems.map((item) => ({
    label: item.name,
    link: item.link,
    target: item.target,
    rel: item.rel,
  }));

  return (
    <div className={`relative z-50 ${className}`.trim()}>
      {/* Desktop Navigation */}
      <ResizableNavbar className="selah-rnav">
        <NavBody>
          <BrandLogo />
          <NavItems items={effectiveItems} />
        </NavBody>
      </ResizableNavbar>

      {/* Mobile Navigation */}
      <div className="relative z-50 lg:hidden selah-smenu">
        <StaggeredMenu
          isFixed={true}
          logo={<MobileBrandLogo />}
          items={staggeredItems as any}
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

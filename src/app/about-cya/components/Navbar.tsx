"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import StaggeredMenu from "@/components/StaggeredMenu";

// Same links as the SELAH home navbar; hash links point back to the home page.
const NAV_LINKS = [
  { name: "Registration", link: "/#events" },
  { name: "Rules", link: "/#delegations" },
  { name: "About CYA", link: "/about-cya" },
  { name: "Gallery", link: "/#faq" },
];

function Brand({ collapsible = false }: { collapsible?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="CYA, back to home"
      className="relative z-20 flex items-center gap-3"
      style={{ textDecoration: "none" }}
    >
      <Image
        src="/cya/CYA_Logo.png"
        alt="Carmel Youth Association logo"
        width={44}
        height={44}
        priority
        className="h-11 w-11 rounded-full object-contain"
      />
      <div
        className={
          collapsible
            ? "overflow-hidden whitespace-nowrap transition-all duration-300 group-data-[shrunk=true]:w-0 group-data-[shrunk=true]:opacity-0"
            : "whitespace-nowrap"
        }
      >
        <span className="cya-nav__brand">
          CYA<span aria-hidden="true">.</span>
        </span>
      </div>
    </Link>
  );
}

export default function Navbar() {
  return (
    <>
      {/* Desktop: resizable navbar (same as SELAH page) */}
      <ResizableNavbar className="cya-rnav">
        <NavBody>
          <Brand collapsible />
          <NavItems items={NAV_LINKS} className="cya-rnav__links" />
        </NavBody>
      </ResizableNavbar>

      {/* Mobile: staggered menu (same as SELAH page) */}
      <div className="relative z-50 lg:hidden">
        <StaggeredMenu
          isFixed={true}
          className="cya-smenu"
          logo={<Brand />}
          items={
            NAV_LINKS.map(({ name, link }) => ({ label: name, link })) as any
          }
          // CYA page tokens (resolve from .cya-page, so dark mode follows)
          colors={["var(--sand)", "var(--sage)", "var(--accent)"]}
          accentColor="var(--accent)"
          menuButtonColor="var(--ink)"
          openMenuButtonColor="var(--ink)"
        />
      </div>
    </>
  );
}

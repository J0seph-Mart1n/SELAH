"use client";

import Link from "next/link";

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <header className={`cya-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="cya-nav__inner">
        <Link className="cya-nav__brand" href="/" aria-label="CYA, back to home">
          CYA<span aria-hidden="true">.</span>
        </Link>
      </div>
    </header>
  );
}

"use client";

import { Cormorant_Garamond, Outfit } from "next/font/google";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Team from "./components/Team";
import "./about.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/*
 * ABOUT CYA: team intro.
 * Copy, team roster: data/content.ts (EDIT: markers).
 */
export default function AboutCYA() {
  return (
    <div className={`cya-page ${serif.variable} ${outfit.variable}`}>
      <Navbar />
      <main className="cya-main" id="content">
        <Hero />
        <Team />
      </main>
    </div>
  );
}

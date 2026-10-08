"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "../hooks";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  className?: string;
}

/** Fade-and-rise on scroll into view (IntersectionObserver). */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.12 });

  return (
    <div
      ref={ref}
      className={`cya-reveal${inView ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

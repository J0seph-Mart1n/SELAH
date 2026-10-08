"use client";

import { useState } from "react";
import type { TeamMember } from "../data/content";

function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter((w) => w.length > 1 || /[A-Za-z]/.test(w));
  return words
    .slice(0, 2)
    .map((w) => w.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase())
    .join("");
}

export default function TeamCard({ member }: { member: TeamMember }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = initialsOf(member.name);

  return (
    <div className="tcard">
      <span className="tcard__core">
        <span className="tcard__figure">
          <span className="tcard__portrait">
            {imgFailed || !member.photo ? (
              <span className="tcard__initials" aria-hidden="true">
                {initials}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- onError initials fallback requires plain <img>
              <img
                src={member.photo}
                alt={`${member.name}, ${member.role}`}
                width={148}
                height={148}
                loading="lazy"
                decoding="async"
                onError={() => setImgFailed(true)}
              />
            )}
            <span className="tcard__tint" aria-hidden="true" />
          </span>

          <svg className="tcard__ring" viewBox="0 0 156 156" aria-hidden="true">
            <circle cx="78" cy="78" r="75" />
          </svg>
        </span>

        <span className="tcard__meta">
          <span className="tcard__bullet" aria-hidden="true" />
          <span className="tcard__name">{member.name}</span>
          <span className="tcard__role">{member.role}</span>
        </span>
      </span>
    </div>
  );
}

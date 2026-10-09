"use client";

import { useState } from "react";
import type { TeamMember } from "../data/content";
import ProfileCard from "@/components/ProfileCard";

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
    <ProfileCard
      name={member.name}
      title={member.role}
      handle={member.group}
      status="CYA Team"
      showUserInfo={false}
      avatarUrl={member.photo || ""}
      grainUrl="/profilecard/grain.webp"
      behindGlowEnabled={true}
      behindGlowColor="#ffbd61"
      innerGradient="linear-gradient(145deg, #2a2a2a 0%, #111111 100%)"
    />
  );
}

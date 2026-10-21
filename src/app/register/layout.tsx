import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration Form | SELAH 2026",
  description:
    "Official Parish squad registration portal for SELAH 2026 Inter-Church Youth Festival at Carmel Parish, Wadgaonsheri, Pune. Register participants for sports and cultural events.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

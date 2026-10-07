import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet the Team · CYA",
  description:
    "Meet the twelve hearts behind the Carmel Youth Association: the director, guides, office bearers, and the Key Army keeping CYA moving.",
  openGraph: {
    title: "Meet the Team · CYA",
    description: "Twelve hearts, one mission. The people behind Carmel Youth Association.",
  },
};

export default function AboutCYALayout({ children }: LayoutProps<"/about-cya">) {
  return children;
}

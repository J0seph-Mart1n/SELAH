import { Leaf } from "lucide-react";
import { hero } from "../data/content";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="cya-hero" id="top" aria-labelledby="cya-hero-title">
      <div className="cya-container cya-hero__inner">
        <Reveal>
          <p className="cya-hero__eyebrow">
            {hero.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h1 id="cya-hero-title" className="cya-hero__title">
            Meet <em>{hero.accentWord}</em> team
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="cya-hero__intro">{hero.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

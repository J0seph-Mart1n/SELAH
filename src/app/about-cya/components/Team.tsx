import { team, teamGroups, type TeamGroup, type TeamMember } from "../data/content";
import TeamCard from "./TeamCard";
import Reveal from "./Reveal";

export default function Team() {
  const inGroup = (g: TeamGroup): TeamMember[] => team.filter((m) => m.group === g);

  return (
    <section className="cya-team" id="team" aria-label="The team">
      <div className="cya-container">
        <div className="cteam__grid">
          {teamGroups.map((group, groupIndex) => (
            <div className="cteam__group" key={group}>
              <Reveal delay={groupIndex * 120}>
                <p className="cteam__group-label">
                  <span aria-hidden="true" />
                  {group}
                  <span aria-hidden="true" />
                </p>
                <div className="cteam__row">
                  {inGroup(group).map((m) => (
                    <TeamCard key={m.id} member={m} />
                  ))}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

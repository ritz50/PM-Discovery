"use client";

import { useEffect, useState } from "react";
import type { Curriculum, TopicMastery } from "@/lib/types";
import { computeAllMastery } from "@/lib/mastery";
import { loadProgress } from "@/lib/storage";
import { Breadcrumbs } from "./Breadcrumbs";
import { TopicCard } from "./TopicCard";

function phaseSlug(phaseId: string) {
  return `phase-${phaseId}`;
}

export function ClientTopics({
  curriculum,
  topicConceptMap,
  moduleConceptIds,
}: {
  curriculum: Curriculum;
  topicConceptMap: Record<string, string[]>;
  moduleConceptIds: Record<string, string[]>;
}) {
  const [masteries, setMasteries] = useState<TopicMastery[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setMasteries(computeAllMastery(curriculum, loadProgress(), moduleConceptIds));
  }, [curriculum, moduleConceptIds]);

  const filteredTopics = curriculum.topics.filter(
    (t) =>
      !filter ||
      t.title.toLowerCase().includes(filter.toLowerCase()) ||
      t.interviewTags.some((tag) => tag.includes(filter.toLowerCase()))
  );

  const visiblePhases = curriculum.phases.filter((phase) =>
    filteredTopics.some((t) => t.phase === phase.id)
  );

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "Learn" }]} />

      <input
        type="search"
        placeholder="Search topics or tags (e.g. interview-heavy)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="input"
      />

      {visiblePhases.length > 1 && (
        <nav
          className="sticky top-[57px] z-40 -mx-1 flex flex-wrap gap-2 border-b py-3 backdrop-blur-md"
          style={{
            borderColor: "var(--border)",
            background: "rgba(11, 6, 24, 0.9)",
          }}
          aria-label="Jump to phase"
        >
          {visiblePhases.map((phase) => {
            const count = filteredTopics.filter((t) => t.phase === phase.id).length;
            return (
              <a
                key={phase.id}
                href={`#${phaseSlug(phase.id)}`}
                className="rounded-lg px-3 py-1.5 text-sm no-underline transition-colors"
                style={{
                  color: "var(--fg-secondary)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                {phase.title}
                <span className="ml-1.5 text-xs" style={{ color: "var(--muted)" }}>
                  ({count})
                </span>
              </a>
            );
          })}
        </nav>
      )}

      {curriculum.phases.map((phase) => {
        const phaseTopics = filteredTopics.filter((t) => t.phase === phase.id);
        if (phaseTopics.length === 0) return null;
        return (
          <section key={phase.id} id={phaseSlug(phase.id)} className="scroll-mt-28">
            <h2 className="section-title mb-1">{phase.title}</h2>
            <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
              {phase.description} · {phaseTopics.length} topic{phaseTopics.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {phaseTopics.map((topic) => {
                const m = masteries.find((x) => x.topicId === topic.id);
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    status={m?.status ?? "not_started"}
                    mastery={m?.mastery ?? 0}
                    conceptCount={topicConceptMap[topic.id]?.length ?? 0}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

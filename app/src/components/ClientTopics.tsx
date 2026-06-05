"use client";

import { useEffect, useState } from "react";
import type { Curriculum, TopicMastery } from "@/lib/types";
import { computeAllMastery } from "@/lib/mastery";
import { loadProgress } from "@/lib/storage";
import { TopicCard } from "./TopicCard";

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

  return (
    <div className="space-y-10">
      <input
        type="search"
        placeholder="Search topics or tags (e.g. interview-heavy)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="input"
      />

      {curriculum.phases.map((phase) => {
        const phaseTopics = filteredTopics.filter((t) => t.phase === phase.id);
        if (phaseTopics.length === 0) return null;
        return (
          <section key={phase.id}>
            <h2 className="section-title mb-1">{phase.title}</h2>
            <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
              {phase.description}
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

"use client";

import { useEffect, useState } from "react";
import type { Curriculum, Gap, RecommendedAction, TopicMastery } from "@/lib/types";
import {
  detectGaps,
  exportGapSnapshot,
  getRecommendedActions,
  getTopicsInProgress,
  computeAllMastery,
} from "@/lib/mastery";
import {
  hasPracticeAttempts,
  countTopicsPracticed,
  buildInterviewTopicMap,
  buildCaseTopicMap,
} from "@/lib/progress-utils";
import { loadProgress } from "@/lib/storage";
import { MasteryBadge } from "./MasteryBadge";
import { Button, Card, Section, StatCard, TextLink } from "./ui";

const gapLabels: Record<Gap["type"], string> = {
  knowledge: "Knowledge gap",
  coverage: "Coverage gap",
  application: "Application gap",
  decay: "Decay gap",
};

type PracticeMeta = {
  interviewQuestions: { id: string; topicIds: string[] }[];
  caseStudies: { id: string; topicIds: string[] }[];
};

export function ClientDashboard({
  curriculum,
  moduleConceptIds,
  interviewQuestions,
  caseStudies,
}: {
  curriculum: Curriculum;
  moduleConceptIds: Record<string, string[]>;
  interviewQuestions: { id: string; topicIds: string[] }[];
  caseStudies: { id: string; topicIds: string[] }[];
}) {
  const [hasAttempts, setHasAttempts] = useState(false);
  const [inProgress, setInProgress] = useState<TopicMastery[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [streak, setStreak] = useState(0);
  const [topicsPracticed, setTopicsPracticed] = useState(0);

  const meta: PracticeMeta = { interviewQuestions, caseStudies };

  useEffect(() => {
    const p = loadProgress();
    const masteries = computeAllMastery(curriculum, p, moduleConceptIds);
    const attempted = hasPracticeAttempts(p);

    setHasAttempts(attempted);
    setStreak(p.streakDays);
    setTopicsPracticed(
      countTopicsPracticed(
        curriculum,
        p,
        moduleConceptIds,
        buildInterviewTopicMap(interviewQuestions),
        buildCaseTopicMap(caseStudies)
      )
    );
    setActions(
      getRecommendedActions(
        curriculum,
        p,
        moduleConceptIds,
        interviewQuestions,
        caseStudies
      )
    );

    if (attempted) {
      setInProgress(
        getTopicsInProgress(
          masteries,
          curriculum,
          p,
          moduleConceptIds,
          interviewQuestions,
          caseStudies
        ).slice(0, 5)
      );
      setGaps(detectGaps(curriculum, p, moduleConceptIds, interviewQuestions, caseStudies));
    } else {
      setInProgress([]);
      setGaps([]);
    }
  }, [curriculum, moduleConceptIds, interviewQuestions, caseStudies]);

  function exportSnapshot() {
    const snapshot = exportGapSnapshot(
      curriculum,
      loadProgress(),
      moduleConceptIds,
      meta.interviewQuestions,
      meta.caseStudies
    );
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gaps-snapshot.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Streak" value={`${streak} days`} />
        <StatCard
          label="Topics practiced"
          value={`${topicsPracticed}/${curriculum.topics.length}`}
        />
        <StatCard
          label="Gaps detected"
          value={hasAttempts ? gaps.length : "—"}
        />
      </section>

      {!hasAttempts && (
        <Card>
          <p className="font-medium" style={{ color: "var(--fg)" }}>
            Complete a practice session to unlock analysis
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Progress tracking and gap analysis unlock after you attempt active recall, a quiz, a mock
            interview, or a case study.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <TextLink href="/recall">Start recall</TextLink>
            <TextLink href="/interview">Mock interview</TextLink>
            <TextLink href="/cases">Case study</TextLink>
          </div>
        </Card>
      )}

      {actions.length > 0 && (
        <Section title={hasAttempts ? "Recommended next" : "Get started"}>
          <ul className="space-y-2">
            {actions.map((a, i) => (
              <li key={i}>
                <Card className="!p-3">
                  <TextLink href={a.href}>{a.message}</TextLink>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {hasAttempts && inProgress.length > 0 && (
        <Section title="Topics in progress">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Topics you have started practicing — keep going to build mastery.
          </p>
          <ul className="mt-3 space-y-2">
            {inProgress.map((m) => {
              const topic = curriculum.topics.find((x) => x.id === m.topicId)!;
              return (
                <li key={m.topicId}>
                  <Card className="flex items-center justify-between !p-3">
                    <TextLink href={`/topics/${m.topicId}`} className="!text-base !font-medium">
                      {topic.title}
                    </TextLink>
                    <MasteryBadge status={m.status} mastery={m.mastery} />
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {hasAttempts && (
        <Section
          title="Gap analysis"
          action={
            <Button variant="ghost" onClick={exportSnapshot}>
              Export for Cursor
            </Button>
          }
        >
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Gaps are inferred from recall lapses, quiz scores, interview ratings, and case
            self-scores — only for topics you have practiced.
          </p>
          {gaps.length === 0 ? (
            <Card className="mt-3">
              <p style={{ color: "var(--muted)" }}>No gaps detected in practiced topics. Keep going!</p>
            </Card>
          ) : (
            <ul className="mt-3 space-y-3">
              {gaps.map((g) => (
                <li key={`${g.topicId}-${g.type}`}>
                  <Card>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: "var(--muted)" }}
                      >
                        {gapLabels[g.type]}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        · {g.mastery}% mastery
                      </span>
                    </div>
                    <p className="font-medium" style={{ color: "var(--fg)" }}>
                      {g.message}
                    </p>
                    <TextLink href={g.actionHref} className="mt-2 inline-block text-sm">
                      {g.action}
                    </TextLink>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}
    </div>
  );
}

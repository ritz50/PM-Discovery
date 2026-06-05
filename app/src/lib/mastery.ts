import type {
  Curriculum,
  Gap,
  GapType,
  MasteryStatus,
  ProgressData,
  RecommendedAction,
  Topic,
  TopicMastery,
} from "./types";
import {
  hasPracticeAttempts,
  topicHasFullPracticeCheck,
  buildInterviewTopicMap,
  buildCaseTopicMap,
  countTopicsPracticed,
} from "./progress-utils";
import { getTopicConceptIds } from "./topic-utils";
import { isDue } from "./sm2";

const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;

function statusFromMastery(mastery: number, hasActivity: boolean): MasteryStatus {
  if (!hasActivity) return "not_started";
  if (mastery >= 75) return "solid";
  // Early practice scores low by design — treat as in-progress, not "weak"
  return "learning";
}

function recallScoreForConcepts(conceptIds: string[], progress: ProgressData): number {
  if (conceptIds.length === 0) return 0;
  const now = Date.now();
  let score = 0;
  let attempted = 0;

  for (const id of conceptIds) {
    const card = progress.cards[id];
    if (!card) continue;
    attempted += 1;
    const recent = card.lastReviewed && now - card.lastReviewed < FOURTEEN_DAYS;
    if (recent && card.lastRating && card.lastRating >= 4) score += 1;
    else if (recent && card.lastRating && card.lastRating >= 3) score += 0.6;
    else if (card.lapses > 0) score += 0.2;
  }

  if (attempted === 0) return 0;
  return Math.round((score / conceptIds.length) * 100);
}

function quizScoreForModules(moduleIds: string[], progress: ProgressData): number {
  const relevant = progress.quizzes.filter((q) => moduleIds.includes(q.moduleId));
  if (relevant.length === 0) return 0;
  const best = Math.max(...relevant.map((q) => (q.score / q.total) * 100));
  return Math.round(best);
}

function applicationScoreForTopic(topicId: string, progress: ProgressData): number {
  const interviews = progress.interviews.filter((i) => i.questionId);
  const cases = progress.cases;
  if (interviews.length === 0 && cases.length === 0) return 0;

  const interviewRatings = interviews.map((i) => {
    if (i.rating <= 1) return 0.2;
    if (i.rating <= 3) return 0.5;
    if (i.rating <= 4) return 0.8;
    return 1;
  });
  const caseRatings = cases.map((c) => c.selfScore / 5);
  const all = [...interviewRatings, ...caseRatings];
  return Math.round((all.reduce((a, b) => a + b, 0) / all.length) * 100);
}

function coverageScore(conceptIds: string[], progress: ProgressData): number {
  if (conceptIds.length === 0) return 0;
  const attempted = conceptIds.filter(
    (id) => progress.cards[id] || progress.quizzes.some(() => true)
  );
  const withCards = conceptIds.filter((id) => progress.cards[id]);
  return Math.round((withCards.length / conceptIds.length) * 100);
}

function countDueCards(conceptIds: string[], progress: ProgressData): number {
  return conceptIds.filter((id) => {
    const card = progress.cards[id];
    return card && isDue(card);
  }).length;
}

export function computeTopicMastery(
  topic: Topic,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>
): TopicMastery {
  const conceptIds = getTopicConceptIds(topic, moduleConceptIds);
  const recall = recallScoreForConcepts(conceptIds, progress);
  const quiz = quizScoreForModules(topic.moduleIds, progress);
  const application = applicationScoreForTopic(topic.id, progress);
  const coverage = coverageScore(conceptIds, progress);
  const dueCards = countDueCards(conceptIds, progress);

  const hasActivity =
    progress.visitedTopics.includes(topic.id) ||
    recall > 0 ||
    quiz > 0 ||
    coverage > 0;

  let mastery = 0;
  if (hasActivity) {
    mastery = Math.round(recall * 0.4 + quiz * 0.3 + application * 0.2 + coverage * 0.1);
  }

  return {
    topicId: topic.id,
    mastery,
    status: statusFromMastery(mastery, hasActivity),
    recallScore: recall,
    quizScore: quiz,
    applicationScore: application,
    coverageScore: coverage,
    dueCards,
  };
}

export function computeAllMastery(
  curriculum: Curriculum,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>
): TopicMastery[] {
  return curriculum.topics.map((t) => computeTopicMastery(t, progress, moduleConceptIds));
}

type PracticeContext = {
  moduleConceptIds: Record<string, string[]>;
  interviewTopicMap: Map<string, string[]>;
  caseTopicMap: Map<string, string[]>;
};

function gapType(
  topic: Topic,
  m: TopicMastery,
  progress: ProgressData,
  ctx: PracticeContext
): GapType | null {
  const practiced = topicHasFullPracticeCheck(
    topic,
    progress,
    ctx.moduleConceptIds,
    ctx.interviewTopicMap,
    ctx.caseTopicMap
  );
  if (!practiced) return null;

  if (m.dueCards >= 3 && m.recallScore < 60) return "decay";
  if (m.quizScore > 0 && m.quizScore < 50) return "knowledge";
  if (m.recallScore > 0 && m.recallScore < 50) return "knowledge";
  if (m.quizScore >= 60 && m.applicationScore < 50) return "application";
  if (m.mastery < 45) return "knowledge";
  return null;
}

/** Topics with practice started but not yet solid — shown as progress, not "weak". */
export function getTopicsInProgress(
  masteries: TopicMastery[],
  curriculum: Curriculum,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>,
  interviewQuestions: { id: string; topicIds: string[] }[] = [],
  caseStudies: { id: string; topicIds: string[] }[] = []
): TopicMastery[] {
  if (!hasPracticeAttempts(progress)) return [];

  const interviewMap = buildInterviewTopicMap(interviewQuestions);
  const caseMap = buildCaseTopicMap(caseStudies);

  return masteries
    .filter((m) => m.status === "learning")
    .filter((m) => {
      const topic = curriculum.topics.find((t) => t.id === m.topicId)!;
      return topicHasFullPracticeCheck(topic, progress, moduleConceptIds, interviewMap, caseMap);
    })
    .sort((a, b) => a.mastery - b.mastery);
}

/** @deprecated Use getTopicsInProgress */
export const getWeakAreas = getTopicsInProgress;

export function getStarterActions(): RecommendedAction[] {
  return [
    { message: "Read a module and build your foundation", href: "/topics", priority: 10 },
    { message: "Start an active recall session", href: "/recall", priority: 9 },
    { message: "Practice a mock interview question", href: "/interview", priority: 8 },
    { message: "Work through a case study", href: "/cases", priority: 7 },
  ];
}

export function detectGaps(
  curriculum: Curriculum,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>,
  interviewQuestions: { id: string; topicIds: string[] }[] = [],
  caseStudies: { id: string; topicIds: string[] }[] = []
): Gap[] {
  if (!hasPracticeAttempts(progress)) return [];

  const ctx: PracticeContext = {
    moduleConceptIds,
    interviewTopicMap: buildInterviewTopicMap(interviewQuestions),
    caseTopicMap: buildCaseTopicMap(caseStudies),
  };

  const masteries = computeAllMastery(curriculum, progress, moduleConceptIds);
  const gaps: Gap[] = [];

  for (const topic of curriculum.topics) {
    const m = masteries.find((x) => x.topicId === topic.id)!;
    const type = gapType(topic, m, progress, ctx);
    if (!type) continue;

    let message = "";
    let action = "";
    let actionHref = `/topics/${topic.id}`;

    switch (type) {
      case "knowledge":
        message = `You struggle with ${topic.title} definitions and recall`;
        action = `Take the ${topic.title} quiz`;
        actionHref = topic.moduleIds[0] ? `/quiz/${topic.moduleIds[0]}` : `/recall?topic=${topic.id}`;
        break;
      case "application":
        message = `${topic.title}: concepts are landing — practice applying them`;
        action = `Practice interview questions on ${topic.title}`;
        actionHref = `/interview?topic=${topic.id}`;
        break;
      case "decay":
        message = `${topic.title}: review overdue, mastery dropping`;
        action = `Review ${m.dueCards} due flashcards`;
        actionHref = `/recall?topic=${topic.id}`;
        break;
    }

    gaps.push({
      topicId: topic.id,
      topicTitle: topic.title,
      type,
      mastery: m.mastery,
      message,
      action,
      actionHref,
    });
  }

  return gaps.sort((a, b) => a.mastery - b.mastery);
}

export function getRecommendedActions(
  curriculum: Curriculum,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>,
  interviewQuestions: { id: string; topicIds: string[] }[] = [],
  caseStudies: { id: string; topicIds: string[] }[] = []
): RecommendedAction[] {
  if (!hasPracticeAttempts(progress)) {
    return getStarterActions();
  }

  const gaps = detectGaps(
    curriculum,
    progress,
    moduleConceptIds,
    interviewQuestions,
    caseStudies
  );
  const actions: RecommendedAction[] = gaps.slice(0, 5).map((g, i) => ({
    message: g.action,
    href: g.actionHref,
    priority: 5 - i,
  }));

  const masteries = computeAllMastery(curriculum, progress, moduleConceptIds);
  for (const m of masteries) {
    if (m.dueCards > 0) {
      const topic = curriculum.topics.find((t) => t.id === m.topicId)!;
      actions.push({
        message: `Review ${m.dueCards} due flashcards in ${topic.title}`,
        href: `/recall?topic=${m.topicId}`,
        priority: 6,
      });
    }
  }

  return actions.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

export function exportGapSnapshot(
  curriculum: Curriculum,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>,
  interviewQuestions: { id: string; topicIds: string[] }[] = [],
  caseStudies: { id: string; topicIds: string[] }[] = []
) {
  const masteries = computeAllMastery(curriculum, progress, moduleConceptIds);
  return {
    exportedAt: new Date().toISOString(),
    hasPracticeAttempts: hasPracticeAttempts(progress),
    gaps: detectGaps(
      curriculum,
      progress,
      moduleConceptIds,
      interviewQuestions,
      caseStudies
    ),
    mastery: masteries,
    topicsInProgress: getTopicsInProgress(
      masteries,
      curriculum,
      progress,
      moduleConceptIds,
      interviewQuestions,
      caseStudies
    ).map((m) => m.topicId),
    topicsPracticed: countTopicsPracticed(
      curriculum,
      progress,
      moduleConceptIds,
      buildInterviewTopicMap(interviewQuestions),
      buildCaseTopicMap(caseStudies)
    ),
  };
}

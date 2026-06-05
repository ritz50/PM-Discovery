import type { Curriculum, ProgressData, Topic } from "./types";
import { getTopicConceptIds } from "./topic-utils";

/** User has completed at least one practice session (recall, quiz, interview, or case). */
export function hasPracticeAttempts(progress: ProgressData): boolean {
  const hasRecall = Object.values(progress.cards).some((c) => c.lastReviewed != null);
  return (
    hasRecall ||
    progress.quizzes.length > 0 ||
    progress.interviews.length > 0 ||
    progress.cases.length > 0
  );
}

export function countTopicsPracticed(
  curriculum: Curriculum,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>,
  interviewQuestionTopicIds: Map<string, string[]>,
  caseTopicMap: Map<string, string[]>
): number {
  return curriculum.topics.filter((t) =>
    topicHasFullPracticeCheck(t, progress, moduleConceptIds, interviewQuestionTopicIds, caseTopicMap)
  ).length;
}

export function topicHasFullPracticeCheck(
  topic: Topic,
  progress: ProgressData,
  moduleConceptIds: Record<string, string[]>,
  interviewQuestionTopicIds: Map<string, string[]>,
  caseTopicMap: Map<string, string[]>
): boolean {
  const conceptIds = new Set(getTopicConceptIds(topic, moduleConceptIds));

  if (
    Object.entries(progress.cards).some(
      ([id, card]) => conceptIds.has(id) && card.lastReviewed != null
    )
  ) {
    return true;
  }

  if (progress.quizzes.some((q) => topic.moduleIds.includes(q.moduleId))) return true;

  if (
    progress.interviews.some((i) =>
      interviewQuestionTopicIds.get(i.questionId)?.includes(topic.id)
    )
  ) {
    return true;
  }

  if (progress.cases.some((c) => caseTopicMap.get(c.caseId)?.includes(topic.id))) {
    return true;
  }

  return false;
}

export function buildInterviewTopicMap(
  questions: { id: string; topicIds: string[] }[]
): Map<string, string[]> {
  return new Map(questions.map((q) => [q.id, q.topicIds]));
}

export function buildCaseTopicMap(
  cases: { id: string; topicIds: string[] }[]
): Map<string, string[]> {
  return new Map(cases.map((c) => [c.id, c.topicIds]));
}

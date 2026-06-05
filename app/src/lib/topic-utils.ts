import type { Topic } from "./types";

export function getTopicConceptIds(
  topic: Pick<Topic, "conceptIds" | "moduleIds">,
  moduleConceptIds: Record<string, string[]>
): string[] {
  const fromModule = topic.moduleIds.flatMap((id) => moduleConceptIds[id] ?? []);
  return [...new Set([...topic.conceptIds, ...fromModule])];
}

export function buildTopicConceptMap(
  topics: Topic[],
  moduleConceptIds: Record<string, string[]>
): Record<string, string[]> {
  return Object.fromEntries(
    topics.map((t) => [t.id, getTopicConceptIds(t, moduleConceptIds)])
  );
}

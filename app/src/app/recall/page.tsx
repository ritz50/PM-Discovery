import { Suspense } from "react";
import { getAllConcepts, getCurriculum, getTopicConceptMap } from "@/lib/content";
import { ClientRecall } from "@/components/ClientRecall";
import { PageHeader } from "@/components/ui";

export default function RecallPage() {
  const concepts = getAllConcepts();
  const curriculum = getCurriculum();
  const topicConceptMap = getTopicConceptMap(curriculum);
  return (
    <div>
      <PageHeader title="Active Recall" subtitle="Spaced repetition flashcards powered by the SM-2 algorithm." />
      <Suspense fallback={<p style={{ color: "var(--muted)" }}>Loading...</p>}>
        <ClientRecall concepts={concepts} curriculum={curriculum} topicConceptMap={topicConceptMap} />
      </Suspense>
    </div>
  );
}

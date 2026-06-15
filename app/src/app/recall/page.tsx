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
      <PageHeader title="Active Recall" subtitle="Review flashcards for the topics you're studying." />
      <Suspense fallback={<p style={{ color: "var(--muted)" }}>Loading...</p>}>
        <ClientRecall concepts={concepts} curriculum={curriculum} topicConceptMap={topicConceptMap} />
      </Suspense>
      <p className="mt-6 text-sm" style={{ color: "var(--muted)" }}>
        Tip: open recall from a topic page to focus on one subject, or browse{" "}
        <a href="/topics" className="underline" style={{ color: "var(--accent)" }}>
          all topics
        </a>
        .
      </p>
    </div>
  );
}

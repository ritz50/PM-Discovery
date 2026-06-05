"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Curriculum, InterviewQuestion } from "@/lib/types";
import { loadProgress, saveProgress, touchActivity } from "@/lib/storage";
import { Button, Card } from "./ui";

export function ClientInterview({
  questions,
  curriculum,
}: {
  questions: InterviewQuestion[];
  curriculum: Curriculum;
}) {
  const searchParams = useSearchParams();
  const topicFilter = searchParams.get("topic");

  const [pool, setPool] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let filtered = questions;
    if (topicFilter) {
      filtered = questions.filter((q) => q.topicIds.includes(topicFilter));
    }
    setPool(filtered.length > 0 ? filtered : questions);
    setIndex(0);
    setRevealed(false);
  }, [questions, topicFilter]);

  const q = pool[index];

  function recordRating(rating: number) {
    const progress = touchActivity(loadProgress());
    progress.interviews.push({ questionId: q.id, rating, timestamp: Date.now() });
    saveProgress(progress);
  }

  function goPrevious() {
    if (index > 0) {
      setIndex(index - 1);
      setRevealed(false);
    }
  }

  function tryAgain() {
    recordRating(1);
    setRevealed(false);
  }

  function goNext() {
    recordRating(4);
    if (index + 1 < pool.length) {
      setIndex(index + 1);
      setRevealed(false);
    }
  }

  if (!q) return <p style={{ color: "var(--muted)" }}>No questions available.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Question {index + 1} of {pool.length}
        {topicFilter && ` · ${curriculum.topics.find((t) => t.id === topicFilter)?.title}`}
      </p>
      <Card className="card-gradient !p-6">
        <p className="text-lg font-medium" style={{ color: "var(--fg)" }}>
          {q.question}
        </p>
      </Card>
      {!revealed ? (
        <Button onClick={() => setRevealed(true)}>Reveal rubric & answer</Button>
      ) : (
        <div className="space-y-4">
          <Card>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              Rubric
            </p>
            <p className="text-sm" style={{ color: "var(--fg-secondary)" }}>
              {q.rubric}
            </p>
          </Card>
          <Card>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              Model answer
            </p>
            <p className="text-sm" style={{ color: "var(--fg-secondary)" }}>
              {q.modelAnswer}
            </p>
          </Card>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="ghost" onClick={goPrevious} disabled={index === 0}>
              Previous
            </Button>
            <Button variant="rating" onClick={tryAgain}>
              Try Again
            </Button>
            <Button onClick={goNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

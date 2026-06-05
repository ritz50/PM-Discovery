"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Concept, Curriculum } from "@/lib/types";
import { defaultCardState, isDue, updateCardSM2 } from "@/lib/sm2";
import { loadProgress, saveProgress, touchActivity } from "@/lib/storage";
import { Button, Card } from "./ui";

export function ClientRecall({
  concepts,
  curriculum,
  topicConceptMap,
}: {
  concepts: Concept[];
  curriculum: Curriculum;
  topicConceptMap: Record<string, string[]>;
}) {
  const searchParams = useSearchParams();
  const topicFilter = searchParams.get("topic");

  const [queue, setQueue] = useState<Concept[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const buildQueue = useCallback(() => {
    let pool = concepts;
    if (topicFilter) {
      const ids = new Set(topicConceptMap[topicFilter] ?? []);
      pool = concepts.filter((c) => ids.has(c.id));
    }
    const progress = loadProgress();
    const due = pool.filter((c) => {
      const card = progress.cards[c.id];
      return !card || isDue(card);
    });
    setQueue(due.length > 0 ? due : pool.slice(0, 10));
    setIndex(0);
    setFlipped(false);
    setDone(false);
  }, [concepts, topicFilter, topicConceptMap]);

  useEffect(() => {
    buildQueue();
  }, [buildQueue]);

  const current = queue[index];

  function recordReview(quality: number) {
    if (!current) return;
    const progress = touchActivity(loadProgress());
    const existing = progress.cards[current.id] ?? defaultCardState();
    progress.cards[current.id] = updateCardSM2(existing, quality);
    saveProgress(progress);
  }

  function goPrevious() {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  }

  function tryAgain() {
    recordReview(1);
    setFlipped(false);
  }

  function goNext() {
    recordReview(4);
    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
      setFlipped(false);
    }
  }

  if (queue.length === 0) {
    return <p style={{ color: "var(--muted)" }}>No flashcards available.</p>;
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg font-medium" style={{ color: "var(--fg)" }}>
          Session complete
        </p>
        <Button onClick={buildQueue}>Study more</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {topicFilter && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Filtered: {curriculum.topics.find((t) => t.id === topicFilter)?.title}
        </p>
      )}
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Card {index + 1} of {queue.length}
      </p>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="card card-gradient w-full min-h-[220px] p-8 text-left transition-all"
        style={{ cursor: "pointer" }}
      >
        <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          {flipped ? "Answer" : "Question"}
        </p>
        {flipped ? (
          <div>
            <p className="font-medium mb-2" style={{ color: "var(--fg)" }}>
              {current.definition}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {current.whenToUse}
            </p>
          </div>
        ) : (
          <p className="text-lg font-medium" style={{ color: "var(--fg)" }}>
            When do you use {current.title}?
          </p>
        )}
      </button>
      {flipped ? (
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" onClick={goPrevious} disabled={index === 0}>
            Previous
          </Button>
          <Button variant="rating" onClick={tryAgain}>
            Try Again
          </Button>
          <Button onClick={goNext}>Next</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button onClick={() => setFlipped(true)} className="w-full">
            Show answer
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={goPrevious} disabled={index === 0}>
              Previous
            </Button>
            <Button variant="ghost" onClick={goNext} disabled={index + 1 >= queue.length}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

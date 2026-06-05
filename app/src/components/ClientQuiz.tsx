"use client";

import { useState } from "react";
import type { Concept } from "@/lib/types";
import { loadProgress, saveProgress, touchActivity } from "@/lib/storage";
import { Card } from "./ui";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function ClientQuiz({ moduleId, concepts }: { moduleId: string; concepts: Concept[] }) {
  const [questions] = useState(() =>
    shuffle(concepts).slice(0, Math.min(5, concepts.length)).map((c) => {
      const others = concepts.filter((x) => x.id !== c.id);
      const options = shuffle([c.definition, ...shuffle(others).slice(0, 3).map((o) => o.definition)]);
      return { concept: c, options, correct: c.definition };
    })
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  function submit(answer: string) {
    setSelected(answer);
    const correct = answer === q.correct;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        let progress = touchActivity(loadProgress());
        progress.quizzes.push({
          moduleId,
          score: newScore,
          total: questions.length,
          timestamp: Date.now(),
        });
        saveProgress(progress);
        setScore(newScore);
        setFinished(true);
      } else {
        setCurrent(current + 1);
        setSelected(null);
      }
    }, 800);
  }

  if (questions.length === 0) {
    return <p style={{ color: "var(--muted)" }}>No concepts to quiz.</p>;
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center space-y-4">
        <p className="text-3xl font-semibold" style={{ color: "var(--fg)" }}>
          {score}/{questions.length}
        </p>
        <p className="text-lg" style={{ color: "var(--fg-secondary)" }}>
          {pct}%
        </p>
        <p style={{ color: "var(--muted)" }}>
          {pct >= 70 ? "Solid recall!" : pct >= 50 ? "Good progress — review a few concepts." : "Keep practicing this module."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Question {current + 1} of {questions.length}
      </p>
      <p className="text-lg font-medium" style={{ color: "var(--fg)" }}>
        What is {q.concept.title}?
      </p>
      <ul className="space-y-2">
        {q.options.map((opt) => {
          let borderColor = "var(--border)";
          let bg = "var(--surface)";
          if (selected) {
            if (opt === q.correct) {
              borderColor = "rgba(74, 222, 128, 0.5)";
              bg = "var(--solid-soft)";
            } else if (opt === selected) {
              borderColor = "rgba(248, 113, 113, 0.5)";
              bg = "var(--weak-soft)";
            }
          }
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={!!selected}
                onClick={() => submit(opt)}
                className="w-full rounded-lg p-3 text-left text-sm transition-colors"
                style={{
                  border: `1px solid ${borderColor}`,
                  background: bg,
                  color: "var(--fg-secondary)",
                  cursor: selected ? "default" : "pointer",
                }}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Markdown } from "./Markdown";
import { loadProgress, saveProgress, touchActivity } from "@/lib/storage";
import { Button, Card } from "./ui";

export function ClientCaseStudy({ caseId, scenario, rubric }: { caseId: string; scenario: string; rubric: string }) {
  const [answer, setAnswer] = useState("");
  const [showRubric, setShowRubric] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submitScore(score: number) {
    let progress = touchActivity(loadProgress());
    progress.cases.push({ caseId, selfScore: score, timestamp: Date.now() });
    saveProgress(progress);
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <Card className="card-gradient">
        <Markdown content={scenario} />
      </Card>
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--fg-secondary)" }}>
          Your answer
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          className="textarea"
          placeholder="Structure: problem frame → discovery plan → recommendation..."
        />
      </div>
      {!showRubric ? (
        <Button onClick={() => setShowRubric(true)}>Compare to rubric</Button>
      ) : (
        <div className="space-y-4">
          <Card>
            <Markdown content={rubric} />
          </Card>
          {!submitted && (
            <div>
              <p className="mb-2 text-sm" style={{ color: "var(--muted)" }}>
                Self-rate your answer (1-5)
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Button key={n} variant="rating" onClick={() => submitScore(n)}>
                    {n}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {submitted && (
            <p style={{ color: "var(--solid)" }}>Score saved. Review gaps on the dashboard.</p>
          )}
        </div>
      )}
    </div>
  );
}

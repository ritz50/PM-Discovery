import type { Concept } from "@/lib/types";
import { Card } from "./ui";

export function ConceptDetailCard({ concept }: { concept: Concept }) {
  return (
    <Card>
      <p className="font-medium" style={{ color: "var(--fg)" }}>
        {concept.title}
      </p>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
        {concept.definition}
      </p>

      {concept.example && (
        <div
          className="mt-3 rounded-lg border px-3 py-2 text-sm leading-relaxed"
          style={{
            borderColor: "var(--border)",
            background: "var(--accent-soft)",
            color: "var(--fg-secondary)",
          }}
        >
          <span className="font-medium" style={{ color: "var(--fg)" }}>
            Example:{" "}
          </span>
          {concept.example}
        </div>
      )}

      {concept.whenToUse && (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          <span className="font-medium" style={{ color: "var(--fg-secondary)" }}>
            When to use:{" "}
          </span>
          {concept.whenToUse}
        </p>
      )}

      {concept.officeUse && (
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          <span className="font-medium" style={{ color: "var(--fg-secondary)" }}>
            At work:{" "}
          </span>
          {concept.officeUse}
        </p>
      )}

      {concept.frameworkSteps && concept.frameworkSteps.length > 0 && (
        <details className="mt-3">
          <summary
            className="cursor-pointer text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            Framework steps ({concept.frameworkSteps.length})
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--muted)" }}>
            {concept.frameworkSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      )}

      {concept.interviewPrompts && concept.interviewPrompts.length > 0 && (
        <details className="mt-2">
          <summary
            className="cursor-pointer text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            Interview prompts ({concept.interviewPrompts.length})
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--muted)" }}>
            {concept.interviewPrompts.map((prompt, i) => (
              <li key={i}>{prompt}</li>
            ))}
          </ul>
        </details>
      )}
    </Card>
  );
}

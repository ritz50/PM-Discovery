import Link from "next/link";
import { Card, Section, TextLink } from "./ui";

const practiceModes = [
  {
    step: "1",
    title: "Learn",
    description: "Read modules, build mental models, and map concepts across Product Discovery topics.",
    href: "/topics",
    cta: "Browse topics",
  },
  {
    step: "2",
    title: "Active recall",
    description: "Strengthen memory with spaced-repetition flashcards tied to each concept.",
    href: "/recall",
    cta: "Start recall",
  },
  {
    step: "3",
    title: "Mock interview",
    description: "Practice PM interview answers with rubrics and self-rating.",
    href: "/interview",
    cta: "Practice questions",
  },
  {
    step: "4",
    title: "Case studies",
    description: "Apply frameworks to realistic discovery scenarios and score yourself.",
    href: "/cases",
    cta: "Open cases",
  },
];

export function LearnHub() {
  return (
    <div className="space-y-10">
      <Section title="Your learning path">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Work through each mode in order — learn concepts, recall them, then apply in interviews and
          cases. Progress analysis unlocks after your first practice session.
        </p>
        <ol className="grid gap-4 sm:grid-cols-2">
          {practiceModes.map((mode) => (
            <li key={mode.href}>
              <Link href={mode.href} className="block no-underline">
                <Card interactive className="h-full">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      {mode.step}
                    </span>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                      {mode.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {mode.description}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium" style={{ color: "var(--accent)" }}>
                    {mode.cta} →
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Resources">
        <div className="flex flex-wrap gap-4">
          <TextLink href="/reference">Frameworks & glossary</TextLink>
          <TextLink href="/progress">View progress & gaps</TextLink>
        </div>
      </Section>
    </div>
  );
}

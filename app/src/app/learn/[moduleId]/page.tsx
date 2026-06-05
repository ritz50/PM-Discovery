import { notFound } from "next/navigation";
import { getModule, getModuleConcepts } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { VisitTracker } from "@/components/VisitTracker";
import { Card, LinkButton, Section } from "@/components/ui";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();
  const concepts = getModuleConcepts(moduleId);

  return (
    <div>
      <VisitTracker moduleId={moduleId} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            {mod.difficulty} · helloPM
          </p>
          <h1 className="page-title">{mod.title}</h1>
        </div>
        <LinkButton href={`/quiz/${moduleId}`}>Take quiz</LinkButton>
      </div>
      <Card className="card-gradient mb-8">
        <Markdown content={mod.content} />
      </Card>

      <Section title="Key concepts">
        <ul className="space-y-3">
          {concepts.map((c) => (
            <li key={c.id}>
              <Card>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {c.title}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--fg-secondary)" }}>
                  {c.definition}
                </p>
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  Use: {c.whenToUse}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurriculum, getModule, getModuleConcepts } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { VisitTracker } from "@/components/VisitTracker";
import { Breadcrumbs, BackLink } from "@/components/Breadcrumbs";
import { ConceptDetailCard } from "@/components/ConceptDetailCard";
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
  const curriculum = getCurriculum();
  const topicId = mod.topicIds?.[0] ?? curriculum.topics.find((t) => t.moduleIds.includes(moduleId))?.id;
  const topic = topicId ? curriculum.topics.find((t) => t.id === topicId) : null;
  const phase = topic ? curriculum.phases.find((p) => p.id === topic.phase) : null;

  return (
    <div>
      <VisitTracker moduleId={moduleId} />
      <Breadcrumbs
        items={[
          { label: "Learn", href: "/topics" },
          ...(phase && topic
            ? [
                { label: phase.title, href: `/topics#phase-${topic.phase}` },
                { label: topic.title, href: `/topics/${topic.id}` },
              ]
            : []),
          { label: mod.title },
        ]}
      />
      {topic && <BackLink href={`/topics/${topic.id}`} label={`Back to ${topic.title}`} />}

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
              <ConceptDetailCard concept={c} />
            </li>
          ))}
        </ul>
      </Section>

      {topic && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/recall?topic=${topic.id}`} className="btn btn-ghost text-sm no-underline !px-3 !py-1.5">
            Practice recall
          </Link>
          <Link href={`/interview?topic=${topic.id}`} className="btn btn-ghost text-sm no-underline !px-3 !py-1.5">
            Mock interview
          </Link>
        </div>
      )}
    </div>
  );
}

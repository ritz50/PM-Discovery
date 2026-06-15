import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCurriculum,
  getConceptsForTopic,
  getFramework,
  getModule,
} from "@/lib/content";
import { VisitTracker } from "@/components/VisitTracker";
import { Breadcrumbs, BackLink } from "@/components/Breadcrumbs";
import { ConceptDetailCard } from "@/components/ConceptDetailCard";
import { Card, LinkButton, PageHeader, Section, TextLink } from "@/components/ui";

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const curriculum = getCurriculum();
  const topic = curriculum.topics.find((t) => t.id === topicId);
  if (!topic) notFound();

  const phase = curriculum.phases.find((p) => p.id === topic.phase);
  const concepts = getConceptsForTopic(topicId, curriculum);
  const primaryModuleId = topic.moduleIds[0];
  const primaryModule = primaryModuleId ? getModule(primaryModuleId) : null;

  const phaseTopics = curriculum.topics.filter((t) => t.phase === topic.phase);
  const topicIndex = phaseTopics.findIndex((t) => t.id === topicId);
  const nextTopic = topicIndex >= 0 && topicIndex < phaseTopics.length - 1
    ? phaseTopics[topicIndex + 1]
    : null;

  const actionClass = "btn btn-ghost text-sm no-underline !px-3 !py-1.5";

  return (
    <div>
      <VisitTracker topicId={topicId} />
      <Breadcrumbs
        items={[
          { label: "Learn", href: "/topics" },
          { label: phase?.title ?? topic.phase, href: `/topics#phase-${topic.phase}` },
          { label: topic.title },
        ]}
      />
      <BackLink href="/topics" label="Back to all topics" />

      <PageHeader title={topic.title} subtitle={topic.description} />

      {primaryModule && (
        <section className="mb-8">
          <h2 className="section-title mb-3">Start here</h2>
          <Card className="card-gradient flex flex-wrap items-center justify-between gap-4 !p-5">
            <div>
              <p className="font-medium" style={{ color: "var(--fg)" }}>
                {primaryModule.title}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {primaryModule.difficulty} · Full lesson with key concepts
              </p>
            </div>
            <LinkButton href={`/learn/${primaryModuleId}`}>Open lesson</LinkButton>
          </Card>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium" style={{ color: "var(--muted)" }}>
          Practice this topic
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href={`/recall?topic=${topicId}`} className={actionClass}>
            Recall
          </Link>
          {primaryModuleId && (
            <Link href={`/quiz/${primaryModuleId}`} className={actionClass}>
              Quiz
            </Link>
          )}
          <Link href={`/interview?topic=${topicId}`} className={actionClass}>
            Interview
          </Link>
        </div>
      </section>

      {topic.frameworkIds.length > 0 && (
        <Section title="Frameworks">
          <ul className="grid gap-3 sm:grid-cols-2">
            {topic.frameworkIds.map((fwId) => {
              const fw = getFramework(fwId);
              return fw ? (
                <li key={fwId}>
                  <Link href={`/frameworks/${fwId}`} className="block no-underline">
                    <Card interactive className="!p-4">
                      <p className="font-medium" style={{ color: "var(--fg)" }}>
                        {fw.title}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: "var(--accent)" }}>
                        View framework →
                      </p>
                    </Card>
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </Section>
      )}

      <Section title={`Concepts (${concepts.length})`}>
        <ul className="space-y-3">
          {concepts.map((c) => (
            <li key={c.id}>
              <ConceptDetailCard concept={c} />
            </li>
          ))}
        </ul>
      </Section>

      {(topic.prerequisites.length > 0 || nextTopic) && (
        <Section title="What's next">
          {topic.prerequisites.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
                Prerequisites
              </p>
              <div className="flex flex-wrap gap-3">
                {topic.prerequisites.map((p) => {
                  const prereq = curriculum.topics.find((t) => t.id === p);
                  return prereq ? (
                    <TextLink key={p} href={`/topics/${p}`}>
                      {prereq.title}
                    </TextLink>
                  ) : null;
                })}
              </div>
            </div>
          )}
          {nextTopic && (
            <Card className="!p-4">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Next in {phase?.title}
              </p>
              <TextLink href={`/topics/${nextTopic.id}`} className="mt-1 inline-block text-base !font-medium">
                {nextTopic.title} →
              </TextLink>
            </Card>
          )}
        </Section>
      )}
    </div>
  );
}

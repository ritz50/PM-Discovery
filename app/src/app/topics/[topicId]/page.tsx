import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCurriculum,
  getConceptsForTopic,
  getFramework,
  getModule,
} from "@/lib/content";
import { VisitTracker } from "@/components/VisitTracker";
import { Card, PageHeader, Section, TextLink } from "@/components/ui";

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

  const actionClass =
    "btn btn-ghost text-sm no-underline !px-3 !py-1.5";

  return (
    <div>
      <VisitTracker topicId={topicId} />
      <PageHeader title={topic.title} subtitle={topic.description} />
      <p className="-mt-4 mb-6 text-sm" style={{ color: "var(--muted)" }}>
        {phase?.title}
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {topic.moduleIds.map((m) => (
          <Link key={m} href={`/learn/${m}`} className={actionClass}>
            Learn
          </Link>
        ))}
        <Link href={`/recall?topic=${topicId}`} className={actionClass}>
          Recall
        </Link>
        {topic.moduleIds[0] && (
          <Link href={`/quiz/${topic.moduleIds[0]}`} className={actionClass}>
            Quiz
          </Link>
        )}
        <Link href={`/interview?topic=${topicId}`} className={actionClass}>
          Interview
        </Link>
      </div>

      {topic.frameworkIds.length > 0 && (
        <Section title="Frameworks">
          <ul className="space-y-2">
            {topic.frameworkIds.map((fwId) => {
              const fw = getFramework(fwId);
              return fw ? (
                <li key={fwId}>
                  <TextLink href={`/frameworks/${fwId}`}>{fw.title}</TextLink>
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
              <Card>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {c.title}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {c.definition}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {topic.moduleIds.map((mId) => {
        const mod = getModule(mId);
        return mod ? (
          <section key={mId} className="mt-6">
            <h2 className="section-title">{mod.title}</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Difficulty: {mod.difficulty}
            </p>
          </section>
        ) : null;
      })}

      {topic.prerequisites.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
            Prerequisites
          </h2>
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
        </section>
      )}
    </div>
  );
}

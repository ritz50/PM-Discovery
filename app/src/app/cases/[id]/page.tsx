import { notFound } from "next/navigation";
import { getCaseStudy } from "@/lib/content";
import { ClientCaseStudy } from "@/components/ClientCaseStudy";
import { PageHeader } from "@/components/ui";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCaseStudy(id);
  if (!c) notFound();

  return (
    <div>
      <PageHeader title={c.title} subtitle="Write your answer, then compare against the rubric." />
      <ClientCaseStudy caseId={c.id} scenario={c.scenario} rubric={c.rubric} />
    </div>
  );
}

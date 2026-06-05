import { notFound } from "next/navigation";
import { getModule, getModuleConcepts } from "@/lib/content";
import { ClientQuiz } from "@/components/ClientQuiz";
import { PageHeader } from "@/components/ui";

export default async function QuizPage({
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
      <PageHeader title={`Quiz: ${mod.title}`} subtitle="Test your comprehension — results feed into gap analysis." />
      <ClientQuiz moduleId={moduleId} concepts={concepts} />
    </div>
  );
}

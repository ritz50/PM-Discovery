import { notFound } from "next/navigation";
import { getFramework } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { Card, PageHeader } from "@/components/ui";

export default async function FrameworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fw = getFramework(id);
  if (!fw) notFound();

  return (
    <div>
      <PageHeader title={fw.title} subtitle="Framework reference — use in interviews and at work." />
      <Card className="card-gradient">
        <Markdown content={fw.content} />
      </Card>
    </div>
  );
}

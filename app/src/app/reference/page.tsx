import { getSearchDocuments } from "@/lib/content";
import { ClientReference } from "@/components/ClientReference";
import { PageHeader } from "@/components/ui";

export default function ReferencePage() {
  const documents = getSearchDocuments();
  return (
    <div>
      <PageHeader title="Reference" subtitle="Search across modules, concepts, frameworks, and glossary." />
      <ClientReference documents={documents} />
    </div>
  );
}

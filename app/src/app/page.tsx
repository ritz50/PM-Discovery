import { LearnHub } from "@/components/LearnHub";
import { PageHeader } from "@/components/ui";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Product Discovery"
        subtitle="Learn concepts, recall them actively, then apply in interviews and case studies."
      />
      <LearnHub />
    </div>
  );
}

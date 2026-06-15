import { LearnHub } from "@/components/LearnHub";
import { PageHeader } from "@/components/ui";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Product Discovery"
        subtitle="Learn product discovery through concepts, case studies, practice questions, and skill-gap reflection."
      />
      <LearnHub />
    </div>
  );
}

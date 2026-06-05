import { getCurriculum, getModuleConceptIdMap, getTopicConceptMap } from "@/lib/content";
import { ClientTopics } from "@/components/ClientTopics";
import { PageHeader } from "@/components/ui";

export default function TopicsPage() {
  const curriculum = getCurriculum();
  const moduleConceptIds = getModuleConceptIdMap();
  const topicConceptMap = getTopicConceptMap(curriculum);
  return (
    <div>
      <PageHeader
        title="Product Discovery Topics"
        subtitle="Browse the full curriculum — phases, mastery status, and drill-down lessons."
      />
      <ClientTopics
        curriculum={curriculum}
        topicConceptMap={topicConceptMap}
        moduleConceptIds={moduleConceptIds}
      />
    </div>
  );
}

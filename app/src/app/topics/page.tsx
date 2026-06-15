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
        title="Learn"
        subtitle="Browse the curriculum by phase — open a topic to read lessons, concepts, and practice."
      />
      <ClientTopics
        curriculum={curriculum}
        topicConceptMap={topicConceptMap}
        moduleConceptIds={moduleConceptIds}
      />
    </div>
  );
}

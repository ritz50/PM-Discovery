import {
  getCurriculum,
  getModuleConceptIdMap,
  getInterviewQuestions,
  getCaseStudySummaries,
} from "@/lib/content";
import { ClientDashboard } from "@/components/ClientDashboard";
import { PageHeader } from "@/components/ui";

export default function ProgressPage() {
  const curriculum = getCurriculum();
  const moduleConceptIds = getModuleConceptIdMap();
  const interviewQuestions = getInterviewQuestions().map((q) => ({
    id: q.id,
    topicIds: q.topicIds,
  }));
  const caseStudies = getCaseStudySummaries();

  return (
    <div>
      <PageHeader
        title="Progress"
        subtitle="Track your progress and spot gaps — available after you complete practice sessions."
      />
      <ClientDashboard
        curriculum={curriculum}
        moduleConceptIds={moduleConceptIds}
        interviewQuestions={interviewQuestions}
        caseStudies={caseStudies}
      />
    </div>
  );
}

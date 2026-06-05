import { Suspense } from "react";
import { getCurriculum, getInterviewQuestions } from "@/lib/content";
import { ClientInterview } from "@/components/ClientInterview";
import { PageHeader } from "@/components/ui";

export default function InterviewPage() {
  const questions = getInterviewQuestions();
  const curriculum = getCurriculum();
  return (
    <div>
      <PageHeader
        title="Mock Interview"
        subtitle="Practice PM discovery questions with rubrics and model answers."
      />
      <Suspense fallback={<p style={{ color: "var(--muted)" }}>Loading...</p>}>
        <ClientInterview questions={questions} curriculum={curriculum} />
      </Suspense>
    </div>
  );
}

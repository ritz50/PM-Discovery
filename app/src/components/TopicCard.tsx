import Link from "next/link";
import type { MasteryStatus, Topic } from "@/lib/types";
import { MasteryBadge } from "./MasteryBadge";

export function TopicCard({
  topic,
  status,
  mastery,
  conceptCount,
}: {
  topic: Topic;
  status: MasteryStatus;
  mastery: number;
  conceptCount: number;
}) {
  return (
    <Link href={`/topics/${topic.id}`} className="card card-interactive block p-4 no-underline">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-medium" style={{ color: "var(--fg)" }}>
          {topic.title}
        </h3>
        <MasteryBadge status={status} mastery={mastery} />
      </div>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {topic.description}
      </p>
      <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
        {conceptCount} concepts
      </p>
    </Link>
  );
}

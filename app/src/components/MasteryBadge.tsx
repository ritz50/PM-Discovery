import type { MasteryStatus } from "@/lib/types";

const styles: Record<MasteryStatus, { bg: string; color: string }> = {
  not_started: { bg: "rgba(139, 130, 168, 0.15)", color: "#8b82a8" },
  learning: { bg: "var(--learning-soft)", color: "#60a5fa" },
  weak: { bg: "var(--learning-soft)", color: "#60a5fa" },
  solid: { bg: "var(--solid-soft)", color: "#4ade80" },
};

export function MasteryBadge({ status, mastery }: { status: MasteryStatus; mastery?: number }) {
  const s = styles[status];

  let label = "Not started";
  if (status === "solid" && mastery !== undefined) {
    label = `${mastery}% · solid`;
  } else if (status !== "not_started" && mastery !== undefined) {
    label = `${mastery}% progress`;
  }

  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {label}
    </span>
  );
}

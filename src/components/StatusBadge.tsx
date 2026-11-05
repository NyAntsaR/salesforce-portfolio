import type { ItemStatus, ProjectStatus } from "@/content/types";

type Status = ItemStatus | ProjectStatus;

const styles: Record<Status, { label: string; className: string; dot: string }> = {
  complete: { label: "Complete", className: "bg-done-soft text-done", dot: "rounded-full bg-done" },
  "in-progress": { label: "In Progress", className: "bg-partial-soft text-partial", dot: "rounded-full bg-partial" },
  planned: { label: "Planned", className: "bg-planned-soft text-planned", dot: "rounded-full border border-planned" },
  done: { label: "Built", className: "bg-done-soft text-done", dot: "rounded-full bg-done" },
  partial: { label: "Partly built", className: "bg-partial-soft text-partial", dot: "rounded-sm bg-partial" },
};

/** Status pill. The text label carries the meaning; the dot shape and color reinforce it. */
export function StatusBadge({ status }: { status: Status }) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
    >
      <span aria-hidden="true" className={`size-2 ${style.dot}`} />
      {style.label}
    </span>
  );
}

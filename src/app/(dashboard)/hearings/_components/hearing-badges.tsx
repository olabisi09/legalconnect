import type { HearingStatus, HearingType } from "@/types/hearing";

// lc-* themed, like Events — Cases' own badges are still a plain hardcoded color map,
// so these won't visually match until that page gets a theme pass too.
const STATUS_STYLES: Record<HearingStatus, string> = {
  SCHEDULED: "bg-lc-ledger-pale text-lc-ledger",
  RESCHEDULED: "bg-secondary text-secondary-foreground",
  HELD: "bg-lc-ledger-pale text-lc-ledger",
  CANCELLED: "bg-lc-stamp/12 text-lc-stamp",
  OUTCOME_RECORDED: "bg-lc-ledger-pale text-lc-ledger",
};

export function HearingStatusBadge({ value }: { value: HearingStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plexmono text-[10px] uppercase tracking-wide ${
        STATUS_STYLES[value] ?? "bg-secondary text-secondary-foreground"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value.replaceAll("_", " ")}
    </span>
  );
}

export function HearingTypeLabel({ value }: { value: HearingType }) {
  return (
    <span className="font-plexmono text-[11px] uppercase tracking-wide text-muted-foreground">
      {value.replaceAll("_", " ")}
    </span>
  );
}

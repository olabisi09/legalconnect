"use client";

import Link from "next/link";
import { useCaseDetails } from "@/hooks/features/use-cases";

export function CaseCell({ caseId }: { caseId: string }) {
  const { data: caseDetails, isLoading } = useCaseDetails(caseId);

  if (isLoading) {
    return <span className="text-[12px] text-muted-foreground">Loading…</span>;
  }

  if (!caseDetails) {
    return (
      <span className="font-plexmono text-[11px] text-muted-foreground">
        {caseId.slice(0, 8)}…
      </span>
    );
  }

  return (
    <Link
      href={`/cases/${caseId}`}
      className="block hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="block truncate text-[13px] text-foreground">
        {caseDetails.title}
      </span>
      <span className="block font-plexmono text-[10.5px] text-muted-foreground">
        {caseDetails.caseNumber}
      </span>
    </Link>
  );
}

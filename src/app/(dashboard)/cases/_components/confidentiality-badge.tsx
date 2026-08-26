import { RiLockLine, RiLockUnlockLine } from "@remixicon/react";
import type { Confidentiality } from "@/types/document";

const tierStyles: Record<Confidentiality, string> = {
  OPEN: "bg-transparent text-muted-foreground border-border",
  INTERNAL: "bg-secondary text-secondary-foreground border-transparent",
  CONFIDENTIAL: "bg-lc-ledger-pale text-lc-ledger border-transparent",
  ATTORNEY_CLIENT_PRIVILEGED: "bg-lc-stamp/12 text-lc-stamp border-transparent",
};

export function ConfidentialityBadge({ value }: { value: string }) {
  const tier = (value in tierStyles ? value : "OPEN") as Confidentiality;
  const Icon = tier === "OPEN" ? RiLockUnlockLine : RiLockLine;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-plexmono text-[10px] uppercase tracking-wide ${tierStyles[tier]}`}
    >
      <Icon className="h-3 w-3" />
      {tier.replaceAll("_", " ")}
    </span>
  );
}

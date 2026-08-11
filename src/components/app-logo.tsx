"use client";

import { useTheme } from "next-themes";
import Link from "next/link";

export function AppLogo() {
  const { theme } = useTheme();
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        className={[
          "flex h-6.5 w-6.5 items-center justify-center rounded-sm border-[1.5px] font-plexmono text-[11px] font-semibold",
          theme === "light"
            ? "border-lc-paper text-lc-paper"
            : "border-lc-ink text-lc-ink",
        ].join(" ")}
      >
        LC
      </span>
      <span
        className={[
          "font-newsreader text-lg font-medium tracking-tight",
          theme === "light" ? "text-lc-paper" : "text-lc-ink",
        ].join(" ")}
      >
        LegalConnect
      </span>
    </Link>
  );
}

import Link from "next/link";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import PersonaTabs from "@/components/persona-tabs";
import Reveal from "@/components/reveal";
import { cn } from "@/lib/utils";

// If your app already loads Inter globally for `font-sans`, you can drop
// the Inter import here and just rely on the inherited font-sans class.

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-lc-ink/10 bg-lc-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-295 items-center justify-between px-7 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-semibold text-lc-ink"
        >
          <span className="flex h-6.5 w-6.5 items-center justify-center rounded-sm border-[1.5px] border-lc-ink font-plexmono text-[11px] font-semibold">
            LC
          </span>
          LegalConnect
        </Link>

        <input type="checkbox" id="nav-toggle" className="peer hidden" />
        <label htmlFor="nav-toggle" className="cursor-pointer p-2 md:hidden">
          <svg
            className="h-5 w-5 text-lc-ink"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

        <nav className="hidden items-center gap-7.5 peer-checked:absolute peer-checked:left-0 peer-checked:right-0 peer-checked:top-full peer-checked:flex peer-checked:flex-col peer-checked:bg-lc-paper peer-checked:p-6 md:relative md:flex md:flex-row md:bg-transparent md:p-0">
          <a
            href="#features"
            className="text-[13.5px] font-medium text-lc-slate transition-colors hover:text-lc-ink"
          >
            Features
          </a>
          <a
            href="#security"
            className="text-[13.5px] font-medium text-lc-slate transition-colors hover:text-lc-ink"
          >
            Security
          </a>
          <a
            href="#workflow"
            className="text-[13.5px] font-medium text-lc-slate transition-colors hover:text-lc-ink"
          >
            Docket
          </a>
          <a
            href="#personas"
            className="text-[13.5px] font-medium text-lc-slate transition-colors hover:text-lc-ink"
          >
            For Your Firm
          </a>
          <Link
            href="/login"
            className="rounded-sm border border-lc-ink px-4.5 py-2 text-[13.5px] font-medium text-lc-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-sm border border-lc-stamp bg-lc-stamp px-5 py-2.5 text-[13.5px] font-semibold text-lc-paper transition-colors hover:bg-lc-stamp-dark"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CaseFolderMockup() {
  return (
    <div
      className="relative w-full max-w-110"
      style={{ aspectRatio: "4 / 3.1" }}
    >
      <div className="absolute -top-4.5 left-9 flex h-7.5 w-37.5 items-center justify-center rounded-t-md border border-b-0 border-lc-ink bg-lc-paper-warm font-plexmono text-[10px] tracking-wider text-lc-slate">
        MATTER № 24-0117
      </div>
      <div className="absolute inset-x-0 bottom-0 top-3 rounded-[3px] border border-lc-ink bg-[#FBFAF4] p-6 shadow-[7px_9px_0_rgba(28,27,23,0.08)]">
        <div className="font-newsreader text-[19px] font-medium text-lc-ink">
          Halvorsen v. Reyes Estate
        </div>
        <div className="mb-4 font-plexmono text-[11.5px] text-lc-slate">
          OPENED 03 FEB 2026 · PROBATE
        </div>
        <div className="mb-4 flex gap-2">
          <span className="rounded-full bg-lc-ledger-pale px-2.5 py-1 font-plexmono text-[10px] text-lc-ledger">
            ● ACTIVE
          </span>
          <span className="rounded-full bg-lc-stamp/15 px-2.5 py-1 font-plexmono text-[10px] text-lc-stamp-dark">
            PRIVILEGED
          </span>
        </div>
        <div className="h-px bg-lc-ink/10" />
        <div className="mt-3.5 space-y-2.5 font-plexmono text-xs text-lc-slate">
          <div className="flex justify-between">
            <span>Assigned</span>
            <span className="font-semibold text-lc-ink">M. Alaba, Esq.</span>
          </div>
          <div className="flex justify-between">
            <span>Trust balance</span>
            <span className="font-semibold text-lc-ink">$52,300.00</span>
          </div>
          <div className="flex justify-between">
            <span>Next deadline</span>
            <span className="font-semibold text-lc-ink">Filing — 12 days</span>
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 200 200"
        className="absolute -bottom-6.5 -right-4.5 h-39.5 w-39.5 origin-center animate-stampdown"
        style={{ transform: "rotate(-11deg) scale(0.94)" }}
      >
        <defs>
          <filter id="rough">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.5} />
          </filter>
        </defs>
        <g filter="url(#rough)" fill="none" stroke="#B23B2E" strokeWidth={3}>
          <circle cx="100" cy="100" r="88" />
          <circle cx="100" cy="100" r="74" />
        </g>
        <g filter="url(#rough)" fill="#B23B2E">
          <text
            x="100"
            y="86"
            textAnchor="middle"
            fontFamily="var(--font-plex-mono)"
            fontSize={19}
            fontWeight={700}
            letterSpacing={2}
          >
            FILED &amp;
          </text>
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fontFamily="var(--font-plex-mono)"
            fontSize={19}
            fontWeight={700}
            letterSpacing={2}
          >
            SECURED
          </text>
          <text
            x="100"
            y="132"
            textAnchor="middle"
            fontFamily="var(--font-plex-mono)"
            fontSize={10}
            letterSpacing={3}
          >
            LEGALCONNECT OS
          </text>
        </g>
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="px-7 pb-20 pt-24 md:pt-32">
      <div className="mx-auto grid max-w-[1180px] items-center gap-[60px] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="flex items-center gap-2.5 font-plexmono text-[11.5px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
            <span className="font-newsreader text-[15px] not-italic">§</span>
            The Law Firm Operating System
          </p>
          <h1 className="mt-[18px] font-newsreader text-[38px] font-medium leading-[1.04] tracking-tight text-lc-ink md:text-[58px]">
            Every matter,
            <br />
            <em className="font-medium not-italic italic text-lc-stamp">
              fully on the record.
            </em>
          </h1>
          <p className="mt-5.5 max-w-[480px] text-[17px] leading-relaxed text-lc-slate">
            LegalConnect replaces five disconnected tools with one system of
            record — matters, documents, trust accounting, and billing, all
            filed under one case number.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-lc-stamp bg-lc-stamp px-[26px] text-sm font-semibold text-lc-paper transition-colors hover:bg-lc-stamp-dark"
            >
              Start free trial
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-lc-ink px-[26px] text-sm font-medium text-lc-ink"
            >
              See features
            </a>
          </div>
          <p className="mt-4 font-plexmono text-xs text-lc-slate">
            NO CARD REQUIRED — 14 DAY TRIAL
          </p>
        </div>

        <div className="flex items-center justify-center">
          <CaseFolderMockup />
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      exhibit: "EXHIBIT A",
      title: "Disconnected tools",
      desc: "Matters, documents, billing, and accounting live in separate systems. Nothing syncs, and staff re-key the same data twice.",
    },
    {
      exhibit: "EXHIBIT B",
      title: "Trust accounting risk",
      desc: "IOLTA accounts managed in spreadsheets are one formula error away from a regulatory penalty or ethics complaint.",
    },
    {
      exhibit: "EXHIBIT C",
      title: "No firm-wide visibility",
      desc: "Partners can't see capacity, at-risk matters, or pipeline in real time — only after the month closes.",
    },
    {
      exhibit: "EXHIBIT D",
      title: "Compliance overhead",
      desc: "Audit trails and retention policies are manual processes that quietly eat billable hours.",
    },
  ];

  return (
    <Reveal>
      <section className="bg-lc-paper px-7 py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
              The Problem
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-ink md:text-[38px]">
              Legal practice management is fractured
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-lc-slate">
              The average law firm runs five separate tools to manage its
              practice. Every hand-off between them is a place data goes
              missing.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-px border border-lc-ink/10 bg-lc-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => (
              <div key={p.title} className="bg-lc-paper p-[30px]">
                <div className="mb-3.5 font-plexmono text-[11px] text-lc-stamp">
                  {p.exhibit}
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-lc-ink">
                  {p.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-lc-slate">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function SolutionSection() {
  const items = [
    {
      glyph: "§",
      title: "Unified data model",
      desc: "Matters, documents, time, billing, and trust share one schema — not bolted-on modules pretending to talk to each other.",
    },
    {
      glyph: "✓",
      title: "Built-in compliance",
      desc: "Audit logs on every entity, write-locking on trust transactions, and role-based access on every endpoint, by default.",
    },
    {
      glyph: "↗",
      title: "Real-time visibility",
      desc: "Dashboards and alerts give partners an honest, current view of firm performance and capacity — not a month-end guess.",
    },
  ];

  return (
    <Reveal>
      <section className="border-y border-lc-ink/10 bg-lc-paper-warm px-7 py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
              The Solution
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-ink md:text-[38px]">
              One system of record for the whole firm
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-lc-slate">
              Every feature shares one schema and one auth layer from day one.
              No integrations to buy, no data to reconcile between tools.
            </p>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-sm border border-lc-ink/10 bg-lc-paper p-[30px]"
              >
                <div className="mb-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-lc-ink font-newsreader text-lg not-italic">
                  {it.glyph}
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-lc-ink">
                  {it.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-lc-slate">
                  {it.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function FeaturesSection() {
  const features = [
    {
      tag: "01 — INTAKE",
      title: "Matter Management",
      desc: "Statuses, priorities, party types, and custom fields across the full matter lifecycle.",
    },
    {
      tag: "02 — RECORDS",
      title: "Document Management",
      desc: "Version tracking, privileged marking, and per-matter access control.",
    },
    {
      tag: "★ 03 — TRUST",
      title: "Trust Accounting",
      desc: "IOLTA-compliant, write-locked, negative-balance-proof. Full audit trail on every transaction.",
      starred: true,
    },
    {
      tag: "04 — TIME",
      title: "Time Tracking",
      desc: "Billable time in 6-minute increments, categorized by matter, task, and fee type.",
    },
    {
      tag: "05 — BILLING",
      title: "Billing & Invoicing",
      desc: "Hourly, contingency, flat fee, and retainer arrangements, generated straight from time entries.",
    },
    {
      tag: "06 — CALENDAR",
      title: "Calendar & Deadlines",
      desc: "Firm-wide court dates and deadlines, automatically linked to their matter.",
    },
    {
      tag: "07 — INTAKE",
      title: "Conflict Checking",
      desc: "Search every matter and party on file before accepting a new engagement.",
    },
    {
      tag: "08 — RECORDS",
      title: "Engagement Letters",
      desc: "Fee arrangements, scope, and digital acceptance tracked against the matter.",
    },
    {
      tag: "09 — COMPLIANCE",
      title: "Audit Logs",
      desc: "An immutable trail on every action, exportable for regulatory review.",
    },
    {
      tag: "10 — ACCESS",
      title: "Role-Based Access",
      desc: "Granular permissions for Admin, Lawyer, Paralegal, Finance, and Client roles.",
    },
    {
      tag: "11 — ACCESS",
      title: "Multi-Factor Auth",
      desc: "TOTP enrollment and verification, enforceable per user.",
    },
    {
      tag: "12 — ACCESS",
      title: "Organizations",
      desc: "Isolated, encrypted data environments per firm, with independent user management.",
    },
  ];

  return (
    <Reveal>
      <section id="features" className="bg-lc-paper px-7 py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
              Features
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-ink md:text-[38px]">
              Everything the file touches
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-lc-slate">
              Twelve feature domains, one platform, zero compromises.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px border border-lc-ink/10 bg-lc-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`p-[26px] ${f.starred ? "bg-lc-ledger-pale" : "bg-lc-paper"}`}
              >
                <div
                  className={`font-plexmono text-[10px] tracking-wide ${f.starred ? "text-lc-ledger" : "text-lc-slate"}`}
                >
                  {f.tag}
                </div>
                <h3 className="mb-1.5 mt-2 text-[15.5px] font-semibold text-lc-ink">
                  {f.title}
                </h3>
                <p className="text-[12.8px] leading-relaxed text-lc-slate">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-px flex flex-wrap items-center gap-6 border border-lc-ledger bg-lc-ledger-pale p-[30px]">
            <svg viewBox="0 0 200 200" className="h-16 w-16 shrink-0">
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="#233D2C"
                strokeWidth={4}
              />
              <text
                x="100"
                y="94"
                textAnchor="middle"
                fill="#233D2C"
                fontFamily="var(--font-plex-mono)"
                fontSize={17}
                fontWeight={700}
              >
                TRUST
              </text>
              <text
                x="100"
                y="118"
                textAnchor="middle"
                fill="#233D2C"
                fontFamily="var(--font-plex-mono)"
                fontSize={17}
                fontWeight={700}
              >
                VERIFIED
              </text>
            </svg>
            <p className="flex-1 text-[13.5px] leading-relaxed text-lc-ledger">
              <span className="font-newsreader font-semibold italic">
                Trust accounting
              </span>{" "}
              is the feature every other tool bolts on last. It&rsquo;s the one
              we built first — pessimistic write-locking, negative-balance
              prevention, and a full audit trail, built for IOLTA compliance
              from day one.
            </p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function SecuritySection() {
  const groups = [
    {
      icon: "A",
      title: "Access Control",
      items: [
        "Role-based permissions on every endpoint",
        "Multi-factor authentication (TOTP)",
        "Multi-tenant org data isolation",
      ],
    },
    {
      icon: "B",
      title: "Trust & Audit",
      items: [
        "Pessimistic write-locking on trust transactions",
        "Immutable audit log on every entity",
        "Negative balance prevention",
      ],
    },
    {
      icon: "C",
      title: "Infrastructure",
      items: [
        "HMAC-SHA512 signed JWT authentication",
        "BCrypt password hashing",
        "Rate limiting and brute-force protection",
      ],
    },
  ];

  return (
    <Reveal>
      <section
        id="security"
        className="bg-lc-ledger-dark px-7 py-[100px] text-[#EFEFE4]"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D9A695]">
              Security
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-paper md:text-[38px]">
              Built for legal, not retrofitted
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-[#AEB8AC]">
              Security isn&rsquo;t a feature toggle here — it&rsquo;s in the
              architecture of every endpoint, transaction, and relationship.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {groups.map((g) => (
              <div
                key={g.title}
                className="rounded-sm border border-white/10 p-7"
              >
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/20 font-plexmono text-xs text-[#D9A695]">
                  {g.icon}
                </div>
                <h3 className="mb-3 mt-3.5 text-base font-semibold text-lc-paper">
                  {g.title}
                </h3>
                <ul className="space-y-2.5">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex gap-2.5 text-[13px] leading-snug text-[#C7CDC3]"
                    >
                      <span className="shrink-0 text-[#7C8A78]">—</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function WorkflowSection() {
  const entries = [
    {
      id: "ENTRY 01",
      title: "Create a matter",
      desc: "Define scope, assign team members, set fee arrangements and deadlines.",
    },
    {
      id: "ENTRY 02",
      title: "Manage documents",
      desc: "Upload, organize, and share. Version tracking and privileged marking built in.",
    },
    {
      id: "ENTRY 03",
      title: "Track time & expenses",
      desc: "Record billable time in 6-minute increments; log expenses against the matter.",
    },
    {
      id: "ENTRY 04",
      title: "Generate invoices",
      desc: "Draft invoices straight from time entries and expenses, any fee type.",
    },
    {
      id: "ENTRY 05",
      title: "Reconcile trust",
      desc: "Automatic reconciliation with full audit trail and balance protection.",
    },
  ];

  return (
    <Reveal>
      <section
        id="workflow"
        className="border-y border-lc-ink/10 bg-lc-paper-warm px-7 py-[100px]"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
              Workflow
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-ink md:text-[38px]">
              The docket, from intake to invoice
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-lc-slate">
              Every step of the matter lifecycle logs to the same file. No
              re-entry, no context switching.
            </p>
          </div>
          <div className="mt-14 overflow-hidden rounded-sm border border-lc-ledger">
            {entries.map((e, i) => (
              <div
                key={e.id}
                className={`grid grid-cols-1 items-center gap-2 border-b border-lc-ledger/20 px-[26px] py-5 last:border-b-0 sm:grid-cols-[110px_220px_1fr] sm:gap-5 ${
                  i % 2 === 1 ? "bg-[#F0EEDF]" : "bg-lc-paper"
                }`}
              >
                <div className="font-plexmono text-[12.5px] font-semibold text-lc-ledger">
                  {e.id}
                </div>
                <div className="font-newsreader text-[17px] font-medium text-lc-ink">
                  {e.title}
                </div>
                <div className="text-[13px] leading-snug text-lc-slate">
                  {e.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function PersonasSection() {
  return (
    <Reveal>
      <section id="personas" className="bg-lc-paper px-7 py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12 max-w-[620px]">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
              For Your Firm
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-ink md:text-[38px]">
              Built for every role on the file
            </h2>
          </div>
          <PersonaTabs />
        </div>
      </section>
    </Reveal>
  );
}

function ScreenshotsSection() {
  return (
    <Reveal>
      <section className="border-y border-lc-ink/10 bg-lc-paper-warm px-7 py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-lc-stamp">
              Screenshots
            </p>
            <h2 className="mt-3 font-newsreader text-[28px] font-medium leading-tight text-lc-ink md:text-[38px]">
              See the file in action
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-lc-slate">
              A clean interface designed for people who bill their time in
              six-minute increments.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2">
            <div className="overflow-hidden rounded-[4px] border border-lc-ink bg-[#FBFAF4] shadow-[6px_8px_0_rgba(28,27,23,0.06)]">
              <div className="flex items-center gap-1.5 border-b border-lc-ink/10 bg-lc-paper-warm px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-lc-slate/40" />
                <span className="h-2 w-2 rounded-full bg-lc-slate/40" />
                <span className="h-2 w-2 rounded-full bg-lc-slate/40" />
                <span className="ml-2 font-plexmono text-[10.5px] text-lc-slate">
                  dashboard.legalconnect.app
                </span>
              </div>
              <div className="p-7">
                <div className="mb-3.5 flex justify-between">
                  <span className="font-plexmono text-[11px] text-lc-slate">
                    OPEN MATTERS
                  </span>
                  <span className="rounded-full bg-lc-ledger-pale px-2.5 py-1 font-plexmono text-[10px] text-lc-ledger">
                    24 ACTIVE
                  </span>
                </div>
                <div className="h-px bg-lc-ink/10" />
                <div className="mt-4 flex justify-between text-[13px] text-lc-ink">
                  <span>Halvorsen v. Reyes Estate</span>
                  <span className="font-plexmono text-[11px] text-lc-slate">
                    DUE 12D
                  </span>
                </div>
                <div className="mt-4 flex justify-between text-[13px] text-lc-ink">
                  <span>Okoro Family Trust</span>
                  <span className="font-plexmono text-[11px] text-lc-slate">
                    DUE 3D
                  </span>
                </div>
                <div className="mt-4 flex justify-between text-[13px] text-lc-ink">
                  <span>Whitfield Merger</span>
                  <span className="font-plexmono text-[11px] text-lc-stamp">
                    FILED
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[4px] border border-lc-ink bg-[#FBFAF4] shadow-[6px_8px_0_rgba(28,27,23,0.06)]">
              <div className="flex items-center gap-1.5 border-b border-lc-ink/10 bg-lc-paper-warm px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-lc-slate/40" />
                <span className="h-2 w-2 rounded-full bg-lc-slate/40" />
                <span className="h-2 w-2 rounded-full bg-lc-slate/40" />
                <span className="ml-2 font-plexmono text-[10.5px] text-lc-slate">
                  trust.legalconnect.app
                </span>
              </div>
              <div className="bg-lc-ledger-dark p-7 text-[#EFEFE4]">
                <div className="mb-3.5 font-plexmono text-[11px] text-[#AEB8AC]">
                  TRUST LEDGER — CLIENT FUNDS
                </div>
                <div className="mb-1.5 flex justify-between text-[12.5px]">
                  <span>Client Funds</span>
                  <span className="font-plexmono">$247,500</span>
                </div>
                <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] bg-[#D9A695]" />
                </div>
                <div className="mb-2.5 font-plexmono text-[11px] text-[#AEB8AC]">
                  RECENT ENTRIES
                </div>
                <div className="flex justify-between border-t border-white/10 py-1.5 text-xs">
                  <span>Smith Trust</span>
                  <span className="text-[#D9A695]">+$5,000</span>
                </div>
                <div className="flex justify-between border-t border-white/10 py-1.5 text-xs">
                  <span>Jones Settlement</span>
                  <span className="text-[#9FC79A]">−$12,500</span>
                </div>
                <div className="mt-3 font-plexmono text-[10px] text-[#7C8A78]">
                  Last reconciled: Today, 2:30 PM — balanced
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 text-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-lc-stamp bg-lc-stamp px-[30px] text-sm font-semibold text-lc-paper transition-colors hover:bg-lc-stamp-dark"
            >
              Try it yourself — start free trial
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function CTASection() {
  return (
    <Reveal>
      <section className="bg-lc-ink px-7 py-[110px] text-center text-lc-paper">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="font-newsreader text-[30px] font-medium leading-[1.12] md:text-[46px]">
            Ready to put your firm
            <br />
            <em className="not-italic italic text-[#D9A695]">on the record?</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-relaxed text-[#B7B6A9]">
            Join the firms filing everything in one place. Start your free trial
            today — no card required.
          </p>
          <div className="mt-[34px] flex flex-wrap justify-center gap-3.5">
            <Link
              href="/signup"
              className="inline-flex h-[50px] items-center justify-center rounded-sm bg-lc-stamp px-[30px] text-sm font-semibold text-lc-paper hover:bg-lc-stamp-dark"
            >
              Start free trial
            </Link>
            <Link
              href="/login"
              className="inline-flex h-[50px] items-center justify-center rounded-sm border border-white/25 px-[30px] text-sm font-medium text-lc-paper"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-lc-ink px-7 py-14 text-[#B7B6A9]">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-semibold text-lc-paper">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-lc-paper font-plexmono text-[11px] font-semibold">
                LC
              </span>
              LegalConnect
            </div>
            <p className="mt-3.5 max-w-[320px] text-[13px] leading-relaxed text-[#8A897C]">
              The Law Firm Operating System. Every matter, fully on the record.
            </p>
          </div>
          <div>
            <h4 className="mb-3.5 font-plexmono text-[10.5px] uppercase tracking-widest text-[#8A897C]">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                "Matter Management",
                "Document Management",
                "Trust Accounting",
                "Billing",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#features"
                    className="text-[13px] hover:text-lc-paper"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3.5 font-plexmono text-[10.5px] uppercase tracking-widest text-[#8A897C]">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#security" className="text-[13px] hover:text-lc-paper">
                  Security
                </a>
              </li>
              <li>
                <a href="#personas" className="text-[13px] hover:text-lc-paper">
                  For Your Firm
                </a>
              </li>
              <li>
                <Link href="/login" className="text-[13px] hover:text-lc-paper">
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-[13px] hover:text-lc-paper"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-11 border-t border-white/10 pt-6 text-center font-plexmono text-[11px] text-[#7C7B6E]">
          © {new Date().getFullYear()} LEGALCONNECT · CASE FILE CLOSED HERE, NOT
          ELSEWHERE
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <SecuritySection />
        <WorkflowSection />
        <PersonasSection />
        <ScreenshotsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

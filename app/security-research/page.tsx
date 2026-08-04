import type { Metadata } from "next";
import Link from "next/link";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import Reveal from "@/app/components/Reveal";
import { DevProjectCard, EmptyRow } from "@/app/components/ContentCards";
import { getSecurityProjects, getTagShowcase, SECURITY_TAG } from "@/lib/data";
import type { DevProject } from "@/lib/types";

/**
 * The dedicated security-research portfolio, separate from the engineering
 * portfolio on / and /projects. Reached from the SecRes hero tag.
 *
 * Everything under "Findings & Disclosures" is data-driven: any dev_project
 * tagged `security-research` appears here automatically and is kept off the
 * engineering pages. The methodology below describes the actual hunt pipeline
 * in github.com/devIykee/security-research.
 */

export const metadata: Metadata = {
  title: "Security Research",
  description:
    "Smart contract audits and vulnerability research on EVM protocols. Findings, tooling, and how I work.",
};

const RESUME_HREF = "/resume/security-research";
// Content lives in Supabase and these pages prerender at build time. Next keeps
// the build-time data reads in .next/cache, which Vercel restores between
// deploys, so a database edit made outside /admin can otherwise stay invisible
// until the cache is cleared by hand. Revalidating puts a ceiling on that.
// Admin writes still call revalidatePath for an immediate refresh.
export const revalidate = 600;

// How a hunt actually runs. Each step is a gate: fail it and the target gets
// dropped rather than burning another day.
const METHODOLOGY: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Ground truth",
    body: "Check the RPC answers and the chain id matches before anything else. Dead and spoofed endpoints are common enough to be worth a gate.",
  },
  {
    step: "02",
    title: "Find the core",
    body: "Trace tokens and positions back to whatever deployed them. When the explorer is thin, the frontend bundle usually has the addresses labelled by role.",
  },
  {
    step: "03",
    title: "Map the surface",
    body: "Balance, code size, Sourcify match, selector dump. This decides whether I am reading source or working from bytecode.",
  },
  {
    step: "04",
    title: "Triage auth",
    body: "Call the admin and keeper signatures from an address with no privileges. Missing access control shows up here or not at all.",
  },
  {
    step: "05",
    title: "Read the value paths",
    body: "Graduation, migration, settlement, claim accounting, by hand. Most of what I have found came from diffing two contracts that do the same job differently.",
  },
  {
    step: "06",
    title: "Prove it",
    body: "Smallest Foundry test that demonstrates the bound, on a fork or against the exact deployed logic. Nothing runs against live state.",
  },
  {
    step: "07",
    title: "Try to kill it",
    body: "Look for the reason the bug does not work before writing it up. Severity reflects what I proved, not the worst case I can imagine.",
  },
  {
    step: "08",
    title: "Report",
    body: "Plain description first, then the bound, the affected addresses, and the fix. Sent privately and held until it is patched.",
  },
];

// Cards are grouped by severity, which lives in its own column so the titles
// do not have to repeat it.
type Severity = "High" | "Medium" | "Trust" | "Tooling";

const SEVERITY_ORDER: Severity[] = ["High", "Medium", "Trust", "Tooling"];

const SEVERITY_LABEL: Record<Severity, string> = {
  High: "High",
  Medium: "Medium",
  Trust: "Trust model",
  Tooling: "Tooling",
};

function severityOf(p: DevProject): Severity {
  const s = (p.severity ?? "").trim();
  return (SEVERITY_ORDER as string[]).includes(s) ? (s as Severity) : "Tooling";
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border p-5">
      <span className="text-3xl font-bold leading-none text-accent">{value}</span>
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
    </div>
  );
}

export default async function SecurityResearchPage() {
  const [projects, showcase] = await Promise.all([
    getSecurityProjects(),
    getTagShowcase(SECURITY_TAG),
  ]);

  const grouped = SEVERITY_ORDER.map((sev) => ({
    sev,
    items: projects.filter((p) => severityOf(p) === sev),
  })).filter((g) => g.items.length > 0);

  const highs = projects.filter((p) => severityOf(p) === "High").length;
  const others = projects.filter((p) => {
    const s = severityOf(p);
    return s === "Medium" || s === "Trust";
  }).length;

  const blurb = showcase?.intro_blurb?.trim() ?? "";
  const isPlaceholder = blurb.startsWith("[");

  return (
    <div
      data-persona="developer"
      className="relative min-h-screen bg-base font-mono text-ink"
    >
      <PersonaChrome persona="developer" />

      <div className="page-enter overflow-x-hidden pb-28">
        <main className="mx-auto max-w-bento px-4 pt-24 md:px-margin md:pt-28">
          {/* ---- Introduction ---- */}
          <div className="mb-12 flex flex-col gap-5 border-b border-border pb-10">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to engineering portfolio
            </Link>

            <h1 className="m-0 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
              <span className="mr-3 text-accent">//</span>
              Security Research
            </h1>

            <p
              className={`m-0 max-w-3xl text-lg leading-relaxed ${
                isPlaceholder ? "italic text-muted" : "text-muted"
              }`}
            >
              {blurb ||
                "Smart contract audits and vulnerability research on EVM protocols."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={RESUME_HREF}
                className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
              >
                <span className="material-symbols-outlined text-[18px]">
                  description
                </span>
                Security Résumé
              </Link>
              <a
                href="mailto:eokorie1911@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
              >
                Get in touch
              </a>
            </div>
          </div>

          {/* ---- At a glance ---- */}
          <Reveal
            as="section"
            className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            <Stat value={String(highs)} label="High findings" />
            <Stat value={String(others)} label="Medium and trust" />
            <Stat value="~30" label="Protocols reviewed" />
            <Stat value="1" label="Fix shipped" />
          </Reveal>

          {/* ---- Methodology ---- */}
          <Reveal
            as="section"
            id="methodology"
            className="mb-6 flex flex-col gap-6 rounded-2xl border border-t-4 border-border border-t-accent p-6"
          >
            <header className="border-b border-border pb-4">
              <h2 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> How I work
              </h2>
              <p className="m-0 mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                The mechanical steps run as scripts so I am not retyping them
                every hunt. Verification is fork,{" "}
                <code className="text-ink">eth_call</code>, or a local Foundry
                test. I do not touch live state, and nothing goes public before
                it is patched.
              </p>
            </header>
            <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
              {METHODOLOGY.map((m) => (
                <li key={m.step} className="flex gap-4">
                  <span className="shrink-0 text-sm font-bold text-accent">
                    {m.step}
                  </span>
                  <div>
                    <h3 className="m-0 text-sm font-bold uppercase tracking-wider text-ink">
                      {m.title}
                    </h3>
                    <p className="m-0 mt-1.5 text-sm leading-relaxed text-muted">
                      {m.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* ---- Findings, writeups, tooling ---- */}
          <Reveal
            as="section"
            id="findings"
            className="flex flex-col gap-8 rounded-2xl border border-border p-6"
          >
            <header className="border-b border-border pb-4">
              <h2 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Findings
              </h2>
              <p className="m-0 mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                Audit and bounty work, each linking to the full writeup. Every
                report says what an attacker gets, what it costs them, and where
                the impact stops.
              </p>
            </header>

            {grouped.length > 0 ? (
              grouped.map((group) => (
                <div key={group.sev} className="flex flex-col gap-5">
                  <h3 className="m-0 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted">
                    <span className="h-px flex-1 bg-border" aria-hidden="true" />
                    {SEVERITY_LABEL[group.sev]} ({group.items.length})
                    <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {group.items.map((p, i) => (
                      <Reveal key={p.id} delay={i * 40}>
                        <DevProjectCard p={p} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyRow label="Nothing published here yet." />
            )}
          </Reveal>

          {/* ---- Rules of engagement ---- */}
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">
            Work is done on authorized targets, inside bounty or audit scope.
            Verification is read only or on a local fork. No production state is
            modified.
          </p>
        </main>

        <PersonaFooter persona="developer" />
      </div>
    </div>
  );
}

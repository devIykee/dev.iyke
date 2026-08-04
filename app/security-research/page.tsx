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
    "Smart-contract security research, audits, and responsibly disclosed high-severity findings.",
};

const RESUME_HREF = "/resume/security-research";

// The ten-step hunt pipeline the tooling in the research repo implements.
const METHODOLOGY: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Ground truth",
    body: "Gate on RPC liveness and a chain-id match before anything else, so no time is spent on a dead or spoofed endpoint.",
  },
  {
    step: "02",
    title: "Core discovery",
    body: "Trace token and position contracts back to their creator via the explorer API, and grep frontend bundles for role-labelled addresses that are published nowhere else.",
  },
  {
    step: "03",
    title: "Surface map",
    body: "Balance, code size, Sourcify verification match, and bytecode selector extraction — which routes the hunt down the verified-source or the reversing path.",
  },
  {
    step: "04",
    title: "Auth triage",
    body: "Replay admin and keeper signatures as an unprivileged caller to flag anything missing access control.",
  },
  {
    step: "05",
    title: "Root-cause reading",
    body: "Read the value-moving paths by hand — graduation, migration, settlement, claim accounting — and diff sibling contracts that implement the same operation differently.",
  },
  {
    step: "06",
    title: "Proof of concept",
    body: "Smallest Foundry test that proves the bound, on a local fork or against exact production logic. Fork and eth_call only; mainnet is never exploited.",
  },
  {
    step: "07",
    title: "Kill your own finding",
    body: "Actively try to invalidate it, then bound the impact honestly. Every report states what the finding is not, and severity reflects demonstrated impact rather than the headline maximum.",
  },
  {
    step: "08",
    title: "Private disclosure",
    body: "Structured report plus a direct, non-extortionate first contact. Held private until patched.",
  },
];

// Severity is carried in the finding's title, e.g. "… (High)". Grouping reads
// it back rather than requiring a second column.
type Severity = "High" | "Medium" | "Trust" | "Tooling";

const SEVERITY_ORDER: Severity[] = ["High", "Medium", "Trust", "Tooling"];

const SEVERITY_LABEL: Record<Severity, string> = {
  High: "High severity",
  Medium: "Medium severity",
  Trust: "Trust / centralization",
  Tooling: "Research tooling",
};

function severityOf(p: DevProject): Severity {
  const t = p.title.toLowerCase();
  if (t.includes("(high)")) return "High";
  if (t.includes("medium")) return "Medium";
  if (t.includes("trust") || t.includes("centralization")) return "Trust";
  return "Tooling";
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
                "Smart-contract security research, audits, and responsibly disclosed findings."}
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
                Report / Engage
              </a>
            </div>
          </div>

          {/* ---- At a glance ---- */}
          <Reveal
            as="section"
            className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            <Stat value={String(highs)} label="High-severity findings" />
            <Stat value={String(others)} label="Medium / trust findings" />
            <Stat value="~30" label="Protocols swept" />
            <Stat value="1" label="Confirmed fix shipped" />
          </Reveal>

          {/* ---- Methodology ---- */}
          <Reveal
            as="section"
            id="methodology"
            className="mb-6 flex flex-col gap-6 rounded-2xl border border-t-4 border-border border-t-accent p-6"
          >
            <header className="border-b border-border pb-4">
              <h2 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Audit Methodology
              </h2>
              <p className="m-0 mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                A repeatable, gate-driven pipeline: mechanical steps run as
                scripts, judgment stays with the analyst. Verification is fork /{" "}
                <code className="text-ink">eth_call</code> / local Foundry only —
                never mainnet exploitation — and findings stay private until
                patched.
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
                <span className="mr-2 text-accent">//</span> Findings &amp;
                Disclosures
              </h2>
              <p className="m-0 mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                Bug-bounty and audit work, each linking to its full writeup.
                Every report opens with a plain-language explanation, states an
                explicit impact bound, and documents what the finding is not.
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
              <EmptyRow label="No security research published yet." />
            )}
          </Reveal>

          {/* ---- Rules of engagement ---- */}
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">
            All research is conducted on authorized targets under bug-bounty or
            audit scope. Verification is read-only or against local forks; no
            production state is ever modified.
          </p>
        </main>

        <PersonaFooter persona="developer" />
      </div>
    </div>
  );
}

import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";

/**
 * Security-research résumé, rendered from public/security-research-resume.md so
 * the page and the raw download are always the same document.
 *
 * Reached only from the Security Research tag showcase (via
 * tag_showcases.resume_url). The site-wide Resume button in the hero and the
 * terminal contact block still point at the general /resume.pdf.
 */

const MD_FILE = "security-research-resume.md";

export const metadata: Metadata = {
  title: "Security Research Résumé",
  description:
    "Iyke — independent Web3 / smart-contract security researcher. Findings, tooling, and methodology.",
};

async function loadResume(): Promise<string> {
  return fs.readFile(path.join(process.cwd(), "public", MD_FILE), "utf8");
}

export default async function SecurityResearchResumePage() {
  const markdown = await loadResume();
  // The H1 is rendered as the page header, so drop it from the prose body.
  const body = markdown.replace(/^#\s.*\n/, "").trimStart();

  return (
    <div
      data-persona="developer"
      className="relative min-h-screen overflow-x-hidden bg-base pb-28 font-mono text-ink"
    >
      <PersonaChrome persona="developer" />

      <article className="mx-auto max-w-reading px-6 pt-24 md:pt-28">
        <Link
          href="/tags/security-research"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          Back to Security Research
        </Link>

        <header className="mt-8 flex flex-col gap-5 border-b border-border pb-8">
          <h1 className="m-0 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Iyke — Security Research Résumé
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/${MD_FILE}`}
              download
              className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Download Markdown
            </a>
            {/* The general resume stays reachable, clearly labelled as such. */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              General Résumé (PDF)
            </a>
          </div>
        </header>

        <div className="prose-writer page-enter mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </article>

      <PersonaFooter persona="developer" />
    </div>
  );
}

"use client";

import { useState } from "react";

const EMAIL = "eokorie1911@gmail.com";
const RESUME_HREF = "/resume.pdf";

/**
 * Developer-persona Contact block: email + résumé, nothing else.
 *
 * The decorative boot-sequence backdrop and the trailing blinking-cursor line
 * were removed — the section now ends immediately after the résumé button.
 * Click-to-copy email with a "copied" confirmation. No socials here (they live
 * in the footer/nav).
 */
export default function TerminalContact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op; the mailto link still works */
    }
  }

  return (
    <div className="relative mt-4 font-mono">
      <div className="relative z-10 flex flex-col items-start gap-6 py-4">
        <div>
          <p className="m-0 mb-2 text-xs uppercase tracking-[0.2em] text-muted">
            {"> CONTACT"}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="text-2xl font-bold text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-3xl md:text-4xl"
            >
              {EMAIL}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                {copied ? "check" : "content_copy"}
              </span>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <a
          href={RESUME_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            download
          </span>
          Download Résumé
        </a>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const EMAIL = "eokorie1911@gmail.com";
const RESUME_HREF = "/resume.pdf";

// Socials rendered as terminal command flags for the Developer contact block.
const FLAGS: { key: string; href: string }[] = [
  { key: "github", href: "https://github.com/devIykee" },
  { key: "linkedin", href: "https://www.linkedin.com/in/emmanuel-okorie-6770a5373/" },
  { key: "x", href: "https://x.com/Deviykee" },
  { key: "tiktok", href: "https://www.tiktok.com/@iykexbt" },
  { key: "telegram", href: "https://t.me/deviykee" },
  { key: "instagram", href: "https://www.instagram.com/deviykee" },
  { key: "youtube", href: "https://www.youtube.com/@devIykee" },
];

/**
 * Developer-persona Contact block: a live-terminal boot sequence with an
 * availability/location/response readout, click-to-copy email, social links as
 * `--flag` commands, an echoed resume link, and a blinking cursor. Monospace,
 * accent-on-surface, matching the terminal aesthetic.
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
    <div className="mt-6 font-mono text-xs leading-relaxed text-accent">
      <pre className="m-0 whitespace-pre-wrap font-mono">{`> SYSTEM BOOT SEQUENCE INITIATED...
> LOADING KERNEL MODULES... [OK]
> MOUNTING ROOT FILESYSTEM... [OK]
> INITIALIZING USER ENVIRONMENT FOR: IYKE
> CURRENT STATUS: ONLINE AND READY FOR INPUT.
> AVAILABILITY: OPEN TO FREELANCE / FULL-TIME
> LOCATION: REMOTE (UTC+1)
> AVG RESPONSE TIME: <24HRS`}</pre>

      {/* Contact email with click-to-copy */}
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span>{"> CONTACT: "}</span>
        <a
          href={`mailto:${EMAIL}`}
          className="underline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {EMAIL}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          aria-label="Copy email address"
          className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="material-symbols-outlined text-[13px]" aria-hidden="true">
            {copied ? "check" : "content_copy"}
          </span>
          {copied ? "copied" : "copy"}
        </button>
      </div>

      {/* Socials as terminal command flags */}
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>{"> SOCIAL: "}</span>
        {FLAGS.map((f) => (
          <a
            key={f.key}
            href={f.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            --{f.key}
          </a>
        ))}
      </div>

      {/* Echoed resume link */}
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span>{"> RESUME: "}</span>
        <a
          href={RESUME_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          download --resume.pdf
        </a>
      </div>

      <span aria-hidden="true">{"> "}</span>
      <span className="animate-pulse" aria-hidden="true">
        _
      </span>
    </div>
  );
}

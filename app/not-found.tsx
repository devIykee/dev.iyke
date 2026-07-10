import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Custom 404, styled to the design system (Developer terminal aesthetic). Common
 * landing spot for stale /writer/[slug] links, so it offers a route back.
 */
export default function NotFound() {
  return (
    <div
      data-persona="developer"
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-base px-6 text-center font-chrome text-ink"
    >
      <div className="font-mono text-sm text-accent">
        <p className="m-0">{"> ERROR 404: RESOURCE NOT FOUND"}</p>
        <p className="m-0">{"> THE REQUESTED PATH DOES NOT EXIST"}</p>
        <p className="m-0">
          {"> "}
          <span className="animate-pulse">_</span>
        </p>
      </div>

      <h1 className="m-0 text-5xl font-black tracking-tight text-ink md:text-7xl">
        404
      </h1>
      <p className="m-0 max-w-md text-muted">
        This page has moved, been unpublished, or never existed. Let&apos;s get you
        back on track.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="border border-accent bg-accent px-6 py-2 text-label uppercase text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Developer
        </Link>
        <Link
          href="/motion"
          className="border border-border px-6 py-2 text-label uppercase text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Motion
        </Link>
        <Link
          href="/writer"
          className="border border-border px-6 py-2 text-label uppercase text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Writer
        </Link>
      </div>
    </div>
  );
}

"use client";

// Global error boundary (item 26): friendly fallback instead of a white screen
// when a route render throws (e.g. an unexpected Supabase/client failure).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      data-persona="developer"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-base px-6 text-center font-chrome text-ink"
    >
      <p className="m-0 font-mono text-sm text-accent">
        {"> UNEXPECTED ERROR — the system caught an exception"}
      </p>
      <h1 className="m-0 text-3xl font-black tracking-tight md:text-4xl">
        Something went wrong
      </h1>
      <p className="m-0 max-w-md text-muted">
        This part of the site failed to load. You can retry, or head back to the
        homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="border border-accent bg-accent px-6 py-2 text-label uppercase text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Try again
        </button>
        <a
          href="/"
          className="border border-border px-6 py-2 text-label uppercase text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

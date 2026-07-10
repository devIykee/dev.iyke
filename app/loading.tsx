/**
 * Global loading shell shown during navigation/streaming. Neutral (no persona
 * context here), using the shared chrome font. Keeps the screen from flashing
 * empty before content/fonts arrive.
 */
export default function Loading() {
  return (
    <div
      data-persona="developer"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-base font-chrome text-ink"
    >
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-accent [animation-delay:150ms]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-accent [animation-delay:300ms]" />
      </div>
      <p className="text-label uppercase tracking-widest text-muted">Loading…</p>
    </div>
  );
}

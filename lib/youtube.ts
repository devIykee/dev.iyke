/**
 * Extract an 11-character YouTube video ID from either a bare ID or any of the
 * common URL shapes (watch?v=, youtu.be/, /embed/, /shorts/). Returns the input
 * trimmed if it already looks like a bare ID, or null if nothing parseable.
 */
export function parseYouTubeId(input: string): string | null {
  const value = (input ?? "").trim();
  if (!value) return null;

  // Already a bare 11-char ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/, // /embed/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/, // /shorts/ID
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m) return m[1];
  }
  return null;
}

/** Fallback thumbnail served straight from YouTube's CDN. */
export function youTubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

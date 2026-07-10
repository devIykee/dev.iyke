import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import { getWriterPostBySlug } from "@/lib/data";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Estimated read time at ~220 wpm (min 1), stripping markdown symbols.
function readingTime(markdown: string): number {
  const words = markdown
    .replace(/[#>*_`~\-!\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWriterPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return { title: `${post.title} — Iyke`, description: post.excerpt };
}

// Render per-request so missing/draft posts return a true 404 (not a cached
// 200) and newly-published posts appear immediately. The blog is small and
// Supabase-backed, so SSR cost is negligible.
export const dynamic = "force-dynamic";

export default async function WriterPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWriterPostBySlug(slug);
  if (!post) notFound();

  return (
    <div
      data-persona="writer"
      className="relative min-h-screen overflow-x-hidden bg-base pb-28 font-serif text-ink"
    >
      <PersonaChrome persona="writer" />

      <article className="mx-auto max-w-reading px-6 pt-16">
        <Link
          href="/writer"
          className="text-label uppercase tracking-wider text-accent hover:underline"
        >
          ← Back to articles
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <p className="m-0 mb-3 flex flex-wrap items-center gap-2 text-label uppercase tracking-wider text-muted">
            <span>{formatDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span>{readingTime(post.body)} min read</span>
          </p>
          {/* Sentence-case headline, per Writer hierarchy rules */}
          <h1 className="m-0 font-serif text-4xl font-bold leading-tight text-ink">
            {post.title}
          </h1>
        </header>

        <div className="prose-writer page-enter mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </article>

      <PersonaFooter persona="writer" />
    </div>
  );
}

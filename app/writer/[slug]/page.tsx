import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import { getWriterPostBySlug, getWriterPosts } from "@/lib/data";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWriterPostBySlug(slug);
  if (!post) return { title: "Iyke — Writer" };
  return { title: `${post.title} — Iyke`, description: post.excerpt };
}

export default async function WriterPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWriterPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-writer-bg pb-28 font-serif text-writer-ink">
      <PersonaChrome persona="writer" />

      <article className="mx-auto max-w-reading px-6 pt-16">
        <Link
          href="/writer"
          className="font-label text-label uppercase tracking-wider text-writer-burgundy hover:underline"
        >
          ← Back to articles
        </Link>

        <header className="mt-8 border-b border-writer-rule pb-8">
          <p className="m-0 mb-3 font-label text-label uppercase tracking-wider text-writer-muted">
            {formatDate(post.date)}
          </p>
          {/* Sentence-case headline, per Writer hierarchy rules */}
          <h1 className="m-0 font-serif text-4xl font-bold leading-tight text-writer-ink">
            {post.title}
          </h1>
        </header>

        <div className="prose-writer mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </article>

      <PersonaFooter persona="writer" />
    </div>
  );
}

// Pre-render known slugs at build; unknown slugs fall back to dynamic render.
export async function generateStaticParams() {
  const posts = await getWriterPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

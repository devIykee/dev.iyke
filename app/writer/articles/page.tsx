import type { Metadata } from "next";
import Link from "next/link";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import { EmptyRow } from "@/app/components/ContentCards";
import { getWriterPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Articles",
  description: "The complete writing archive.",
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function AllArticlesPage() {
  const posts = await getWriterPosts();

  return (
    <div
      data-persona="writer"
      className="relative min-h-screen bg-base font-serif text-ink"
    >
      <PersonaChrome persona="writer" />

      <div className="page-enter overflow-x-hidden pb-28">
        <main id="articles" className="mx-auto max-w-reading px-6 pt-24 md:pt-28">
          <div className="mb-10 border-b border-border pb-6">
            <Link
              href="/writer"
              className="mb-4 inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to Writer
            </Link>
            <h1 className="m-0 font-serif text-h2 font-bold text-ink">
              All Articles
            </h1>
          </div>

          {posts.length > 0 ? (
            <ul className="m-0 list-none p-0">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="border-t border-border py-8 first:border-t-0 first:pt-0"
                >
                  <p className="m-0 mb-2 text-label uppercase tracking-wider text-muted">
                    {formatDate(post.date)}
                  </p>
                  <h4 className="m-0 mb-3 font-serif text-2xl font-bold leading-snug text-ink">
                    <Link
                      href={`/writer/${post.slug}`}
                      className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {post.title}
                    </Link>
                  </h4>
                  <p className="m-0 mb-4 text-lg leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/writer/${post.slug}`}
                    className="text-label uppercase tracking-wider text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Read →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow label="No articles published yet." />
          )}
        </main>

        <PersonaFooter persona="writer" />
      </div>
    </div>
  );
}

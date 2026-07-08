import type { Metadata } from "next";
import Link from "next/link";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import { getWriterPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Iyke — Writer",
  description: "Crafting narratives that convert and connect.",
};

// Formats an ISO date as "June 1, 2026" without pulling in a date library.
function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function WriterPage() {
  const posts = await getWriterPosts();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-writer-bg pb-28 font-serif text-writer-ink">
      <PersonaHeader persona="writer" />
      <PersonaChrome persona="writer" />

      {/* Single, narrow, centered reading rail — max 720px */}
      <main className="mx-auto max-w-reading px-6 pt-16">
        {/* ARTICLES */}
        <section id="articles">
          <h3 className="m-0 mb-8 font-serif text-h2 font-bold text-writer-ink">
            Articles
          </h3>
          <ul className="m-0 list-none p-0">
            {posts.map((post) => (
              <li
                key={post.id}
                className="border-t border-writer-rule py-8 first:border-t-0 first:pt-0"
              >
                <p className="m-0 mb-2 font-label text-label uppercase tracking-wider text-writer-muted">
                  {formatDate(post.date)}
                </p>
                <h4 className="m-0 mb-3 font-serif text-2xl font-bold leading-snug text-writer-ink">
                  <Link
                    href={`/writer/${post.slug}`}
                    className="transition-colors hover:text-writer-burgundy"
                  >
                    {post.title}
                  </Link>
                </h4>
                <p className="m-0 mb-4 text-lg leading-relaxed text-writer-muted">
                  {post.excerpt}
                </p>
                <Link
                  href={`/writer/${post.slug}`}
                  className="font-label text-label uppercase tracking-wider text-writer-burgundy hover:underline"
                >
                  Read →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <hr className="my-14 border-t border-writer-rule" />

        {/* CASE STUDIES */}
        <section id="case-studies">
          <h3 className="m-0 mb-6 font-serif text-h2 font-bold text-writer-ink">
            Case studies
          </h3>
          <p className="text-lg leading-relaxed text-writer-muted">
            Long-form breakdowns of narrative and conversion work — pairing the
            brief, the draft, and the measured result. New studies are added as
            projects wrap.
          </p>
        </section>

        <hr className="my-14 border-t border-writer-rule" />

        {/* PUBLICATIONS */}
        <section id="publications">
          <h3 className="m-0 mb-6 font-serif text-h2 font-bold text-writer-ink">
            Publications
          </h3>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {[
              { org: "The Editorial", role: "Guest essayist" },
              { org: "Field Notes Quarterly", role: "Contributing writer" },
              { org: "Longform Weekly", role: "Featured author" },
            ].map((pub) => (
              <li
                key={pub.org}
                className="flex items-baseline justify-between border-b border-writer-rule pb-4"
              >
                <span className="font-serif text-lg font-bold text-writer-ink">
                  {pub.org}
                </span>
                <span className="text-sm text-writer-muted">{pub.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="my-14 border-t border-writer-rule" />

        {/* CONTACT */}
        <section id="contact" className="pb-8">
          <h3 className="m-0 mb-6 font-serif text-h2 font-bold text-writer-ink">
            Contact
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-writer-muted">
            For commissions, editing, or a conversation about a story worth
            telling —
          </p>
          <a
            href="mailto:eokorie1911@gmail.com"
            className="inline-block border border-writer-burgundy bg-writer-burgundy px-6 py-2 font-label text-label uppercase text-writer-surface transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
        </section>
      </main>

      <PersonaFooter persona="writer" />
    </div>
  );
}

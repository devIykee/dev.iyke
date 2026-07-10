import type { Metadata } from "next";
import Link from "next/link";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import Reveal from "@/app/components/Reveal";
import SocialLinks from "@/app/components/SocialLinks";
import { EmptyRow } from "@/app/components/ContentCards";
import { getWriterPosts } from "@/lib/data";
import { getHeroImage } from "@/lib/hero";

export const metadata: Metadata = {
  title: "Writer",
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
  const [posts, heroImage] = await Promise.all([
    getWriterPosts(),
    getHeroImage("writer"),
  ]);

  return (
    <div
      data-persona="writer"
      className="page-enter relative min-h-screen overflow-x-hidden bg-base pb-28 font-serif text-ink"
    >
      <PersonaHeader persona="writer" imageSrc={heroImage} />
      <PersonaChrome persona="writer" />

      {/* Single, narrow, centered reading rail — max 720px */}
      <main className="mx-auto max-w-reading px-6 pt-16">
        {/* ARTICLES */}
        <Reveal as="section" id="articles">
          <h3 className="m-0 mb-8 font-serif text-h2 font-bold text-ink">
            Articles
          </h3>
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
        </Reveal>

        <hr className="my-14 border-t border-border" />

        {/* CASE STUDIES */}
        <Reveal as="section" id="case-studies">
          <h3 className="m-0 mb-6 font-serif text-h2 font-bold text-ink">
            Case studies
          </h3>
          <p className="text-lg leading-relaxed text-muted">
            Long-form breakdowns of narrative and conversion work — pairing the
            brief, the draft, and the measured result. New studies are added as
            projects wrap.
          </p>
        </Reveal>

        <hr className="my-14 border-t border-border" />

        {/* PUBLICATIONS */}
        <Reveal as="section" id="publications">
          <h3 className="m-0 mb-6 font-serif text-h2 font-bold text-ink">
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
                className="flex items-baseline justify-between border-b border-border pb-4"
              >
                <span className="font-serif text-lg font-bold text-ink">
                  {pub.org}
                </span>
                <span className="text-sm text-muted">{pub.role}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <hr className="my-14 border-t border-border" />

        {/* CONTACT */}
        <Reveal as="section" id="contact" className="pb-8">
          <h3 className="m-0 mb-6 font-serif text-h2 font-bold text-ink">
            Contact
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-muted">
            For commissions, editing, or a conversation about a story worth
            telling —
          </p>
          <a
            href="mailto:eokorie1911@gmail.com"
            className="inline-block rounded-full border border-accent bg-accent px-6 py-2 text-label uppercase text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Get in touch
          </a>
          {/* Where to follow the writing/thoughts */}
          <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
            <span className="text-xs uppercase tracking-widest text-muted">
              Follow
            </span>
            <SocialLinks items={["x", "linkedin", "telegram"]} />
          </div>
        </Reveal>
      </main>

      <PersonaFooter persona="writer" />
    </div>
  );
}

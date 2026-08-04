import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import Reveal from "@/app/components/Reveal";
import {
  DevProjectCard,
  MotionCaseStudyCard,
} from "@/app/components/ContentCards";
import { PERSONAS } from "@/lib/personas";
import {
  getHeroTagsBySlug,
  getTagShowcase,
  getDevProjects,
  getMotionProjects,
  getWriterPosts,
} from "@/lib/data";
import type { Persona } from "@/lib/types";

// Persona wrapper font, mirroring each persona page's root class.
const PERSONA_FONT: Record<Persona, string> = {
  developer: "font-mono",
  motion: "font-sans",
  writer: "font-serif",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getHeroTagsBySlug(slug);
  const label = tags[0]?.label ?? slug;
  return {
    title: `#${label}`,
    description: `Selected work tagged ${label}.`,
  };
}

export default async function TagShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tags, showcase] = await Promise.all([
    getHeroTagsBySlug(slug),
    getTagShowcase(slug),
  ]);

  // Unknown tag → 404.
  if (!tags.length) notFound();

  const persona = tags[0].persona;
  const label = tags[0].label;
  const config = PERSONAS[persona];
  const ids = showcase?.project_ids ?? [];
  const blurb = showcase?.intro_blurb?.trim() ?? "";
  const isPlaceholderBlurb = blurb.startsWith("[");

  // Pull the persona's items and keep only the featured ids, in showcase order.
  let devItems: Awaited<ReturnType<typeof getDevProjects>> = [];
  let motionItems: Awaited<ReturnType<typeof getMotionProjects>> = [];
  let writerItems: Awaited<ReturnType<typeof getWriterPosts>> = [];
  if (persona === "developer") {
    const all = await getDevProjects();
    const byId = new Map(all.map((p) => [p.id, p]));
    devItems = ids.map((id) => byId.get(id)).filter((p): p is (typeof all)[number] => Boolean(p));
  } else if (persona === "motion") {
    const all = await getMotionProjects();
    const byId = new Map(all.map((p) => [p.id, p]));
    motionItems = ids.map((id) => byId.get(id)).filter((p): p is (typeof all)[number] => Boolean(p));
  } else {
    const all = await getWriterPosts();
    const byId = new Map(all.map((p) => [p.id, p]));
    writerItems = ids.map((id) => byId.get(id)).filter((p): p is (typeof all)[number] => Boolean(p));
  }

  const count = devItems.length + motionItems.length + writerItems.length;

  return (
    <div
      data-persona={persona}
      className={`relative min-h-screen bg-base text-ink ${PERSONA_FONT[persona]}`}
    >
      <PersonaChrome persona={persona} />

      <div className="page-enter overflow-x-hidden pb-28">
        <main className="mx-auto max-w-bento px-4 pt-24 md:px-margin md:pt-28">
          {/* Header: back link, tag title, intro blurb */}
          <div className="mb-12 flex flex-col gap-4 border-b border-border pb-8">
            <Link
              href={config.path}
              className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to {config.name}
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/60 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
                <span className="text-accent/50" aria-hidden="true">
                  #
                </span>
                {label}
              </span>
            </div>
            <p
              className={`m-0 max-w-2xl text-lg leading-relaxed ${
                isPlaceholderBlurb ? "italic text-muted" : "text-muted"
              }`}
            >
              {blurb || `Selected work tagged ${label}.`}
            </p>
          </div>

          {/* Featured work */}
          {count > 0 ? (
            persona === "motion" ? (
              <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                {motionItems.map((p) => (
                  <MotionCaseStudyCard key={p.id} p={p} />
                ))}
              </div>
            ) : persona === "writer" ? (
              <ul className="m-0 max-w-reading list-none p-0">
                {writerItems.map((post) => (
                  <li
                    key={post.id}
                    className="border-t border-border py-8 first:border-t-0 first:pt-0"
                  >
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {devItems.map((p, i) => (
                  <Reveal key={p.id} delay={i * 40}>
                    <DevProjectCard p={p} />
                  </Reveal>
                ))}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center text-sm text-muted">
              No projects linked yet — curate this showcase from{" "}
              <span className="mx-1 font-semibold text-ink">/admin → Tags</span>.
            </div>
          )}
        </main>

        <PersonaFooter persona={persona} />
      </div>
    </div>
  );
}

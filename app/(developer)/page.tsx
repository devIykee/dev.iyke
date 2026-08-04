import type { Metadata } from "next";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import Reveal from "@/app/components/Reveal";
import AutoScrollY from "@/app/components/AutoScrollY";
import AutoScrollX from "@/app/components/AutoScrollX";
import {
  ToolkitChip,
  CollaborationRow,
  EmptyRow,
  DevProjectCard,
} from "@/app/components/ContentCards";
import TerminalContact from "@/app/components/TerminalContact";
import Link from "next/link";
import {
  getDevProjects,
  getCollaborations,
  getToolkitItems,
  getHeroTags,
} from "@/lib/data";
import { getHeroImage } from "@/lib/hero";

// How many project cards show in the section before the "Show More" CTA.
const PROJECTS_PREVIEW = 6;

export const metadata: Metadata = {
  title: "Developer",
  description: "Architecting scalable, logic-driven systems.",
};

export default async function DeveloperPage() {
  const [projects, collaborations, toolkit, heroImage, tags] = await Promise.all([
    getDevProjects(),
    getCollaborations(),
    getToolkitItems(),
    getHeroImage("developer"),
    getHeroTags("developer"),
  ]);
  const previewProjects = projects.slice(0, PROJECTS_PREVIEW);
  const hasMoreProjects = projects.length > PROJECTS_PREVIEW;

  return (
    <div
      data-persona="developer"
      className="relative min-h-screen bg-base font-mono text-ink"
    >
      {/* Chrome is a sibling of the animated/clipped content so its fixed nav is
          truly viewport-fixed (an ancestor transform/overflow would trap it). */}
      <PersonaChrome persona="developer" />

      <div className="page-enter overflow-x-hidden pb-28">
        <PersonaHeader persona="developer" imageSrc={heroImage} tags={tags} />

        <main className="mx-auto max-w-bento px-4 pt-16 md:px-margin">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* PROJECTS — full width, internal 3-col grid */}
          <Reveal
            as="section"
            id="projects"
            className="col-span-1 flex flex-col gap-6 rounded-2xl border border-t-4 border-border border-t-accent p-6 md:col-span-12"
          >
            <header className="flex items-end justify-between border-b border-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Projects
              </h3>
            </header>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {previewProjects.map((p, i) => (
                  <Reveal key={p.id} delay={i * 60}>
                    <DevProjectCard p={p} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyRow label="No projects yet." />
            )}
            {hasMoreProjects && (
              <div className="flex justify-center pt-2">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  Show More
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            )}
          </Reveal>

          {/* COLLABORATIONS — full width, ABOVE Toolkit. Vertical list, fixed
              height, auto-scrolls vertically once items overflow. */}
          <Reveal
            as="section"
            id="collaborations"
            className="col-span-1 flex flex-col rounded-2xl border border-border p-6 md:col-span-12"
          >
            <header className="mb-4 border-b border-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Collaborations
              </h3>
            </header>
            {collaborations.length > 0 ? (
              <>
                <div className="grid grid-cols-[1fr_1fr] gap-4 border-b border-border pb-2 text-xs uppercase tracking-wider text-muted">
                  <span>Organization</span>
                  <span>Role / Contribution</span>
                </div>
                <AutoScrollY heightClass="max-h-[280px]">
                  {collaborations.map((c) => (
                    <CollaborationRow key={c.id} c={c} />
                  ))}
                </AutoScrollY>
              </>
            ) : (
              <EmptyRow label="No collaborations listed yet." />
            )}
          </Reveal>

          {/* TOOLKIT — full width, BELOW Collaborations. Single horizontal strip,
              auto-scrolls horizontally once items overflow. */}
          <Reveal
            as="section"
            id="toolkit"
            className="col-span-1 rounded-2xl border border-border p-6 md:col-span-12"
          >
            <header className="mb-6 border-b border-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Toolkit
              </h3>
            </header>
            {toolkit.length > 0 ? (
              <AutoScrollX>
                {toolkit.map((item) => (
                  <ToolkitChip key={item.id} item={item} />
                ))}
              </AutoScrollX>
            ) : (
              <EmptyRow label="No tools listed yet." />
            )}
          </Reveal>

          {/* CONTACT / terminal decorative block — full width */}
          <Reveal
            as="section"
            id="contact"
            className="relative col-span-1 overflow-hidden rounded-2xl border border-border bg-surface p-6 md:col-span-12"
          >
            <div className="absolute left-2 top-2 flex gap-1">
              <div className="h-2 w-2 bg-border" />
              <div className="h-2 w-2 bg-border" />
              <div className="h-2 w-2 bg-border" />
            </div>
            <TerminalContact />
          </Reveal>
        </div>
      </main>

        <PersonaFooter persona="developer" />
      </div>
    </div>
  );
}

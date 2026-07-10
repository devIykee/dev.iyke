import type { Metadata } from "next";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import ScreenshotFrame from "@/app/components/ScreenshotFrame";
import Reveal from "@/app/components/Reveal";
import AutoScrollY from "@/app/components/AutoScrollY";
import AutoScrollX from "@/app/components/AutoScrollX";
import {
  ToolkitChip,
  CollaborationRow,
  EmptyRow,
} from "@/app/components/ContentCards";
import TerminalContact from "@/app/components/TerminalContact";
import { getDevProjects, getCollaborations, getToolkitItems } from "@/lib/data";
import { getHeroImage } from "@/lib/hero";

export const metadata: Metadata = {
  title: "Developer",
  description: "Architecting scalable, logic-driven systems.",
};

export default async function DeveloperPage() {
  const [projects, collaborations, toolkit, heroImage] = await Promise.all([
    getDevProjects(),
    getCollaborations(),
    getToolkitItems(),
    getHeroImage("developer"),
  ]);

  return (
    <div
      data-persona="developer"
      className="page-enter relative min-h-screen overflow-x-hidden bg-base pb-28 font-mono text-ink"
    >
      <PersonaHeader persona="developer" imageSrc={heroImage} />
      <PersonaChrome persona="developer" />

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
                {projects.map((p, i) => (
                  <Reveal
                    key={p.id}
                    as="article"
                    delay={i * 60}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border transition-transform duration-200 hover:-translate-y-1"
                  >
                    <ScreenshotFrame
                      src={p.screenshot_url}
                      label="IMG_PLACEHOLDER"
                      alt={`${p.title} project screenshot`}
                      className="h-48 border-b border-border bg-elevated"
                      labelClassName="text-muted font-mono tracking-widest"
                    />
                    <div className="flex flex-1 flex-col bg-base p-4">
                      <h4 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-accent">
                        {p.title}
                      </h4>
                      <p className="mb-6 line-clamp-2 flex-1 text-sm text-muted">
                        {p.description}
                      </p>
                      <a
                        href={p.link ?? "#"}
                        target={p.link && p.link !== "#" ? "_blank" : undefined}
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Explore
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyRow label="No projects yet." />
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
  );
}

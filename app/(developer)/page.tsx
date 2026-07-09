import type { Metadata } from "next";
import Image from "next/image";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import ScreenshotFrame from "@/app/components/ScreenshotFrame";
import { getDevProjects, getCollaborations, getToolkitItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Iyke — Developer",
  description: "Architecting scalable, logic-driven systems.",
};

export default async function DeveloperPage() {
  const [projects, collaborations, toolkit] = await Promise.all([
    getDevProjects(),
    getCollaborations(),
    getToolkitItems(),
  ]);

  return (
    <div
      data-persona="developer"
      className="relative min-h-screen overflow-x-hidden bg-base pb-28 font-mono text-ink"
    >
      <PersonaHeader persona="developer" />
      <PersonaChrome persona="developer" />

      <main className="mx-auto max-w-bento px-4 pt-12 md:px-margin">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* PROJECTS — full width, internal 3-col grid */}
          <section
            id="projects"
            className="col-span-1 flex flex-col gap-6 border border-t-4 border-border border-t-accent p-6 md:col-span-12"
          >
            <header className="flex items-end justify-between border-b border-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Projects
              </h3>
            </header>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col border border-border"
                >
                  <ScreenshotFrame
                    src={p.screenshot_url}
                    label="IMG_PLACEHOLDER"
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
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase text-accent hover:underline"
                    >
                      Explore
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* TOOLKIT — 4 cols */}
          <section
            id="toolkit"
            className="col-span-1 border border-border p-6 md:col-span-4"
          >
            <header className="mb-6 border-b border-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Toolkit
              </h3>
            </header>
            <div className="grid grid-cols-2 gap-4">
              {toolkit.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border border-border-soft bg-surface p-3 transition-colors hover:border-accent"
                >
                  <span className="material-symbols-outlined text-muted">
                    {item.icon_key}
                  </span>
                  <span className="text-sm text-ink">{item.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* COLLABORATIONS — 8 cols */}
          <section
            id="collaborations"
            className="col-span-1 flex flex-col border border-border p-6 md:col-span-8"
          >
            <header className="mb-6 border-b border-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-ink">
                <span className="mr-2 text-accent">//</span> Collaborations
              </h3>
            </header>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                    <th className="py-3 font-normal">Organization</th>
                    <th className="py-3 font-normal">Role / Contribution</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {collaborations.map((c) => {
                    // Logo (real image) or a flat labelled placeholder square.
                    const logo = c.logo_url ? (
                      <span className="relative block h-6 w-6 shrink-0 overflow-hidden rounded-sm border border-border bg-surface">
                        <Image
                          src={c.logo_url}
                          alt={`${c.org} logo`}
                          fill
                          sizes="24px"
                          className="object-contain"
                        />
                      </span>
                    ) : (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-[10px] font-bold text-muted">
                        {c.org.charAt(0).toUpperCase()}
                      </span>
                    );

                    const orgLabel = c.link_url ? (
                      <a
                        href={c.link_url}
                        className="inline-flex items-center gap-1 font-bold text-ink hover:text-accent hover:underline"
                      >
                        {c.org}
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_outward
                        </span>
                      </a>
                    ) : (
                      <span className="font-bold text-ink">{c.org}</span>
                    );

                    return (
                      <tr
                        key={c.id}
                        className="border-b border-border-soft transition-colors hover:bg-surface"
                      >
                        <td className="py-4 pl-2">
                          <span className="flex items-center gap-3">
                            {logo}
                            {orgLabel}
                          </span>
                        </td>
                        <td className="py-4 text-muted">{c.role}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* CONTACT / terminal decorative block — full width */}
          <section
            id="contact"
            className="relative col-span-1 overflow-hidden border border-border bg-surface p-6 md:col-span-12"
          >
            <div className="absolute left-2 top-2 flex gap-1">
              <div className="h-2 w-2 bg-border" />
              <div className="h-2 w-2 bg-border" />
              <div className="h-2 w-2 bg-border" />
            </div>
            <div className="mt-6 whitespace-pre-wrap font-mono text-xs text-accent">
              {`> SYSTEM BOOT SEQUENCE INITIATED...
> LOADING KERNEL MODULES... [OK]
> MOUNTING ROOT FILESYSTEM... [OK]
> INITIALIZING USER ENVIRONMENT FOR: IYKE
> CURRENT STATUS: ONLINE AND READY FOR INPUT.
> CONTACT: `}
              <a href="mailto:eokorie1911@gmail.com" className="underline hover:text-ink">
                eokorie1911@gmail.com
              </a>
              <span className="animate-pulse"> _</span>
            </div>
          </section>
        </div>
      </main>

      <PersonaFooter persona="developer" />
    </div>
  );
}

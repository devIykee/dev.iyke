import type { Metadata } from "next";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import ScreenshotFrame from "@/app/components/ScreenshotFrame";
import { getDevProjects, getCollaborations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Iyke — Developer",
  description: "Architecting scalable, logic-driven systems.",
};

// The toolkit is presentational (not content-managed), mirroring code.html.
const TOOLKIT = [
  { icon: "code_blocks", name: "TypeScript" },
  { icon: "api", name: "Next.js" },
  { icon: "data_object", name: "React" },
  { icon: "terminal", name: "GitHub" },
  { icon: "database", name: "PostgreSQL" },
  { icon: "dns", name: "Docker" },
];

export default async function DeveloperPage() {
  const [projects, collaborations] = await Promise.all([
    getDevProjects(),
    getCollaborations(),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-dev-bg pb-28 font-mono text-white">
      <PersonaHeader persona="developer" />
      <PersonaChrome persona="developer" />

      <main className="mx-auto max-w-bento px-4 pt-12 md:px-margin">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* PROJECTS — full width, internal 3-col grid */}
          <section
            id="projects"
            className="col-span-1 flex flex-col gap-6 border border-t-4 border-grid-border border-t-terminal-green p-6 md:col-span-12"
          >
            <header className="flex items-end justify-between border-b border-grid-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-white">
                <span className="mr-2 text-terminal-green">//</span> Projects
              </h3>
            </header>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col border border-grid-border"
                >
                  <ScreenshotFrame
                    src={p.screenshot_url}
                    label="IMG_PLACEHOLDER"
                    className="h-48 border-b border-grid-border bg-dev-bg-elevated"
                    labelClassName="text-outline font-mono tracking-widest"
                  />
                  <div className="flex flex-1 flex-col bg-dev-bg p-4">
                    <h4 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-terminal-green">
                      {p.title}
                    </h4>
                    <p className="mb-6 line-clamp-2 flex-1 text-sm text-dev-muted">
                      {p.description}
                    </p>
                    <a
                      href={p.link ?? "#"}
                      target={p.link && p.link !== "#" ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase text-terminal-green hover:underline"
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
            className="col-span-1 border border-grid-border p-6 md:col-span-4"
          >
            <header className="mb-6 border-b border-grid-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-white">
                <span className="mr-2 text-terminal-green">//</span> Toolkit
              </h3>
            </header>
            <div className="grid grid-cols-2 gap-4">
              {TOOLKIT.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 border border-[#222222] bg-[#111111] p-3 transition-colors hover:border-terminal-green"
                >
                  <span className="material-symbols-outlined text-outline">
                    {item.icon}
                  </span>
                  <span className="text-sm text-[#cccccc]">{item.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* COLLABORATIONS — 8 cols */}
          <section
            id="collaborations"
            className="col-span-1 flex flex-col border border-grid-border p-6 md:col-span-8"
          >
            <header className="mb-6 border-b border-grid-border pb-4">
              <h3 className="m-0 text-h3 uppercase tracking-widest text-white">
                <span className="mr-2 text-terminal-green">//</span> Collaborations
              </h3>
            </header>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-grid-border text-xs uppercase tracking-wider text-outline">
                    <th className="py-3 font-normal">Organization</th>
                    <th className="py-3 font-normal">Role / Contribution</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {collaborations.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-[#222222] transition-colors hover:bg-[#111111]"
                    >
                      <td className="py-4 pl-2 font-bold text-white">{c.org}</td>
                      <td className="py-4 text-dev-muted">{c.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CONTACT / terminal decorative block — full width */}
          <section
            id="contact"
            className="relative col-span-1 overflow-hidden border border-grid-border bg-dev-bg-deep p-6 md:col-span-12"
          >
            <div className="absolute left-2 top-2 flex gap-1">
              <div className="h-2 w-2 bg-[#333]" />
              <div className="h-2 w-2 bg-[#333]" />
              <div className="h-2 w-2 bg-[#333]" />
            </div>
            <div className="mt-6 whitespace-pre-wrap font-mono text-xs text-terminal-green opacity-70">
              {`> SYSTEM BOOT SEQUENCE INITIATED...
> LOADING KERNEL MODULES... [OK]
> MOUNTING ROOT FILESYSTEM... [OK]
> INITIALIZING USER ENVIRONMENT FOR: IYKE
> CURRENT STATUS: ONLINE AND READY FOR INPUT.
> CONTACT: `}
              <a
                href="mailto:eokorie1911@gmail.com"
                className="underline hover:text-white"
              >
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

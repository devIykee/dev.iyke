import type { Metadata } from "next";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import { getMotionProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Iyke — Motion",
  description: "Bringing interfaces to life through movement.",
};

export default async function MotionPage() {
  const projects = await getMotionProjects();
  const [feature, ...rest] = projects;

  return (
    <div
      data-persona="motion"
      className="relative min-h-screen overflow-x-hidden bg-base pb-28 font-sans text-ink"
    >
      <PersonaHeader persona="motion" />
      <PersonaChrome persona="motion" />

      <main className="mx-auto max-w-bento px-4 pt-12 md:px-margin">
        {/* REEL — the lead feature video, large scale */}
        <section id="reel" className="mb-16">
          <SectionLabel>Reel</SectionLabel>
          {feature ? (
            <div className="border border-border bg-surface">
              <div className="aspect-video w-full bg-base">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${feature.youtube_id}`}
                  title={feature.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between">
                <h3 className="m-0 text-h3 font-extrabold text-ink">
                  {feature.title}
                </h3>
                <p className="m-0 max-w-xl text-sm text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ) : (
            <EmptyNote>No reel yet — add one from the admin dashboard.</EmptyNote>
          )}
        </section>

        {/* CASE STUDIES — 2–3 column grid of embeds */}
        <section id="case-studies" className="mb-16">
          <SectionLabel>Case Studies</SectionLabel>
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col border border-border bg-surface"
                >
                  <div className="aspect-video w-full bg-base">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${p.youtube_id}`}
                      title={p.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h4 className="mb-2 text-lg font-extrabold text-ink">
                      {p.title}
                    </h4>
                    <p className="line-clamp-3 text-sm text-muted">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyNote>More case studies coming soon.</EmptyNote>
          )}
        </section>

        {/* BEHIND THE SCENES — flat placeholder tiles (no real assets yet) */}
        <section id="behind-the-scenes" className="mb-16">
          <SectionLabel>Behind the Scenes</SectionLabel>
          <div className="grid grid-cols-2 gap-gutter md:grid-cols-4">
            {["Storyboards", "Rig Setup", "Color Pass", "Final Render"].map(
              (label) => (
                <div
                  key={label}
                  className="flex aspect-square items-center justify-center border border-border bg-surface"
                >
                  <span className="text-label uppercase text-muted">{label}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mb-8">
          <SectionLabel>Contact</SectionLabel>
          <div className="flex flex-col items-start gap-4 border border-border bg-surface p-8">
            <p className="max-w-xl text-muted">
              Have a sequence that needs to move? Let&apos;s talk about your next
              motion project.
            </p>
            <a
              href="mailto:eokorie1911@gmail.com"
              className="border border-accent bg-accent px-6 py-2 text-label uppercase text-accent-ink transition-opacity hover:opacity-90"
            >
              Start a Project
            </a>
          </div>
        </section>
      </main>

      <PersonaFooter persona="motion" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h3 className="m-0 text-h2 font-black text-ink">{children}</h3>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-8 text-sm text-muted">
      {children}
    </div>
  );
}

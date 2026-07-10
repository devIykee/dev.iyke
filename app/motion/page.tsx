import type { Metadata } from "next";
import PersonaHeader from "@/app/components/PersonaHeader";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import Reveal from "@/app/components/Reveal";
import SocialLinks from "@/app/components/SocialLinks";
import { getMotionProjects } from "@/lib/data";
import { getHeroImage } from "@/lib/hero";

export const metadata: Metadata = {
  title: "Motion",
  description: "Bringing interfaces to life through movement.",
};

export default async function MotionPage() {
  const [projects, heroImage] = await Promise.all([
    getMotionProjects(),
    getHeroImage("motion"),
  ]);
  const [feature, ...rest] = projects;

  return (
    <div
      data-persona="motion"
      className="relative min-h-screen bg-base font-sans text-ink"
    >
      <PersonaChrome persona="motion" />

      <div className="page-enter overflow-x-hidden pb-28">
        <PersonaHeader persona="motion" imageSrc={heroImage} />

        <main className="mx-auto max-w-bento px-4 pt-16 md:px-margin">
        {/* REEL — the lead feature video, large scale */}
        <Reveal as="section" id="reel" className="mb-16">
          <SectionLabel>Reel</SectionLabel>
          {feature ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
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
            <EmptyNote>No reel yet.</EmptyNote>
          )}
        </Reveal>

        {/* CASE STUDIES — 2–3 column grid of embeds */}
        <Reveal as="section" id="case-studies" className="mb-16">
          <SectionLabel>Case Studies</SectionLabel>
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-transform duration-200 hover:-translate-y-1"
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
        </Reveal>

        {/* BEHIND THE SCENES — flat placeholder tiles (no real assets yet) */}
        <Reveal as="section" id="behind-the-scenes" className="mb-16">
          <SectionLabel>Behind the Scenes</SectionLabel>
          <div className="grid grid-cols-2 gap-gutter md:grid-cols-4">
            {["Storyboards", "Rig Setup", "Color Pass", "Final Render"].map(
              (label) => (
                <div
                  key={label}
                  className="flex aspect-square items-center justify-center rounded-xl border border-border bg-surface"
                >
                  <span className="text-label uppercase text-muted">{label}</span>
                </div>
              )
            )}
          </div>
        </Reveal>

        {/* CONTACT */}
        <Reveal as="section" id="contact" className="mb-8">
          <SectionLabel>Contact</SectionLabel>
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-8">
            <p className="max-w-xl text-muted">
              Have a sequence that needs to move? Let&apos;s talk about your next
              motion project.
            </p>
            <a
              href="mailto:eokorie1911@gmail.com"
              className="rounded-full border border-accent bg-accent px-6 py-2 text-label uppercase text-accent-ink transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Start a Project
            </a>
            {/* Where the video content lives */}
            <div className="mt-2 flex items-center gap-4 border-t border-border pt-6">
              <span className="text-xs uppercase tracking-widest text-muted">
                Watch
              </span>
              <SocialLinks items={["tiktok", "youtube", "instagram"]} />
            </div>
          </div>
        </Reveal>
      </main>

        <PersonaFooter persona="motion" />
      </div>
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
    <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
      {children}
    </div>
  );
}

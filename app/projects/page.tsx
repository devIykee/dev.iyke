import type { Metadata } from "next";
import Link from "next/link";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import Reveal from "@/app/components/Reveal";
import { DevProjectCard, EmptyRow } from "@/app/components/ContentCards";
import { getEngineeringProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Projects",
  description: "The full engineering portfolio.",
};

// Engineering only. Security research is a separate portfolio, reachable from
// the SecRes tag at /security-research.

export default async function AllProjectsPage() {
  const projects = await getEngineeringProjects();

  return (
    <div
      data-persona="developer"
      className="relative min-h-screen bg-base font-mono text-ink"
    >
      <PersonaChrome persona="developer" />

      <div className="page-enter overflow-x-hidden pb-28">
        <main
          id="projects"
          className="mx-auto max-w-bento px-4 pt-24 md:px-margin md:pt-28"
        >
          <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to home
            </Link>
            <h1 className="m-0 text-h2 uppercase tracking-widest text-ink">
              <span className="mr-2 text-accent">//</span> All Projects
            </h1>
            <p className="m-0 text-sm text-muted">
              {projects.length} engineering project
              {projects.length === 1 ? "" : "s"} · security research lives at{" "}
              <Link
                href="/security-research"
                className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                /security-research
              </Link>
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 40}>
                  <DevProjectCard p={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyRow label="No projects yet." />
          )}
        </main>

        <PersonaFooter persona="developer" />
      </div>
    </div>
  );
}

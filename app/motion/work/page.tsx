import type { Metadata } from "next";
import Link from "next/link";
import PersonaChrome from "@/app/components/PersonaChrome";
import PersonaFooter from "@/app/components/PersonaFooter";
import { MotionCaseStudyCard } from "@/app/components/ContentCards";
import { getMotionProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Motion Work",
  description: "Every reel and case study in one place.",
};

export default async function AllMotionWorkPage() {
  const projects = await getMotionProjects();

  return (
    <div
      data-persona="motion"
      className="relative min-h-screen bg-base font-sans text-ink"
    >
      <PersonaChrome persona="motion" />

      <div className="page-enter overflow-x-hidden pb-28">
        <main
          id="case-studies"
          className="mx-auto max-w-bento px-4 pt-24 md:px-margin md:pt-28"
        >
          <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6">
            <Link
              href="/motion"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to Motion
            </Link>
            <h1 className="m-0 text-h2 font-black text-ink">All Work</h1>
            <p className="m-0 text-sm text-muted">
              {projects.length} video{projects.length === 1 ? "" : "s"}
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <MotionCaseStudyCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
              No work published yet.
            </div>
          )}
        </main>

        <PersonaFooter persona="motion" />
      </div>
    </div>
  );
}

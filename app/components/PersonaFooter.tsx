import type { Persona } from "@/lib/types";
import SocialLinks from "./SocialLinks";

export default function PersonaFooter({ persona: _persona }: { persona: Persona }) {
  return (
    <footer className="mt-12 w-full border-t border-border bg-base px-6 py-10 md:px-margin">
      <div className="mx-auto flex max-w-bento flex-col items-center gap-6">
        {/* All social icons, icon-only, persona-accent on hover */}
        <SocialLinks className="justify-center" />
        <p className="m-0 text-center text-[10px] uppercase tracking-widest text-muted">
          2026 © All Rights Reserved — Developed with ❤️ by Iyke
        </p>
      </div>
    </footer>
  );
}

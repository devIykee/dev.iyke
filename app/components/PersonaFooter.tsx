import type { Persona } from "@/lib/types";

export default function PersonaFooter({ persona: _persona }: { persona: Persona }) {
  return (
    <footer className="mt-12 w-full border-t border-border bg-base px-margin py-8 text-center text-muted">
      <p className="font-chrome text-[10px] uppercase tracking-widest">
        2026 © All Rights Reserved — Developed by Iyke
      </p>
    </footer>
  );
}

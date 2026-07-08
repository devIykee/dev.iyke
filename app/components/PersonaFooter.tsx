import type { Persona } from "@/lib/types";

const FOOTER_THEMES: Record<Persona, string> = {
  developer: "bg-dev-bg border-grid-border text-outline",
  motion: "bg-motion-bg border-motion-border text-motion-muted",
  writer: "bg-writer-bg border-writer-rule text-writer-muted",
};

export default function PersonaFooter({ persona }: { persona: Persona }) {
  return (
    <footer
      className={`mt-12 w-full border-t px-margin py-8 text-center ${FOOTER_THEMES[persona]}`}
    >
      <p className="font-label text-[10px] uppercase tracking-widest">
        2026 © All Rights Reserved — Developed by Iyke
      </p>
    </footer>
  );
}

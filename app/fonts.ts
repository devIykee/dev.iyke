import localFont from "next/font/local";

/**
 * ONE font family for the entire site — every persona, all shared chrome, and
 * the admin panel. Persona identity comes from color/background/grid tokens,
 * not typography.
 *
 * Active: Acorn (Displaay Type Foundry), supplied in public/fonts/acorn/.
 * Weights used: Regular 400, Medium 500, SemiBold 600, Bold 700 only.
 * Thin / ExtraLight / Light are intentionally excluded (too delicate here).
 *
 * To swap the family later, point `appFont` at a different localFont() block
 * exposing the same `--font-app` variable — nothing else in the codebase changes.
 */

const acorn = localFont({
  variable: "--font-app",
  display: "swap",
  src: [
    { path: "../public/fonts/acorn/Acorn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/acorn/Acorn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/acorn/Acorn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/acorn/Acorn-Bold.woff2", weight: "700", style: "normal" },
  ],
});

// Kept available as a free stand-in (Fontshare) if Acorn ever needs swapping out.
// const switzer = localFont({
//   variable: "--font-app",
//   display: "swap",
//   src: [
//     { path: "../public/fonts/switzer/Switzer-400.woff2", weight: "400", style: "normal" },
//     { path: "../public/fonts/switzer/Switzer-500.woff2", weight: "500", style: "normal" },
//     { path: "../public/fonts/switzer/Switzer-600.woff2", weight: "600", style: "normal" },
//     { path: "../public/fonts/switzer/Switzer-700.woff2", weight: "700", style: "normal" },
//   ],
// });

// The single active app font.
export const appFont = acorn;

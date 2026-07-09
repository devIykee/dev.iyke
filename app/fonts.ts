import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

// One font per persona, per DESIGN.md's typographic voices (content areas only).
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

// General Sans — the single consistent font for ALL shared chrome (nav, buttons,
// the constant H1) and the entire /admin panel, across every persona. Self-hosted
// via next/font/local so there's no slow CDN round-trip.
export const generalSans = localFont({
  variable: "--font-general-sans",
  display: "swap",
  src: [
    { path: "./fonts/general-sans/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/general-sans/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/general-sans/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/general-sans/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
});

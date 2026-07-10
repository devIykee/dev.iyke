import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { appFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-iyke.vercel.app"
  ),
  title: {
    default: "Iyke:  Developer · Motion · Writer",
    template: "%s · Iyke",
  },
  description:
    "The multi-disciplinary portfolio of Iyke: Software engineering, motion design, and writing.",
  applicationName: "Iyke.dev",
  authors: [{ name: "Iyke" }],
  keywords: [
    "Iyke",
    "deviykee",
    "portfolio",
    "motion design",
    "software engineer",
    "writer",
    "Rust",
    "Solana",
    "Next.js",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Iyke.dev",
    title: "Iyke:  Developer · Motion · Writer",
    description:
      "The multi-disciplinary portfolio of Iyke: Software engineering, motion design, and writing..",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Iyke:  Developer · Motion · Writer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iyke:  Developer · Motion · Writer",
    description:
      "The multi-disciplinary portfolio of Iyke: Software engineering, motion design, and writing..",
    images: ["/og-image.png"],
  },
};

// Runs before first paint to set the persisted (or system) theme, preventing a
// flash of the wrong mode. Kept tiny and dependency-free.
const noFlashTheme = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={appFont.variable}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

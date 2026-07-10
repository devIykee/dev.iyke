import type { MetadataRoute } from "next";
import { getWriterPosts } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-iyke.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/motion`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/writer`, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Include each published blog post.
  try {
    const posts = await getWriterPosts();
    for (const p of posts) {
      routes.push({
        url: `${SITE}/writer/${p.slug}`,
        lastModified: p.date,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  } catch {
    // If the DB is unreachable at build, ship the static routes only.
  }

  return routes;
}

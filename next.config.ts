import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // The SecRes tag has a bespoke portfolio page rather than the generic tag
  // showcase. Redirecting at the router gives a real 307 before any rendering
  // happens; doing it inside the page yields a 200 + meta-refresh instead.
  async redirects() {
    return [
      {
        source: "/tags/security-research",
        destination: "/security-research",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

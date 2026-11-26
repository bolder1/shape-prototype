import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Skill Passports live at /@handle. "@" folders are parallel routes in the App Router, so the pages sit under /u.
  async rewrites() {
    return [
      { source: "/@:handle", destination: "/u/:handle" },
      { source: "/@:handle/print", destination: "/u/:handle/print" },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

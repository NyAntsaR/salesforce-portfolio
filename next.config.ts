import type { NextConfig } from "next";

// GitHub Pages serves a project repository from /<repo-name>, so the base path
// comes from the deploy workflow. Leave it empty for local development and for
// a <username>.github.io repository.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Emit /projects/x/index.html so GitHub Pages serves /projects/x/ without rewrites.
  trailingSlash: true,
  images: {
    // The default image loader needs a server; a static export serves files as-is.
    unoptimized: true,
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

import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  // GitHub Pages serves from /caos-portfolio/
  basePath: isStaticExport ? "/caos-portfolio" : "",
  images: isStaticExport
    ? {
        unoptimized: true,
      }
    : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

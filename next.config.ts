import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La exportación estática permite publicar el mismo código en GitHub Pages.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
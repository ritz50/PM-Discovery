import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Trace files inside app/ only (content-data), not the whole repo (inbox, .git, etc.)
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    'http://sharpsighted.local:3001',
    'http://ros.sharpsighted.local:3001',
    'http://localhost:3001',
  ],
};

export default nextConfig;

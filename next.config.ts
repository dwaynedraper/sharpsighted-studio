import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    'sharpsighted.local:3001',
    'ros.sharpsighted.local:3001',
    'localhost:3001',
  ],
};

export default nextConfig;

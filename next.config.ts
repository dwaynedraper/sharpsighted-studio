import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    'localhost',
    'sharpsighted.local',
    '*.sharpsighted.local',
  ],
};

export default nextConfig;

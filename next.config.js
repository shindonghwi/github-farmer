/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Tone.js ESM 지원
  transpilePackages: ["tone"],
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ATTENTION : masquer les erreurs TypeScript en production n'est pas recommandé !
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

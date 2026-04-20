/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,   // ← Ceci désactive le linting pendant le build
  },
  typescript: {
    ignoreBuildErrors: true,    // ← Et ça ignore les erreurs TypeScript si besoin
  },
};

export default nextConfig;

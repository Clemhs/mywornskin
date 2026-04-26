/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,   // ← Désactivé pour éviter l'infinite loading
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

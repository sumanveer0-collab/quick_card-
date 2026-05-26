/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Unblocks builds while legacy editor/fabric types are migrated
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
}
module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ NO TARGET HERE. Vercel handles this automatically now.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

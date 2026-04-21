/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed the 'target' line entirely to escape Legacy Mode
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

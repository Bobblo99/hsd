/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // compiler: {
  //   removeConsole: {
  //     exclude: ["error", "warn"],
  //   },
  // },
};

module.exports = nextConfig;

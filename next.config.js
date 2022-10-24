/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.flamingo.apelabs.net",
      },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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

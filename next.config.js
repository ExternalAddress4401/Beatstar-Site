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
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://info.cern.ch",
      },
    ];
  },
};

module.exports = nextConfig;

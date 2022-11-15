/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["page.tsx", "api.ts"],
  experimental: {
    newNextLinkBehavior: true,
  },
};

module.exports = nextConfig;

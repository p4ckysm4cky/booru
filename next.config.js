/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  pageExtensions: ["page.tsx", "api.ts"],
  experimental: {
    newNextLinkBehavior: true,
  },
};

// Run: ANALYZE=true next build
// Open in browser: ./.next/analyze/client.html
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

module.exports = withBundleAnalyzer(nextConfig);

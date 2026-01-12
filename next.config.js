/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force dynamic rendering, no static optimization
  output: 'standalone',
}

module.exports = nextConfig

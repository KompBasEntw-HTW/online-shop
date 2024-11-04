import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'images.unsplash.com',
      'tailwindui.com',
      'res.cloudinary.com',
      'exe.dlugoschvincent.de'
    ]
  },
  output: 'standalone'
}

export default nextConfig

import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com'
			},
			{
				protocol: 'https',
				hostname: 'tailwindui.com'
			},

			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			},

			{
				protocol: 'https',
				hostname: 'exe.dlugoschvincent.de'
			}
		]
	},
	output: 'standalone'
}

export default nextConfig

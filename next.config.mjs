/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'grid0.vtexassets.com',
        port: '',
        pathname: '/arquivos/ids/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.adidas.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
require('dotenv').config();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not set in the environment!');
}

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`, // Proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
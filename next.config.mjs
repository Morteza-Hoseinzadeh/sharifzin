/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: http://localhost:3000;
  font-src 'self' data:;
  connect-src 'self' http://localhost:3000 https:;
  frame-ancestors 'none';
`;

const nextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/assets/products/:path*',
        destination: 'http://localhost:3000/assets/products/:path*',
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/assets/products/**',
      },
    ],
  },
};

export default nextConfig;

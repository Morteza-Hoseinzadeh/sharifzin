/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://sharifzin.ir;
  font-src 'self' data:;
  connect-src 'self' https://sharifzin.ir;
  frame-src 'self' https://www.instagram.com;
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
        destination: 'https://sharifzin.ir/assets/products/:path*',
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sharifzin',
        pathname: '/assets/products/**',
      },
    ],
  },
};

export default nextConfig;

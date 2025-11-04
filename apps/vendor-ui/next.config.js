/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ new format
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
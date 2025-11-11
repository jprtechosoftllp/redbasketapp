const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  // ...other config
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            // SVGR options here
          },
        },
      ],
    });
    return config;
  },
};
module.exports = nextConfig;
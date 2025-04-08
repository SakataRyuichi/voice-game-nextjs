/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Chrome DevTools向け最適化
      config.devtool = 'eval-source-map';
      
      // Hot Module Replacement最適化
      config.optimization = {
        ...config.optimization,
        runtimeChunk: true,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // SWC minifyを有効化
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 開発モードでの設定
      config.devtool = 'eval-source-map';
      
      // モジュール解決の設定追加
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        },
      };
      
      // SWCヘルパーの互換性問題対策
      config.module = {
        ...config.module,
        exprContextCritical: false, // SWCヘルパー関連の警告を抑制
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // CORS 및 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // React 19 호환성 및 청크 로딩 개선
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // 큰 청크 분할하여 로딩 안정성 향상
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          reown: {
            name: 'reown',
            test: /[\\/]node_modules[\\/]@reown[\\/]/,
            priority: 30,
            chunks: 'all',
          },
          walletconnect: {
            name: 'walletconnect',
            test: /[\\/]node_modules[\\/]@walletconnect[\\/]/,
            priority: 25,
            chunks: 'all',
          },
          appkit: {
            name: 'appkit',
            test: /[\\/]node_modules[\\/].*appkit.*[\\/]/,
            priority: 25,
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
  
  // 서버 외부 패키지 설정
  serverExternalPackages: ['@reown/appkit'],
}

export default nextConfig
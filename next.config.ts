import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정 - Vercel 배포용
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Vercel 배포 최적화
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  // 정적 자산 처리
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // 빌드 최적화
  compress: true,
  // 개발 모드 설정
  reactStrictMode: true,
  // 정적 내보내기 설정 (필요시 주석 해제)
  // output: 'export',
  // trailingSlash: true,
  // basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
};

export default nextConfig;

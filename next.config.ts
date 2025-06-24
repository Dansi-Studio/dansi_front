import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 일반 img 태그 사용으로 이미지 최적화 완전 비활성화
  images: {
    unoptimized: true,
  },
  // 개발 모드 설정
  reactStrictMode: true,
  // 정적 자산 최적화
  compress: true,
};

export default nextConfig;

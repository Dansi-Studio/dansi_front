import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 비활성화 - 배포 시 이미지 문제 해결
  images: {
    unoptimized: true,
  },
  // 정적 내보내기 설정 (필요시 주석 해제)
  // output: 'export',
  // trailingSlash: true,
  // basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
};

export default nextConfig;

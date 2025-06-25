'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../components/BottomNavigation'
import './main.css'

// 예시 키워드들
const keywords = [
  '노을', '바람', '향기', '기억', '고요', '여운', '빛', '소리', '그리움', '설렘', '여행', '자유', '희망', '온기', '순간', '파도', '별빛', '안개', '무지개', '하늘', '추억', '바다', '꿈', '사랑', '봄날', '겨울밤', '여름', '가을', '아침', '저녁', '낮', '밤하늘', '별', '달빛', '햇살', '비', '눈', '꽃잎', '숲', '강물', '산', '들판', '바위', '모래', '구름', '비행', '산책', '노래', '시', '이야기'
]

export default function MainPage() {
  const [currentKeyword, setCurrentKeyword] = useState('별')

  // 키워드 동적 변경 (예시)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
      setCurrentKeyword(randomKeyword)
    }, 3000) // 5초마다 변경

    return () => clearInterval(interval)
  }, [])

  // 한글자면 좌우에 공백 추가
  const formatKeyword = (keyword: string) => {
    console.log('Original keyword:', keyword, 'Length:', keyword.length)
    if (keyword.length === 1) {
      const formatted = ` ${keyword} `
      console.log('Formatted keyword:', formatted)
      return formatted
    }
    return keyword
  }

  const handleWriteClick = () => {
    // 작성하기 페이지로 이동 (나중에 구현)
    console.log('작성하기 클릭:', currentKeyword)
  }

  return (
    <div className="main-container">
      {/* 헤더 - 로고 */}
      <div className="main-header">
        <div className="logo-section">
          <Image
            src="/logo.png"
            alt="단시 공방 로고"
            width={120}
            height={84}
            className="main-logo"
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <div className="keyword-section">
          <div className="today-line">
            <span className="today-text">오늘의</span>
          </div>
          <div className="keyword-line">
            <span className="keyword-text">{formatKeyword(currentKeyword)}</span>
          </div>
          <div className="write-line">
            <span className="write-text" onClick={handleWriteClick}>작성하기</span>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
} 
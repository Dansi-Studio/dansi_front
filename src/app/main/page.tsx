'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../components/BottomNavigation'
import './main.css'
import { useRouter } from 'next/navigation'

// 예시 키워드들
const keywords = [
  '노을', '바람', '향기', '기억', '고요', '여운', '빛', '소리', '그리움', '설렘', '여행', '자유', '희망', '온기', '순간', '파도', '별빛', '안개', '무지개', '하늘', '추억', '바다', '꿈', '사랑', '봄날', '겨울밤', '여름', '가을', '아침', '저녁', '낮', '밤하늘', '별', '달빛', '햇살', '비', '눈', '꽃잎', '숲', '강물', '산', '들판', '바위', '모래', '구름', '비행', '산책', '노래', '시', '이야기'
]

// 건네는 글감용 키워드들 (더 많은 키워드)
const inspirationKeywords = [
  '노을', '바람', '향기', '기억', '고요', '여운', '빛', '소리', '그리움', '설렘', 
  '여행', '자유', '희망', '온기', '순간', '파도', '별빛', '안개', '무지개', '하늘', 
  '추억', '바다', '꿈', '사랑', '봄날', '겨울밤', '여름', '가을', '아침', '저녁', 
  '낮', '밤하늘', '별', '달빛', '햇살', '비', '눈', '꽃잎', '숲', '강물', 
  '산', '들판', '바위', '모래', '구름', '비행', '산책', '노래', '시', '이야기',
  '미소', '웃음', '눈물', '행복', '슬픔', '기쁨', '평화', '고독', '친구', '가족',
  '집', '길', '다리', '문', '창문', '책', '편지', '음악', '그림', '사진',
  '커피', '차', '빵', '꽃', '나무', '잎', '뿌리', '씨앗', '열매', '향수',
  '시간', '공간', '거리', '골목', '공원', '학교', '도서관', '카페', '바다', '호수',
  '강', '계곡', '폭포', '섬', '언덕', '평원', '사막', '정원', '마당', '옥상'
]

export default function MainPage() {
  const [currentKeyword, setCurrentKeyword] = useState('영감') // 고정된 초기값
  const [isLoaded, setIsLoaded] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [showInspiration, setShowInspiration] = useState(false) // 제목과 설명 부분
  const [showKeywordGrid, setShowKeywordGrid] = useState(false) // 키워드 그리드 부분
  const [keywordSizes, setKeywordSizes] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const router = useRouter()

  // 초기 애니메이션 시작 및 랜덤 키워드 설정
  useEffect(() => {
    setIsClient(true)
    
    // 클라이언트에서만 랜덤 키워드 설정
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    setCurrentKeyword(randomKeyword);
    
    // 키워드 카드 크기들을 클라이언트에서만 생성 - 핀터레스트 스타일
    const sizes = inspirationKeywords.map(() => {
      const sizeOptions = ['small', 'small', 'medium', 'large', 'large'] // large를 더 많이 추가하여 공간 채우기
      return sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
    })
    setKeywordSizes(sizes)
    
    // 컴포넌트 마운트 시 애니메이션 시작
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    // 스크롤 안내 요소 초기 표시 (약간 지연)
    const scrollIndicatorTimer = setTimeout(() => {
      if (window.scrollY <= 30) {
        setShowScrollIndicator(true)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      clearTimeout(scrollIndicatorTimer)
    }
  }, [])

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      
      console.log('현재 스크롤 위치:', scrollPosition) // 디버깅용
      
      // 스크롤이 50px 이상 내려왔을 때 건네는 글감 제목 섹션 표시 (더 빠르게)
      if (scrollPosition > 50) {
        console.log('건네는 글감 표시 - 스크롤:', scrollPosition)
        setShowInspiration(true)
      }
      
      // 스크롤이 100px 이상 내려왔을 때 키워드 그리드 표시
      if (scrollPosition > 100) {
        console.log('키워드 그리드 표시 - 스크롤:', scrollPosition)
        setShowKeywordGrid(true)
      }
      
      // 스크롤이 조금이라도 내려왔으면 스크롤 안내 숨기기
      if (scrollPosition > 30) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    // 컴포넌트 마운트 직후 초기 상태 설정
    const initializeScrollState = () => {
      const scrollPosition = window.scrollY
      
      console.log('초기 스크롤 위치:', scrollPosition) // 디버깅용
      
      // 초기 스크롤 위치가 30px 이하면 스크롤 안내 표시
      if (scrollPosition <= 30) {
        setShowScrollIndicator(true)
      } else {
        setShowScrollIndicator(false)
      }
      
      // 초기 스크롤 위치에 따라 건네는 글감 섹션 표시 여부 결정
      if (scrollPosition > 50) {
        console.log('초기 건네는 글감 표시')
        setShowInspiration(true)
      }
      
      if (scrollPosition > 100) {
        console.log('초기 키워드 그리드 표시')
        setShowKeywordGrid(true)
      }
    }

    // 초기 상태 설정을 약간 지연시켜 렌더링 완료 후 실행
    const initTimer = setTimeout(() => {
      initializeScrollState()
    }, 100)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(initTimer)
    }
  }, [])

  // 키워드 동적 변경 (예시)
  useEffect(() => {
    const interval = setInterval(() => {
      // 키워드 변경 애니메이션 시작
      setIsChanging(true)
      
      setTimeout(() => {
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
        setCurrentKeyword(randomKeyword)
        
        // 새 키워드 설정 후 애니메이션 완료
        setTimeout(() => {
          setIsChanging(false)
        }, 50)
      }, 300) // 기존 키워드가 사라지는 시간
      
    }, 3000) // 3초마다 변경

    return () => clearInterval(interval)
  }, [])

  // 한글자면 좌우에 공백 추가
  const formatKeyword = (keyword: string) => {
    if (keyword.length === 1) {
      const formatted = ` ${keyword} `
      return formatted
    }
    return keyword
  }

  const handleWriteClick = () => {
    // 키워드와 함께 작성하기 페이지로 이동
    router.push(`/write?keyword=${encodeURIComponent(currentKeyword)}`)
  }

  const handleKeywordClick = (keyword: string) => {
    // 해당 키워드로 둘러보기 페이지로 이동
    router.push(`/explore?keyword=${encodeURIComponent(keyword)}`)
  }

  const handleScrollIndicatorClick = () => {
    // 부드럽게 건네는 글감 섹션으로 스크롤
    const inspirationSection = document.querySelector('.inspiration-section')
    if (inspirationSection) {
      inspirationSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // 클라이언트에서만 렌더링하도록 보장
  if (!isClient) {
    return null
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
        <div className={`keyword-section ${isLoaded ? 'loaded' : ''}`}>
          <div className="today-line">
            <span className="today-text">오늘의</span>
          </div>
          <div className={`keyword-line ${isChanging ? 'changing' : ''}`}>
            <span className="keyword-text">{formatKeyword(currentKeyword)}</span>
          </div>
          <div className="write-line">
            <span className="write-text" onClick={handleWriteClick}>작성하기</span>
          </div>
        </div>
        
        {/* 스크롤 안내 요소 */}
        <div 
          className={`scroll-indicator ${showScrollIndicator ? 'visible' : ''}`}
          onClick={handleScrollIndicatorClick}
        >
          <div className="scroll-text">스크롤 아래로 내려보세요</div>
          <div className="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 건네는 글감 섹션 */}
      <div className={`inspiration-section ${showInspiration ? 'visible' : ''}`}>
        <div className={`inspiration-header ${showInspiration ? 'visible' : ''}`}>
          <h2 className="inspiration-title">건네는 글감</h2>
          <p className="inspiration-subtitle">당신의 마음에 닿을 단어를 찾아보세요</p>
        </div>
        
        <div className={`keywords-grid ${showKeywordGrid ? 'visible' : ''}`}>
          {inspirationKeywords.map((keyword, index) => (
            <div
              key={`${keyword}-${index}`}
              className={`keyword-card ${keywordSizes[index] || 'medium'}`}
              onClick={() => handleKeywordClick(keyword)}
              style={{
                animationDelay: `${(index % 20) * 0.1}s`
              }}
            >
              <span className="keyword-card-text">{keyword}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
} 
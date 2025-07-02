'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../components/BottomNavigation'
import './main.css'
import { useRouter } from 'next/navigation'
import { getRandomKeywords } from '../../utils/api'

export default function MainPage() {
  const [currentKeyword, setCurrentKeyword] = useState('영감') // 기본값
  const [keywords, setKeywords] = useState<string[]>([]) // 랜덤 키워드 변경용
  const [inspirationKeywords, setInspirationKeywords] = useState<string[]>([]) // 그리드 표시용
  const [isLoaded, setIsLoaded] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [showInspiration, setShowInspiration] = useState(false) // 제목과 설명 부분
  const [showKeywordGrid, setShowKeywordGrid] = useState(false) // 키워드 그리드 부분
  const [keywordSizes, setKeywordSizes] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const router = useRouter()

  // 백엔드에서 키워드 받아오기
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        // 병렬로 키워드 요청
        const [randomKeywordsResponse, inspirationKeywordsResponse] = await Promise.all([
          getRandomKeywords(20), // 랜덤 키워드 변경용으로 20개
          getRandomKeywords(80)  // 그리드 표시용으로 80개
        ])
        
        if (randomKeywordsResponse.success && randomKeywordsResponse.data) {
          const keywordStrings = randomKeywordsResponse.data.map(k => k.keyword)
          setKeywords(keywordStrings)
          
          // 첫 번째 키워드를 현재 키워드로 설정
          if (keywordStrings.length > 0) {
            setCurrentKeyword(keywordStrings[0])
          }
        }
        
        if (inspirationKeywordsResponse.success && inspirationKeywordsResponse.data) {
          const inspirationKeywordStrings = inspirationKeywordsResponse.data.map(k => k.keyword)
          setInspirationKeywords(inspirationKeywordStrings)
          
          // 키워드 카드 크기들을 클라이언트에서만 생성 - 핀터레스트 스타일
          const sizes = inspirationKeywordStrings.map(() => {
            const sizeOptions = ['small', 'small', 'medium', 'large', 'large'] // large를 더 많이 추가하여 공간 채우기
            return sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
          })
          setKeywordSizes(sizes)
        }
        
      } catch (error) {
        console.error('키워드 로딩 오류:', error)
        // 에러 시 기본 키워드들 사용
        const defaultKeywords = ['영감', '바람', '노을', '향기', '기억', '고요', '여운', '빛']
        setKeywords(defaultKeywords)
        setInspirationKeywords(defaultKeywords)
        setCurrentKeyword(defaultKeywords[0])
      }
    }

    fetchKeywords()
  }, [])

  // 초기 애니메이션 시작
  useEffect(() => {
    setIsClient(true)
    
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
    let throttleTimer: NodeJS.Timeout | null = null
    
    const handleScroll = () => {
      if (throttleTimer) return
      
      throttleTimer = setTimeout(() => {
        const scrollPosition = window.scrollY
        const viewportHeight = window.innerHeight
        
        // 뷰포트 높이를 기준으로 한 비율 계산 (더 일관된 동작)
        const scrollRatio = scrollPosition / viewportHeight
        
        console.log('현재 스크롤 위치:', scrollPosition, '뷰포트 높이:', viewportHeight, '비율:', scrollRatio) // 디버깅용
        
        // 뷰포트 높이의 5% 이상 스크롤 시 건네는 글감 제목 섹션 표시
        if (scrollRatio > 0.05) {
          console.log('건네는 글감 표시 - 스크롤 비율:', scrollRatio)
          setShowInspiration(true)
        }
        
        // 뷰포트 높이의 10% 이상 스크롤 시 키워드 그리드 표시  
        if (scrollRatio > 0.1) {
          console.log('키워드 그리드 표시 - 스크롤 비율:', scrollRatio)
          setShowKeywordGrid(true)
        }
        
        // 뷰포트 높이의 3% 이상 스크롤 시 스크롤 안내 숨기기
        if (scrollRatio > 0.03) {
          setShowScrollIndicator(false)
        } else {
          setShowScrollIndicator(true)
        }
        
        throttleTimer = null
      }, 16) // 약 60fps로 제한
    }

    // 컴포넌트 마운트 직후 초기 상태 설정
    const initializeScrollState = () => {
      const scrollPosition = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollRatio = scrollPosition / viewportHeight
      
      console.log('초기 스크롤 위치:', scrollPosition, '뷰포트 높이:', viewportHeight, '비율:', scrollRatio) // 디버깅용
      
      // 초기 스크롤 비율이 3% 이하면 스크롤 안내 표시
      if (scrollRatio <= 0.03) {
        setShowScrollIndicator(true)
      } else {
        setShowScrollIndicator(false)
      }
      
      // 초기 스크롤 위치에 따라 건네는 글감 섹션 표시 여부 결정
      if (scrollRatio > 0.05) {
        console.log('초기 건네는 글감 표시')
        setShowInspiration(true)
      }
      
      if (scrollRatio > 0.1) {
        console.log('초기 키워드 그리드 표시')
        setShowKeywordGrid(true)
      }
    }

    // 초기 상태 설정을 약간 지연시켜 렌더링 완료 후 실행
    const initTimer = setTimeout(() => {
      initializeScrollState()
    }, 100)

    // 리사이즈 이벤트도 처리하여 화면 회전 등에 대응
    const handleResize = () => {
      initializeScrollState()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(initTimer)
    }
  }, [])

  // 키워드 동적 변경 (백엔드에서 받은 키워드 사용)
  useEffect(() => {
    if (keywords.length === 0) return // 키워드가 없으면 실행하지 않음
    
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
  }, [keywords])

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
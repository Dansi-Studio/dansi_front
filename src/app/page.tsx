'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const kakaoRef = useRef<HTMLDivElement>(null)
  const googleRef = useRef<HTMLButtonElement>(null)
  const togetherRef = useRef<HTMLButtonElement>(null)
  
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직
    console.log('카카오 로그인')
  }

  const handleGoogleLogin = () => {
    // 구글 로그인 로직
    console.log('구글 로그인')
  }

  const handleJoinTogether = () => {
    // 함께하기 로직
    console.log('함께하기')
  }

  useEffect(() => {
    const updateButtonHeights = () => {
      if (kakaoRef.current && googleRef.current && togetherRef.current) {
        const kakaoHeight = kakaoRef.current.offsetHeight
        googleRef.current.style.height = `${kakaoHeight}px`
        togetherRef.current.style.height = `${kakaoHeight}px`
      }
    }

    // 초기 설정
    updateButtonHeights()

    // 윈도우 리사이즈 시 업데이트
    window.addEventListener('resize', updateButtonHeights)
    
    // 이미지 로드 완료 후 업데이트
    const timer = setTimeout(updateButtonHeights, 100)

    return () => {
      window.removeEventListener('resize', updateButtonHeights)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // 컴포넌트 마운트 후 로고 애니메이션 시작
    const logoTimer = setTimeout(() => {
      setLogoLoaded(true)
    }, 100)

    // 로고 애니메이션 완료 후 버튼들 등장 (더 빠르게)
    const buttonTimer = setTimeout(() => {
      setShowButtons(true)
    }, 1500)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden" style={{ backgroundColor: '#F3EFEC' }}>
      {/* 로고 영역 */}
      <div 
        className={`flex justify-center items-center transition-all duration-1000 ease-out ${
          logoLoaded ? 'transform scale-100' : 'transform scale-150'
        }`}
        style={{ 
          marginTop: '8vh', 
          marginBottom: '24vh',
          opacity: logoLoaded ? 1 : 0.8
        }}
      >
        <Image
          src="/logo.png"
          alt="단시 공방 로고"
          width={250}
          height={175}
          className="object-contain"
          priority
        />
      </div>

      {/* 버튼 영역 */}
      <div className="w-full flex flex-col items-center px-6" style={{ gap: '1vh' }}>
        {/* 카카오 로그인 이미지 */}
        <div 
          ref={kakaoRef}
          onClick={handleKakaoLogin}
          className={`cursor-pointer hover:-translate-y-1 hover:shadow-lg overflow-hidden rounded-xl ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            width: '80%',
            maxWidth: '450px',
            minWidth: '280px',
            filter: 'drop-shadow(0 0 0 transparent)',
            transitionProperty: showButtons ? 'opacity, transform, filter' : 'filter',
            transitionDuration: showButtons ? '0.6s, 0.6s, 0.2s' : '0.2s',
            transitionTimingFunction: showButtons ? 'ease-out, ease-out, ease' : 'ease',
            transitionDelay: showButtons ? '0.2s, 0.2s, 0s' : '0s'
          }}
          onMouseEnter={(e) => {
            if (showButtons) {
              e.currentTarget.style.filter = 'drop-shadow(0 4px 12px rgba(254, 229, 0, 0.3))';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'drop-shadow(0 0 0 transparent)';
          }}
        >
          <Image
            src="/login/kakao.png"
            alt="카카오 로그인"
            width={450}
            height={60}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          ref={googleRef}
          onClick={handleGoogleLogin}
          className={`hover:-translate-y-1 hover:shadow-lg ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            width: '80%',
            maxWidth: '450px',
            minWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            backgroundColor: 'white',
            color: '#666666',
            border: '1px solid #DADCE0',
            fontWeight: '500',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            gap: 'clamp(8px, 1.5vw, 12px)',
            padding: '0 clamp(20px, 4vw, 32px)',
            boxSizing: 'border-box',
            transitionProperty: showButtons ? 'opacity, transform, background-color, box-shadow' : 'background-color, box-shadow',
            transitionDuration: showButtons ? '0.6s, 0.6s, 0.2s, 0.2s' : '0.2s, 0.2s',
            transitionTimingFunction: showButtons ? 'ease-out, ease-out, ease, ease' : 'ease, ease',
            transitionDelay: showButtons ? '0.4s, 0.4s, 0s, 0s' : '0s, 0s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* 함께하기 버튼 */}
        <button
          ref={togetherRef}
          onClick={handleJoinTogether}
          className={`hover:-translate-y-1 hover:shadow-lg ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            width: '80%',
            maxWidth: '450px',
            minWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            backgroundColor: '#8B6F47',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            padding: '0 clamp(20px, 4vw, 32px)',
            boxSizing: 'border-box',
            transitionProperty: showButtons ? 'opacity, transform, background-color, box-shadow' : 'background-color, box-shadow',
            transitionDuration: showButtons ? '0.6s, 0.6s, 0.2s, 0.2s' : '0.2s, 0.2s',
            transitionTimingFunction: showButtons ? 'ease-out, ease-out, ease, ease' : 'ease, ease',
            transitionDelay: showButtons ? '0.6s, 0.6s, 0s, 0s' : '0s, 0s'
          }}
        >
          함께하기
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import './home.css'

export default function Home() {
  const router = useRouter()
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
    // 로그인 페이지로 이동
    router.push('/login')
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
    <div className="home-container">
      {/* 로고 영역 */}
      <div className={`logo-container ${logoLoaded ? 'loaded' : 'loading'}`}>
        <Image
          src="/logo.png"
          alt="단시 공방 로고"
          width={250}
          height={175}
          className="logo-image"
        />
      </div>

      {/* 버튼 영역 */}
      <div className="buttons-container">
        {/* 카카오 로그인 이미지 */}
        <div 
          ref={kakaoRef}
          onClick={handleKakaoLogin}
          className={`kakao-login ${showButtons ? 'show' : 'hide'}`}
        >
          <Image
            src="/login/kakao.png"
            alt="카카오 로그인"
            width={450}
            height={60}
            className="kakao-image"
          />
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          ref={googleRef}
          onClick={handleGoogleLogin}
          className={`google-login ${showButtons ? 'show' : 'hide'}`}
        >
          <Image
            src="/login/google.svg"
            alt="구글 로그인"
            width={450}
            height={60}
            className="google-image"
          />
        </button>

        {/* 함께하기 버튼 */}
        <button
          ref={togetherRef}
          onClick={handleJoinTogether}
          className={`together-button ${showButtons ? 'show' : 'hide'}`}
        >
          <Image
            src="/login/together.svg"
            alt="함께하기"
            width={450}
            height={60}
            className="together-image"
          />
        </button>
      </div>
    </div>
  )
}

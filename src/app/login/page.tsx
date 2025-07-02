'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginMember, tokenStorage, userStorage, checkAutoLogin } from '../../utils/api'
import './login.css'

// useSearchParams를 사용하는 컴포넌트를 분리
function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // redirect 파라미터 확인
  const redirectTo = searchParams.get('redirect')

  // 자동 로그인 체크
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userData = await checkAutoLogin()
        
        if (userData) {
          // 토큰이 유효하면 redirect 파라미터에 따라 이동
          if (redirectTo === 'profile') {
            router.push('/profile')
          } else {
            router.push('/main')
          }
          return
        }
      } catch (error) {
        console.error('인증 확인 오류:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthentication()
  }, [router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 백엔드 로그인 API 호출
      const response = await loginMember({
        email: formData.email,
        password: formData.password
      })

      if (response.success && response.data) {
        // 로그인 성공 - Access Token과 Refresh Token 저장
        tokenStorage.setAccessToken(response.data.accessToken)
        tokenStorage.setRefreshToken(response.data.refreshToken)
        userStorage.setUser(response.data.member)
        
        // redirect 파라미터에 따라 이동
        if (redirectTo === 'profile') {
          router.push('/profile')
        } else {
          router.push('/main')
        }
      } else {
        setError(response.message || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 입력 시 에러 메시지 초기화
    if (error) {
      setError('')
    }
  }

  const handleSignup = () => {
    // 회원가입 페이지로 이동
    router.push('/signup')
  }

  const handleForgotPassword = () => {
    // 비밀번호 찾기 페이지로 이동
    router.push('/forgot-password')
  }

  const handleBack = () => {
    router.back()
  }

  // 인증 확인 중일 때는 그냥 빈 화면 또는 기존 로딩을 유지
  if (isCheckingAuth) {
    return <div></div>
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <button onClick={handleBack} className="back-button">
          ← 뒤로 가기
        </button>
      </div>

      <div className="login-content">
        <h1 className="login-title">환영합니다!</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleInputChange}
              className="login-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              className="login-input"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-link"
            disabled={isLoading}
          >
            비밀번호 찾기
          </button>

          <div className="button-group">
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
            
            <button 
              type="button" 
              onClick={handleSignup}
              className="signup-button"
              disabled={isLoading}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Suspense로 감싼 메인 컴포넌트
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="login-container"><div>로딩 중...</div></div>}>
      <LoginPageContent />
    </Suspense>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkAutoLogin } from '../../utils/api'
import './forgot-password.css'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 자동 로그인 체크
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userData = await checkAutoLogin()
        
        if (userData) {
          // 토큰이 유효하면 메인 페이지로 이동
          router.push('/main')
          return
        }
      } catch (error) {
        console.error('인증 확인 오류:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthentication()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      alert('이메일을 입력해주세요.')
      return
    }

    setIsLoading(true)
    
    try {
      // 임시 비밀번호 전송 로직
      console.log('임시 비밀번호 전송:', email)
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('임시 비밀번호가 이메일로 전송되었습니다.')
      router.back()
    } catch {
      alert('전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleCancel = () => {
    router.back()
  }

  const handleBack = () => {
    router.back()
  }

  // 인증 확인 중일 때는 그냥 빈 화면을 보여줌
  if (isCheckingAuth) {
    return <div></div>
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-header">
        <button onClick={handleBack} className="back-button">
          ← 뒤로 가기
        </button>
      </div>

      <div className="forgot-password-content">
        <h1 className="forgot-password-title">비밀번호 찾기</h1>
        
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
              className="forgot-password-input"
              required
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading}
            >
              {isLoading ? '전송 중...' : '임시비밀번호 전송'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
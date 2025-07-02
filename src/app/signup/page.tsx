'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerMember, checkEmailExists, checkAutoLogin } from '../../utils/api'
import './signup.css'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const [emailChecked, setEmailChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailChecking, setIsEmailChecking] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
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
    setError('')
    
    // 유효성 검사
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (!emailChecked) {
      setError('이메일 중복 확인을 완료해주세요.')
      return
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setIsLoading(true)

    try {
      // 회원가입 API 호출
      const response = await registerMember({
        email: formData.email,
        name: formData.name,
        password: formData.password
      })

      if (response.success) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.')
        router.push('/login')
      } else {
        setError(response.message || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      setError('회원가입 중 오류가 발생했습니다.')
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

    // 이메일이 변경된 경우 중복 확인 상태 초기화
    if (name === 'email') {
      setEmailChecked(false)
      setEmailError('')
    }
    
    // 입력 시 에러 메시지 초기화
    if (error) {
      setError('')
    }
  }

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setEmailError('이메일을 입력해주세요.')
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.')
      return
    }

    setIsEmailChecking(true)
    setEmailError('')

    try {
      const response = await checkEmailExists(formData.email)
      
      if (response.success) {
        if (response.data === true) {
          setEmailError('이미 사용 중인 이메일입니다.')
          setEmailChecked(false)
        } else {
          setEmailError('')
          setEmailChecked(true)
          alert('사용 가능한 이메일입니다.')
        }
      } else {
        setEmailError(response.message || '이메일 확인 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error)
      setEmailError('이메일 확인 중 오류가 발생했습니다.')
    } finally {
      setIsEmailChecking(false)
    }
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
    <div className="signup-container">
      <div className="signup-header">
        <button onClick={handleBack} className="back-button">
          ← 뒤로 가기
        </button>
      </div>

      <div className="signup-content">
        <h1 className="signup-title">회원가입</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleInputChange}
              className="signup-input"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="input-group email-group">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleInputChange}
              className="signup-input email-input"
              required
              disabled={isLoading || isEmailChecking}
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className={`verify-button ${emailChecked ? 'verified' : ''}`}
              disabled={isLoading || isEmailChecking || emailChecked}
            >
              {isEmailChecking ? '확인 중...' : emailChecked ? '완료' : '중복 확인'}
            </button>
          </div>
          
          {emailError && (
            <div className="error-message email-error">
              {emailError}
            </div>
          )}
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (6자 이상)"
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              className="signup-input"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
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
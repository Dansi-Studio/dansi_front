'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 로그인 로직 구현
    console.log('로그인 시도:', formData)
    
    // 로그인 성공 시 메인 페이지로 이동
    router.push('/main')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
              type="text"
              name="username"
              placeholder="아이디"
              value={formData.username}
              onChange={handleInputChange}
              className="login-input"
              required
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
            />
          </div>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-link"
          >
            비밀번호 찾기
          </button>

          <div className="button-group">
            <button type="submit" className="login-button">
              로그인
            </button>
            
            <button
              type="button"
              onClick={handleSignup}
              className="signup-button"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
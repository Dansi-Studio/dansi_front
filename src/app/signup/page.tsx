'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './signup.css'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const [emailVerified, setEmailVerified] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    // 이메일 인증 확인
    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.')
      return
    }

    // 회원가입 로직 구현
    console.log('회원가입 시도:', formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailVerification = () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.')
      return
    }
    
    // 이메일 인증 로직
    console.log('이메일 인증:', formData.email)
    setEmailVerified(true)
    alert('인증이 완료되었습니다.')
  }

  const handleCancel = () => {
    router.back()
  }

  const handleBack = () => {
    router.back()
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
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              className={`verify-button ${emailVerified ? 'verified' : ''}`}
              disabled={emailVerified}
            >
              {emailVerified ? '완료' : '인증'}
            </button>
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
              required
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
            />
          </div>

          <div className="button-group">
            <button type="submit" className="confirm-button">
              확인
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'

// 환경 변수 체크
const isLocalEnv = process.env.NODE_ENV === 'development'

export default function HealthCheckPage() {
  const [response, setResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // 로컬 환경이 아니면 404 처리
  useEffect(() => {
    if (!isLocalEnv) {
      notFound()
    }
  }, [])

  const checkHealth = async () => {
    if (!isLocalEnv) return

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        const text = await res.text()
        setResponse(text)
      } else {
        setError(`HTTP ${res.status}: ${res.statusText}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    } finally {
      setIsLoading(false)
    }
  }

  // 로컬 환경이 아니면 아무것도 렌더링하지 않음 (notFound()가 이미 호출됨)
  if (!isLocalEnv) {
    return null
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkHealth}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? '체크 중...' : '헬스체크'}
        </button>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ 오류: {error}
        </div>
      )}

      {response && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ✅ 응답: {response}
        </div>
      )}
    </div>
  )
} 
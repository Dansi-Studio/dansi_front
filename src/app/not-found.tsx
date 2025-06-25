'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FDFCFC',
      color: '#735030',
      fontFamily: 'var(--font-sunflower), sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '400px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
          페이지를 찾을 수 없습니다
        </h1>
        <p style={{ 
          fontSize: '16px', 
          fontWeight: 300, 
          lineHeight: 1.5, 
          marginBottom: '24px',
          opacity: 0.8 
        }}>
          요청하신 페이지가 존재하지 않거나<br />
          이동되었을 수 있습니다
        </p>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#735030',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background-color 0.2s ease'
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
} 
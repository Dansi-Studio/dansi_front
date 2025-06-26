'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import './write.css'

function WritePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  
  const [keyword, setKeyword] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [tempKeyword, setTempKeyword] = useState('')

  useEffect(() => {
    const keywordParam = searchParams.get('keyword')
    if (keywordParam) {
      setKeyword(keywordParam)
      setTempKeyword(keywordParam)
    } else {
      setKeyword('영감')
      setTempKeyword('영감')
    }

    const timer = setTimeout(() => {
      setIsLoaded(true)
      if (titleRef.current) {
        titleRef.current.focus()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchParams])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setCharCount(value.length)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setIsSaving(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('저장된 글:', {
        keyword,
        title,
        content,
        createdAt: new Date().toISOString()
      })
      
      router.push('/main')
    } catch (error) {
      console.error('저장 중 오류:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    if (title.trim() || content.trim()) {
      const confirmed = confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')
      if (!confirmed) return
    }
    router.back()
  }

  return (
    <div className="write-container">
      {/* 헤더 */}
      <div className={`write-header ${isLoaded ? 'loaded' : ''}`}>
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="header-center">
        {tempKeyword}
        </div>

        <div className="header-right">
          <button 
            className={`publish-button ${isSaving ? 'saving' : ''}`}
            onClick={handleSave}
            disabled={isSaving || !content.trim() || !title.trim()}
          >
            {isSaving ? '저장중...' : '발행'}
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={`write-content ${isLoaded ? 'loaded' : ''}`}>
        {/* 키워드 섹션 */}
 
        <div className="input-section">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요"
            className="title-input"
            maxLength={100}
          />
          
          <textarea
            ref={contentRef}
            value={content}
            onChange={handleContentChange}
            placeholder={`${keyword}에서 시작하는 이야기를 써보세요...
당신의 마음 속 이야기를 자유롭게 써내려가세요.`}
            className="content-textarea"
            maxLength={2000}
            spellCheck={false}
          />
          
          {/* 글자수 카운터 */}
          <div className="char-count">
            <span className={charCount > 1800 ? 'warning' : ''}>{charCount}/2000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePageContent />
    </Suspense>
  )
}
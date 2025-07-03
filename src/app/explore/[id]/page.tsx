'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import './detail.css'
import {
  getPoemDetail,
  getCommentsByPoem,
  createComment,
  deleteComment,
  deletePoem,
  togglePoemLike,
  checkLikeStatus,
  getLikeCount,
  getCommentsCount,
  checkAutoLogin,
  type Poem,
  type Comment,
  type Member
} from '../../../utils/api'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const poemId = parseInt(params.id as string)
  
  const [poem, setPoem] = useState<Poem | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  // 사용자 정보 확인
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await checkAutoLogin()
        if (userData?.member) {
          setCurrentUser(userData.member)
        }
      } catch (error) {
        console.error('사용자 정보 확인 오류:', error)
      }
    }
    loadUserData()
  }, [])

  // 시 상세 정보 로드
  useEffect(() => {
    const loadPoemDetail = async () => {
      if (!poemId || isNaN(poemId)) {
        router.push('/explore')
        return
      }

      try {
        setIsLoading(true)
        
        // 시 상세 정보 조회 (조회수 자동 증가)
        const [poemResponse, commentsResponse] = await Promise.all([
          getPoemDetail(poemId),
          getCommentsByPoem(poemId)
        ])

        if (poemResponse.success && poemResponse.data) {
          setPoem(poemResponse.data)
        } else {
          router.push('/explore')
          return
        }

        if (commentsResponse.success && commentsResponse.data) {
          setComments(commentsResponse.data)
        }

        // 좋아요 정보 로드
        const [likeCountResponse, commentCountResponse] = await Promise.all([
          getLikeCount(poemId),
          getCommentsCount(poemId)
        ])

        if (likeCountResponse.success && likeCountResponse.data) {
          setLikeCount(likeCountResponse.data.count)
        }

        if (commentCountResponse.success && commentCountResponse.data) {
          setCommentCount(commentCountResponse.data.count)
        }

        // 현재 사용자의 좋아요 상태 확인
        if (currentUser) {
          const likeStatusResponse = await checkLikeStatus(poemId, currentUser.memberId)
          if (likeStatusResponse.success && likeStatusResponse.data) {
            setIsLiked(likeStatusResponse.data.isLiked)
          }
        }

      } catch (error) {
        console.error('시 상세 정보 로드 오류:', error)
        router.push('/explore')
      } finally {
        setIsLoading(false)
      }
    }

    loadPoemDetail()
  }, [poemId, router, currentUser])

  const handleBack = () => {
    router.back()
  }

  const handleLike = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }

         try {
       const response = await togglePoemLike(poemId, currentUser.memberId)
       if (response.success && response.data) {
         const isLikedResult = response.data.isLiked
         setIsLiked(isLikedResult)
         setLikeCount(prev => isLikedResult ? prev + 1 : Math.max(0, prev - 1))
       }
     } catch (error) {
       console.error('좋아요 토글 오류:', error)
     }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || isCommentSubmitting) return

    if (!currentUser) {
      router.push('/login')
      return
    }

    setIsCommentSubmitting(true)
    
         try {
       const response = await createComment(poemId, currentUser.memberId, newComment.trim())
       
       if (response.success && response.data) {
         // 새 댓글을 목록에 추가
         const newCommentData = response.data
         setComments(prev => [...prev, newCommentData])
         setCommentCount(prev => prev + 1)
         setNewComment('')
       }
     } catch (error) {
       console.error('댓글 작성 오류:', error)
     } finally {
       setIsCommentSubmitting(false)
     }
  }

  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poem?.title,
        text: poem?.content,
        url: window.location.href,
      })
    } else {
      // 공유 API가 지원되지 않는 경우 URL 복사
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다!')
    }
  }

  // 시 수정 핸들러
  const handleEditPoem = () => {
    if (poem) {
      // 수정 모드로 작성 페이지로 이동 (쿼리 파라미터로 시 정보 전달)
      router.push(`/write?edit=true&poemId=${poem.poemId}&keyword=${encodeURIComponent(poem.keyword || '')}&title=${encodeURIComponent(poem.title)}&content=${encodeURIComponent(poem.content)}`)
    }
  }

  // 시 삭제 핸들러
  const handleDeletePoem = async () => {
    if (!poem || !currentUser) return

    if (confirm('정말로 이 시를 삭제하시겠습니까?')) {
      try {
        const response = await deletePoem(poem.poemId, currentUser.memberId)
        if (response.success) {
          alert('시가 삭제되었습니다.')
          router.push('/explore')
        } else {
          alert('시 삭제에 실패했습니다: ' + response.message)
        }
      } catch (error) {
        console.error('시 삭제 오류:', error)
        alert('시 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    if (!currentUser) return

    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        const response = await deleteComment(commentId, currentUser.memberId)
        if (response.success) {
          // 댓글 목록에서 삭제
          setComments(prev => prev.filter(comment => comment.commentId !== commentId))
          setCommentCount(prev => Math.max(0, prev - 1))
        } else {
          alert('댓글 삭제에 실패했습니다: ' + response.message)
        }
      } catch (error) {
        console.error('댓글 삭제 오류:', error)
        alert('댓글 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  const getProfileImageSrc = (imgType?: string) => {
    if (imgType && ['cat', 'dog', 'hamster', 'rabbit', 'person'].includes(imgType)) {
      return `/profile-images/${imgType}.svg`
    }
    return '/default-profile.svg'
  }

  if (isLoading) {
    return (
      <div className="detail-container">
        <div className="detail-header">
          <button onClick={handleBack} className="detail-back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="detail-title">시 상세</h1>
        </div>
        <div className="detail-loading">
          <div className="loading-spinner"></div>
          <p>시를 불러오는 중...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (!poem) {
    return (
      <div className="detail-container">
        <div className="detail-header">
          <button onClick={handleBack} className="detail-back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="detail-title">시를 찾을 수 없습니다</h1>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={handleBack} className="detail-back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="detail-title">시 상세</h1>
        <button onClick={handleShare} className="detail-share-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="detail-content">
        <div className="detail-post-detail">
          <div className="detail-post-header">
            <div className="detail-author-info">
              <Image
                src={getProfileImageSrc(poem.member?.img)}
                alt={poem.member?.name || '작성자'}
                width={48}
                height={48}
                className="detail-author-avatar"
              />
              <div className="detail-author-details">
                <span className="detail-author-name">{poem.member?.name || '익명'}</span>
                <span className="detail-post-date">{formatDate(poem.createdAt)}</span>
              </div>
            </div>
            <span className="detail-post-keyword">
              {poem.keyword ? `오늘의 ${poem.keyword}` : '자유 주제'}
            </span>
          </div>
          
          <div className="detail-post-body">
            <h1 className="detail-post-title">{poem.title}</h1>
            <div className="detail-post-text">{poem.content}</div>
          </div>

          <div className="detail-post-stats">
            <div className="detail-stats-left">
              <div className="detail-stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{poem.viewCount}</span>
              </div>
              <div className="detail-stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{commentCount}</span>
              </div>
            </div>
            
            <div className="detail-actions-right">
              <button
                className={`detail-action-button heart ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"}>
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 3C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99866 7.05 3C5.59096 2.99866 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54866 7.04096 1.55 8.5C1.54866 9.95904 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.45 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{likeCount}</span>
              </button>
              {currentUser && poem.member?.memberId === currentUser.memberId && (
                <>
                  <button onClick={handleEditPoem} className="detail-edit-btn-small">
                    수정
                  </button>
                  <button onClick={handleDeletePoem} className="detail-delete-btn-small">
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="detail-comments-section">
          <h3 className="detail-comments-title">댓글 {commentCount}개</h3>
          
          <div className="detail-comment-write">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleCommentKeyPress}
              placeholder={currentUser ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
              className="detail-comment-input"
              disabled={!currentUser || isCommentSubmitting}
              rows={3}
            />
            <button 
              onClick={handleCommentSubmit}
              disabled={!newComment.trim() || isCommentSubmitting || !currentUser}
              className="detail-comment-submit"
            >
              {isCommentSubmitting ? '등록 중...' : '댓글 등록'}
            </button>
          </div>

          <div className="detail-comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.commentId} className="detail-comment-item">
                  <div className="detail-comment-header">
                    <div className="detail-comment-author">
                      <Image
                        src={getProfileImageSrc(comment.member?.img)}
                        alt={comment.member?.name || '작성자'}
                        width={32}
                        height={32}
                        className="detail-comment-avatar"
                      />
                      <div className="detail-comment-author-info">
                        <span className="detail-comment-author-name">
                          {comment.member?.name || '익명'}
                        </span>
                        <span className="detail-comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    {currentUser && comment.member?.memberId === currentUser.memberId && (
                      <button 
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="detail-comment-delete-btn"
                        title="댓글 삭제"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <p className="detail-comment-content">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="detail-no-comments">
                <p>아직 댓글이 없습니다.</p>
                <p>첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
} 
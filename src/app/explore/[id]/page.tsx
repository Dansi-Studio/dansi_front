'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import './detail.css'

// 예시 게시글 데이터 (실제로는 API에서 가져올 데이터)
const posts = [
  {
    id: 1,
    author: {
      name: '시인의마음',
      avatar: '/default-profile.svg'
    },
    keyword: '할머니',
    title: '할머니의 손길',
    content: '따뜻했던 할머니의 손길이 아직도 생생합니다.\n그 손으로 만져주시던 머리카락의 촉감과\n손바닥에 새겨진 세월의 흔적들이\n저에게는 가장 소중한 기억입니다.\n\n할머니, 보고 싶어요.',
    createdAt: '2024.12.24',
    viewCount: 256,
    heartCount: 23,
    commentCount: 12,
    isLiked: false
  },
  {
    id: 2,
    author: {
      name: '달빛작가',
      avatar: '/default-profile.svg'
    },
    keyword: '별',
    title: '밤하늘의 약속',
    content: '어릴 적 바라보던 그 별이 오늘도 저 자리에 있습니다.\n시간이 흘러도 변하지 않는 것들이 있어\n마음이 든든해집니다.\n\n별아, 고마워.',
    createdAt: '2024.12.23',
    viewCount: 189,
    heartCount: 34,
    commentCount: 8,
    isLiked: true
  },
  {
    id: 3,
    author: {
      name: '감성글꾼',
      avatar: '/default-profile.svg'
    },
    keyword: '바다',
    title: '파도의 노래',
    content: '끊임없이 밀려오는 파도처럼\n당신이 그리워집니다.\n바다가 들려주는 이야기를\n오늘도 듣고 있어요.\n\n언젠가 함께 바다를 보러 가요.',
    createdAt: '2024.12.22',
    viewCount: 423,
    heartCount: 56,
    commentCount: 19,
    isLiked: false
  },
  {
    id: 4,
    author: {
      name: '추억수집가',
      avatar: '/default-profile.svg'
    },
    keyword: '집',
    title: '엄마의 집',
    content: '집에 가면 항상 똑같은 자리에\n엄마가 앉아 계십니다.\n그 모습이 변하지 않아서\n집이 더욱 집다워집니다.\n\n고마워요, 엄마.',
    createdAt: '2024.12.21',
    viewCount: 312,
    heartCount: 41,
    commentCount: 15,
    isLiked: true
  },
  {
    id: 5,
    author: {
      name: '봄날의꿈',
      avatar: '/default-profile.svg'
    },
    keyword: '꽃',
    title: '벚꽃이 피면',
    content: '벚꽃이 피면 생각나는 사람이 있습니다.\n함께 걸었던 그 길에서\n웃음소리가 들려오는 것 같아요.\n\n올해도 꽃이 필까요?',
    createdAt: '2024.12.20',
    viewCount: 145,
    heartCount: 28,
    commentCount: 6,
    isLiked: false
  }
]

// 타입 정의
interface Comment {
  id: number;
  author: { name: string; avatar: string };
  content: string;
  createdAt: string;
  heartCount: number;
  isLiked: boolean;
}

// 예시 댓글 데이터
const commentsData: { [key: number]: Comment[] } = {
  1: [
    {
      id: 1,
      author: { name: '마음따뜻한사람', avatar: '/default-profile.svg' },
      content: '정말 감동적인 글이에요. 할머니에 대한 그리움이 고스란히 느껴집니다.',
      createdAt: '2024.12.24',
      heartCount: 5,
      isLiked: false
    },
    {
      id: 2,
      author: { name: '시를사랑하는이', avatar: '/default-profile.svg' },
      content: '저도 할머니가 생각나네요. 따뜻한 글 감사합니다.',
      createdAt: '2024.12.24',
      heartCount: 3,
      isLiked: true
    }
  ],
  2: [
    {
      id: 3,
      author: { name: '별빛여행자', avatar: '/default-profile.svg' },
      content: '별을 바라보며 읽으니 더욱 특별하게 느껴져요.',
      createdAt: '2024.12.23',
      heartCount: 2,
      isLiked: false
    }
  ]
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = parseInt(params.id as string)
  
  const [post, setPost] = useState(posts.find(p => p.id === postId))
  const [comments, setComments] = useState<Comment[]>(commentsData[postId] || [])
  const [newComment, setNewComment] = useState('')
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
  const [hasViewIncremented, setHasViewIncremented] = useState(false)

  useEffect(() => {
    if (!post) {
      router.push('/explore')
      return
    }
    
    // 조회수 증가 (한 번만)
    if (!hasViewIncremented) {
      setPost(prev => prev ? { ...prev, viewCount: prev.viewCount + 1 } : prev)
      setHasViewIncremented(true)
    }
  }, [post, router, hasViewIncremented])

  const handleBack = () => {
    router.back()
  }

  const handleLike = () => {
    if (!post) return
    
    setPost(prev => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      heartCount: prev.isLiked ? prev.heartCount - 1 : prev.heartCount + 1
    } : prev)
  }

  const handleCommentLike = (commentId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              heartCount: comment.isLiked ? comment.heartCount - 1 : comment.heartCount + 1
            }
          : comment
      )
    )
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || isCommentSubmitting) return

    setIsCommentSubmitting(true)
    
    // 새 댓글 추가 (실제로는 API 호출)
    const newCommentObj = {
      id: Date.now(),
      author: { name: '현재사용자', avatar: '/default-profile.svg' },
      content: newComment.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
      heartCount: 0,
      isLiked: false
    }
    
    setComments(prev => [...prev, newCommentObj])
    setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev)
    setNewComment('')
    setIsCommentSubmitting(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href,
      })
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다.')
    }
  }

  if (!post) {
    return (
      <div className="detail-container">
        <div className="detail-loading">
          <p>게시글을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-container">
      {/* 헤더 */}
      <div className="detail-header">
        <button className="detail-back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="detail-title">시 상세보기</h1>
        <button className="detail-share-button" onClick={handleShare}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2"/>
            <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="detail-content">
        {/* 게시글 내용 */}
        <div className="detail-post-detail">
          <div className="detail-post-header">
            <div className="detail-author-info">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="detail-author-avatar"
              />
              <div className="detail-author-details">
                <span className="detail-author-name">{post.author.name}</span>
                <span className="detail-post-date">{post.createdAt}</span>
              </div>
            </div>
            <span className="detail-post-keyword">오늘의 {post.keyword}</span>
          </div>

          <div className="detail-post-stats">
            <div className="detail-stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{post.viewCount}</span>
            </div>
            <div className="detail-stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{post.commentCount}</span>
            </div>
          </div>

          <div className="detail-post-body">
            <h2 className="detail-post-title">{post.title}</h2>
            <div className="detail-post-text">{post.content}</div>
          </div>

          <div className="detail-post-actions">
            <button
              className={`detail-action-button heart ${post.isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"}>
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 3C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99866 7.05 3C5.59096 2.99866 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54866 7.04096 1.55 8.5C1.54866 9.95904 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.45 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>좋아요 {post.heartCount}</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="detail-comments-section">
          <h3 className="detail-comments-title">댓글 {comments.length}개</h3>
          
          {/* 댓글 작성 */}
          <div className="detail-comment-write">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="따뜻한 댓글을 남겨보세요..."
              className="detail-comment-input"
              rows={3}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim() || isCommentSubmitting}
              className="detail-comment-submit"
            >
              {isCommentSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>

          {/* 댓글 목록 */}
          <div className="detail-comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="detail-comment-item">
                <div className="detail-comment-header">
                  <div className="detail-comment-author">
                    <Image
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      width={32}
                      height={32}
                      className="detail-comment-avatar"
                    />
                    <div className="detail-comment-author-info">
                      <span className="detail-comment-author-name">{comment.author.name}</span>
                      <span className="detail-comment-date">{comment.createdAt}</span>
                    </div>
                  </div>
                  <button
                    className={`detail-comment-like ${comment.isLiked ? 'liked' : ''}`}
                    onClick={() => handleCommentLike(comment.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={comment.isLiked ? "currentColor" : "none"}>
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 3C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99866 7.05 3C5.59096 2.99866 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54866 7.04096 1.55 8.5C1.54866 9.95904 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.45 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{comment.heartCount}</span>
                  </button>
                </div>
                <div className="detail-comment-content">
                  {comment.content}
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="detail-no-comments">
                <p>아직 댓글이 없습니다.</p>
                <p>첫 번째 댓글을 남겨보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
} 
 'use client'

import { useState } from 'react'
import Image from 'next/image'
import BottomNavigation from '../components/BottomNavigation'
import './explore.css'

type SortType = 'latest' | 'popular'

// 예시 게시글 데이터
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

export default function ExplorePage() {
  const [sortType, setSortType] = useState<SortType>('latest')
  const [postsData, setPostsData] = useState(posts)

  const sortedPosts = [...postsData].sort((a, b) => {
    if (sortType === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return b.viewCount - a.viewCount
    }
  })

  const handleLike = (postId: number) => {
    setPostsData(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              heartCount: post.isLiked ? post.heartCount - 1 : post.heartCount + 1
            }
          : post
      )
    )
  }

  const handleComment = (postId: number) => {
    console.log('댓글 달기:', postId)
    // 댓글 모달이나 페이지 이동 로직
  }

  const handlePostClick = (postId: number) => {
    console.log('글 상세보기:', postId)
    // 글 상세보기 페이지로 이동
  }

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1 className="explore-title">둘러보기</h1>
        <div className="sort-buttons" data-active={sortType}>
          <button
            className={`sort-button ${sortType === 'latest' ? 'active' : ''}`}
            onClick={() => setSortType('latest')}
          >
            최신순
          </button>
          <button
            className={`sort-button ${sortType === 'popular' ? 'active' : ''}`}
            onClick={() => setSortType('popular')}
          >
            조회수순
          </button>
        </div>
      </div>

      <div className="posts-container">
        {sortedPosts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="author-info">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="author-avatar"
                />
                <div className="author-details">
                  <span className="author-name">{post.author.name}</span>
                  <span className="post-date">{post.createdAt}</span>
                </div>
              </div>
              <span className="post-keyword">오늘의 {post.keyword}</span>
            </div>

            <div className="post-content" onClick={() => handlePostClick(post.id)}>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.content}</p>
            </div>

            <div className="post-stats">
              <div className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{post.viewCount}</span>
              </div>
            </div>

            <div className="post-actions">
              <button
                className={`action-button heart ${post.isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 3C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99866 7.05 3C5.59096 2.99866 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54866 7.04096 1.55 8.5C1.54866 9.95904 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.45 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>좋아요 {post.heartCount}</span>
              </button>
              
              <button
                className="action-button comment"
                onClick={() => handleComment(post.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>댓글 {post.commentCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  )
}
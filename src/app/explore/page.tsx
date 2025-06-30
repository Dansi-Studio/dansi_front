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
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearchFixed, setIsSearchFixed] = useState(false)

  // 검색 필터링
  const filteredPosts = postsData.filter(post => {
    if (!searchKeyword.trim()) return true
    return post.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
  })

  // 정렬
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortType === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return b.heartCount - a.heartCount
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

  const handlePostClick = (postId: number) => {
    window.location.href = `/explore/${postId}`
  }

  const handleSortSelect = (type: SortType) => {
    setSortType(type)
    setIsDropdownOpen(false)
  }

  const clearSearch = () => {
    setSearchKeyword('')
    setIsSearchOpen(false)
    setIsSearchFixed(false)
  }

  const toggleSearch = () => {
    if (isSearchFixed && !isSearchOpen) {
      setIsSearchOpen(true)
    } else {
      setIsSearchOpen(!isSearchOpen)
      if (isSearchOpen && searchKeyword && !isSearchFixed) {
        setSearchKeyword('')
      }
    }
  }

  const handleSearchSubmit = () => {
    if (searchKeyword.trim()) {
      setIsSearchFixed(true)
      setIsSearchOpen(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleClickOutside = () => {
    if (isSearchOpen && !isSearchFixed) {
      setIsSearchOpen(false)
      if (searchKeyword) {
        setSearchKeyword('')
      }
    } else if (isSearchOpen && isSearchFixed) {
      setIsSearchOpen(false)
    }
    if (isDropdownOpen) {
      setIsDropdownOpen(false)
    }
  }

  return (
    <div className="explore-container" onClick={handleClickOutside}>
      <div className="explore-header">
        <h1 className="explore-title">둘러보기</h1>
      </div>

      <div className="explore-posts-container">
        {/* 카테고리 및 정렬 섹션 */}
        <div className="explore-controls-section">
          <div className="explore-category-controls" onClick={(e) => e.stopPropagation()}>
            <div className={`explore-search-area ${isSearchOpen ? 'expanded' : ''}`}>
              {!isSearchOpen ? (
                <>
                  <button className="explore-search-toggle" onClick={toggleSearch}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="explore-category-title">
                    {searchKeyword ? `오늘의 ${searchKeyword}` : '전체 시'}
                    {isSearchFixed && searchKeyword && (
                      <button className="explore-search-fixed-clear" onClick={clearSearch}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="explore-sort-dropdown">
                    <button 
                      className="explore-dropdown-trigger"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {sortType === 'latest' ? '최신순' : '인기순'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="explore-dropdown-menu">
                        <button
                          className={`explore-dropdown-item ${sortType === 'latest' ? 'active' : ''}`}
                          onClick={() => handleSortSelect('latest')}
                        >
                          최신순
                        </button>
                        <button
                          className={`explore-dropdown-item ${sortType === 'popular' ? 'active' : ''}`}
                          onClick={() => handleSortSelect('popular')}
                        >
                          인기순
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="explore-search-expanded">
                  <div className="explore-search-input-wrapper">
                    <svg className="explore-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      type="text"
                      className="explore-search-input"
                      placeholder="키워드를 검색해보세요 (예: 할머니, 별)"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      autoFocus
                      onKeyDown={handleSearchKeyPress}
                    />
                    {searchKeyword && (
                      <button className="explore-search-clear" onClick={clearSearch}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <div key={post.id} className="explore-post-card">
              <div className="explore-post-header">
                <div className="explore-author-info">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    className="explore-author-avatar"
                  />
                  <div className="explore-author-details">
                    <span className="explore-author-name">{post.author.name}</span>
                    <span className="explore-post-date">{post.createdAt}</span>
                  </div>
                </div>
                <span className="explore-post-keyword">오늘의 {post.keyword}</span>
              </div>
              
              <div className="explore-post-content" onClick={() => handlePostClick(post.id)}>
                <h3 className="explore-post-title">{post.title}</h3>
                <p className="explore-post-text">{post.content}</p>
              </div>

              <div className="explore-post-stats">
                <div className="explore-stat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{post.viewCount}</span>
                </div>
                <div className="explore-stat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{post.commentCount}</span>
                </div>
              </div>

              <div className="explore-post-actions">
                <button
                  className={`explore-action-button heart ${post.isLiked ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(post.id)
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"}>
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 3C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99866 7.05 3C5.59096 2.99866 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54866 7.04096 1.55 8.5C1.54866 9.95904 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.45 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{post.heartCount}</span>
                </button>
                <button
                  className="explore-action-button comment"
                  onClick={() => handlePostClick(post.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>댓글</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="explore-no-results">
            <p>{`'${searchKeyword}' 키워드로 작성된 시가 없습니다.`}</p>
            <p>다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
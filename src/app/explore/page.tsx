'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavigation from '../components/BottomNavigation'
import './explore.css'
import { 
  getPoems, 
  getPoemsListByKeyword, 
  togglePoemLike, 
  checkLikeStatus, 
  getLikeCount, 
  getCommentsCount,
  checkAutoLogin,
  type PoemSummary,
  type Member
} from '../../utils/api'

type SortType = 'latest' | 'popular'

function ExplorePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortType, setSortType] = useState<SortType>('latest')
  const [postsData, setPostsData] = useState<PoemSummary[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearchFixed, setIsSearchFixed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

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

  // URL 파라미터에서 키워드 확인 및 자동 검색
  useEffect(() => {
    const keywordParam = searchParams.get('keyword')
    if (keywordParam) {
      setSearchKeyword(keywordParam)
      setIsSearchFixed(true)  // 검색창은 닫혀있지만 검색은 완료된 상태
      // 검색 실행
      loadPosts(0, keywordParam, sortType, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sortType])

  // 시 목록 로드
  const loadPosts = async (page: number = 0, keyword: string = '', sort: SortType = 'latest', isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true)
      } else {
        setLoadingMore(true)
      }

      let response
      if (keyword.trim()) {
        // 키워드 검색
        response = await getPoemsListByKeyword(keyword)
                 if (response.success && response.data) {
           // 키워드 검색 결과를 PoemSummary 형식으로 변환
           const poemsWithCounts: PoemSummary[] = await Promise.all(
             response.data.map(async (poem): Promise<PoemSummary> => {
               const [likeResponse, commentResponse] = await Promise.all([
                 getLikeCount(poem.poemId),
                 getCommentsCount(poem.poemId)
               ])
               
               let isLiked = false
               if (currentUser) {
                 const likeStatusResponse = await checkLikeStatus(poem.poemId, currentUser.memberId)
                 isLiked = likeStatusResponse.success ? likeStatusResponse.data?.isLiked || false : false
               }

               return {
                 ...poem,
                 likeCount: likeResponse.success ? likeResponse.data?.count || 0 : 0,
                 commentCount: commentResponse.success ? commentResponse.data?.count || 0 : 0,
                 isLiked
               } as PoemSummary
             })
           )
          
          // 정렬 적용
          const sortedPoems = [...poemsWithCounts].sort((a, b) => {
            if (sort === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
              return b.likeCount - a.likeCount
            }
          })
          
          setPostsData(sortedPoems)
          setHasMore(false) // 키워드 검색은 페이징 없음
        }
      } else {
        // 전체 시 목록 조회
        response = await getPoems(page, 10, sort)
        if (response.success && response.data) {
          const poems = response.data.content
          
                     // 각 시에 대해 좋아요 개수, 댓글 개수, 좋아요 상태 조회
           const poemsWithCounts: PoemSummary[] = await Promise.all(
             poems.map(async (poem): Promise<PoemSummary> => {
               const [likeResponse, commentResponse] = await Promise.all([
                 getLikeCount(poem.poemId),
                 getCommentsCount(poem.poemId)
               ])
               
               let isLiked = false
               if (currentUser) {
                 const likeStatusResponse = await checkLikeStatus(poem.poemId, currentUser.memberId)
                 isLiked = likeStatusResponse.success ? likeStatusResponse.data?.isLiked || false : false
               }

               return {
                 ...poem,
                 likeCount: likeResponse.success ? likeResponse.data?.count || 0 : 0,
                 commentCount: commentResponse.success ? commentResponse.data?.count || 0 : 0,
                 isLiked
               } as PoemSummary
             })
           )
          
          if (isLoadMore) {
            setPostsData(prev => [...prev, ...poemsWithCounts])
          } else {
            setPostsData(poemsWithCounts)
          }
          
          setHasMore(!response.data.last)
        }
      }
    } catch (error) {
      console.error('시 목록 로드 오류:', error)
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  // 초기 로드 (키워드 파라미터가 없을 때만)
  useEffect(() => {
    const keywordParam = searchParams.get('keyword')
    if (!keywordParam) {
      loadPosts(0, searchKeyword, sortType, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, currentUser, searchParams])

  // 검색 실행 (수동 검색인 경우만)
  useEffect(() => {
    const keywordParam = searchParams.get('keyword')
    if (isSearchFixed && searchKeyword.trim() && !keywordParam) {
      setCurrentPage(0)
      loadPosts(0, searchKeyword, sortType, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchFixed, searchKeyword, sortType, searchParams])

  // 좋아요 토글
  const handleLike = async (poemId: number) => {
    if (!currentUser) {
      // 로그인 필요
      router.push('/login')
      return
    }

    try {
      const response = await togglePoemLike(poemId, currentUser.memberId)
      if (response.success) {
        // 로컬 상태 업데이트
    setPostsData(prevPosts =>
      prevPosts.map(post =>
            post.poemId === poemId
          ? {
              ...post,
                  isLiked: response.data?.isLiked || false,
                  likeCount: response.data?.isLiked 
                    ? post.likeCount + 1 
                    : Math.max(0, post.likeCount - 1)
            }
          : post
      )
    )
      }
    } catch (error) {
      console.error('좋아요 토글 오류:', error)
    }
  }

  const handlePostClick = (postId: number) => {
    router.push(`/explore/${postId}`)
  }

  const handleSortSelect = (type: SortType) => {
    setSortType(type)
    setIsDropdownOpen(false)
    setCurrentPage(0)
  }

  const clearSearch = () => {
    setSearchKeyword('')
    setIsSearchOpen(false)
    setIsSearchFixed(false)
    setCurrentPage(0)
    loadPosts(0, '', sortType, false)
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

  const loadMorePosts = () => {
    if (hasMore && !loadingMore && !searchKeyword.trim()) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      loadPosts(nextPage, searchKeyword, sortType, true)
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
      <div className="explore-container">
        <div className="explore-header">
          <h1 className="explore-title">둘러보기</h1>
        </div>
        <div className="explore-loading">
          <div className="loading-spinner"></div>
          <p>시 목록을 불러오는 중...</p>
        </div>
        <BottomNavigation />
      </div>
    )
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

        {/* 시 목록 */}
        {postsData.length > 0 ? (
          <>
            {postsData.map((post) => (
              <div key={post.poemId} className="explore-post-card">
              <div className="explore-post-header">
                <div className="explore-author-info">
                  <Image
                      src={getProfileImageSrc(post.member?.img)}
                      alt={post.member?.name || '작성자'}
                    width={36}
                    height={36}
                    className="explore-author-avatar"
                  />
                  <div className="explore-author-details">
                      <span className="explore-author-name">{post.member?.name || '익명'}</span>
                      <span className="explore-post-date">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <span className="explore-post-keyword">
                    {post.keyword ? `오늘의 ${post.keyword}` : '자유 주제'}
                  </span>
              </div>
              
                <div className="explore-post-content" onClick={() => handlePostClick(post.poemId)}>
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
                      handleLike(post.poemId)
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"}>
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 3C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99866 7.05 3C5.59096 2.99866 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54866 7.04096 1.55 8.5C1.54866 9.95904 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.45 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                    <span>{post.likeCount}</span>
                </button>
                <button
                  className="explore-action-button comment"
                    onClick={() => handlePostClick(post.poemId)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>댓글</span>
                </button>
              </div>
            </div>
            ))}
            
            {/* 더 보기 버튼 */}
            {hasMore && !searchKeyword.trim() && (
              <div className="explore-load-more">
                <button 
                  className="explore-load-more-btn"
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                >
                  {loadingMore ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="explore-no-results">
            <p>
              {searchKeyword.trim() 
                ? `'${searchKeyword}' 키워드로 작성된 시가 없습니다.`
                : '아직 작성된 시가 없습니다.'
              }
            </p>
            <p>
              {searchKeyword.trim() 
                ? '다른 키워드로 검색해보세요.'
                : '첫 번째 시를 작성해보세요!'
              }
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="explore-container">
        <div className="explore-header">
          <h1 className="explore-title">둘러보기</h1>
        </div>
        <div className="explore-loading">
          <div className="loading-spinner"></div>
          <p>시 목록을 불러오는 중...</p>
        </div>
        <BottomNavigation />
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  )
}
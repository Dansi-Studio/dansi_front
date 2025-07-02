'use client'

import { useState, useEffect } from 'react'
import BottomNavigation from '../components/BottomNavigation'
import './profile.css'
import { 
  getMemberProfile, 
  getMemberStats, 
  getMemberPoemsWithPagination, 
  updateProfile, 
  changePassword, 
  logoutAllDevices, 
  logout, 
  checkAutoLogin,
  type Member, 
  type MemberStats, 
  type Poem
} from '../../utils/api'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// 배지 타입 정의
interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

// 예시 배지 데이터
const badges: Badge[] = [
  { id: 1, name: '준비 중이에요', description: '', icon: '✨', earned: true },
]

// 귀여운 동물 컨셉 프로필 이미지 옵션들
const profileImageOptions = [
  { id: 1, name: '기본', type: 'person', color: '#F8F6F0' },
  { id: 2, name: '고양이', type: 'cat', color: '#F5F1EB' },
  { id: 3, name: '강아지', type: 'dog', color: '#F0EBE1' },
  { id: 4, name: '햄스터', type: 'hamster', color: '#EAE4D3' },
  { id: 5, name: '토끼', type: 'rabbit', color: '#E8E0D0' },
]

// 프로필 이미지 컴포넌트 - SVG 파일을 경로로 로드
const ProfileImage = ({ type, size = 100 }: { type: string; size?: number }) => {
  return (
    <Image
      src={`/profile-images/${type}.svg`}
      alt={`${type} profile`}
      width={size}
      height={size}
      className="profile-svg"
    />
  )
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('setting')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  
  // 사용자 데이터 상태
  const [userData, setUserData] = useState<Member | null>(null)
  const [userStats, setUserStats] = useState<MemberStats | null>(null)
  const [userPoems, setUserPoems] = useState<Poem[]>([])
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoadingPoems, setIsLoadingPoems] = useState(false)
  const [pageSize] = useState(10) // 페이지당 시 개수
  
  // 편집 상태
  const [editedName, setEditedName] = useState('')
  const [editedBio, setEditedBio] = useState('')
  
  // 비밀번호 변경 모달 상태
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // 프로필 이미지 변경 모달 상태
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false)
  const [selectedProfileImage, setSelectedProfileImage] = useState('person') // 기본값을 'person'으로 설정

  const router = useRouter()

  // 사용자 시 목록 로드 (페이지네이션)
  const loadUserPoems = async (page: number = 0) => {
    if (!userData) return
    
    setIsLoadingPoems(true)
    try {
      const response = await getMemberPoemsWithPagination(userData.memberId, page, pageSize)
      
      if (response.success && response.data) {
        setUserPoems(response.data.content)
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.number)
      }
    } catch (error) {
      console.error('사용자 시 목록 로드 오류:', error)
    } finally {
      setIsLoadingPoems(false)
    }
  }

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      loadUserPoems(newPage)
    }
  }

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsCheckingAuth(true)
        
        console.log('프로필 페이지: 인증 확인 시작')
        
        // 1. checkAutoLogin으로 토큰과 사용자 정보를 한 번에 검증
        const userData = await checkAutoLogin()
        
        console.log('프로필 페이지: checkAutoLogin 결과:', userData)
        
        if (!userData || !userData.member) {
          console.log('프로필 페이지: 사용자 데이터 없음, 로그인 페이지로 리디렉트')
          // 토큰이 유효하지 않거나 사용자 정보가 없으면 로그인 페이지로 리디렉트
          router.push('/login?redirect=profile')
          return
        }

        const memberId = userData.member.memberId
        console.log('프로필 페이지: 멤버 ID:', memberId)
        
        if (!memberId) {
          console.log('프로필 페이지: 멤버 ID 없음, 로그인 페이지로 리디렉트')
          // memberId가 없으면 로그인 페이지로 리디렉트
          router.push('/login?redirect=profile')
          return
        }

        console.log('프로필 페이지: API 호출 시작')
        // 2. 사용자 정보 로드 (API 호출)
        const [profileResponse, statsResponse] = await Promise.all([
          getMemberProfile(memberId),
          getMemberStats(memberId)
        ])

        console.log('프로필 페이지: 프로필 응답:', profileResponse)
        console.log('프로필 페이지: 통계 응답:', statsResponse)

        // 3. API 호출이 실패하면 로그인 페이지로 리디렉트
        if (!profileResponse.success) {
          console.error('프로필 정보 로드 실패:', profileResponse.message)
          // 토큰이 유효하지 않거나 사용자 정보에 문제가 있음
          logout() // logout 함수를 사용하여 모든 정보 정리
          router.push('/login?redirect=profile')
          return
        }

        console.log('프로필 페이지: 데이터 로드 성공, 상태 업데이트')
        // 4. 성공적으로 데이터를 받았으면 상태 업데이트
        if (profileResponse.success && profileResponse.data) {
          setUserData(profileResponse.data)
          setEditedName(profileResponse.data.name)
          setEditedBio(profileResponse.data.bio || '')
          setSelectedProfileImage(profileResponse.data.img || 'person')
        }

        if (statsResponse.success && statsResponse.data) {
          setUserStats(statsResponse.data)
        }

        console.log('프로필 페이지: 모든 로직 완료')

      } catch (error) {
        console.error('프로필 페이지: 사용자 데이터 로드 오류:', error)
        // 네트워크 오류 등의 경우에만 로그인 페이지로 리디렉트
        logout() // logout 함수를 사용하여 모든 정보 정리
        router.push('/login?redirect=profile')
      } finally {
        setIsCheckingAuth(false)
        setIsLoaded(true)
      }
    }

    loadUserData()
  }, [router])

  // 사용자 데이터가 로드된 후 시 목록 로드
  useEffect(() => {
    if (userData && activeTab === 'posts') {
      loadUserPoems(0) // 첫 번째 페이지부터 로드
    }
  }, [userData, activeTab])

  // 탭 변경 시 시 목록 로드
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'posts' && userData && userPoems.length === 0) {
      loadUserPoems(0)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAllDevices()
      router.push('/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      // 오류가 발생해도 로컬 스토리지는 정리하고 로그인 페이지로 이동
      logout()
      router.push('/login')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  const handlePasswordChange = () => {
    setIsPasswordChangeModalOpen(true)
  }

  const handleProfileImageClick = () => {
    setIsProfileImageModalOpen(true)
  }

  const handleProfileImageSelect = async (option: typeof profileImageOptions[0]) => {
    if (!userData) return
    
    try {
      const response = await updateProfile(userData.memberId, {
        name: userData.name,
        bio: userData.bio,
        img: option.type
      })
      
      if (response.success && response.data) {
        setUserData(response.data)
        setSelectedProfileImage(option.type)
      }
    } catch (error) {
      console.error('프로필 이미지 변경 오류:', error)
    }
    
    setIsProfileImageModalOpen(false)
  }

  const handleProfileImageCancel = () => {
    setIsProfileImageModalOpen(false)
  }

  const handlePasswordChangeSubmit = async () => {
    if (!userData) return
    
    // 비밀번호 검증
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('모든 필드를 입력해주세요.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('새 비밀번호는 8자 이상이어야 합니다.')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError('기존 비밀번호와 새 비밀번호가 같습니다.')
      return
    }

    setIsChangingPassword(true)
    setPasswordError('')

    try {
      const response = await changePassword(userData.memberId, {
        currentPassword,
        newPassword
      })
      
      if (response.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.')
        handlePasswordChangeCancel()
      } else {
        setPasswordError(response.message || '비밀번호 변경에 실패했습니다.')
      }
      
    } catch (error) {
      setPasswordError('비밀번호 변경에 실패했습니다. 기존 비밀번호를 확인해주세요.')
      console.error('비밀번호 변경 오류:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handlePasswordChangeCancel = () => {
    setIsPasswordChangeModalOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setIsChangingPassword(false)
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveProfile = async () => {
    if (!userData) return
    
    try {
      const response = await updateProfile(userData.memberId, {
        name: editedName,
        bio: editedBio,
        img: userData.img
      })
      
      if (response.success && response.data) {
        setUserData(response.data)
        setIsEditModalOpen(false)
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditedName(userData?.name || '')
    setEditedBio(userData?.bio || '')
    setIsEditModalOpen(false)
  }

  if (isCheckingAuth || !userData) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>프로필 정보를 불러오는 중...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-background">
        <div className="gradient-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="profile-content">
        {/* 프로필 헤더 */}
        <div className={`profile-header ${isLoaded ? 'loaded' : ''}`}>
          <div className="profile-image-container">
            <div className="profile-image-frame" onClick={handleProfileImageClick}>
              <div className="profile-svg-container">
                <ProfileImage type={selectedProfileImage} size={100} />
              </div>
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-nickname-container">
              <h1 className="profile-nickname">{userData.name}</h1>
              <button className="edit-icon-btn" onClick={handleEditProfile} title="프로필 편집">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="profile-bio-container">
              <p className="profile-bio">
                {userData.bio && userData.bio.trim() ? userData.bio : '한줄 소개 작성해주세요!'}
              </p>
            </div>           
          </div> 
        </div>

        {/* 통계 카드 */}
        <div className={`stats-grid ${isLoaded ? 'loaded' : ''}`}>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-number">{typeof userStats?.totalWrites === 'number' ? userStats.totalWrites : 0}</div>
            <div className="stat-label">작성한 글</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-number">{typeof userStats?.totalLikes === 'number' ? userStats.totalLikes : 0}</div>
            <div className="stat-label">받은 좋아요</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div className="stat-number">{typeof userStats?.totalViews === 'number' ? userStats.totalViews : 0}</div>
            <div className="stat-label">총 조회수</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'setting' ? 'active' : ''}`}
            onClick={() => handleTabChange('setting')}
          >
            설정
          </button>
          <button 
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleTabChange('posts')}
          >
            최근 글
          </button>
          <button 
            className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => handleTabChange('badges')}
          >
            배지
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="tab-content">
          {activeTab === 'setting' && (
            <div className="setting-section">
              <div className="setting-list">
                <div className="setting-item">
                  <div className="setting-main">
                    <div className="setting-title">계정</div>
                    <div className="setting-value">{userData.email}</div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-main">
                    <div className="setting-title">함께한 날</div>
                    <div className="setting-value">{userStats?.joinDate ? formatDate(userStats.joinDate) : ''}부터</div>
                  </div>
                </div>

                <div className="setting-item clickable" onClick={handlePasswordChange}>
                  <div className="setting-main">
                    <div className="setting-title">비밀번호 변경</div>
                  </div>
                  <div className="setting-arrow">〉</div>
                </div>

                <div className="setting-item clickable logout" onClick={handleLogout}>
                  <div className="setting-main">
                    <div className="setting-title">로그아웃</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="badges-section">
              <div className="badges-grid">
                {badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
                  >
                    <div className="badge-icon">{badge.icon}</div>
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-description">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              {isLoadingPoems && (
                <div className="loading-message">시 목록을 불러오는 중...</div>
              )}
              
              {!isLoadingPoems && (
                <>
                  {userPoems.map((poem, index) => (
                    <div key={poem?.poemId || `poem-${index}`} className="post-card">
                      <div className="post-keyword">{poem?.keyword || '키워드 없음'}</div>
                      <div className="post-content">
                        <h3 className="post-title">{poem?.title || '제목 없음'}</h3>
                        <div className="post-meta">
                          <span className="post-date">{poem?.createdAt ? formatDate(poem.createdAt) : '날짜 없음'}</span>
                          <span className="post-likes">❤️ {poem?.likeCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {userPoems.length === 0 && (
                    <div className="empty-message">아직 작성한 글이 없습니다.</div>
                  )}
                  
                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        이전
                      </button>
                      
                      <div className="pagination-info">
                        {currentPage + 1} / {totalPages} 페이지
                      </div>
                      
                      <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />

      {/* 편집 팝업 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>프로필 편집</h2>
              <button className="modal-close-btn" onClick={handleCancelEdit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="nickname">닉네임</label>
                <input
                  id="nickname"
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="modal-input"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="bio">한줄소개</label>
                <textarea
                  id="bio"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="modal-textarea"
                  rows={3}
                  placeholder="한줄 소개를 작성해주세요!"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={handleCancelEdit}>
                취소
              </button>
              <button className="modal-save-btn" onClick={handleSaveProfile}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {isPasswordChangeModalOpen && (
        <div className="modal-overlay" onClick={handlePasswordChangeCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>비밀번호 변경</h2>
              <button className="modal-close-btn" onClick={handlePasswordChangeCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="currentPassword">기존 비밀번호</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="modal-input"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="newPassword">새 비밀번호</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="modal-input"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="modal-input"
                />
              </div>

              {passwordError && (
                <div className="error-message">
                  {passwordError}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={handlePasswordChangeCancel} disabled={isChangingPassword}>
                취소
              </button>
              <button className="modal-save-btn" onClick={handlePasswordChangeSubmit} disabled={isChangingPassword}>
                {isChangingPassword ? '변경 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 이미지 변경 모달 */}
      {isProfileImageModalOpen && (
        <div className="modal-overlay" onClick={handleProfileImageCancel}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>프로필 이미지 선택</h2>
              <button className="modal-close-btn" onClick={handleProfileImageCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="profile-modal-body">
              <div className="profile-cards-container">
                <div className="profile-cards-scroll">
                  {profileImageOptions.map(option => (
                    <div
                      key={option.id}
                      className={`profile-card ${selectedProfileImage === option.type ? 'selected' : ''}`}
                      onClick={() => handleProfileImageSelect(option)}
                      style={{ backgroundColor: option.color }}
                    >
                      <div className="profile-card-emoji">
                        <ProfileImage type={option.type} size={48} />
                      </div>
                      <div className="profile-card-name">{option.name}</div>
                      {selectedProfileImage === option.type && (
                        <div className="profile-card-selected">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="profile-card disabled">
                    <div className="profile-card-emoji">📷</div>
                    <div className="profile-card-name">직접 업로드</div>
                    <div className="profile-card-status">준비중</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
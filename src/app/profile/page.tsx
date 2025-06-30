'use client'

import { useState, useEffect } from 'react'
import BottomNavigation from '../components/BottomNavigation'
import './profile.css'

// 예시 데이터
const userData = {
  nickname: '감성작가',
  bio: '일상의 작은 순간들을\n글로 담아내는 것을 좋아합니다.',
  profileImage: '/default-profile.svg',
  joinDate: '2024.01.15',
  email: 'writer@dansi.com',
  totalWrites: 47,
  totalLikes: 324,
  totalViews: 1250,
  badges: [
    { id: 1, name: '준비 중이에요', description: '', icon: '✨', earned: true },
    // { id: 2, name: '꾸준함', description: '7일 연속 글 작성', icon: '🔥', earned: true },
    // { id: 3, name: '인기 작가', description: '100개 좋아요 달성', icon: '❤️', earned: true },
    // { id: 4, name: '베스트셀러', description: '1000회 조회수 달성', icon: '👑', earned: false },
  ],
  recentPosts: [
    { id: 1, title: '겨울 바람의 속삭임', date: '2024.03.15', likes: 23, keyword: '바람' },
    { id: 2, title: '따뜻한 커피 한 잔', date: '2024.03.14', likes: 18, keyword: '온기' },
    { id: 3, title: '별이 빛나는 밤에', date: '2024.03.13', likes: 31, keyword: '별빛' },
  ]
}

// 귀여운 동물 컨셉 프로필 이미지 옵션들
const profileImageOptions = [
  { id: 1, name: '기본', type: 'person', color: '#F8F6F0' },
  { id: 2, name: '고양이', type: 'cat', color: '#F5F1EB' },
  { id: 3, name: '강아지', type: 'dog', color: '#F0EBE1' },
  { id: 4, name: '햄스터', type: 'hamster', color: '#EAE4D3' },
  { id: 5, name: '토끼', type: 'rabbit', color: '#E8E0D0' },
]

// SVG 프로필 컴포넌트들 - 심플하고 일관된 베이지 톤 디자인
const AnimalSVG = ({ type, size = 48 }: { type: string; size?: number }) => {
  const strokeColor = '#735030'
  const fillColor = '#FFFEF7'
  const strokeWidth = '2.5'
  const innerStrokeColor = '#A68B6B'
  
  switch (type) {
    case 'person':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* 사람 머리 */}
          <circle cx="50" cy="35" r="18" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 사람 몸 */}
          <path d="M25 90 Q25 65 35 60 Q50 55 65 60 Q75 65 75 90 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          {/* 얼굴 디테일 */}
          <circle cx="45" cy="32" r="1.5" fill={strokeColor}/>
          <circle cx="55" cy="32" r="1.5" fill={strokeColor}/>
          <path d="M46 40 Q50 42 54 40" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      )
    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* 고양이 얼굴 */}
          <circle cx="50" cy="50" r="25" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 고양이 귀 */}
          <path d="M32 32 L40 15 L48 32" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} 
                strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M52 32 L60 15 L68 32" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} 
                strokeLinejoin="round" strokeLinecap="round"/>
          {/* 귀 안쪽 */}
          <line x1="36" y1="27" x2="40" y2="20" stroke={innerStrokeColor} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="64" y1="27" x2="60" y2="20" stroke={innerStrokeColor} strokeWidth="1.5" strokeLinecap="round"/>
          {/* 눈 */}
          <circle cx="42" cy="45" r="2" fill={strokeColor}/>
          <circle cx="58" cy="45" r="2" fill={strokeColor}/>
          {/* 코 */}
          <path d="M48 52 L52 52 L50 55" fill={innerStrokeColor} strokeLinejoin="round"/>
          {/* 입 */}
          <path d="M50 55 Q46 60 43 58" stroke={strokeColor} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M50 55 Q54 60 57 58" stroke={strokeColor} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* 수염 */}
          <line x1="30" y1="48" x2="38" y2="50" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="30" y1="54" x2="38" y2="54" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="62" y1="50" x2="70" y2="48" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="62" y1="54" x2="70" y2="54" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    case 'dog':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* 강아지 얼굴 */}
          <circle cx="50" cy="52" r="24" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 강아지 귀 */}
          <ellipse cx="36" cy="35" rx="6" ry="15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="64" cy="35" rx="6" ry="15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 귀 안쪽 */}
          <ellipse cx="36" cy="35" rx="3" ry="10" fill="none" stroke={innerStrokeColor} strokeWidth="1.5"/>
          <ellipse cx="64" cy="35" rx="3" ry="10" fill="none" stroke={innerStrokeColor} strokeWidth="1.5"/>
          {/* 눈 */}
          <circle cx="43" cy="47" r="2.5" fill={strokeColor}/>
          <circle cx="57" cy="47" r="2.5" fill={strokeColor}/>
          {/* 코 */}
          <circle cx="50" cy="57" r="2" fill={strokeColor}/>
          {/* 입 */}
          <path d="M50 60 Q45 65 41 63" stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M50 60 Q55 65 59 63" stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* 혀 */}
          <ellipse cx="50" cy="68" rx="3" ry="2" fill={innerStrokeColor}/>
        </svg>
      )
    case 'hamster':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* 햄스터 몸통 */}
          <circle cx="50" cy="55" r="26" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 햄스터 귀 */}
          <circle cx="42" cy="35" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="58" cy="35" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 귀 안쪽 */}
          <circle cx="42" cy="35" r="2.5" fill="none" stroke={innerStrokeColor} strokeWidth="1.5"/>
          <circle cx="58" cy="35" r="2.5" fill="none" stroke={innerStrokeColor} strokeWidth="1.5"/>
          {/* 눈 */}
          <circle cx="44" cy="48" r="3" fill={strokeColor}/>
          <circle cx="56" cy="48" r="3" fill={strokeColor}/>
          {/* 코 */}
          <circle cx="50" cy="55" r="1" fill={innerStrokeColor}/>
          {/* 입 */}
          <path d="M50 57 Q47 60 45 58" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M50 57 Q53 60 55 58" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* 볼살 */}
          <circle cx="30" cy="52" r="5" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
          <circle cx="70" cy="52" r="5" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
        </svg>
      )
    case 'rabbit':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* 토끼 얼굴 */}
          <circle cx="50" cy="55" r="22" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 토끼 긴 귀 */}
          <ellipse cx="44" cy="25" rx="4" ry="18" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="56" cy="25" rx="4" ry="18" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          {/* 귀 안쪽 */}
          <ellipse cx="44" cy="25" rx="2" ry="12" fill="none" stroke={innerStrokeColor} strokeWidth="1.5"/>
          <ellipse cx="56" cy="25" rx="2" ry="12" fill="none" stroke={innerStrokeColor} strokeWidth="1.5"/>
          {/* 눈 */}
          <circle cx="45" cy="50" r="2" fill={strokeColor}/>
          <circle cx="55" cy="50" r="2" fill={strokeColor}/>
          {/* 코 */}
          <path d="M48 58 L52 58 L50 61" fill={innerStrokeColor} strokeLinejoin="round"/>
          {/* 입 */}
          <path d="M50 61 Q46 65 44 63" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M50 61 Q54 65 56 63" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* 앞니 */}
          <rect x="49" y="64" width="1" height="2.5" fill={fillColor} stroke={strokeColor} strokeWidth="0.8"/>
          <rect x="50" y="64" width="1" height="2.5" fill={fillColor} stroke={strokeColor} strokeWidth="0.8"/>
        </svg>
      )
    default:
      return <div>?</div>
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('setting')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedNickname, setEditedNickname] = useState(userData.nickname)
  const [editedBio, setEditedBio] = useState(userData.bio)
  
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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleLogout = () => {
    console.log('로그아웃')
  }

  const handlePasswordChange = () => {
    setIsPasswordChangeModalOpen(true)
  }

  const handleProfileImageClick = () => {
    setIsProfileImageModalOpen(true)
  }

  const handleProfileImageSelect = (option: typeof profileImageOptions[0]) => {
    setSelectedProfileImage(option.type)
    console.log('프로필 이미지 변경:', option)
    setIsProfileImageModalOpen(false)
    // 실제로는 API 호출하여 저장
  }

  const handleProfileImageCancel = () => {
    setIsProfileImageModalOpen(false)
  }

  const handlePasswordChangeSubmit = async () => {
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
      // 실제로는 API 호출
      console.log('비밀번호 변경 요청:', { currentPassword, newPassword })
      
      // 임시로 2초 대기 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 성공 시
      alert('비밀번호가 성공적으로 변경되었습니다.')
      handlePasswordChangeCancel()
      
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

  const handleSaveProfile = () => {
    console.log('프로필 저장:', { nickname: editedNickname, bio: editedBio })
    // 실제로는 API 호출하여 저장
    setIsEditModalOpen(false)
  }

  const handleCancelEdit = () => {
    setEditedNickname(userData.nickname)
    setEditedBio(userData.bio)
    setIsEditModalOpen(false)
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
                <AnimalSVG type={selectedProfileImage} size={100} />
              </div>
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-nickname-container">
              <h1 className="profile-nickname">{userData.nickname}</h1>
              <button className="edit-icon-btn" onClick={handleEditProfile} title="프로필 편집">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="profile-bio-container">
              <p className="profile-bio">{userData.bio}</p>
            </div>           
          </div> 
        </div>

        {/* 통계 카드 */}
        <div className={`stats-grid ${isLoaded ? 'loaded' : ''}`}>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-number">{userData.totalWrites}</div>
            <div className="stat-label">작성한 글</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-number">{userData.totalLikes}</div>
            <div className="stat-label">받은 좋아요</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div className="stat-number">{userData.totalViews}</div>
            <div className="stat-label">총 조회수</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'setting' ? 'active' : ''}`}
            onClick={() => setActiveTab('setting')}
          >
            설정
          </button>
          <button 
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            최근 글
          </button>
          <button 
            className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
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
                    <div className="setting-value">{userData.joinDate}부터</div>
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
              
              {/* <div className="quick-actions">
                <button className="action-button">
                  <span className="action-icon">⚙️</span>
                  <span>설정</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">📊</span>
                  <span>통계</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">🎨</span>
                  <span>테마</span>
                </button>
              </div> */}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="badges-section">
              <div className="badges-grid">
                {userData.badges.map(badge => (
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
              {userData.recentPosts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-keyword">{post.keyword}</div>
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span className="post-date">{post.date}</span>
                      <span className="post-likes">❤️ {post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                  value={editedNickname}
                  onChange={(e) => setEditedNickname(e.target.value)}
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
                        <AnimalSVG type={option.type} size={48} />
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
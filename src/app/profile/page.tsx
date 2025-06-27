'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../components/BottomNavigation'
import './profile.css'

// 예시 데이터
const userData = {
  nickname: '감성작가',
  bio: '일상의 작은 순간들을 글로 담아내는 것을 좋아합니다.',
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('setting')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedNickname, setEditedNickname] = useState(userData.nickname)
  const [editedBio, setEditedBio] = useState(userData.bio)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleLogout = () => {
    console.log('로그아웃')
  }

  const handlePasswordChange = () => {
    console.log('비밀번호 변경')
    // 비밀번호 변경 페이지로 이동하거나 모달 띄우기
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
            <div className="profile-image-frame">
              <Image
                src={userData.profileImage}
                alt="프로필 이미지"
                width={100}
                height={100}
                className="profile-image"
              />
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
    </div>
  )
} 
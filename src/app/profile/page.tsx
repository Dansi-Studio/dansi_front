'use client'

import Image from 'next/image'
import BottomNavigation from '../components/BottomNavigation'
import './profile.css'

// 예시 데이터
const userData = {
  nickname: '감성작가',
  bio: '일상의 작은 순간들을 글로 담아내는 것을 좋아합니다.',
  profileImage: '/default-profile.svg',
  joinDate: '2024.01.15'
}

export default function ProfilePage() {
  const handleLogout = () => {
    console.log('로그아웃')
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-image">
          <Image
            src={userData.profileImage}
            alt="프로필 이미지"
            width={80}
            height={80}
          />
        </div>
        
        <h2 className="profile-nickname">{userData.nickname}</h2>
        <p className="profile-bio">{userData.bio}</p>
        
        <div className="profile-join-date">
          함께한 날 {userData.joinDate}부터
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
} 
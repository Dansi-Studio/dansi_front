# 🌸 단시 공방 (Dansi Craft)

> 시와 감성을 나누는 창작 공간

단시 공방은 사용자들이 일상의 순간을 시와 글로 표현하고 공유할 수 있는 모바일 웹 애플리케이션입니다. 키워드를 통해 영감을 받고, 자신만의 감성적인 글을 작성하여 다른 사용자들과 나눌 수 있습니다.

## ✨ 주요 기능

### 📝 창작 기능

- **키워드 기반 영감**: 매일 바뀌는 키워드로 창작 영감 제공
- **건네는 글감**: 다양한 키워드 카드를 통한 창작 소재 제공
- **자유로운 글쓰기**: 시, 산문, 일기 등 자유로운 형태의 글쓰기

### 🔍 둘러보기

- **최신순/인기순 정렬**: 다양한 방식으로 글 탐색
- **키워드 검색**: 특정 키워드로 작성된 글들 검색
- **좋아요/댓글**: 글에 대한 반응과 소통

### 👤 사용자 기능

- **소셜 로그인**: 카카오, 구글 계정으로 간편 로그인
- **프로필 관리**: 개인 프로필 및 작성한 글 관리
- **비밀번호 재설정**: 안전한 계정 관리

### 📱 모바일 최적화

- **PWA 지원**: 앱처럼 설치하여 사용 가능
- **반응형 디자인**: 모바일 퍼스트 UI/UX
- **하단 네비게이션**: 직관적인 앱 스타일 내비게이션

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4, Custom CSS
- **State Management**: React Hooks
- **PWA**: next-pwa

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Next.js built-in bundler

## 🚀 설치 및 실행

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd dansi_front

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── components/         # 공통 컴포넌트
│   │   └── BottomNavigation.tsx
│   ├── explore/           # 둘러보기 페이지
│   ├── login/             # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   ├── main/              # 메인 페이지
│   ├── profile/           # 프로필 페이지
│   ├── write/             # 글쓰기 페이지
│   ├── forgot-password/   # 비밀번호 재설정
│   ├── globals.css        # 전역 스타일
│   └── layout.tsx         # 루트 레이아웃
├── public/                # 정적 파일
│   ├── icons/            # PWA 아이콘
│   ├── login/            # 로그인 관련 이미지
│   ├── manifest.json     # PWA 매니페스트
│   └── sw.js            # 서비스 워커
└── types/                # TypeScript 타입 정의
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: `#735030` (따뜻한 브라운)
- **Secondary**: `#2E2014` (다크 브라운)
- **Background**: `#FDFCFC` (크림 화이트)
- **Text**: `#4A4A4A` (소프트 그레이)

### 폰트

- **Main Font**: Sunflower (Google Fonts)
- **Weights**: 300 (Light), 500 (Medium), 700 (Bold)

## 📱 PWA 기능

단시 공방은 Progressive Web App으로 제작되어 다음 기능을 지원합니다:

- **오프라인 지원**: 네트워크 연결 없이도 기본 기능 사용 가능
- **홈 스크린 추가**: 모바일 기기에 앱처럼 설치 가능
- **푸시 알림**: 새로운 소식과 업데이트 알림 (예정)
- **빠른 로딩**: 서비스 워커를 통한 캐싱으로 빠른 앱 실행

## 🔄 스크롤 최적화

모바일 환경에서의 최적화된 스크롤 경험을 제공합니다:

- **동적 뷰포트 높이**: 모바일 브라우저 주소창 변화에 대응
- **부드러운 스크롤**: 뷰포트 비율 기반 스크롤 트리거
- **성능 최적화**: 스크롤 이벤트 throttling 적용

## 🌟 주요 페이지

### 메인 페이지 (`/main`)

- 오늘의 키워드 표시
- 동적 키워드 변경 애니메이션
- 스크롤 기반 "건네는 글감" 섹션
- 키워드 그리드 탐색

### 둘러보기 (`/explore`)

- 전체 글 목록 조회
- 키워드별 필터링
- 최신순/인기순 정렬
- 검색 기능

### 글쓰기 (`/write`)

- 키워드 기반 글쓰기
- 자유로운 텍스트 작성
- 실시간 미리보기

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 언제든지 연락주세요.

---

**단시 공방**에서 당신만의 감성적인 순간을 글로 남겨보세요. ✨

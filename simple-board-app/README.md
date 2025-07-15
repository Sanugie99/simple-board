# Simple Board App

React로 구현된 간단한 게시판 애플리케이션입니다.

## 주요 기능

### 인증 시스템
- **로그인**: 2단계 검증 (아이디 확인 → 비밀번호 확인)
- **회원가입**: 아이디/이메일 중복 확인, 비밀번호 검증
- **마이페이지**: 사용자 정보 조회 및 수정

### 게시판 기능
- **게시글 목록**: 카테고리별 필터링, 조회수/댓글수/스크랩수 표시
- **게시글 작성**: 카테고리 선택, 제목/내용 입력, 파일 첨부 (Base64 인코딩)
- **게시글 상세**: 내용 조회, 첨부파일 다운로드, 댓글 표시, 스크랩 기능
- **파일 업로드**: 다중 파일 선택, 크기/타입 검증, Base64 변환

### 사용자 관리
- **프로필 조회**: 사용자 정보 표시
- **정보 수정**: 이름, 이메일, 비밀번호 변경
- **회원 탈퇴**: 계정 삭제 기능

## 기술 스택

- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios 1.10.0
- **Styling**: CSS3 (반응형 디자인)
- **State Management**: React Context API

## 프로젝트 구조

```
src/
├── api/                    # API 함수들
│   ├── authApi.js         # 인증 관련 API
│   ├── postApi.js         # 게시글 관련 API
│   ├── userApi.js         # 사용자 관련 API
│   └── fileApi.js         # 파일 업로드 관련 API
├── config/                # 설정 파일들
│   ├── apiConfig.js       # API 설정
│   └── environment.js     # 환경 설정
├── components/            # React 컴포넌트들
│   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── LoginForm.js
│   │   └── SignupForm.js
│   ├── common/           # 공통 컴포넌트
│   │   ├── Header.js
│   │   ├── FileUploader.js
│   │   ├── LoadingSpinner.js
│   │   └── ErrorMessage.js
│   ├── mypage/           # 마이페이지 컴포넌트
│   │   ├── ProfileView.js
│   │   └── ProfileEditForm.js
│   └── posts/            # 게시글 관련 컴포넌트
│       ├── PostList.js
│       ├── PostDetail.js
│       └── PostForm.js
├── contexts/             # React Context
│   └── AuthContext.js    # 인증 상태 관리
├── hooks/                # 커스텀 훅들
│   ├── useForm.js        # 폼 상태 관리 훅
│   └── useAsync.js       # 비동기 작업 관리 훅
├── pages/                # 페이지 컴포넌트들
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── MainPage.js
│   ├── CreatePostPage.js
│   ├── PostDetailPage.js
│   └── MyPage.js
├── utils/                # 유틸리티 함수들
│   ├── fileUtils.js      # 파일 처리 유틸리티
│   ├── validationUtils.js # 입력 검증 유틸리티
│   └── commonUtils.js    # 공통 유틸리티 함수들
├── App.js                # 메인 앱 컴포넌트
└── index.js              # 앱 진입점
```

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

애플리케이션이 `http://localhost:3000`에서 실행됩니다.

### 3. Mock 데이터로 테스트

현재 애플리케이션은 Mock 데이터를 사용하여 백엔드 없이도 모든 기능을 테스트할 수 있습니다.

#### 테스트 계정
- **아이디**: `testuser1`, **비밀번호**: `Test123!@#`
- **아이디**: `testuser2`, **비밀번호**: `Test123!@#`

#### 테스트 가능한 기능들
- ✅ 로그인/회원가입 (Mock API)
- ✅ 게시글 목록 조회 및 카테고리 필터링
- ✅ 게시글 상세 조회 (댓글, 첨부파일 포함)
- ✅ 게시글 작성 (파일 업로드 포함)
- ✅ 스크랩 기능
- ✅ 마이페이지 (사용자 정보 조회/수정)
- ✅ 파일 업로드 및 다운로드

#### Mock 데이터에서 실제 API로 전환
`src/api/` 폴더의 각 파일에서 `USE_MOCK_API = false`로 변경하면 실제 백엔드 API를 사용합니다.

### 4. 빌드
```bash
npm run build
```

## 환경 설정

### API URL 설정
애플리케이션의 API URL은 `src/config/` 폴더의 설정 파일들을 통해 중앙 집중식으로 관리됩니다.

#### 개발 환경
- 기본 API URL: `http://localhost:10000/api`
- 설정 파일: `src/config/environment.js`

#### 프로덕션 환경
환경 변수를 통해 API URL을 설정할 수 있습니다:
```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

#### 설정 파일 구조
- `src/config/environment.js`: 환경별 설정 관리
- `src/config/apiConfig.js`: API 관련 설정 (environment.js 사용)

모든 API 파일(`src/api/` 폴더)에서는 `API_BASE_URL`을 import하여 사용하므로, URL 변경 시 설정 파일만 수정하면 됩니다.

## API 엔드포인트

### 인증 API
- `POST /api/auth/check-id` - 아이디 확인
- `POST /api/auth/check-password` - 비밀번호 확인
- `POST /api/auth/login` - 로그인
- `POST /api/auth/check-email` - 이메일 중복 확인
- `POST /api/auth/signup` - 회원가입

### 게시글 API
- `GET /api/posts` - 게시글 목록 조회
- `GET /api/posts/category/:category` - 카테고리별 게시글 조회
- `POST /api/posts/:postId` - 게시글 상세 조회
- `POST /api/posts` - 게시글 작성
- `POST /api/posts/:postId/scrap` - 스크랩 토글

### 사용자 API
- `POST /api/user/info` - 사용자 정보 조회
- `PUT /api/user/update` - 사용자 정보 수정
- `DELETE /api/user/delete` - 회원 탈퇴

## 주요 기능 설명

### 코드 구조 개선
프로젝트의 중복 코드를 제거하고 중앙 집중식으로 관리하기 위해 다음과 같은 개선사항을 적용했습니다:

#### 커스텀 훅 (Custom Hooks)
- **`useForm`**: 폼 상태 관리 (입력값, 에러, 로딩 상태)
- **`useAsync`**: 비동기 작업 관리 (로딩, 에러 처리)

#### 공통 컴포넌트
- **`LoadingSpinner`**: 로딩 상태 표시
- **`ErrorMessage`**: 에러 메시지 표시 및 재시도 기능

#### 공통 유틸리티
- **`commonUtils`**: 날짜 포맷팅, 카테고리 색상, 게시글 정렬 등
- **`storage`**: 로컬 스토리지 관리

### 로그인 프로세스
1. 사용자가 아이디 입력
2. 아이디 존재 여부 확인 API 호출
3. 아이디가 존재하면 비밀번호 입력 필드 표시
4. 비밀번호 입력 후 검증 API 호출
5. 성공 시 로그인 처리 및 메인 페이지로 이동

### 회원가입 프로세스
1. 사용자가 아이디, 이메일, 비밀번호, 이름 입력
2. 아이디/이메일 중복 확인 버튼으로 개별 검증
3. 모든 필드 검증 통과 후 회원가입 API 호출
4. 성공 시 로그인 페이지로 이동

### 파일 업로드
- 최대 5개 파일, 각 5MB 이하
- 지원 형식: 이미지(jpg, png, gif), PDF, 문서(doc, docx), 텍스트(txt)
- Base64 인코딩으로 변환하여 서버 전송

### 입력 검증
- **아이디**: 4-20자, 영문+숫자
- **비밀번호**: 8자 이상, 영문+숫자+특수문자
- **이름**: 2-10자, 한글+영문
- **이메일**: 표준 이메일 형식
- **제목**: 1-100자
- **내용**: 1-10000자

## 라우팅 구조

- `/` - 메인 페이지 (게시글 목록)
- `/login` - 로그인 페이지
- `/signup` - 회원가입 페이지
- `/create-post` - 게시글 작성 페이지 (인증 필요)
- `/post/:postId` - 게시글 상세 페이지
- `/mypage` - 마이페이지 (인증 필요)
- `/mypage/edit` - 정보 수정 페이지 (인증 필요)

## 보안 기능

- **라우트 보호**: 인증이 필요한 페이지는 자동으로 로그인 페이지로 리다이렉트
- **세션 관리**: 로컬 스토리지를 통한 사용자 정보 저장
- **입력 검증**: 클라이언트/서버 양쪽에서 입력 데이터 검증
- **파일 검증**: 업로드 파일의 크기와 타입 검증

## 반응형 디자인

모든 컴포넌트는 모바일, 태블릿, 데스크톱 환경에 최적화되어 있습니다.

## 개발 환경

- Node.js 16+
- npm 8+
- React 19.1.0
- React Router DOM 7.6.3

## 라이선스

MIT License

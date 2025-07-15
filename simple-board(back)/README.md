# Simple Board Backend

Spring Boot 기반의 게시판 백엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Spring Boot 3.5.3
- **Language**: Java 17
- **Database**: H2 (개발용) / MySQL (배포용)
- **Security**: Spring Security + JWT
- **Build Tool**: Gradle
- **Cloud**: AWS (EC2, RDS, S3)

## 주요 기능

### 1. 사용자 관리
- 회원가입 / 로그인
- JWT 기반 인증/인가
- ID/PW 찾기 (이메일 발송)
- 사용자 정보 조회/수정
- 회원탈퇴

### 2. 게시판 기능
- Dev 게시판 (WYSIWYG 에디터 지원)
- 게시글 CRUD
- 카테고리별 게시글 조회
- 게시글 검색
- 조회수 증가
- 스크랩 기능

### 3. 파일 업로드
- AWS S3 파일 업로드
- 이미지/문서 첨부 지원

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/check-id` - 아이디 중복 확인
- `POST /api/auth/check-email` - 이메일 중복 확인
- `POST /api/auth/find-id` - 아이디 찾기
- `POST /api/auth/find-password` - 비밀번호 찾기

### 사용자 (User)
- `POST /api/user/info` - 사용자 정보 조회
- `PUT /api/user/update` - 사용자 정보 수정
- `DELETE /api/user/delete` - 회원탈퇴

### 게시글 (Post)
- `GET /api/posts` - 게시글 목록 조회
- `GET /api/posts/search` - 게시글 검색
- `POST /api/posts/{postId}` - 게시글 상세 조회
- `POST /api/posts` - 게시글 작성
- `PUT /api/posts/{postId}` - 게시글 수정
- `DELETE /api/posts/{postId}` - 게시글 삭제
- `POST /api/posts/{postId}/scrap` - 스크랩 토글
- `GET /api/posts/scrapped` - 스크랩한 게시글 목록

### 파일 (File)
- `POST /api/files/upload` - 파일 업로드
- `DELETE /api/files/delete` - 파일 삭제

## 개발 환경 설정

### 1. 필수 요구사항
- Java 17
- Gradle 7.x 이상
- H2 Database (개발용)

### 2. 환경 변수 설정
`application.yml` 파일에서 다음 설정을 수정하세요:

```yaml
# JWT 설정
jwt:
  secret: your-secret-key-here-make-it-long-and-secure-for-production

# AWS S3 설정
cloud:
  aws:
    credentials:
      access-key: your-access-key
      secret-key: your-secret-key
    s3:
      bucket: your-bucket-name

# 이메일 설정
spring:
  mail:
    username: your-email@gmail.com
    password: your-app-password
```

### 3. 실행 방법

```bash
# 프로젝트 빌드
./gradlew build

# 애플리케이션 실행
./gradlew bootRun
```

애플리케이션이 실행되면 다음 URL에서 접근할 수 있습니다:
- API 서버: http://localhost:10000/api
- H2 콘솔: http://localhost:10000/api/h2-console

## 배포 환경 설정

### 1. MySQL 설정
배포 시에는 MySQL을 사용합니다. `application-mysql.yml` 파일을 참조하세요.

### 2. AWS 배포
AWS 배포를 위한 스크립트가 포함되어 있습니다:

```bash
# 배포 스크립트 실행
chmod +x deploy.sh
./deploy.sh
```

### 3. AWS 서비스 구성
- **EC2**: Spring Boot 애플리케이션 호스팅
- **RDS**: MySQL 데이터베이스
- **S3**: 파일 저장소
- **ECR**: Docker 이미지 저장소
- **ECS**: 컨테이너 오케스트레이션

## 데이터베이스 스키마

### Users 테이블
- id (PK)
- user_id (UK)
- password
- email (UK)
- name
- role
- created_at
- updated_at

### Posts 테이블
- id (PK)
- title
- content
- user_id (FK)
- category
- view_count
- created_at
- updated_at

### Comments 테이블
- id (PK)
- content
- post_id (FK)
- user_id (FK)
- created_at
- updated_at

### Scraps 테이블
- id (PK)
- post_id (FK)
- user_id (FK)
- created_at

### Post_Files 테이블
- id (PK)
- original_file_name
- stored_file_name
- file_url
- file_size
- content_type
- post_id (FK)
- created_at

## 개발 가이드

### 1. 코드 구조
```
src/main/java/com/korea/simple_board/
├── config/          # 설정 클래스
├── controller/      # REST API 컨트롤러
├── dto/            # 데이터 전송 객체
├── entity/         # JPA 엔티티
├── repository/     # 데이터 접근 계층
├── service/        # 비즈니스 로직
└── security/       # 보안 관련 클래스
```

### 2. 테스트
```bash
# 단위 테스트 실행
./gradlew test

# 통합 테스트 실행
./gradlew integrationTest
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 
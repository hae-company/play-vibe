# hae.company Lab

> 쓸데없지만 진지하게, AI와 만든 실험들

취미 프로젝트를 모아 보여주는 한국어 포트폴리오 사이트입니다. 프로젝트 등록/관리는 어드민 페이지에서, 데이터는 Upstash Redis에서 관리합니다.

**Live:** [https://play-vibe-five.vercel.app](https://play-vibe-five.vercel.app)

---

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Database | Upstash Redis (REST API) |
| Deployment | Vercel |
| Theme | next-themes (다크모드 지원) |
| Font | Geist Sans / Geist Mono |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # 홈 - 프로젝트 목록 (검색, 카테고리 필터, 무한스크롤)
│   ├── admin/page.tsx        # 어드민 - 프로젝트 CRUD (비밀번호 인증)
│   ├── layout.tsx            # 루트 레이아웃 (ThemeProvider, 폰트)
│   ├── globals.css           # 글로벌 스타일, CSS 변수
│   └── api/
│       ├── projects/route.ts # GET/POST/PUT/DELETE - 프로젝트 CRUD
│       ├── likes/route.ts    # POST - 좋아요 일괄 조회
│       ├── likes/[id]/route.ts # GET/POST - 개별 좋아요 조회/토글
│       ├── meta/route.ts     # POST - URL 메타정보 자동 수집 (Microlink)
│       └── health/route.ts   # GET - 외부 URL 상태 체크
├── components/
│   ├── project-card.tsx      # 프로젝트 카드 컴포넌트
│   ├── like-button.tsx       # 좋아요 버튼
│   ├── tag-filter.tsx        # 카테고리 필터 탭
│   ├── auto-thumbnail.tsx    # 자동 썸네일
│   ├── health-badge.tsx      # URL 상태 뱃지
│   ├── theme-provider.tsx    # next-themes 래퍼
│   ├── theme-toggle.tsx      # 다크모드 토글
│   └── ui/                   # shadcn/ui 컴포넌트
├── data/
│   └── projects.ts           # Project 타입 정의, 카테고리 목록
└── lib/
    └── redis.ts              # Upstash Redis 클라이언트
```

### Data Flow

```
[홈페이지]                    [어드민]
    │                            │
    │ GET /api/projects          │ POST/PUT/DELETE /api/projects
    │                            │ (x-admin-password 헤더 인증)
    ▼                            ▼
┌─────────────────────────────────────┐
│          Upstash Redis              │
│                                     │
│  "projects"    → Project[] (JSON)   │
│  "likes:{id}"  → number (좋아요 수) │
└─────────────────────────────────────┘
```

- **홈페이지**: `/api/projects`에서 전체 목록을 가져와 `published: true`인 것만 클라이언트에서 필터링
- **어드민**: `x-admin-password` 헤더로 인증 후 프로젝트 추가/수정/삭제
- **좋아요**: Redis `INCR`/`DECR`로 카운트, 클라이언트 localStorage로 중복 방지
- **메타 자동채우기**: URL 입력 시 Microlink API로 제목/설명 자동 수집

---

## Getting Started

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성:

```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
ADMIN_PASSWORD=your-admin-password
```

> Upstash Redis는 [Upstash Console](https://console.upstash.com)에서 무료로 생성할 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 4. 프로젝트 등록

[http://localhost:3000/admin](http://localhost:3000/admin)에서 비밀번호 입력 후 프로젝트를 추가하세요.

---

## Available Scripts

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |

---

## API Endpoints

### Projects

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/projects` | 전체 프로젝트 목록 조회 | - |
| POST | `/api/projects` | 프로젝트 추가 | `x-admin-password` |
| PUT | `/api/projects` | 프로젝트 수정 | `x-admin-password` |
| DELETE | `/api/projects` | 프로젝트 삭제 | `x-admin-password` |

### Likes

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/likes` | 여러 프로젝트 좋아요 수 일괄 조회 |
| GET | `/api/likes/[id]` | 개별 프로젝트 좋아요 수 조회 |
| POST | `/api/likes/[id]` | 좋아요 토글 (`{ action: "like" | "unlike" }`) |

### Utilities

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/meta` | URL 메타정보 수집 (제목, 설명, 이미지) |
| GET | `/api/health?url=...` | 외부 URL 상태 체크 (up/down) |

---

## Deployment (Vercel)

### 1. GitHub 레포 연결

Vercel 대시보드에서 **Add New Project** → GitHub 레포 `hae-company/play-vibe` 선택

### 2. 환경변수 설정

**Settings > Environment Variables**에 3개 추가:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_PASSWORD`

> 또는 Vercel Marketplace에서 **Upstash Redis**를 추가하면 Redis 관련 환경변수가 자동 연결됩니다.

### 3. 배포

`main` 브랜치에 푸시하면 자동으로 프로덕션 배포됩니다.

---

## Project Categories

| 카테고리 | 설명 |
|----------|------|
| 시뮬레이터 | 현실의 무언가를 웹으로 재현 |
| 쓸데없는 도구 | 쓸모는 없지만 만들어야 했던 것들 |
| 미니게임 | 간단한 웹 게임 |
| AI 실험 | AI API를 활용한 실험적 프로젝트 |
| 감성/힐링 | 감성적이거나 힐링되는 경험 |
| 기타 | 위 카테고리에 속하지 않는 것들 |

---

Built with vibe coding

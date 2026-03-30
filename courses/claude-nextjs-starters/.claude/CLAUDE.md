# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui로 구성된 **프로덕션 레디 웹 스타터킷**.
어떤 웹 프로젝트도 즉시 시작할 수 있도록 설계된 완전한 보일러플레이트.

## 기술 스택

| 항목 | 버전 | 설정 |
|---|---|---|
| **Next.js** | 16.2.1 | App Router (Turbopack 기본 활성화) |
| **React** | 19.2.4 | Server Components 우선 |
| **TypeScript** | 5 | Strict mode, 전체 코드 커버리지 |
| **Tailwind CSS** | v4 | PostCSS 방식 (config 파일 없음, CSS-first) |
| **shadcn/ui** | 16개 컴포넌트 | RSC 호환, Radix UI 기반 |
| **Styling** | clsx + tailwind-merge | `cn()` 유틸리티로 클래스 병합 |
| **Form Validation** | react-hook-form + zod | 성능 최적화된 폼 검증 |
| **Theme** | next-themes | 다크/라이트 모드, 시스템 연동 |
| **Icons** | lucide-react | Tree-shakeable 아이콘 |
| **Toast** | sonner | 알림/토스트 UI |
| **Hooks** | usehooks-ts | 검증된 커스텀 훅 모음 |

## 라우팅 구조 (Route Groups)

```
app/
├── (marketing)/          # 공개 페이지 레이아웃: Header + Footer
│   ├── layout.tsx
│   └── page.tsx          # 랜딩 페이지 (/, /404 아님)
│
├── (dashboard)/          # 앱 내부 레이아웃: Sidebar + Header
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx      # 대시보드 메인
│
├── layout.tsx            # Root Layout: ThemeProvider + Toaster
├── not-found.tsx         # 404 전역 처리
├── error.tsx             # 에러 바운더리 (use client)
└── globals.css           # Tailwind v4 + shadcn CSS 변수
```

**Route Groups 특성:**
- `(folderName)` 문법은 URL에 포함되지 않음 (마케팅 vs 대시보드 레이아웃 분기)
- 같은 URL로 해결되는 경로 충돌 불가
- 다른 Root Layout 간 라우팅 시 full page reload 발생 (설계상 의도)

## 컴포넌트 계층

### Tier 1: shadcn/ui (직접 설치, 직접 작성 금지)
16개 컴포넌트가 `components/ui/`에 설치됨:
- **기본**: Button, Input, Label, Badge, Avatar, Separator, Skeleton, Switch, Checkbox
- **고급**: Card, Alert, Dialog, Sheet, Dropdown Menu, Tabs, Tooltip, Sonner

shadcn CLI로 추가/업데이트:
```bash
npx shadcn@latest add <component-name>
```

### Tier 2: 레이아웃 컴포넌트 (직접 개발)
`components/layout/`에 위치:
- **Header** (`header.tsx`) — 로고 + 네비게이션 + ThemeToggle, `useMediaQuery`로 반응형
- **Sidebar** (`sidebar.tsx`) — `useLocalStorage`로 열림/닫힘 상태 저장, 반응형 접힘
- **Footer** (`footer.tsx`) — 저작권, 링크
- **PageHeader** (`page-header.tsx`) — 페이지 제목 + 설명 + 우측 액션 슬롯

### Tier 3: 테마 및 컨텍스트
- **ThemeProvider** (`components/theme-provider.tsx`) — next-themes 래퍼 (`"use client"`)
- **ThemeToggle** (`components/theme-toggle.tsx`) — Sun/Moon 아이콘 토글 (`"use client"`)

## 스타일링 및 다크모드

### Tailwind v4 (CSS-first)
- `tailwind.config.js` 파일 없음 (v4 방식)
- `app/globals.css`에서 `@import "tailwindcss"` + `@theme inline` 사용
- shadcn 색상 변수: HSL 채널값 (`:root` 라이트, `.dark` 다크모드)
- `@layer` 지시어로 전역 스타일 적용

### 다크모드 전환
```tsx
// next-themes 제공
const { theme, setTheme } = useTheme()
setTheme(theme === 'dark' ? 'light' : 'dark')
```
- `class` attribute 기반 (`.dark` 클래스)
- 시스템 설정 자동 감지 (`enableSystem: true`)
- 새로고침 후에도 선택 유지 (localStorage)

## 핵심 유틸리티

### `lib/utils.ts` — `cn()` 함수
```tsx
import { cn } from '@/lib/utils'

// clsx + tailwind-merge 조합
<Button className={cn('px-4', condition && 'bg-primary')} />
```

## usehooks-ts 활용

모든 훅은 **직접 작성하지 말고 usehooks-ts 라이브러리 사용**:

| 훅 | 사용 예 |
|---|---|
| `useLocalStorage` | Sidebar 열림/닫힘 상태 저장 |
| `useMediaQuery` | Header/Sidebar 반응형 분기 (`md` 브레이크포인트) |
| `useOnClickOutside` | Sidebar 외부 클릭 시 닫기 (모바일) |
| `useCopyToClipboard` | 코드 스니펫 복사 버튼 |
| `useDebounceValue` | 검색 Input 디바운싱 |
| `useTheme` | next-themes 테마 제어 |

```tsx
import { useLocalStorage, useMediaQuery } from 'usehooks-ts'

const [isOpen, setIsOpen] = useLocalStorage('sidebar-open', true)
const isMobile = !useMediaQuery('(min-width: 768px)')
```

## 폼 검증 (react-hook-form + zod)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})

export function Form() {
  const form = useForm({ resolver: zodResolver(schema) })
  // ...
}
```

## 개발 워크플로우

### 기본 명령어

```bash
# 개발 서버 시작 (Turbopack 기본, localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 실행
npm run start

# 코드 린트 검사 (ESLint)
npm run lint
```

### shadcn/ui 컴포넌트 관리

```bash
# 새 컴포넌트 추가 (components/ui/에 자동 생성)
npx shadcn@latest add <component-name>

# 예시
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu

# shadcn 설정 초기화 (필요시)
npx shadcn@latest init
```

### Playwright 브라우저 테스트

```bash
# 개선된 E2E 테스트 실행 (Chrome 브라우저 자동화)
node test-dashboard-improved.js

# 테스트 결과 확인
# - test-screenshots/ 디렉토리에 스크린샷 저장
# - 콘솔에 9단계 테스트 결과 출력
# - FINAL_REPORT.txt 또는 PLAYWRIGHT_TEST_REPORT.md 참고
```

### 패키지 및 의존성

```bash
# 새 패키지 설치
npm install <package-name>

# 개발 패키지 설치
npm install --save-dev <package-name>

# 의존성 업데이트
npm update

# 패키지 목록 확인
npm list
```

## 대시보드 페이지 구조

### 구현된 페이지

1. **메인 대시보드** (`/dashboard`)
   - 4개 통계 카드: 사용자, 매출, 활성 세션, 전환율
   - 3개 탭: 개요, 분석, 보고서
   - `useDebounceValue` 훅으로 검색 디바운싱 구현
   - 로딩 상태 표시 (Skeleton 컴포넌트)

2. **분석 페이지** (`/analytics`)
   - 4개 메트릭 카드: DAU, 월간 수익, 전환율, 이탈율
   - 3개 탭: 개요, 트래픽, 전환
   - 월별 데이터 테이블
   - 트래픽 소스 및 전환 단계 시각화 (아직 차트 미구현)

3. **설정 페이지** (`/settings`)
   - 3개 탭: 일반, 알림, 보안
   - **일반 설정**: 사이트명, 관리자 이메일, 시간대
   - **알림 설정**: Switch 토글 (이메일, 푸시, 주간 보고서)
   - **보안 설정**: 비밀번호, 2단계 인증, 세션 관리 버튼

### 라우팅 패턴
모든 대시보드 페이지는 `(dashboard)` Route Group 내에 위치하므로:
- 공통 레이아웃 (`app/(dashboard)/layout.tsx`): Sidebar + Header 적용
- URL에 `(dashboard)` 포함 안 됨 (예: `/dashboard`, `/analytics`, `/settings`)

## Next.js 16 주의사항

**AGENTS.md의 경고**: "This is NOT the Next.js you know"

Breaking changes 전에 항상 문서 확인:
- `node_modules/next/dist/docs/` 디렉토리의 가이드 읽기
- async/await 방식의 params, searchParams (동기 접근 금지)
- Middleware → Proxy로 deprecated
- PPR (experimental.ppr) → cacheComponents로 변경

## 컴포넌트 작성 규칙

### Server Components 우선
```tsx
// ✓ 기본 (서버 컴포넌트)
export function Card() { ... }

// ✓ 필요한 경우만 클라이언트
'use client'
export function ThemeToggle() { ... }
```

### 임포트 경로
```tsx
// ✓ 절대 경로 사용
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ✗ 상대 경로 (금지)
import { Button } from '../button'
```

### 훅 작성 금지
- usehooks-ts 라이브러리에서 제공하는 훅 사용
- 커스텀 훅 직접 작성 금지

### 타입 정의
```tsx
interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}
```

## 파일 구조 빠른 네비게이션

```
app/
  (marketing)/          ← 랜딩 페이지 로직
  (dashboard)/          ← 앱 내부 로직
  layout.tsx            ← 루트 레이아웃 (ThemeProvider)
  not-found.tsx, error.tsx
  globals.css           ← Tailwind v4 설정

components/
  ui/                   ← shadcn 컴포넌트 (수정 금지)
  layout/               ← 커스텀 레이아웃 (Header, Sidebar 등)
  theme-provider.tsx    ← next-themes 래퍼
  theme-toggle.tsx      ← 다크모드 토글

lib/
  utils.ts              ← cn() 유틸리티 (shadcn init 생성)
```

## 자동화 테스트 (Playwright)

### E2E 테스트 스크립트
- **파일**: `test-dashboard-improved.js`
- **목적**: 대시보드 전체 UI 플로우 자동화 테스트
- **브라우저**: Chrome (headless: false로 UI 확인 가능)

### 테스트 단계 (9단계)
1. 홈페이지 접속 (/)
2. 대시보드 메인 접속 (/dashboard)
3. 분석 페이지 접속 (/analytics)
4. 분석 페이지 탭 상호작용
5. 설정 페이지 접속 (/settings)
6. 설정 페이지 탭 상호작용 (알림, 보안)
7. 대시보드 내부 탭 상호작용
8. 사이드바 네비게이션 링크 검증
9. 반응형 디자인 테스트 (모바일 375px, 태블릿 768px)

### 테스트 결과 생성물
- 스크린샷: `test-screenshots/` (11개)
- 보고서: `PLAYWRIGHT_TEST_REPORT.md`
- 요약: `ERROR_ANALYSIS_SUMMARY.md`

### 주요 발견사항
- ✅ 모든 페이지 정상 로드 (200 응답)
- ✅ 모든 탭 상호작용 정상 작동
- ✅ 네비게이션 링크 정상 작동
- ✅ 반응형 디자인 정상 작동

## 환경 설정 파일

### TypeScript (`tsconfig.json`)
- **target**: ES2017
- **module**: ESNext
- **strict**: true (엄격한 타입 검사)
- **경로 매핑**: `@/*` → 절대 경로

### ESLint (`eslint.config.mjs`)
- **설정**: Flat Config (새 형식)
- **확장**: next/core-web-vitals + typescript
- **무시**: .next, out, build 디렉토리

### PostCSS (`postcss.config.mjs`)
- **플러그인**: `@tailwindcss/postcss` (Tailwind CSS v4)

### Tailwind CSS (`app/globals.css`)
- **방식**: CSS-first (config 파일 없음)
- **색상**: HSL 채널값 CSS 변수
- **다크모드**: `.dark` 클래스 기반

### MCP 설정 (`mcp.json`)
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "chrome"]
    }
  }
}
```
- **목적**: Claude Code에서 Playwright를 통한 자동화 테스트
- **브라우저**: Chrome 사용

## 언어 및 커뮤니케이션

- **응답 언어**: 한국어
- **코드 주석**: 한국어
- **커밋 메시지**: 한국어
- **변수/함수명**: 영어 (코드 표준)

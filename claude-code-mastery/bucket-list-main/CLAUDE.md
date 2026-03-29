# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

**버킷 리스트** (Bucket List) 는 사용자의 인생 목표를 기록하고 추적하는 웹 애플리케이션입니다. 프레임워크 없이 순수 HTML, CSS, JavaScript로 만들어졌으며 LocalStorage를 통해 데이터를 브라우저에 저장합니다.

## 아키텍처

### 핵심 설계 원칙

- **모듈화 분리**: 데이터 관리(Storage)와 UI 로직(App)을 명확히 분리
- **클래스 기반**: `BucketListApp` 클래스로 모든 UI 로직을 캡슐화
- **단일 책임**: 각 모듈이 명확한 책임을 가짐
- **이벤트 위임**: DOM 조작은 최소화하고 이벤트로 상태 관리

### 주요 모듈

**1. BucketStorage (js/storage.js)**
- LocalStorage를 통한 CRUD 작업 수행
- 모든 데이터 변경은 이 모듈을 거쳐야 함
- 주요 메서드:
  - `load()` - 모든 항목 로드
  - `addItem(title)` - 새 항목 추가
  - `updateItem(id, newTitle)` - 항목 수정
  - `deleteItem(id)` - 항목 삭제
  - `toggleComplete(id)` - 완료 상태 토글
  - `getStats()` - 통계 정보 반환
  - `getFilteredList(filter)` - 필터링된 리스트 반환

**2. BucketListApp (js/app.js)**
- UI 렌더링과 사용자 상호작용 담당
- 앱 상태 관리:
  - `currentFilter` - 현재 필터 상태 ('all', 'active', 'completed')
  - `editingId` - 현재 수정 중인 항목 ID
  - `editModal` 등의 DOM 요소 캐시
- 주요 메서드:
  - `init()` - 초기화 (DOM 캐싱, 이벤트 바인딩)
  - `render()` - 전체 화면 리렌더링
  - `handleAdd()`, `handleFilter()`, `handleToggle()` 등 - 이벤트 핸들러

### 데이터 흐름

```
사용자 액션 → 이벤트 핸들러 → BucketStorage 메서드 호출 → render() → 화면 업데이트
```

## 핵심 파일 위치

| 파일 | 용도 |
|------|------|
| `index.html` | 메인 HTML 구조 및 Tailwind CSS CDN 연결 |
| `js/storage.js` | LocalStorage를 통한 데이터 관리 |
| `js/app.js` | UI 로직 및 사용자 상호작용 처리 |
| `css/styles.css` | Tailwind CSS를 보완하는 커스텀 스타일 |

## 개발 명령어

### 로컬 개발 서버 실행

**Python 3.x 사용:**
```bash
python -m http.server 8000
# http://localhost:8000 에서 접속
```

**Python 2.x 사용:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js http-server 사용:**
```bash
npx http-server
# http://localhost:8080 에서 접속
```

### VS Code Live Server
1. Live Server 확장 설치
2. `index.html` 우클릭 → "Open with Live Server"

## 코드 패턴

### 새로운 기능 추가 흐름

1. **데이터 작업이 필요한 경우** → `BucketStorage`에 메서드 추가
2. **UI/이벤트 처리 필요** → `BucketListApp`에 핸들러 메서드 추가
3. **스타일링** → `css/styles.css`에 추가 (가능하면 Tailwind 클래스 우선)

### HTML 생성 패턴

`BucketListApp.createBucketItemHTML(item)` 메서드에서 항목을 HTML 문자열로 생성합니다.
- `escapeHtml()` 메서드로 XSS 방지
- 인라인 onclick 핸들러 사용 (간단한 규모의 앱이므로 적절)

### 상태 관리

- 진정한 상태는 LocalStorage에만 존재
- `BucketListApp` 인스턴스 변수는 UI 상태만 관리 (현재 필터, 수정 중인 ID)
- 모든 변경 후 `render()`를 호출하여 UI 동기화

## 주요 구현 세부사항

### 필터링 시스템
- `getFilteredList(filter)` 메서드가 세 가지 필터 지원:
  - `'all'` - 모든 항목
  - `'active'` - 미완료 항목만
  - `'completed'` - 완료된 항목만

### 통계 계산
- `getStats()`에서 총 개수, 완료 개수, 진행 중 개수, 달성률을 계산
- 모든 렌더링 시 `updateStats()`로 통계 업데이트

### 로컬스토리지 데이터 구조
```javascript
{
  id: "1730880000000",           // 타임스탬프 기반 고유 ID
  title: "세계 일주하기",         // 항목 제목
  completed: false,               // 완료 여부
  createdAt: "2025-11-06T...",   // ISO 형식 생성일
  completedAt: null               // 완료 시에만 설정
}
```

## 스타일링 구조

- **프레임워크**: Tailwind CSS (CDN)
- **커스텀 스타일**: `css/styles.css`에서:
  - 필터 버튼 스타일 (`.filter-btn` 클래스)
  - 애니메이션 (`slideIn`, `fadeIn`, `scaleIn`)
  - 다크 모드 지원 (`prefers-color-scheme: dark`)
  - 반응형 스타일 (모바일: 640px 이하)

## 테스트 및 디버깅

- 브라우저 DevTools 콘솔에서 `app` 객체로 접근 가능
- LocalStorage 확인: `localStorage.getItem('bucketList')` (콘솔에서)
- 데이터 초기화: `localStorage.removeItem('bucketList')`
- `BucketStorage` 메서드는 모두 `console.error()`로 에러 로깅

## 브라우저 호환성

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- LocalStorage를 지원하는 모든 모던 브라우저

## 확장 시 고려사항

### 새 기능 추가 시
- 데이터 구조 변경이 필요하면 마이그레이션 로직 추가 필요 (LocalStorage는 지속적임)
- 필터링 추가 시 `getFilteredList()`와 필터 버튼 모두 업데이트 필요

### 성능 최적화
- 현재 규모(수백 개 항목)에서는 전체 리렌더링이 충분히 빠름
- 매우 많은 항목의 경우 가상 스크롤링 고려
- 대규모 데이터는 IndexedDB로 마이그레이션 고려

### 코드 품질
- 모든 DOM 요소는 `cacheElements()`에서 한 번에 캐시
- HTML 이스케프는 `escapeHtml()` 메서드로 일관되게 처리
- 에러 처리는 `BucketStorage`의 try-catch 패턴 따르기

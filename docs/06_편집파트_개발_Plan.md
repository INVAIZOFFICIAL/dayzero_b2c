# Implementation Plan — 편집(Editing) 파트

| 항목 | 내용 |
|---|---|
| 작성일 | 2026-03-10 |
| 대상 화면 | ED-01 · ED-01a · ED-02 · ED-02a · ED-02b · ED-02c |
| 기술 스택 | React · TypeScript · Zustand · Lucide React · Design Tokens |
| 전제 | 실제 API 없음, MOCK 데이터 기반, UT 프로토타입 |

---

## 의존성 흐름

```
┌─────────────────────────────────────────────────────┐
│  Step 1 · 기반 작업 (타입 · Mock · Store)            │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  Step 2     │         │  Step 4     │
│  ED-01 목록 │         │  ED-02 틀   │
└──────┬──────┘         └──────┬──────┘
       │                       │
       ▼               ┌───────┼───────┐
┌─────────────┐        ▼       ▼       ▼
│  Step 3     │   Step 5   Step 6   Step 7
│  ED-01a 번역│   ED-02a   ED-02b   ED-02c
└─────────────┘
```

> Step 2와 Step 4는 Step 1 완료 후 병렬 진행 가능
> Step 5 → Step 6 → Step 7은 순차 진행 (ImageCompareSlider 공용 컴포넌트 의존)

---

## Step 1 · 기반 작업

> **목표** 편집 파트 전체가 공유하는 타입 · Mock · Zustand 스토어를 먼저 확정한다.
> 이 Step 없이는 이후 어떤 Step도 시작할 수 없다.

### 생성/수정 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/types/editing.ts` | 신규 | 편집 파트 전용 타입 |
| `src/mock/editingMock.ts` | 신규 | 48건 MOCK 상품 데이터 |
| `src/store/useEditingStore.ts` | 신규 | 편집 파트 Zustand 스토어 |
| `src/types/sourcing.ts` | 수정 | `SourcedProduct`에 `titleJa?` 필드 추가 |

### 상태 정의 (핵심)

| 상태 | 의미 | Qoo10 등록 가능 여부 |
|---|---|---|
| `translationStatus: 'pending'` | 번역 전 | ❌ |
| `translationStatus: 'processing'` | 번역 진행 중 | ❌ |
| `translationStatus: 'completed'` | **번역 완료** | ✅ **등록 가능** |
| `translationStatus: 'failed'` | 번역 실패 | ❌ |
| `editStatus: 'completed'` | 편집 완료 | 별도 상태 (등록 조건 아님, 선택적) |

> **핵심 원칙**: 번역(상품명 · 상세설명 · 옵션명)만 완료되면 Qoo10 등록 가능.
> 편집 완료는 추가 편집까지 마쳤음을 표시하는 선택적 상태이며, 등록 조건이 아니다.
> 상세페이지 이미지(ED-02c) 번역은 등록 조건에 포함되지 않는다.

### 핵심 타입 (`types/editing.ts`)

```
ProductDetail        상품 상세 (편집 대상 전체 데이터)
  ├─ titleKo / titleJa          한국어 원문 / 일본어 번역본
  ├─ descriptionKo / descriptionJa
  ├─ options[]                  ProductOption (한/일 동시 보유)
  ├─ thumbnails[]               ProductImage (최대 10장)
  ├─ detailImages[]             ProductImage (최대 30장)
  ├─ salePriceJpy               소싱 단계에서 이미 계산된 판매가(JPY) — 읽기 전용
  ├─ qoo10CategoryId            Qoo10 내부 카테고리 ID — 자동 매핑
  ├─ qoo10CategoryPath          Qoo10 카테고리 경로 (표시용) — 자동 매핑
  ├─ editStatus                 'pending' | 'completed'
  └─ translationStatus          'pending' | 'processing' | 'completed' | 'failed'

TranslationJob       번역 작업 단위 (ED-01a 진행 추적용)
  └─ status          'queued' | 'processing' | 'completed' | 'failed'
```

> **카테고리**: Qoo10 내부 카테고리 체계에 소싱 단계에서 자동 매핑됨.
> 편집 화면에서는 매핑 결과를 표시하고, 틀렸을 때만 직접 변경한다.
> AI 추천 없음.

> **가격**: 소싱 단계에서 마진율 · 환율 · 배송비 적용 완료 후 `salePriceJpy`로 저장됨.
> 편집 화면에서는 결과값만 표시 (재계산 UI 없음).

### MOCK 데이터 규모

| 항목 | 값 |
|---|---|
| 전체 상품 수 | 48건 |
| 번역 필요 | 35건 |
| 번역 완료 | 13건 (이 중 편집 완료 표시 8건) |
| 판매가(JPY) | 상품당 MOCK 고정값 (예: 1,980엔 · 2,480엔 등) |
| Qoo10 카테고리 | 상품당 자동 매핑된 카테고리 경로 1개 |

### 완료 체크리스트

- [ ] `types/editing.ts` 컴파일 오류 없음
- [ ] `editingMock.ts` 실행 시 48건 `ProductDetail` 생성
- [ ] `useEditingStore.products` 조회 → 48건 반환
- [ ] `SourcedProduct.titleJa` 추가 후 기존 소싱 코드 오류 없음

---

## Step 2 · ED-01 편집 목록

> **목표** 수집 완료 상품을 리스트로 보여주는 메인 편집 화면.

### 생성/수정 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/pages/editing/EditingListPage.tsx` | 신규 | ED-01 메인 페이지 |
| `src/pages/editing/components/CollectionProgressBanner.tsx` | 신규 | 수집 진행 배너 |
| `src/pages/editing/components/ProductListItem.tsx` | 신규 | 상품 행 |
| `src/pages/editing/components/BulkActionBar.tsx` | 신규 | 하단 액션 바 |
| `src/App.tsx` | 수정 | `/editing`, `/editing/:productId` 라우트 추가 |

### 화면 구조

```
EditingListPage
├─ CollectionProgressBanner       running 상태 job 수만큼 배너 표시
├─ 페이지 헤더 (제목 + 전체 건수)
├─ 탭 바: 전체(48) · 번역 필요(35) · 번역 완료(13)
├─ 검색 인풋 + 소싱처 필터 드롭다운
├─ 전체 선택 체크박스 + 선택 건수 표시
├─ ProductListItem × N
│    체크박스 · 썸네일 · 상품명(일본어 우선) · 소싱처 아이콘 · 가격 · 상태 뱃지
│    → 행 클릭 시 /editing/:id 이동
│    → 번역 중인 행: shimmer 효과
└─ BulkActionBar  (선택 > 0일 때 하단 고정)
     AI 번역하기 · Qoo10 등록 · 삭제
```

### CollectionProgressBanner 동작

```
useSourcingStore.jobs 중 status === 'running' 항목만 렌더링

진행 중: 🔄 올리브영 뷰티 인기상품 수집 중 (32/50건) ████████░░ 64%
완료 시: ✅ 수집 완료 — 48건이 추가되었습니다  [X]
```

> 폴링 없음. MOCK job-1이 running 상태로 고정되어 있으므로 배너 항상 표시.
> 완료 전환은 dismiss 버튼으로 수동 처리 (자동 제거는 실제 API 연동 시 구현).

### 완료 체크리스트

- [ ] `/editing` 접속 → 48건 목록 렌더링
- [ ] 탭 전환 → 건수 정확히 필터링
- [ ] 소싱처 필터 + 키워드 검색 조합 동작
- [ ] 체크박스 선택 → BulkActionBar 표시
- [ ] 전체 선택 ↔ 전체 해제 토글
- [ ] 행 클릭 → `/editing/:id` 이동
- [ ] running job 존재 → CollectionProgressBanner 표시

---

## Step 3 · ED-01a AI 번역 모달

> **목표** "AI 번역하기" 클릭 시 열리는 모달. 번역 항목 선택 → 실행 → 인플레이스 갱신.

### 생성 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/pages/editing/components/TranslationModal.tsx` | 신규 | ED-01a 번역 모달 |

### 모달 내부 흐름

```
[설정 뷰]
  선택된 상품 목록 표시
  번역 항목 체크박스: ☑ 상품명  ☑ 상세설명  ☑ 옵션명  (기본 전체 선택)
  이미 번역된 상품 포함 시: "이미 번역된 N건은 재번역됩니다"
  → "번역 시작" 클릭

      ↓ 모달 내부 뷰 전환

[진행 뷰]
  전체 진행률 바 ── 처리중 N / 완료 N / 실패 N
  상품별 상태:  ⏳ 대기 → 🔄 번역중 → ✅ 완료 / ❌ 실패
  실패 항목 클릭 → 에러 사유 + 재시도 버튼
```

### MOCK 시뮬레이션 규칙

```typescript
// ✅ 올바른 방식 — setTimeout × N (1회성)
products.forEach((p, i) => {
  setTimeout(() => updateTranslationJob(p.id, { status: 'completed' }), i * 800)
})

// ❌ 금지 — setInterval · 재귀 setTimeout (소싱 파트 이중 알림 교훈)
```

번역 완료 시 ED-01 목록의 상품명: **fade-out(한국어) → fade-in(일본어)** 전환

### 완료 체크리스트

- [ ] "AI 번역하기" 클릭 → 모달 열림
- [ ] 번역 항목 체크박스 선택/해제 동작
- [ ] "번역 시작" → 상품별 800ms 간격 순차 완료
- [ ] 완료 시 ED-01 목록 상품명이 일본어로 전환
- [ ] fade 애니메이션 확인
- [ ] 모달 닫아도 번역 계속 진행 (모달은 뷰, 작업은 store)

---

## Step 4 · ED-02 상품 편집 컨테이너

> **목표** 편집 상세 페이지의 레이아웃 · 헤더 · 탭 · 저장/등록 버튼.
> 탭 콘텐츠는 Step 5~7에서 채운다.

### 생성 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/pages/editing/EditingDetailPage.tsx` | 신규 | ED-02 컨테이너 |
| `src/pages/editing/components/EditingHeader.tsx` | 신규 | 상단 고정 헤더 |
| `src/pages/editing/components/EditingTabBar.tsx` | 신규 | 탭 바 (3개) |

### 화면 구조

```
EditingDetailPage
├─ EditingHeader (고정)
│    썸네일(40px) · 일본어 상품명 · 상태 뱃지 · 번역 상태 아이콘
│    카테고리 + 최종가(JPY) 요약
│    [목록으로]  [← 이전]  [다음 →]  [편집 완료]  [Qoo10 등록]
├─ EditingTabBar
│    통합 편집 · 썸네일 AI · 상세페이지 AI
└─ 탭 콘텐츠 영역 (Step 5~7)
     자동 저장: debounce 2000ms → "저장됨 ✓ HH:MM"
```

### 버튼 활성화 조건

| 버튼 | 활성 조건 | 비고 |
|---|---|---|
| 편집 완료 토글 | 항상 활성 · 클릭 시 `editStatus` 토글 | 등록 조건 아님, 선택적 상태 표시 |
| Qoo10 등록 | `translationStatus === 'completed'` 일 때만 활성 | 번역만 완료되면 등록 가능 · 비활성 시 "번역을 먼저 완료해주세요" 툴팁 |

### 완료 체크리스트

- [ ] `/editing/prod-1` 접속 → 올바른 상품 정보 렌더링
- [ ] 존재하지 않는 ID → `/editing` redirect
- [ ] 탭 3개 전환 동작
- [ ] 이전/다음 네비게이션 (첫/마지막에서 버튼 비활성)
- [ ] "편집 완료" 토글 → editStatus 변경 + 헤더 뱃지 갱신
- [ ] 번역 미완료 상품에서 "Qoo10 등록" 비활성 + 툴팁 확인
- [ ] 번역 완료 상품에서 "Qoo10 등록" 활성 확인

---

## Step 5 · ED-02a 통합 편집

> **목표** 번역 결과 텍스트 편집 + Qoo10 카테고리 확인/변경 + 가격 표시.

### 생성 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/pages/editing/tabs/BasicEditTab.tsx` | 신규 | ED-02a 탭 |

### 섹션 구성

```
BasicEditTab
├─ 상품명
│    일본어 편집 textarea
│    [원문 보기] 토글 → 한국어 원문 (기본 숨김)
├─ 상세설명
│    일본어 편집 textarea (10,000자 제한 · 글자 수 카운터)
│    [원문 보기] 토글 (기본 숨김)
├─ 옵션명 테이블
│    열: 일본어명 | 한국어 원문 | 재고
│    행 추가 · 삭제 버튼
├─ Qoo10 카테고리
│    자동 매핑된 카테고리 경로 표시 (읽기 전용)
│    [변경] 버튼 → 키워드 검색 모달 (MOCK Qoo10 카테고리 트리)
└─ 판매가
     소싱 단계에서 계산된 salePriceJpy 표시 (읽기 전용)
     예: ¥1,980
```

> **카테고리 변경 모달**: Qoo10 내부 카테고리 체계 기준 키워드 검색 + 결과 선택.
> AI 추천 없음. 자동 매핑 결과가 틀렸을 때만 사용.

### 완료 체크리스트

- [ ] 일본어 상품명 수정 → debounce 2초 후 자동 저장 표시
- [ ] 원문 토글 동작
- [ ] Qoo10 카테고리 자동 매핑 결과 표시
- [ ] [변경] 버튼 → 카테고리 검색 모달 열림/닫힘/선택
- [ ] 판매가(JPY) 읽기 전용 표시

---

## Step 6 · ED-02b 썸네일 AI 설정

> **목표** 썸네일 이미지 정렬 · AI 번역 · 배경제거 · 리사이즈.

### 생성 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/pages/editing/tabs/ThumbnailTab.tsx` | 신규 | ED-02b 탭 |
| `src/pages/editing/components/ImageCompareSlider.tsx` | 신규 | 전후 비교 슬라이더 **(공용)** |

### 기능 목록

| 기능 | MOCK 동작 |
|---|---|
| 갤러리 그리드 (최대 10장) | 첫 번째 이미지에 ⭐ 대표 뱃지 |
| 순서 변경 | "위로/아래로" 버튼 (드래그 구현이 과도하면 버튼 방식 채택) |
| AI 번역 (개별/전체) | setTimeout 1회, 1.5초 후 `translatedUrl` 세팅 |
| 전후 비교 | ImageCompareSlider (좌우 드래그 핸들) |
| 배경 제거 | setTimeout 1초 후 → 투명/흰색 배경 선택 라디오 표시 |
| 리사이즈 | 버튼 클릭 시 "적용됨" 토스트만 (실제 처리 없음) |
| 이미지 삭제 | 최소 1장 유지 필수 · 삭제 시도 시 인라인 경고 |

### 완료 체크리스트

- [ ] 순서 변경 후 첫 번째가 대표 이미지(⭐)로 갱신
- [ ] AI 번역 → 1.5초 후 이미지 변경 + 슬라이더 표시
- [ ] 비교 슬라이더 드래그 동작
- [ ] 배경 제거 → 투명/흰색 선택 UI 표시
- [ ] 1장 남은 상태에서 삭제 시도 → 경고
- [ ] 10장 초과 불가

---

## Step 7 · ED-02c 상세페이지 AI 설정

> **목표** 상세페이지 이미지 관리 · AI 번역 · Qoo10 미리보기.

### 생성 파일

| 파일 | 구분 | 설명 |
|---|---|---|
| `src/pages/editing/tabs/DetailPageTab.tsx` | 신규 | ED-02c 탭 |
| `src/pages/editing/components/Qoo10PreviewModal.tsx` | 신규 | Qoo10 JP 상세 미리보기 |

### 기능 목록

| 기능 | MOCK 동작 |
|---|---|
| 세로 이미지 리스트 (최대 30장, 순서 변경 없음) | placehold.co URL 사용 |
| AI 번역 (개별/전체) | 이미지당 1.2초 간격 순차 처리 (setTimeout × N) |
| 대량 처리 안내 (10장+) | 상단 배너: "완료되면 알림으로 알려드릴게요" |
| 전후 비교 슬라이더 | **ImageCompareSlider 재사용** (Step 6 컴포넌트) |
| 이미지 교체 | 파일 인풋 → ObjectURL로 즉시 미리보기 반영 |
| Qoo10 미리보기 | 모달 내 모바일/데스크톱 전환 토글 |

### 완료 체크리스트

- [ ] 세로 이미지 리스트 렌더링
- [ ] 전체 번역 → 1.2초 간격 순차 처리
- [ ] 10장+ 번역 시 안내 배너 표시
- [ ] 이미지 교체 → 선택 파일 즉시 반영
- [ ] 미리보기 모달 모바일/데스크톱 전환
- [ ] ImageCompareSlider 신규 생성 없이 재사용 확인

---

## 리스크 & 주의사항

| # | 리스크 | 대응 방법 |
|---|---|---|
| 1 | MOCK 루프로 이중 알림 (소싱 파트 재발) | `setTimeout × N`만 허용. `setInterval` · 재귀 setTimeout 금지 |
| 2 | 탭/필터 상태 라우팅 이동 시 유실 | `activeTab` · `providerFilter` · `searchKeyword` → `useEditingStore` 전역 관리 |
| 3 | 미존재 productId 접근 | 페이지 마운트 시 ID 존재 여부 체크 → 없으면 `/editing` redirect |
| 4 | hex 하드코딩 | 모든 색상 · 폰트 · 간격 → `src/design/tokens.ts` 사용. PR 머지 전 리뷰 |
| 5 | 탭 언마운트 중 pending 자동 저장 | `useEffect` cleanup에서 `clearTimeout` + flush 처리 |
| 6 | 번역 모달 닫기 중 작업 소실 | 작업 상태는 store에서 관리. 모달은 뷰일 뿐, 닫혀도 번역 계속 |

---

## 최종 파일 구조

```
src/
├── types/
│   ├── sourcing.ts              수정 (titleJa? 추가)
│   └── editing.ts               신규
├── mock/
│   └── editingMock.ts           신규 (48건)
├── store/
│   └── useEditingStore.ts       신규
└── pages/
    └── editing/
        ├── EditingListPage.tsx          ED-01
        ├── EditingDetailPage.tsx        ED-02 컨테이너
        ├── tabs/
        │   ├── BasicEditTab.tsx         ED-02a
        │   ├── ThumbnailTab.tsx         ED-02b
        │   └── DetailPageTab.tsx        ED-02c
        └── components/
            ├── CollectionProgressBanner.tsx
            ├── ProductListItem.tsx
            ├── BulkActionBar.tsx
            ├── TranslationModal.tsx     ED-01a
            ├── EditingHeader.tsx
            ├── EditingTabBar.tsx
            ├── ImageCompareSlider.tsx   공용 (Step 6 생성 · Step 7 재사용)
            └── Qoo10PreviewModal.tsx
```

/**
 * DayZero Design Tokens
 *
 * UI 작업 시 반드시 이 파일의 값을 사용한다.
 * 하드코딩된 색상·간격·폰트 크기는 금지.
 *
 * 사용법:
 *   import { colors, font, radius, spacing } from '@/design/tokens';
 *   style={{ color: colors.text.primary, fontSize: font.size.md }}
 */

// ── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  /** 브랜드 파란색. CTA 버튼, 활성 상태, 링크 */
  primary: '#3182F6',
  /** 연한 파란색 배경. 선택된 필터·탭 배경 */
  primaryLight: '#EFF6FF',

  /** 성공. 활성 토글, 완료 상태 */
  success: '#00C853',
  /** 성공 (대체). 수익/상승 지표 */
  successAlt: '#3ED4A4',

  /** 에러·위험. 입력 오류, 삭제 액션 */
  danger: '#F04452',
  /** 연한 에러 배경. 칩·배지 테두리 */
  dangerLight: '#FDE2E4',
  /** 아주 연한 에러 배경. 실패 아이템 행 배경 */
  dangerBg: '#FEF0F1',

  /** 경고 */
  warning: '#FBBC05',

  text: {
    /** 제목, 강조 텍스트 */
    primary: '#191F28',
    /** 본문, 일반 레이블 */
    secondary: '#4E5968',
    /** 부가 설명, 메타 정보 */
    tertiary: '#6B7684',
    /** 비활성, 플레이스홀더 보조 */
    muted: '#8B95A1',
    /** 입력 placeholder */
    placeholder: '#C4CAD4',
    /** 완전 비활성 */
    disabled: '#B0B8C1',
  },

  bg: {
    /** 페이지 배경 */
    page: '#F9FAFB',
    /** 카드·모달·패널 배경 */
    surface: '#FFFFFF',
    /** 보조 배경. 태그, 뱃지, 인풋 배경 */
    subtle: '#F2F4F6',
    /** 아주 연한 배경. 콜아웃·섹션 구분 */
    faint: '#F8F9FA',
    /** 인포 박스 배경 */
    info: '#F0F6FF',
  },

  border: {
    /** 기본 구분선, 카드 테두리 */
    default: '#E5E8EB',
    /** 연한 구분선 */
    light: '#D1D6DB',
  },
} as const;

// ── Typography ───────────────────────────────────────────────────────────────

export const font = {
  family: {
    sans: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  size: {
    /** 12px – 태그, 캡션 */
    xs: '12px',
    /** 13px – 보조 텍스트, 메타 */
    sm: '13px',
    /** 14px – 본문 보조, 설명 */
    md: '14px',
    /** 15px – 본문 기본 */
    base: '15px',
    /** 18px – 섹션 제목 */
    lg: '18px',
    /** 22px – 페이지 서브 타이틀 */
    xl: '22px',
    /** 28px – 페이지 메인 타이틀 */
    '2xl': '28px',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: '1.3',
    normal: '1.5',
    relaxed: '1.7',
  },
} as const;

// ── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  /** 4px – 인라인 배지, 작은 태그 */
  xs: '4px',
  /** 6px – 태그, 뱃지 */
  sm: '6px',
  /** 8px – 버튼, 인풋, 작은 카드 */
  md: '8px',
  /** 10px – 이미지 썸네일 */
  img: '10px',
  /** 12px – 카드, 드롭다운 */
  lg: '12px',
  /** 16px – 모달, 패널 */
  xl: '16px',
  /** 9999px – 토글, 풀 라운드 */
  full: '9999px',
} as const;

// ── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
} as const;

// ── Shadows ──────────────────────────────────────────────────────────────────

export const shadow = {
  /** 카드, 드롭다운 */
  sm: '0 1px 4px rgba(0,0,0,0.06)',
  /** 모달, 패널 */
  md: '0 4px 16px rgba(0,0,0,0.10)',
  /** 플로팅 버튼, 팝오버 */
  lg: '0 8px 32px rgba(0,0,0,0.14)',
} as const;

// ── Z-index ──────────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 500,
  nav: 1000,
  modal: 2000,
  toast: 3000,
} as const;

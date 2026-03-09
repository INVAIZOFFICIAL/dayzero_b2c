export type SourcingProvider = '올리브영' | '쿠팡' | '네이버 스마트스토어' | 'G마켓' | '다이소' | 'yes24' | '알라딘' | 'Ktown4u' | '위버스샵' | '메이크스타' | '위치폼' | 'FANS';

export interface SourcingJob {
    id: string;
    type: 'URL' | 'AUTO';
    provider: SourcingProvider;
    categorySummary: string; // e.g. "뷰티 인기상품"
    status: 'queued' | 'running' | 'completed' | 'failed';
    totalCount: number;
    currentCount: number;
    createdAt: string; // ISO string
    completedAt?: string;
    duplicateCount?: number;
    durationString?: string;
    errorMessage?: string;
}

export interface AutoSchedule {
    id: string;
    provider: SourcingProvider;
    categoryPath: string; // e.g. "대분류 > 중분류 > 소분류"
    criteria: '인기상품' | '신상품';
    targetCount: number;
    timeString: string; // e.g. "06:00"
    isActive: boolean;
}

export interface SourcedProduct {
    id: string;
    jobId: string;
    provider: SourcingProvider;
    title: string;
    thumbnailUrl: string;
    originalPriceKrw: number;
    optionCount: number;
    sourceUrl: string;
    translationStatus: 'pending' | 'processing' | 'completed' | 'failed';
    qoo10Category: string | null;
    editStatus: 'pending' | 'completed';
}

export const SOURCING_PROVIDERS: { name: SourcingProvider; logo: string }[] = [
    { name: '올리브영', logo: '/올리브영.png' },
    { name: '쿠팡', logo: '/쿠팡.png' },
    { name: '네이버 스마트스토어', logo: '/스마트스토어.png' },
    { name: 'G마켓', logo: '/Gmarket.png' },
    { name: '다이소', logo: '/다이소.png' },
    { name: 'yes24', logo: '/yes24.png' },
    { name: '알라딘', logo: '/알라딘.png' },
    { name: 'Ktown4u', logo: '/Ktown4U.png' },
    { name: '위버스샵', logo: '/위버스샵.png' },
    { name: '메이크스타', logo: '/메이크스타.png' },
    { name: '위치폼', logo: '/로고 총합.png' }, // Fallback for 위치폼 since it wasn't listed, using 로고 총합 as placeholder
    { name: 'FANS', logo: '/FANS.png' },
];

export const MOCK_URL_TO_PROVIDER = (url: string): SourcingProvider | null => {
    if (url.includes('oliveyoung')) return '올리브영';
    if (url.includes('coupang')) return '쿠팡';
    if (url.includes('naver')) return '네이버 스마트스토어';
    if (url.includes('gmarket')) return 'G마켓';
    if (url.includes('daiso')) return '다이소';
    if (url.includes('yes24')) return 'yes24';
    if (url.includes('aladin')) return '알라딘';
    if (url.includes('ktown4u')) return 'Ktown4u';
    if (url.includes('weverseshop')) return '위버스샵';
    if (url.includes('makestar')) return '메이크스타';
    if (url.includes('witchform')) return '위치폼';
    if (url.includes('fans')) return 'FANS';
    return null;
}

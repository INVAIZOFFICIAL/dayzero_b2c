export interface ProductOption {
    id: string;
    nameKo: string;
    nameJa: string | null;
    stock: number;
}

export interface ProductImage {
    id: string;
    url: string;
    translatedUrl: string | null;
    translationStatus: 'none' | 'processing' | 'completed';
    backgroundRemoved: boolean;
}

export interface ProductDetail {
    id: string;

    // 원문 (한국어)
    titleKo: string;
    descriptionKo: string;
    options: ProductOption[];

    // 번역본 (일본어)
    titleJa: string | null;
    descriptionJa: string | null;

    // 이미지
    thumbnails: ProductImage[];   // 최대 10장, [0] = 대표
    detailImages: ProductImage[]; // 최대 30장

    // 가격 (소싱 단계에서 계산 완료)
    salePriceJpy: number;

    // Qoo10 카테고리 (자동 매핑)
    qoo10CategoryId: string;
    qoo10CategoryPath: string;    // 표시용 "패션 > 여성의류 > 원피스"

    // 소싱 정보
    provider: string;
    thumbnailUrl: string;
    originalPriceKrw: number;

    // 상태
    translationStatus: 'pending' | 'processing' | 'completed' | 'failed';
    editStatus: 'pending' | 'completed';
    lastSavedAt: string | null;
    createdAt: string; // 수집 등록일 (ISO string)
}

export interface TranslationJob {
    id: string;
    productId: string;
    productTitleKo: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    errorMessage?: string;
    targets: ('title' | 'description' | 'options')[];
}

export type EditTabFilter = 'all' | 'needs_translation' | 'translated';

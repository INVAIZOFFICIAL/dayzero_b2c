import { create } from 'zustand';
import type { ProductDetail, TranslationJob, EditTabFilter } from '../types/editing';
import { MOCK_PRODUCTS } from '../mock/editingMock';

interface EditingState {
    products: ProductDetail[];

    // ED-01 UI 상태
    selectedProductIds: string[];
    activeTab: EditTabFilter;
    providerFilter: string;
    searchKeyword: string;

    // ED-01a 번역 작업
    translationJobs: TranslationJob[];
    isTranslationModalOpen: boolean;

    // ED-02 현재 편집 상품
    currentEditProductId: string | null;

    // Actions — 필터/탭
    setActiveTab: (tab: EditTabFilter) => void;
    setProviderFilter: (filter: string) => void;
    setSearchKeyword: (keyword: string) => void;

    // Actions — 선택
    toggleSelectProduct: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    // Actions — 번역 모달
    openTranslationModal: () => void;
    closeTranslationModal: () => void;
    startTranslationJobs: (productIds: string[], targets: TranslationJob['targets']) => void;
    updateTranslationJob: (jobId: string, updates: Partial<TranslationJob>) => void;

    // Actions — 상품
    updateProduct: (id: string, updates: Partial<ProductDetail>) => void;
    deleteProducts: (ids: string[]) => void;
    setCurrentEditProduct: (id: string | null) => void;
}

export const useEditingStore = create<EditingState>((set) => ({
    products: [...MOCK_PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

    selectedProductIds: [],
    activeTab: 'all',
    providerFilter: '전체',
    searchKeyword: '',

    translationJobs: [],
    isTranslationModalOpen: false,

    currentEditProductId: null,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setProviderFilter: (filter) => set({ providerFilter: filter }),
    setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

    toggleSelectProduct: (id) =>
        set((state) => ({
            selectedProductIds: state.selectedProductIds.includes(id)
                ? state.selectedProductIds.filter((sid) => sid !== id)
                : [...state.selectedProductIds, id],
        })),

    selectAll: (ids) => set({ selectedProductIds: ids }),
    clearSelection: () => set({ selectedProductIds: [] }),

    openTranslationModal: () => set({ isTranslationModalOpen: true }),
    closeTranslationModal: () => set({ isTranslationModalOpen: false }),

    startTranslationJobs: (productIds, targets) =>
        set((state) => {
            const jobs: TranslationJob[] = productIds.map((pid) => {
                const product = state.products.find((p) => p.id === pid);
                return {
                    id: `job-${pid}-${Date.now()}`,
                    productId: pid,
                    productTitleKo: product?.titleKo ?? pid,
                    status: 'queued',
                    targets,
                };
            });

            // processing 상태로 전환
            const updatedProducts = state.products.map((p) =>
                productIds.includes(p.id)
                    ? { ...p, translationStatus: 'processing' as const }
                    : p
            );

            return { translationJobs: jobs, products: updatedProducts };
        }),

    updateTranslationJob: (jobId, updates) =>
        set((state) => {
            const updatedJobs = state.translationJobs.map((j) =>
                j.id === jobId ? { ...j, ...updates } : j
            );

            // 번역 완료 시 상품 상태도 함께 갱신
            let updatedProducts = state.products;
            if (updates.status === 'completed') {
                const job = state.translationJobs.find((j) => j.id === jobId);
                if (job) {
                    updatedProducts = state.products.map((p) =>
                        p.id === job.productId
                            ? {
                                  ...p,
                                  translationStatus: 'completed' as const,
                                  titleJa: p.titleJa ?? `[번역완료] ${p.titleKo}`,
                              }
                            : p
                    );
                }
            }
            if (updates.status === 'failed') {
                const job = state.translationJobs.find((j) => j.id === jobId);
                if (job) {
                    updatedProducts = state.products.map((p) =>
                        p.id === job.productId
                            ? { ...p, translationStatus: 'failed' as const }
                            : p
                    );
                }
            }

            return { translationJobs: updatedJobs, products: updatedProducts };
        }),

    updateProduct: (id, updates) =>
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, ...updates, lastSavedAt: new Date().toISOString() } : p
            ),
        })),

    deleteProducts: (ids) =>
        set((state) => ({
            products: state.products.filter((p) => !ids.includes(p.id)),
            selectedProductIds: state.selectedProductIds.filter((sid) => !ids.includes(sid)),
        })),

    setCurrentEditProduct: (id) => set({ currentEditProductId: id }),
}));

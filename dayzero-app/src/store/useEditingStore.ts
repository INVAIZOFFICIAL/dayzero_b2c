import { create } from 'zustand';
import type { ProductDetail, TranslationJob, EditTabFilter, TranslationBatch, RegistrationBatch } from '../types/editing';

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

    // 배치 작업 (알림 패널용)
    translationBatches: TranslationBatch[];
    registrationBatches: RegistrationBatch[];

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
    addProduct: (product: ProductDetail) => void;

    markTranslationsRead: () => void;
    markRegistrationsRead: () => void;
    markTranslationJobRead: (id: string) => void;
    markTranslationBatchRead: (id: string) => void;
    markRegistrationBatchRead: (id: string) => void;
    removeTranslationJob: (id: string) => void;
    removeTranslationBatch: (id: string) => void;
    removeRegistrationBatch: (id: string) => void;
    startRegistrationBatch: (productIds: string[]) => void;
    markProductsRead: (exceptJobId?: string) => void;
    selectByJobId: (jobId: string) => void;
}

export const useEditingStore = create<EditingState>((set, get) => ({
    products: [],

    selectedProductIds: [],
    activeTab: 'all',
    providerFilter: '전체',
    searchKeyword: '',

    translationJobs: [],
    isTranslationModalOpen: false,
    translationBatches: [],
    registrationBatches: [],

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

    startTranslationJobs: (productIds, targets) => {
        const batchId = `tb-${Date.now()}`;
        const newBatch: TranslationBatch = {
            id: batchId,
            totalCount: productIds.length,
            currentCount: 0,
            status: 'processing',
            createdAt: new Date().toISOString(),
            isRead: true,
        };

        const newJobs: TranslationJob[] = productIds.map((pid) => {
            const product = get().products.find((p) => p.id === pid);
            return {
                id: `job-${pid}-${Date.now()}`,
                productId: pid,
                productTitleKo: product?.titleKo ?? pid,
                status: 'queued',
                targets,
                isRead: true
            };
        });

        // Update local state first
        set((state) => ({
            translationJobs: [...newJobs, ...state.translationJobs],
            translationBatches: [newBatch, ...state.translationBatches],
            products: state.products.map((p) =>
                productIds.includes(p.id) ? { ...p, translationStatus: 'processing' } : p
            ),
        }));

        // Simulate progress
        let processedCount = 0;
        const interval = setInterval(() => {
            processedCount++;

            const currentJob = newJobs[processedCount - 1];
            if (currentJob) {
                get().updateTranslationJob(currentJob.id, { status: 'completed' });
            }

            set((state) => ({
                translationBatches: state.translationBatches.map(b =>
                    b.id === batchId ? { ...b, currentCount: processedCount } : b
                )
            }));

            if (processedCount >= productIds.length) {
                clearInterval(interval);
                set((state) => ({
                    translationBatches: state.translationBatches.map(b =>
                        b.id === batchId ? { ...b, status: 'completed', completedAt: new Date().toISOString() } : b
                    )
                }));
            }
        }, 1500 + Math.random() * 1000);
    },

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

    addProduct: (product) => set((state) => ({
        products: [{ ...product, isRead: false }, ...state.products],
    })),

    markTranslationsRead: () => set((state) => {
        const anyUnread = state.translationJobs.some(j => !j.isRead) || state.translationBatches.some(b => !b.isRead);
        if (!anyUnread) return state;
        return {
            translationJobs: state.translationJobs.map(j => j.isRead ? j : { ...j, isRead: true }),
            translationBatches: state.translationBatches.map(b => b.isRead ? b : { ...b, isRead: true }),
        };
    }),

    markRegistrationsRead: () => set((state) => {
        if (state.registrationBatches.every(b => b.isRead)) return state;
        return { registrationBatches: state.registrationBatches.map(b => b.isRead ? b : { ...b, isRead: true }) };
    }),

    markTranslationJobRead: (id) => set((state) => ({
        translationJobs: state.translationJobs.map(j => j.id === id ? { ...j, isRead: true } : j)
    })),

    markTranslationBatchRead: (id) => set((state) => ({
        translationBatches: state.translationBatches.map(b => b.id === id ? { ...b, isRead: true } : b)
    })),

    markRegistrationBatchRead: (id) => set((state) => ({
        registrationBatches: state.registrationBatches.map(b => b.id === id ? { ...b, isRead: true } : b)
    })),

    removeTranslationJob: (id) => set((state) => ({
        translationJobs: state.translationJobs.filter(j => j.id !== id),
    })),

    removeTranslationBatch: (id) => set((state) => ({
        translationBatches: state.translationBatches.filter(b => b.id !== id),
    })),

    removeRegistrationBatch: (id) => set((state) => ({
        registrationBatches: state.registrationBatches.filter(b => b.id !== id),
    })),

    startRegistrationBatch: (productIds) => {
        const batchId = `rb-${Date.now()}`;
        const newBatch: RegistrationBatch = {
            id: batchId,
            totalCount: productIds.length,
            currentCount: 0,
            status: 'processing',
            createdAt: new Date().toISOString(),
            isRead: true,
        };

        // Update local state first
        set((state) => ({
            registrationBatches: [newBatch, ...state.registrationBatches],
            products: state.products.map((p) =>
                productIds.includes(p.id) ? { ...p, editStatus: 'processing' } : p
            ),
        }));

        // Simulate progress
        let processedCount = 0;
        const interval = setInterval(() => {
            processedCount++;

            set((state) => ({
                registrationBatches: state.registrationBatches.map(b =>
                    b.id === batchId ? { ...b, currentCount: processedCount } : b
                )
            }));

            if (processedCount >= productIds.length) {
                clearInterval(interval);
                set((state) => ({
                    registrationBatches: state.registrationBatches.map(b =>
                        b.id === batchId ? { ...b, status: 'completed', completedAt: new Date().toISOString() } : b
                    ),
                    products: state.products.map((p) =>
                        productIds.includes(p.id) ? { ...p, editStatus: 'completed' } : p
                    ),
                }));
            }
        }, 2000 + Math.random() * 1000);
    },
    markProductsRead: (exceptJobId) => set((state) => ({
        products: state.products.map(p => {
            if (p.isRead) return p;
            if (exceptJobId && p.jobId === exceptJobId) return p;
            return { ...p, isRead: true };
        })
    })),
    selectByJobId: (jobId) => set((state) => {
        const productIds = state.products
            .filter(p => p.jobId === jobId)
            .map(p => p.id);
        return { selectedProductIds: productIds };
    }),
}));

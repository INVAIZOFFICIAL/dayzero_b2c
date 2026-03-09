import { create } from 'zustand';
import { SourcingJob, AutoSchedule, SourcedProduct, SourcingProvider } from '../types/sourcing';

interface SourcingState {
    jobs: SourcingJob[];
    schedules: AutoSchedule[];
    unprocessedProductCount: number;
    products: SourcedProduct[];

    addJob: (job: SourcingJob) => void;
    updateJob: (id: string, updates: Partial<SourcingJob>) => void;
    addSchedule: (schedule: AutoSchedule) => void;
    toggleSchedule: (id: string) => void;
    setUnprocessedCount: (count: number) => void;
    addProduct: (product: SourcedProduct) => void;
}

export const useSourcingStore = create<SourcingState>((set) => ({
    jobs: [
        {
            id: 'job-1',
            type: 'AUTO',
            provider: '올리브영',
            categorySummary: '뷰티 인기상품',
            status: 'running',
            totalCount: 50,
            currentCount: 23,
            createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        },
        {
            id: 'job-2',
            type: 'AUTO',
            provider: '쿠팡',
            categorySummary: '생활용품 전체',
            status: 'completed',
            totalCount: 50,
            currentCount: 50,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.2).toISOString(),
            completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            durationString: '2분 10초',
            duplicateCount: 2,
        },
        {
            id: 'job-3',
            type: 'AUTO',
            provider: '다이소',
            categorySummary: '전체 인기상품',
            status: 'completed',
            totalCount: 30,
            currentCount: 30,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5.1).toISOString(),
            completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            durationString: '1분 45초',
            duplicateCount: 0,
        }
    ],
    schedules: [
        {
            id: 'sched-1',
            provider: '올리브영',
            categoryPath: '뷰티 > 스킨케어',
            criteria: '인기상품',
            targetCount: 50,
            timeString: '06:00',
            isActive: true,
        },
        {
            id: 'sched-2',
            provider: '쿠팡',
            categoryPath: '생활용품 > 세제/세정',
            criteria: '신상품',
            targetCount: 30,
            timeString: '07:00',
            isActive: true,
        }
    ],
    unprocessedProductCount: 42,
    products: [],

    addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),

    updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map((job) => job.id === id ? { ...job, ...updates } : job)
    })),

    addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),

    toggleSchedule: (id) => set((state) => ({
        schedules: state.schedules.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s)
    })),

    setUnprocessedCount: (count) => set({ unprocessedProductCount: count }),

    addProduct: (product) => set((state) => ({
        products: [product, ...state.products],
        unprocessedProductCount: state.unprocessedProductCount + 1
    })),

}));

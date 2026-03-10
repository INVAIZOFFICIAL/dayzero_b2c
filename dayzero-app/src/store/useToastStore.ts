import { create } from 'zustand';

export interface Toast {
    id: string;
    message: string;
    details?: string;
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
    addToast: (message: string, details?: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (message, details, duration = 5000) => {
        const id = `toast-${Date.now()}`;
        set((state) => ({
            toasts: [...state.toasts, { id, message, details, duration }]
        }));

        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            }, duration);
        }
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }))
}));

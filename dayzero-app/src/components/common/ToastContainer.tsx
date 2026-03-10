import React from 'react';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
    const { toasts } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '96px', // Positioned above the bell icon (24px bottom + 56px height + 16px gap)
            right: '24px',  // Aligned with the bell icon
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'flex-end',
            pointerEvents: 'none',
        }}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    style={{
                        background: '#FFFFFF',
                        color: '#191F28',
                        padding: '16px 20px',
                        borderRadius: '16px 16px 4px 16px', // Tail pointing down-right
                        fontSize: '15px',
                        fontWeight: 600,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        border: '1px solid #E5E8EB',
                        display: 'flex',
                        alignItems: 'flex-start', // Align items to top since we have two lines
                        gap: '12px',
                        pointerEvents: 'auto',
                        animation: 'toastBubbleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        maxWidth: '400px',
                        position: 'relative',
                    }}
                >
                    {/* Tail element */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        right: '12px',
                        width: '12px',
                        height: '12px',
                        background: '#FFFFFF',
                        borderBottom: '1px solid #E5E8EB',
                        borderRight: '1px solid #E5E8EB',
                        transform: 'rotate(45deg)',
                        zIndex: -1,
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: '1.4' }}>
                        <span>{toast.message}</span>
                        {toast.details && (
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#4E5968' }}>
                                {toast.details}
                            </span>
                        )}
                    </div>
                </div>
            ))}

            <style>{`
            @keyframes toastBubbleUp {
                0% {
                    opacity: 0;
                    transform: translateY(16px) scale(0.9);
                    transform-origin: bottom right;
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    transform-origin: bottom right;
                }
            }
            `}</style>
        </div>
    );
};

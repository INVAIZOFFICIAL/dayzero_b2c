import { useState } from 'react';
import { Loader2, Star, Trash2, Check, RotateCcw, Scissors } from 'lucide-react';

import type { ProductDetail, ProductImage } from '../../../types/editing';
import { useEditingStore } from '../../../store/useEditingStore';
import { colors, font, radius, shadow, spacing } from '../../../design/tokens';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

interface Props {
    product: ProductDetail;
}

const mockEnhanceBg = (img: ProductImage): ProductImage => ({
    ...img,
    translatedUrl: img.url.replace('F2F4F6/8B95A1', 'EFF6FF/3182F6'),
    translationStatus: 'completed',
    backgroundRemoved: true,
});

const btnBase = (active: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
    padding: `6px 0`,
    background: active ? colors.primaryLight : colors.bg.subtle,
    border: `1px solid ${active ? colors.primaryBorder : colors.border.default}`,
    borderRadius: radius.sm,
    fontSize: font.size.xs, fontWeight: 600,
    color: active ? colors.primary : colors.text.muted,
    cursor: active ? 'pointer' : 'not-allowed',
});

export const ThumbnailEditTab: React.FC<Props> = ({ product }) => {
    const { updateProduct } = useEditingStore();
    const [images, setImages] = useState<ProductImage[]>([...product.thumbnails]);
    const [processing, setProcessing] = useState<Set<string>>(new Set());
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const save = (imgs: ProductImage[]) => updateProduct(product.id, { thumbnails: imgs });

    const handleRemoveBg = (id: string) => {
        if (processing.has(id)) return;
        setProcessing(prev => new Set([...prev, id]));
        setTimeout(() => {
            setImages(prev => {
                const next = prev.map(img => img.id === id ? mockEnhanceBg(img) : img);
                save(next);
                return next;
            });
            setProcessing(prev => { const n = new Set(prev); n.delete(id); return n; });
        }, 2000);
    };

    const handleRevert = (id: string) => {
        setImages(prev => {
            const next = prev.map(img => img.id === id
                ? { ...img, translatedUrl: null, translationStatus: 'none' as const, backgroundRemoved: false }
                : img
            );
            save(next);
            return next;
        });
    };

    const handleDelete = (id: string) => {
        const next = images.filter(img => img.id !== id);
        setImages(next);
        save(next);
        setDeleteConfirm(null);
    };

    return (
        <div style={{ maxWidth: '760px' }}>
            <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>

            {/* 상단 */}
            <div style={{ marginBottom: spacing['4'] }}>
                <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.secondary }}>썸네일 이미지</span>
                <span style={{ fontSize: font.size.xs, color: colors.text.muted, marginLeft: spacing['2'] }}>
                    {images.length}장 · 첫 번째 이미지가 대표
                </span>
            </div>

            {/* 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing['3'] }}>
                {images.map((img, idx) => {
                    const isProcessing = processing.has(img.id);
                    const isDone = img.translationStatus === 'completed';

                    return (
                        <div key={img.id} style={{
                            border: `1.5px solid ${isDone ? colors.primaryBorder : colors.border.default}`,
                            borderRadius: radius.lg,
                            overflow: 'hidden',
                            background: colors.bg.surface,
                            boxShadow: shadow.sm,
                            position: 'relative',
                        }}>
                            {/* 대표 뱃지 */}
                            {idx === 0 && (
                                <div style={{
                                    position: 'absolute', top: spacing['2'], left: spacing['2'], zIndex: 2,
                                    display: 'flex', alignItems: 'center', gap: '3px',
                                    background: colors.primary, color: '#fff',
                                    padding: '3px 7px', borderRadius: radius.full,
                                    fontSize: font.size['2xs+'], fontWeight: 700,
                                }}>
                                    <Star size={9} fill="#fff" />
                                    대표
                                </div>
                            )}
                            {/* 처리완료 뱃지 */}
                            {isDone && (
                                <div style={{
                                    position: 'absolute', top: spacing['2'], right: spacing['2'], zIndex: 2,
                                    display: 'flex', alignItems: 'center', gap: '3px',
                                    background: colors.primary, color: '#fff',
                                    padding: '3px 7px', borderRadius: radius.full,
                                    fontSize: font.size['2xs+'], fontWeight: 600,
                                }}>
                                    <Check size={9} />
                                    배경 제거
                                </div>
                            )}

                            {/* 이미지 */}
                            <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={isDone && img.translatedUrl ? img.translatedUrl : img.url}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                {isProcessing && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(49,130,246,0.12)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        gap: spacing['2'],
                                    }}>
                                        <Loader2 size={24} color={colors.primary} style={{ animation: 'spin 1s linear infinite' }} />
                                        <span style={{ fontSize: font.size.xs, fontWeight: 600, color: colors.primary }}>처리 중...</span>
                                    </div>
                                )}
                            </div>

                            {/* 버튼 영역 */}
                            <div style={{
                                padding: spacing['2'], display: 'flex', gap: spacing['1'],
                                borderTop: `1px solid ${colors.border.default}`,
                                background: colors.bg.faint,
                            }}>
                                {isDone ? (
                                    <button
                                        onClick={() => handleRevert(img.id)}
                                        style={{ ...btnBase(true), background: colors.bg.subtle, border: `1px solid ${colors.border.default}`, color: colors.text.secondary }}
                                    >
                                        <RotateCcw size={11} /> 원본 복원
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleRemoveBg(img.id)}
                                        disabled={isProcessing}
                                        style={btnBase(!isProcessing)}
                                    >
                                        {isProcessing
                                            ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                                            : <Scissors size={11} />
                                        }
                                        {isProcessing ? '처리 중...' : 'AI 배경 개선'}
                                    </button>
                                )}
                                <button
                                    onClick={() => images.length > 1 && setDeleteConfirm(img.id)}
                                    disabled={images.length <= 1}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '30px', background: 'none',
                                        border: `1px solid ${colors.border.default}`,
                                        borderRadius: radius.sm,
                                        color: images.length <= 1 ? colors.text.disabled : colors.text.muted,
                                        cursor: images.length <= 1 ? 'not-allowed' : 'pointer',
                                        transition: 'color 0.15s',
                                    }}
                                    onMouseEnter={e => { if (images.length > 1) e.currentTarget.style.color = colors.danger; }}
                                    onMouseLeave={e => { if (images.length > 1) e.currentTarget.style.color = colors.text.muted; }}
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="이미지를 삭제할까요?"
                description="삭제한 이미지는 복구할 수 없습니다."
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </div>
    );
};

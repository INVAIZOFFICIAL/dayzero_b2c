import { useState, useRef, useEffect } from 'react';
import type { ProductDetail } from '../../../types/editing';
import { SOURCING_PROVIDERS } from '../../../types/sourcing';
import { toKoCategory, shortKoCategory, EXCHANGE_RATE } from '../../../mock/categoryMap';
import { colors, font, radius, shadow, spacing, zIndex } from '../../../design/tokens';

const formatDate = (iso: string) => {
    const d = new Date(iso);
    const yy = String(d.getFullYear()).slice(2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
};

interface Props {
    product: ProductDetail;
    selected: boolean;
    onToggle: () => void;
    onClick: () => void;
}

interface TooltipData {
    x: number;
    y: number;
    content: React.ReactNode;
}

const getProviderLogo = (name: string) =>
    SOURCING_PROVIDERS.find((p) => p.name === name)?.logo ?? '/logos/default.png';

const stripPrefix = (title: string) => title.replace(/^\[[^\]]+\]\s*/, '');

/** 화면 고정 위치 툴팁 */
const FloatingTooltip: React.FC<{ data: TooltipData }> = ({ data }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: data.x, y: data.y });

    useEffect(() => {
        if (!ref.current) return;
        const { width, height } = ref.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let x = data.x;
        let y = data.y + 12;
        if (x + width > vw - 16) x = vw - width - 16;
        if (y + height > vh - 16) y = data.y - height - 12;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPos({ x, y });
    }, [data.x, data.y]);

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                zIndex: zIndex.toast,
                background: colors.text.primary,
                color: '#fff',
                borderRadius: radius.lg,
                padding: `${spacing['3']} ${spacing['4']}`,
                boxShadow: shadow.lg,
                pointerEvents: 'none',
                maxWidth: '300px',
                animation: 'tooltipFadeIn 0.12s ease',
            }}
        >
            {data.content}
        </div>
    );
};

export const ProductListItem: React.FC<Props> = ({ product, selected, onToggle, onClick }) => {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);

    const needsTranslation = product.translationStatus === 'pending' || product.translationStatus === 'failed';
    const isProcessing = product.translationStatus === 'processing';
    const isTranslated = !!product.titleJa;
    const displayTitle = stripPrefix(product.titleJa ?? product.titleKo);
    const krwEquivalent = Math.round(product.salePriceJpy * EXCHANGE_RATE);

    const showTooltip = (e: React.MouseEvent, content: React.ReactNode) => {
        setTooltip({ x: e.clientX, y: e.clientY, content });
    };
    const hideTooltip = () => setTooltip(null);

    return (
        <>
            <style>{`
                @keyframes tooltipFadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div
                onClick={onClick}
                style={{
                    display: 'flex', alignItems: 'center', gap: spacing['4'],
                    padding: `14px ${spacing['5']}`,
                    background: selected ? colors.primaryLight : colors.bg.surface,
                    border: `1px solid ${selected ? '#BFDBFE' : colors.border.default}`,
                    borderRadius: radius.lg,
                    cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                    position: 'relative', overflow: 'hidden',
                }}
            >
                {isProcessing && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.4s infinite',
                        pointerEvents: 'none',
                    }} />
                )}

                {/* 체크박스 */}
                <div
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    style={{
                        width: '20px', height: '20px', flexShrink: 0,
                        borderRadius: radius.xs,
                        border: `2px solid ${selected ? colors.primary : colors.border.light}`,
                        background: selected ? colors.primary : colors.bg.surface,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}
                >
                    {selected && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                            <path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>

                {/* 썸네일 */}
                <img
                    src={product.thumbnailUrl} alt=""
                    style={{
                        width: '48px', height: '48px', flexShrink: 0,
                        borderRadius: radius.img, objectFit: 'cover',
                        border: `1px solid ${colors.border.default}`,
                    }}
                />

                {/* 상품명 */}
                <div
                    style={{ flex: 3, minWidth: 0, display: 'flex', alignItems: 'center', gap: spacing['2'] }}
                    onMouseMove={isTranslated ? (e) => showTooltip(e, (
                        <div>
                            <div style={{ fontSize: font.size.xs, color: 'rgba(255,255,255,0.55)', marginBottom: '4px', fontWeight: 500 }}>
                                한국어 원문
                            </div>
                            <div style={{ fontSize: font.size.md, fontWeight: 600, lineHeight: '1.4' }}>
                                {stripPrefix(product.titleKo)}
                            </div>
                        </div>
                    )) : undefined}
                    onMouseLeave={isTranslated ? hideTooltip : undefined}
                >
                    <img
                        src={getProviderLogo(product.provider)} alt={product.provider}
                        style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <span style={{
                        fontSize: font.size.base, fontWeight: 600, color: colors.text.primary,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        textDecoration: isTranslated ? 'underline' : 'none',
                        textDecorationStyle: 'dotted',
                        textUnderlineOffset: '3px',
                        textDecorationColor: colors.text.muted,
                    }}>
                        {displayTitle}
                    </span>
                    {needsTranslation && (
                        <span style={{
                            flexShrink: 0, padding: '2px 7px', borderRadius: radius.xs,
                            fontSize: font.size.xs, fontWeight: 600,
                            background: '#FEF3C7', color: '#D97706',
                        }}>
                            {product.translationStatus === 'failed' ? '번역 실패' : '번역 필요'}
                        </span>
                    )}
                </div>

                {/* 카테고리 (한국어 표시, 호버 시 전체 경로) */}
                <div
                    style={{ flex: 2, minWidth: 0 }}
                    onMouseMove={(e) => showTooltip(e, (
                        <div>
                            <div style={{ fontSize: font.size.xs, color: 'rgba(255,255,255,0.55)', marginBottom: '4px', fontWeight: 500 }}>
                                Qoo10 카테고리 전체 경로
                            </div>
                            <div style={{ fontSize: font.size.md, fontWeight: 600, lineHeight: '1.4' }}>
                                {toKoCategory(product.qoo10CategoryPath)}
                            </div>
                        </div>
                    ))}
                    onMouseLeave={hideTooltip}
                >
                    <span style={{
                        fontSize: font.size.sm, color: colors.text.tertiary,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        display: 'block', cursor: 'default',
                    }}>
                        {shortKoCategory(product.qoo10CategoryPath)}
                    </span>
                </div>

                {/* 판매가 */}
                <div
                    style={{ width: '90px', flexShrink: 0 }}
                    onMouseMove={(e) => showTooltip(e, (
                        <div>
                            <div style={{ fontSize: font.size.xs, color: 'rgba(255,255,255,0.55)', marginBottom: '4px', fontWeight: 500 }}>
                                한화 환산 (¥1 = ₩{EXCHANGE_RATE})
                            </div>
                            <div style={{ fontSize: font.size.lg, fontWeight: 700 }}>
                                약 ₩{krwEquivalent.toLocaleString()}
                            </div>
                        </div>
                    ))}
                    onMouseLeave={hideTooltip}
                >
                    <span style={{
                        fontSize: font.size.base, fontWeight: 700, color: colors.text.primary,
                        textDecoration: 'underline', textDecorationStyle: 'dotted',
                        textUnderlineOffset: '3px', textDecorationColor: colors.text.muted,
                        cursor: 'default',
                    }}>
                        ¥{product.salePriceJpy.toLocaleString()}
                    </span>
                </div>

                {/* 원가 */}
                <div style={{ width: '90px', flexShrink: 0, fontSize: font.size.sm, color: colors.text.tertiary }}>
                    ₩{product.originalPriceKrw.toLocaleString()}
                </div>

                {/* 등록일 */}
                <div style={{ width: '72px', flexShrink: 0, fontSize: font.size.sm, color: colors.text.tertiary }}>
                    {formatDate(product.createdAt)}
                </div>
            </div>

            {tooltip && <FloatingTooltip data={tooltip} />}
        </>
    );
};

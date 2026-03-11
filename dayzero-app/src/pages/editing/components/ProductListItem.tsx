import { useState, useRef, useEffect } from 'react';
import type { ProductDetail } from '../../../types/editing';
import { getProviderLogo } from '../../../types/sourcing';
import { Checkbox } from '../../../components/common/Checkbox';
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
    'data-job-id'?: string;
}

interface TooltipData {
    x: number;
    y: number;
    content: React.ReactNode;
}


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

const WeightSection: React.FC<{
    product: ProductDetail,
    onUpdateTooltip: (data: TooltipData | null) => void
}> = ({ product, onUpdateTooltip }) => {
    const hasWeight = product.weightKg > 0;
    const isAi = product.isWeightEstimated;

    const tooltipContent = isAi
        ? "상품 무게 정보가 없어 AI가 예측한 무게입니다."
        : "실제 상품 페이지에서 수집한 무게 정보입니다.";

    return (
        <div
            style={{ width: '100px', flexShrink: 0, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: font.size.base,
                    fontWeight: 700,
                    color: hasWeight ? colors.text.primary : colors.danger,
                    cursor: 'default',
                    padding: '4px 0',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dotted',
                    textUnderlineOffset: '3px',
                    textDecorationColor: colors.text.muted,
                }}
                onMouseMove={(e) => onUpdateTooltip({
                    x: e.clientX, y: e.clientY,
                    content: tooltipContent
                })}
                onMouseLeave={() => onUpdateTooltip(null)}
            >
                {hasWeight ? (
                    <span>{product.weightKg}<span style={{ fontSize: '11px', marginLeft: '2px', opacity: 0.6, fontWeight: 500 }}>kg</span></span>
                ) : (
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>무게 설정 필요</span>
                )}

                {isAi && (
                    <div
                        style={{
                            fontSize: '9px',
                            background: colors.primary,
                            color: '#fff',
                            padding: '1px 3px',
                            borderRadius: '3px',
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: '-0.5px'
                        }}
                    >AI</div>
                )}
            </div>
        </div>
    );
};

export const ProductListItem: React.FC<Props> = ({
    product, selected, onToggle, onClick, 'data-job-id': jobId
}) => {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [imgError, setImgError] = useState(false);

    const isProcessing = product.translationStatus === 'processing';
    const isTranslated = !!product.titleJa;
    const displayTitle = stripPrefix(product.titleJa ?? product.titleKo);

    // 한화 환산 계산
    const krwEquivalent = Math.round(product.salePriceJpy * EXCHANGE_RATE);

    // 읽지 않은 항목은 파란색 배경 표시 (isRead 가 false 이거나 undefined 일 때)
    const isUnread = product.isRead === false;

    const showTooltip = (e: React.MouseEvent, content: React.ReactNode) => {
        setTooltip({ x: e.clientX, y: e.clientY, content });
    };
    const hideTooltip = () => setTooltip(null);

    return (
        <div
            onClick={onClick}
            data-job-id={jobId}
            style={{
                display: 'flex', alignItems: 'center', gap: spacing['5'],
                padding: `14px ${spacing['5']}`,
                background: isUnread
                    ? (selected ? '#DBEAFE' : '#F0F9FF')
                    : (selected ? colors.primaryLight : colors.bg.surface),
                borderRadius: radius.lg,
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
                position: 'relative',
                borderBottom: `1px solid ${colors.border.default}`,
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

            <Checkbox checked={selected} onClick={() => onToggle()} />

            {/* 썸네일 */}
            {imgError || !product.thumbnailUrl ? (
                <div style={{
                    width: '48px', height: '48px', flexShrink: 0,
                    borderRadius: radius.img,
                    background: colors.bg.subtle,
                    border: `1px solid ${colors.border.default}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                </div>
            ) : (
                <img
                    src={product.thumbnailUrl}
                    alt=""
                    onError={() => setImgError(true)}
                    style={{
                        width: '48px', height: '48px', flexShrink: 0,
                        borderRadius: radius.img, objectFit: 'cover',
                        border: `1px solid ${colors.border.default}`,
                    }}
                />
            )}

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
                {product.translationStatus === 'failed' && (
                    <span style={{
                        flexShrink: 0, padding: '2px 7px', borderRadius: radius.xs,
                        fontSize: font.size.xs, fontWeight: 600,
                        background: colors.dangerLight, color: colors.danger,
                    }}>
                        번역 실패
                    </span>
                )}
            </div>

            {/* 카테고리 */}
            <div
                style={{ flex: 1.2, minWidth: 0 }}
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

            {/* 무게 (kg) */}
            <WeightSection product={product} onUpdateTooltip={setTooltip} />

            {/* 판매가 */}
            <div
                style={{ width: '100px', flexShrink: 0 }}
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

            {tooltip && <FloatingTooltip data={tooltip} />}
        </div>
    );
};

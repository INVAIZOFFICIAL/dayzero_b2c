import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { colors, font, radius, spacing, shadow, zIndex } from '../../../design/tokens';
import { getProviderLogo } from '../../../types/sourcing';
import type { ProductDetail } from '../../../types/editing';

interface Props {
    product: ProductDetail;
    hasPrev: boolean;
    hasNext: boolean;
    onBack: () => void;
    onPrev: () => void;
    onNext: () => void;
    onRegister: () => void;
}

const stripPrefix = (title: string) => title.replace(/^\[[^\]]+\]\s*/, '');

const PROVIDER_URLS: Record<string, string> = {
    '올리브영': 'https://www.oliveyoung.co.kr',
    '쿠팡': 'https://www.coupang.com',
    '다이소': 'https://www.daiso-sangpoom.com',
};

export const EditingHeader: React.FC<Props> = ({
    product, hasPrev, hasNext, onBack, onPrev, onNext, onRegister,
}) => {
    const [showRegTooltip, setShowRegTooltip] = useState(false);

    const isTranslated = !!product.titleJa;
    const providerUrl = PROVIDER_URLS[product.provider] ?? 'https://www.coupang.com';

    return (
        <div style={{
            position: 'sticky',
            top: 0,
            zIndex: zIndex.sticky,
            background: colors.bg.surface,
            borderBottom: `1px solid ${colors.border.default}`,
            boxShadow: shadow.sm,
            padding: `${spacing['4']} 64px`,
        }}>
            <style>{`@keyframes tooltipFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing['4'] }}>

                {/* 목록으로 버튼 */}
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: spacing['1'],
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: font.size.sm, color: colors.text.tertiary,
                        padding: `${spacing['1']} ${spacing['2']}`,
                        borderRadius: radius.md,
                        whiteSpace: 'nowrap', flexShrink: 0,
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = colors.text.primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = colors.text.tertiary)}
                >
                    <ArrowLeft size={14} />
                    목록으로
                </button>

                {/* 세로 구분선 */}
                <div style={{ width: '1px', height: '32px', background: colors.border.default, flexShrink: 0 }} />

                {/* 썸네일 + 상품 정보 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing['3'], flex: 1, minWidth: 0 }}>
                    <img
                        src={product.thumbnailUrl}
                        alt=""
                        style={{
                            width: '40px', height: '40px',
                            borderRadius: radius.md,
                            objectFit: 'cover', flexShrink: 0,
                            border: `1px solid ${colors.border.default}`,
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'], minWidth: 0 }}>
                        {/* 소싱처 아이콘 */}
                        <img
                            src={getProviderLogo(product.provider)}
                            alt={product.provider}
                            style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        {/* 상품명 — 항상 한국어 원문, 클릭 시 소싱처 사이트 이동 */}
                        <a
                            href={providerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="product-title-link"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                minWidth: 0,
                                fontSize: font.size.base, fontWeight: 700,
                                color: colors.text.primary,
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = colors.primary; }}
                            onMouseLeave={e => { e.currentTarget.style.color = colors.text.primary; }}
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                                {stripPrefix(product.titleKo)}
                            </span>
                            <ExternalLink size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
                        </a>
                    </div>
                </div>

                {/* 오른쪽 액션 영역 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'], flexShrink: 0 }}>

                    {/* 이전 / 다음 */}
                    <button
                        onClick={onPrev}
                        disabled={!hasPrev}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: hasPrev ? colors.bg.subtle : colors.bg.faint,
                            border: `1px solid ${colors.border.default}`,
                            borderRadius: radius.md,
                            padding: `${spacing['2']} ${spacing['3']}`,
                            fontSize: font.size.sm,
                            color: hasPrev ? colors.text.secondary : colors.text.disabled,
                            cursor: hasPrev ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <ChevronLeft size={14} />
                        이전
                    </button>

                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: hasNext ? colors.bg.subtle : colors.bg.faint,
                            border: `1px solid ${colors.border.default}`,
                            borderRadius: radius.md,
                            padding: `${spacing['2']} ${spacing['3']}`,
                            fontSize: font.size.sm,
                            color: hasNext ? colors.text.secondary : colors.text.disabled,
                            cursor: hasNext ? 'pointer' : 'not-allowed',
                        }}
                    >
                        다음
                        <ChevronRight size={14} />
                    </button>

                    {/* 세로 구분선 */}
                    <div style={{ width: '1px', height: '28px', background: colors.border.default }} />

                    {/* Qoo10 등록 (툴팁 포함) */}
                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => !isTranslated && setShowRegTooltip(true)}
                        onMouseLeave={() => setShowRegTooltip(false)}
                    >
                        <button
                            onClick={isTranslated ? onRegister : undefined}
                            disabled={!isTranslated}
                            style={{
                                background: isTranslated ? colors.primary : colors.bg.subtle,
                                border: 'none',
                                borderRadius: radius.md,
                                padding: `${spacing['2']} ${spacing['4']}`,
                                fontSize: font.size.sm, fontWeight: 600,
                                color: isTranslated ? '#fff' : colors.text.disabled,
                                cursor: isTranslated ? 'pointer' : 'not-allowed',
                                transition: 'background 0.2s',
                            }}
                        >
                            Qoo10 등록
                        </button>

                        {showRegTooltip && (
                            <div style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 8px)',
                                right: 0,
                                background: colors.text.primary,
                                color: '#fff',
                                fontSize: font.size.xs,
                                padding: '6px 10px',
                                borderRadius: radius.md,
                                whiteSpace: 'nowrap',
                                zIndex: zIndex.dropdown,
                                pointerEvents: 'none',
                                boxShadow: shadow.md,
                            }}>
                                번역을 먼저 완료해주세요
                                <div style={{
                                    position: 'absolute',
                                    top: '100%', right: '16px',
                                    border: '5px solid transparent',
                                    borderTopColor: colors.text.primary,
                                }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

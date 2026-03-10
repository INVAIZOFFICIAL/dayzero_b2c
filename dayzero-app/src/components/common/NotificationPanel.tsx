import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, Loader2, X, PackageOpen } from 'lucide-react';
import { useSourcingStore } from '../../store/useSourcingStore';
import { useEditingStore } from '../../store/useEditingStore';
import { colors, font, radius, shadow, spacing, zIndex } from '../../design/tokens';

type PanelTab = '소싱' | '번역' | '등록';

interface Particle {
    id: number;
    originX: number;
    originY: number;
    dx: number;
    dy: number;
}

export const NotificationPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<PanelTab>('소싱');
    const [activeParticles, setActiveParticles] = useState<Particle[]>([]);
    const bellRef = useRef<HTMLButtonElement>(null);

    const { notifications, unreadCount, particleOrigin, markAllRead, triggerParticle } = useSourcingStore();
    const { translationJobs } = useEditingStore();

    const inProgressTranslations = translationJobs.filter((j) => j.status === 'queued' || j.status === 'processing');
    const completedTranslations = translationJobs.filter((j) => j.status === 'completed');
    const failedTranslations = translationJobs.filter((j) => j.status === 'failed');

    const totalBadge = unreadCount + inProgressTranslations.length;

    useEffect(() => {
        if (!particleOrigin || !bellRef.current) return;

        const bellRect = bellRef.current.getBoundingClientRect();
        const bellCenterX = bellRect.left + bellRect.width / 2;
        const bellCenterY = bellRect.top + bellRect.height / 2;

        setActiveParticles(
            Array.from({ length: 7 }, (_, i) => ({
                id: Date.now() + i,
                originX: particleOrigin.x,
                originY: particleOrigin.y,
                dx: bellCenterX - particleOrigin.x,
                dy: bellCenterY - particleOrigin.y,
            }))
        );

        const timer = setTimeout(() => {
            setActiveParticles([]);
            triggerParticle(null);
        }, 1200);

        return () => clearTimeout(timer);
    }, [particleOrigin, triggerParticle]);

    const handleBellClick = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (next) markAllRead();
    };

    const TABS: PanelTab[] = ['소싱', '번역', '등록'];

    return (
        <>
            {/* Particles */}
            {activeParticles.map((p, i) => (
                <div
                    key={p.id}
                    style={{
                        position: 'fixed',
                        left: `${p.originX}px`,
                        top: `${p.originY}px`,
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: colors.primary,
                        zIndex: 9999,
                        pointerEvents: 'none',
                        animationName: 'particleFly',
                        animationDuration: '0.75s',
                        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        animationDelay: `${i * 0.055}s`,
                        animationFillMode: 'forwards',
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                    } as React.CSSProperties}
                />
            ))}

            {/* Bell + Panel container */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: zIndex.modal }}>
                {/* Bell Button */}
                <button
                    ref={bellRef}
                    onClick={handleBellClick}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: colors.text.primary,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                        position: 'relative',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#2D3540')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = colors.text.primary)}
                >
                    <Bell size={22} color="#FFFFFF" />
                    {totalBadge > 0 && !isOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            background: colors.danger,
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            minWidth: '20px',
                            height: '20px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 5px',
                            fontFamily: 'Pretendard, sans-serif',
                            boxShadow: '0 0 0 2px #FFFFFF',
                        }}>
                            {totalBadge > 9 ? '9+' : totalBadge}
                        </div>
                    )}
                </button>

                {/* Notification Panel */}
                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 12px)',
                        right: 0,
                        width: '460px',
                        background: '#FFFFFF',
                        borderRadius: radius.xl,
                        boxShadow: shadow.xl,
                        border: `1px solid ${colors.border.default}`,
                        overflow: 'hidden',
                        animation: 'panelSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        fontFamily: 'Pretendard, sans-serif',
                    }}>
                        {/* Panel Header */}
                        <div style={{
                            padding: `${spacing['5']} ${spacing['6']}`,
                            borderBottom: `1px solid ${colors.border.default}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{ fontSize: font.size.lg, fontWeight: 700, color: colors.text.primary }}>작업 현황</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                            >
                                <X size={18} color={colors.text.muted} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            borderBottom: `1px solid ${colors.border.default}`,
                            padding: `0 ${spacing['6']}`,
                        }}>
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: `${spacing['3']} ${spacing['4']}`,
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: `2px solid ${activeTab === tab ? colors.primary : 'transparent'}`,
                                        marginBottom: '-1px',
                                        fontSize: font.size.base,
                                        fontWeight: activeTab === tab ? 700 : 500,
                                        color: activeTab === tab ? colors.primary : colors.text.tertiary,
                                        cursor: 'pointer',
                                        transition: 'color 0.15s',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div style={{ overflowY: 'auto', maxHeight: '480px' }}>
                            {activeTab === '소싱' && (
                                notifications.length === 0 ? (
                                    <EmptyState label="진행 중인 수집이 없어요" />
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} style={{
                                            padding: `${spacing['5']} ${spacing['6']}`,
                                            borderBottom: `1px solid ${colors.bg.page}`,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing['4'] }}>
                                                <StatusIcon status={n.status === 'completed' ? 'completed' : 'running'} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: font.size.base, fontWeight: 600, color: colors.text.primary, marginBottom: spacing['1'] }}>
                                                        {n.title}
                                                    </div>
                                                    {n.type === 'auto' ? (
                                                        <div style={{ fontSize: font.size.sm, color: colors.text.tertiary }}>
                                                            내일 오전 07:00부터 자동 실행돼요.
                                                        </div>
                                                    ) : n.status === 'running' ? (
                                                        <>
                                                            <div style={{ fontSize: font.size.sm, color: colors.text.tertiary, marginBottom: spacing['2'] }}>
                                                                수집 중... {n.currentCount}/{n.totalCount}건
                                                            </div>
                                                            <ProgressBar value={n.currentCount} max={n.totalCount} />
                                                        </>
                                                    ) : (
                                                        <div style={{ fontSize: font.size.sm, color: colors.success, fontWeight: 600 }}>
                                                            {n.totalCount}건 중 {n.currentCount}건 수집 완료
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}

                            {activeTab === '번역' && (
                                translationJobs.length === 0 ? (
                                    <EmptyState label="진행 중인 번역이 없어요" />
                                ) : (
                                    <>
                                        {inProgressTranslations.length > 0 && (
                                            <SectionLabel label={`번역 중 ${inProgressTranslations.length}개`} />
                                        )}
                                        {inProgressTranslations.map((job) => (
                                            <div key={job.id} style={{
                                                padding: `${spacing['4']} ${spacing['6']}`,
                                                borderBottom: `1px solid ${colors.bg.page}`,
                                                display: 'flex', alignItems: 'center', gap: spacing['4'],
                                            }}>
                                                <StatusIcon status="running" />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {job.productTitleKo}
                                                    </div>
                                                    <div style={{ fontSize: font.size.xs, color: colors.text.muted, marginTop: '2px' }}>
                                                        {job.targets.join(', ')} 번역 중
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {completedTranslations.length > 0 && (
                                            <>
                                                <SectionLabel label={`번역 완료 ${completedTranslations.length}개`} />
                                                {completedTranslations.map((job) => (
                                                    <div key={job.id} style={{
                                                        padding: `${spacing['4']} ${spacing['6']}`,
                                                        borderBottom: `1px solid ${colors.bg.page}`,
                                                        display: 'flex', alignItems: 'center', gap: spacing['4'],
                                                    }}>
                                                        <StatusIcon status="completed" />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {job.productTitleKo}
                                                            </div>
                                                            <div style={{ fontSize: font.size.xs, color: colors.success, marginTop: '2px', fontWeight: 600 }}>
                                                                번역 완료
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {failedTranslations.length > 0 && (
                                            <>
                                                <SectionLabel label={`번역 실패 ${failedTranslations.length}개`} />
                                                {failedTranslations.map((job) => (
                                                    <div key={job.id} style={{
                                                        padding: `${spacing['4']} ${spacing['6']}`,
                                                        borderBottom: `1px solid ${colors.bg.page}`,
                                                        display: 'flex', alignItems: 'center', gap: spacing['4'],
                                                    }}>
                                                        <StatusIcon status="failed" />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {job.productTitleKo}
                                                            </div>
                                                            <div style={{ fontSize: font.size.xs, color: colors.danger, marginTop: '2px', fontWeight: 600 }}>
                                                                번역 실패
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </>
                                )
                            )}

                            {activeTab === '등록' && (
                                <EmptyState label="등록된 작업이 없어요" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const StatusIcon: React.FC<{ status: 'running' | 'completed' | 'failed' }> = ({ status }) => (
    <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: status === 'completed' ? '#F0FFF8' : status === 'failed' ? '#FFF1F2' : '#EFF6FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    }}>
        {status === 'completed'
            ? <CheckCircle2 size={18} color={colors.success} />
            : status === 'failed'
            ? <X size={18} color={colors.danger} />
            : <Loader2 size={18} color={colors.primary} className="spin" />
        }
    </div>
);

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => (
    <div style={{ height: '4px', background: colors.bg.subtle, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
            height: '100%',
            width: `${max > 0 ? (value / max) * 100 : 0}%`,
            background: colors.primary,
            borderRadius: '2px',
            transition: 'width 0.4s ease',
        }} />
    </div>
);

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <div style={{
        padding: `${spacing['3']} ${spacing['6']}`,
        fontSize: font.size.xs,
        fontWeight: 700,
        color: colors.text.muted,
        background: colors.bg.subtle,
        letterSpacing: '0.02em',
    }}>
        {label}
    </div>
);

const EmptyState: React.FC<{ label: string }> = ({ label }) => (
    <div style={{ padding: '56px 24px', textAlign: 'center' }}>
        <PackageOpen size={36} color={colors.border.default} style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: font.size.sm, color: colors.text.muted, margin: 0 }}>{label}</p>
    </div>
);

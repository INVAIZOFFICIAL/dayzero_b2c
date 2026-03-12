import { useState, useCallback, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import type { ProductDetail } from '../../../types/editing';
import { useEditingStore } from '../../../store/useEditingStore';
import { useOnboarding } from '../../../components/onboarding/OnboardingContext';
import { EXCHANGE_RATE } from '../../../mock/categoryMap';
import { colors, font, radius, shadow, spacing, zIndex } from '../../../design/tokens';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

interface Props {
    product: ProductDetail;
}

// ── 공통 스타일 상수 ────────────────────────────────────────────────────────
const flexBetween: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

const sectionBadgeStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '20px', height: '20px',
    background: colors.primary, color: '#fff', borderRadius: '50%',
    fontSize: font.size.xs, fontWeight: 700,
    marginRight: '7px', flexShrink: 0,
};

const costSummaryBadgeStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '18px', height: '18px',
    background: '#fff', color: colors.primary,
    border: `1.5px solid ${colors.primary}`, borderRadius: '50%',
    fontSize: '10px', fontWeight: 700,
};

const summaryRowStyle: React.CSSProperties = {
    ...flexBetween,
    padding: `11px ${spacing['4']}`,
    background: colors.bg.subtle,
    borderTop: `1px solid ${colors.border.default}`,
};

const calcRowStyle: React.CSSProperties = {
    ...flexBetween,
    padding: '11px 0',
};

const subAmountStyle: React.CSSProperties = {
    fontSize: '11px', color: colors.text.muted, marginTop: '1px',
};

const KSE_RATES: [number, number][] = [
    [0.10, 490], [0.25, 560], [0.50, 620], [0.75, 700],
    [1.00, 750], [1.25, 780], [1.50, 830], [1.75, 880],
    [2.00, 940], [2.50, 1090],
];

const lookupKseRate = (kg: number): number => {
    for (const [limit, fee] of KSE_RATES) if (kg <= limit) return fee;
    return KSE_RATES[KSE_RATES.length - 1][1];
};

const QOO10_FEE_RATE = 0.108;

// ── 섹션 레이블 (BasicEditTab과 동일 스타일) ──────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.secondary }}>
        {children}
    </span>
);

// ── 행 구분선 (섹션 내부 행 사이) ─────────────────────────────────────────
const Divider = () => (
    <div style={{ height: '1px', background: colors.border.default }} />
);

// ── 섹션 구분선 (BasicEditTab과 동일: margin spacing[6]) ───────────────────
const SectionDivider = () => (
    <div style={{ height: '1px', background: colors.border.default, margin: `${spacing['6']} 0` }} />
);

// ── 인라인 편집 행 (클릭으로 바로 수정) ───────────────────────────────────
const EditableRow: React.FC<{
    label: string;
    sub?: string;
    value: number;
    prefix: '₩' | '¥';
    onChange: (v: number) => void;
}> = ({ label, sub, value, prefix, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => { if (editing) ref.current?.select(); }, [editing]);
    useEffect(() => { if (!editing) setInput(value); }, [value, editing]);

    const commit = () => { onChange(input); setEditing(false); };

    return (
        <div
            onClick={!editing ? () => { setInput(value); setEditing(true); } : undefined}
            style={{
                ...flexBetween,
                padding: '13px 0', cursor: editing ? 'default' : 'pointer',
            }}
        >
            <div>
                <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>{label}</span>
                {sub && <span style={{ fontSize: font.size.xs, color: colors.text.muted, marginLeft: '4px' }}>{sub}</span>}
            </div>

            {editing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: font.size.sm, color: colors.text.muted }}>{prefix}</span>
                    <input
                        ref={ref}
                        type="number" min={0} value={input}
                        onChange={e => setInput(Number(e.target.value))}
                        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
                        onBlur={commit}
                        className="price-input"
                        style={{
                            width: '90px', textAlign: 'right',
                            padding: '0 0 3px', fontSize: font.size.sm, fontWeight: 600,
                            color: colors.primary, background: 'transparent',
                            border: 'none', borderBottom: `2px solid ${colors.primary}`,
                            outline: 'none', fontFamily: 'inherit',
                        }}
                    />
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary }}>
                        {prefix}{value.toLocaleString()}
                    </span>
                    <Pencil size={10} color={colors.text.muted} />
                </div>
            )}
        </div>
    );
};

// ── 읽기 전용 행 ────────────────────────────────────────────────────────────
const ReadRow: React.FC<{
    label: string;
    sub?: string;
    value: React.ReactNode;
    valueStyle?: React.CSSProperties;
}> = ({ label, sub, value, valueStyle }) => (
    <div style={{ ...flexBetween, padding: '13px 0' }}>
        <div>
            <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>{label}</span>
            {sub && <span style={{ fontSize: font.size.xs, color: colors.text.muted, marginLeft: '4px' }}>{sub}</span>}
        </div>
        <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary, ...valueStyle }}>
            {value}
        </span>
    </div>
);

// ── 무게 floating 툴팁 ─────────────────────────────────────────────────────
const WeightTooltip: React.FC<{ pos: { x: number; y: number }; isAi: boolean }> = ({ pos, isAi }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [adjusted, setAdjusted] = useState(pos);

    useEffect(() => {
        if (!ref.current) return;
        const { width, height } = ref.current.getBoundingClientRect();
        const vw = window.innerWidth;
        let x = pos.x, y = pos.y + 12;
        if (x + width > vw - 16) x = vw - width - 16;
        if (y + height > window.innerHeight - 16) y = pos.y - height - 12;
        setAdjusted({ x, y });
    }, [pos.x, pos.y]);

    return (
        <div ref={ref} style={{
            position: 'fixed', left: adjusted.x, top: adjusted.y, zIndex: zIndex.toast,
            background: colors.text.primary, color: '#fff',
            borderRadius: radius.lg, padding: `${spacing['3']} ${spacing['4']}`,
            boxShadow: shadow.lg, pointerEvents: 'none', maxWidth: '340px', fontSize: font.size.sm,
            animation: 'koIn 0.12s ease',
        }}>
            {isAi ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: colors.primary, color: '#fff', padding: '2px 4px', borderRadius: radius.xs, flexShrink: 0, marginTop: '2px' }}>AI</span>
                    <span style={{ lineHeight: 1.6 }}>상품 무게 정보가 없어 AI가 예측한 무게입니다.<br />실제보다 낮으면 배송비가 추가될 수 있어 여유롭게 설정했습니다.</span>
                </div>
            ) : (
                <span>실제 상품 페이지에서 수집한 무게 정보입니다.</span>
            )}
        </div>
    );
};

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────
export const PriceEditTab: React.FC<Props> = ({ product }) => {
    const { updateProduct } = useEditingStore();
    const { state: onboarding } = useOnboarding();

    const defaultMarginRate = onboarding.marginType === '%' ? onboarding.marginValue : 30;

    const [marginRate, setMarginRate] = useState(defaultMarginRate);
    const [domesticShipping, setDomesticShipping] = useState(onboarding.domesticShipping);
    const [prepCost, setPrepCost] = useState(onboarding.prepCost);
    const [intlShipping, setIntlShipping] = useState(
        onboarding.intlShipping > 0 ? onboarding.intlShipping : lookupKseRate(product.weightKg)
    );
    const [weight, setWeight] = useState(product.weightKg);
    const [salePriceJpy, setSalePriceJpy] = useState(product.salePriceJpy);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const [weightTooltipPos, setWeightTooltipPos] = useState<{ x: number; y: number } | null>(null);
    const [showWeightConfirm, setShowWeightConfirm] = useState(false);
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [weightInput, setWeightInput] = useState(String(product.weightKg));
    const [isWeightUserEdited, setIsWeightUserEdited] = useState(false);
    const weightInputRef = useRef<HTMLInputElement>(null);

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const priceRef = useRef(salePriceJpy);
    priceRef.current = salePriceJpy;

    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        if (savedTimer.current) clearTimeout(savedTimer.current);
        setSalePriceJpy(product.salePriceJpy);
        setMarginRate(defaultMarginRate);
        setDomesticShipping(onboarding.domesticShipping);
        setPrepCost(onboarding.prepCost);
        setIntlShipping(onboarding.intlShipping > 0 ? onboarding.intlShipping : lookupKseRate(product.weightKg));
        setWeight(product.weightKg);
        setWeightInput(String(product.weightKg));
        setIsWeightUserEdited(false);
        setSaveStatus('idle');
        setIsEditingWeight(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    useEffect(() => {
        if (isEditingWeight) weightInputRef.current?.focus();
    }, [isEditingWeight]);

    useEffect(() => {
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
            if (savedTimer.current) clearTimeout(savedTimer.current);
        };
    }, []);

    const triggerSave = useCallback(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        if (savedTimer.current) clearTimeout(savedTimer.current);
        setSaveStatus('saving');
        saveTimer.current = setTimeout(() => {
            updateProduct(product.id, { salePriceJpy: priceRef.current });
            setSaveStatus('saved');
            savedTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
        }, 2000);
    }, [product.id, updateProduct]);

    // ── 계산 ──────────────────────────────────────────────────────────────
    const totalCostKrw = product.originalPriceKrw + domesticShipping + prepCost;
    const costJpy = totalCostKrw / EXCHANGE_RATE;
    const totalCostJpy = costJpy + intlShipping;

    const recalcPrice = (margin: number, domestic: number, prep: number, intl: number) => {
        const total = (product.originalPriceKrw + domestic + prep) / EXCHANGE_RATE + intl;
        const newPrice = Math.round(total * (1 + margin / 100) / 10) * 10;
        setSalePriceJpy(newPrice > 0 ? newPrice : 0);
        priceRef.current = newPrice > 0 ? newPrice : 0;
        triggerSave();
    };

    const handleMarginChange = (v: number) => { setMarginRate(v); recalcPrice(v, domesticShipping, prepCost, intlShipping); };
    const handleDomesticChange = (v: number) => { setDomesticShipping(v); recalcPrice(marginRate, v, prepCost, intlShipping); };
    const handlePrepChange = (v: number) => { setPrepCost(v); recalcPrice(marginRate, domesticShipping, v, intlShipping); };

    const handleWeightSave = () => {
        const numWeight = parseFloat(weightInput) || 0;
        const newIntl = lookupKseRate(numWeight);
        setWeight(numWeight);
        setIsWeightUserEdited(true);
        setIsEditingWeight(false);
        setIntlShipping(newIntl);
        updateProduct(product.id, { weightKg: numWeight });
        recalcPrice(marginRate, domesticShipping, prepCost, newIntl);
    };

    const handlePriceChange = (jpy: number) => {
        setSalePriceJpy(jpy);
        priceRef.current = jpy;
        if (totalCostJpy > 0) setMarginRate(Math.round((jpy / totalCostJpy - 1) * 100));
        triggerSave();
    };

    // ── 수익 계산 ─────────────────────────────────────────────────────────
    const qoo10FeeJpy = Math.round(salePriceJpy * QOO10_FEE_RATE);
    const settlementJpy = salePriceJpy - qoo10FeeJpy;
    const profitJpy = settlementJpy - totalCostJpy;
    const profitKrw = Math.round(profitJpy * EXCHANGE_RATE);
    const effectiveMarginPct = settlementJpy > 0 ? Math.round(profitJpy / settlementJpy * 100) : 0;
    const isProfit = profitKrw > 0;

    const priceInputBase: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box',
        padding: `12px ${spacing['3']}`,
        border: `1.5px solid ${colors.border.default}`,
        borderRadius: radius.md,
        fontSize: font.size.base, color: colors.text.primary,
        outline: 'none', fontFamily: 'inherit',
        background: colors.bg.surface,
        transition: 'border-color 0.15s',
    };

    return (
        <div style={{ maxWidth: '760px' }}>
            <style>{`
                @keyframes savedIn { from { opacity:0; } to { opacity:1; } }
                @keyframes koIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
                .price-input::-webkit-outer-spin-button,
                .price-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .price-input { -moz-appearance: textfield; }
                .editable-row:hover { background: ${colors.bg.faint}; border-radius: ${radius.md}; }
            `}</style>

            {/* ── 원가 구조 ── */}
            <div style={{ ...flexBetween, marginBottom: spacing['2'] }}>
                <SectionLabel><span style={sectionBadgeStyle}>1</span>국내 비용</SectionLabel>
                <div style={{ fontSize: font.size.xs }}>
                    {saveStatus === 'saving' && <span style={{ color: colors.text.muted }}>저장 중...</span>}
                    {saveStatus === 'saved' && <span style={{ color: colors.success, animation: 'savedIn 0.2s ease' }}>저장됨 ✓</span>}
                </div>
            </div>

            <div style={{ border: `1px solid ${colors.border.default}`, borderRadius: radius.lg, overflow: 'hidden' }}>
                <div style={{ padding: `0 ${spacing['4']}` }}>
                    <ReadRow label="소싱 원가" value={`₩${product.originalPriceKrw.toLocaleString()}`} />
                    <Divider />
                    <EditableRow label="국내 배송비" sub="소싱처→집하센터" value={domesticShipping} prefix="₩" onChange={handleDomesticChange} />
                    <Divider />
                    <EditableRow label="작업비" sub="검수/포장" value={prepCost} prefix="₩" onChange={handlePrepChange} />
                </div>
                {/* 합계 행 */}
                <div style={summaryRowStyle}>
                    <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.secondary }}>국내 비용 소계</span>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: font.size.sm, fontWeight: 700, color: colors.text.primary }}>
                            ₩{totalCostKrw.toLocaleString()}
                        </span>
                        <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '2px' }}>
                            ¥{Math.round(costJpy).toLocaleString()} · 환율 ¥1=₩{EXCHANGE_RATE.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 해외 배송비 ── */}
            <div style={{ marginTop: spacing['8'], marginBottom: spacing['2'] }}>
                <SectionLabel><span style={sectionBadgeStyle}>2</span>해외 배송비</SectionLabel>
            </div>

            <div style={{ border: `1px solid ${colors.border.default}`, borderRadius: radius.lg, overflow: 'hidden' }}>
                <div style={{ padding: `0 ${spacing['4']}` }}>
                    {isEditingWeight ? (
                        <div style={{ padding: '12px 0' }}>
                            <div style={flexBetween}>
                                <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>상품 무게</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'] }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <input
                                            ref={weightInputRef}
                                            type="text" inputMode="decimal" className="price-input"
                                            value={weightInput}
                                            onChange={e => setWeightInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleWeightSave(); if (e.key === 'Escape') setIsEditingWeight(false); }}
                                            onFocus={e => e.target.select()}
                                            style={{
                                                width: '80px', textAlign: 'right',
                                                padding: '0 0 3px', fontSize: font.size.sm, fontWeight: 600,
                                                color: colors.primary, background: 'transparent',
                                                border: 'none', borderBottom: `2px solid ${colors.primary}`,
                                                outline: 'none', fontFamily: 'inherit',
                                            }}
                                        />
                                        <span style={{ fontSize: font.size.xs, color: colors.text.muted }}>kg</span>
                                    </div>
                                    <button onClick={handleWeightSave} style={{ padding: `4px 12px`, borderRadius: radius.md, background: colors.primary, border: 'none', fontSize: font.size.xs, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>저장</button>
                                    <button onClick={() => { setIsEditingWeight(false); setWeightInput(String(weight)); }} style={{ padding: `4px 10px`, borderRadius: radius.md, background: 'none', border: `1px solid ${colors.border.default}`, fontSize: font.size.xs, color: colors.text.secondary, cursor: 'pointer' }}>취소</button>
                                </div>
                            </div>
                            <div style={{ fontSize: font.size.xs, color: colors.text.muted, marginTop: '6px' }}>
                                KSE(SAGAWA) 요금표 기준으로 해외 배송비가 자동 계산됩니다
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => isWeightUserEdited ? setIsEditingWeight(true) : setShowWeightConfirm(true)}
                            onMouseMove={e => setWeightTooltipPos({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setWeightTooltipPos(null)}
                            style={{ ...flexBetween, padding: '13px 0', cursor: 'pointer' }}
                        >
                            <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>상품 무게</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {product.isWeightEstimated && !isWeightUserEdited && (
                                    <span style={{ fontSize: '10px', fontWeight: 800, background: colors.primary, color: '#fff', padding: '2px 5px', borderRadius: radius.xs }}>AI</span>
                                )}
                                <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary }}>
                                    {weight}<span style={{ fontSize: font.size.xs, color: colors.text.muted, marginLeft: '2px' }}>kg</span>
                                </span>
                                <Pencil size={10} color={colors.text.muted} />
                            </div>
                        </div>
                    )}
                </div>
                {/* 해외 배송비 합계 행 */}
                <div style={summaryRowStyle}>
                    <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.secondary }}>
                        해외 배송비
                        <span style={{ fontSize: font.size.xs, fontWeight: 400, color: colors.text.muted, marginLeft: '4px' }}>KSE SAGAWA 기준</span>
                    </span>
                    <span style={{ fontSize: font.size.sm, fontWeight: 700, color: colors.text.primary }}>¥{intlShipping.toLocaleString()}</span>
                </div>
            </div>

            {/* 전체 비용 요약 — 독립 파란 박스 */}
            <div style={{
                ...flexBetween,
                padding: `${spacing['3']} ${spacing['4']}`,
                background: colors.primaryLight,
                borderRadius: radius.lg,
                border: `1px solid #BFDBFE`,
                marginTop: spacing['8'],
                marginBottom: spacing['6'],
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={costSummaryBadgeStyle}>1</span>
                        <span style={{ fontSize: font.size.xs, color: colors.primary, fontWeight: 600 }}>+</span>
                        <span style={costSummaryBadgeStyle}>2</span>
                        <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.primary, marginLeft: '4px' }}>전체 비용 합계</span>
                    </div>
                    <div style={{ fontSize: font.size.xs, color: colors.primary, opacity: 0.7, marginTop: '2px' }}>
                        국내 비용 + 해외 배송비 · 상품 구매에 드는 총 비용
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: font.size.base, fontWeight: 700, color: colors.primary }}>
                        ₩{Math.round(totalCostJpy * EXCHANGE_RATE).toLocaleString()}
                    </span>
                    <div style={{ fontSize: font.size.xs, color: colors.primary, opacity: 0.7, marginTop: '2px' }}>
                        ≈ ¥{Math.round(totalCostJpy).toLocaleString()}
                    </div>
                </div>
            </div>

            <SectionDivider />

            {/* ── 판매가 설정 ── */}
            <div style={{ marginBottom: spacing['3'] }}>
                <SectionLabel><span style={sectionBadgeStyle}>3</span>판매가 설정</SectionLabel>
            </div>

            {/* 판매가 ↔ 마진율 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 120px', gap: spacing['3'], alignItems: 'start' }}>
                {/* 판매가 (핵심, 왼쪽) */}
                <div>
                    <div style={{ fontSize: font.size.xs, color: colors.text.muted, marginBottom: spacing['2'] }}>
                        Qoo10 판매가
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: spacing['3'], top: '50%', transform: 'translateY(-50%)', fontSize: font.size.base, fontWeight: 700, color: colors.primary, pointerEvents: 'none' }}>¥</span>
                        <input
                            type="text" inputMode="decimal" className="price-input" value={salePriceJpy}
                            onChange={e => handlePriceChange(Number(e.target.value))}
                            onFocus={e => e.target.select()}
                            style={{ ...priceInputBase, paddingLeft: '28px', borderColor: colors.primary, color: colors.primary, fontWeight: 700 }}
                        />
                    </div>
                    <div style={{ marginTop: '5px', fontSize: font.size.xs, color: colors.text.muted }}>
                        ≈ ₩{Math.round(salePriceJpy * EXCHANGE_RATE).toLocaleString()}
                    </div>
                </div>

                <div style={{ paddingTop: '30px', color: colors.text.muted, fontSize: font.size.lg, userSelect: 'none' }}>↔</div>

                {/* 마진율 (오른쪽) */}
                <div>
                    <div style={{ fontSize: font.size.xs, color: colors.text.muted, marginBottom: spacing['2'] }}>
                        마진율
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text" inputMode="decimal" className="price-input" value={marginRate}
                            onChange={e => handleMarginChange(Number(e.target.value))}
                            onFocus={e => { e.target.select(); e.target.style.borderColor = colors.primary; }}
                            onBlur={e => { e.target.style.borderColor = colors.border.default; }}
                            style={priceInputBase}
                        />
                        <span style={{ position: 'absolute', right: spacing['3'], top: '50%', transform: 'translateY(-50%)', fontSize: font.size.sm, fontWeight: 600, color: colors.text.muted, pointerEvents: 'none' }}>%</span>
                    </div>
                    <div style={{ marginTop: '5px', fontSize: font.size.xs, color: colors.text.muted }}>
                        추천 30~40%
                    </div>
                </div>
            </div>

            <SectionDivider />

            {/* ── 수익 계산 ── */}
            <div style={{ marginBottom: spacing['4'] }}>
                <SectionLabel><span style={sectionBadgeStyle}>4</span>수익 계산</SectionLabel>
            </div>

            <div style={{
                borderRadius: radius.lg,
                border: `1.5px solid ${isProfit ? '#BBF0D4' : colors.dangerLight}`,
                background: isProfit ? '#F6FEF9' : colors.dangerBg,
                overflow: 'hidden',
            }}>
                {/* 계산 내역 */}
                <div style={{ padding: `0 ${spacing['4']}` }}>
                    <div style={calcRowStyle}>
                        <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>판매가</span>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary }}>₩{Math.round(salePriceJpy * EXCHANGE_RATE).toLocaleString()}</div>
                            <div style={subAmountStyle}>¥{salePriceJpy.toLocaleString()}</div>
                        </div>
                    </div>
                    <Divider />
                    <div style={calcRowStyle}>
                        <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>
                            Qoo10 수수료
                            <span style={{ fontSize: font.size.xs, color: colors.text.muted, marginLeft: '4px' }}>10.8%</span>
                        </span>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.danger }}>−₩{Math.round(qoo10FeeJpy * EXCHANGE_RATE).toLocaleString()}</div>
                            <div style={subAmountStyle}>¥{qoo10FeeJpy.toLocaleString()}</div>
                        </div>
                    </div>
                    <Divider />
                    <div style={calcRowStyle}>
                        <span style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.text.primary }}>정산금액</span>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: font.size.sm, fontWeight: 700, color: colors.text.primary }}>₩{Math.round(settlementJpy * EXCHANGE_RATE).toLocaleString()}</div>
                            <div style={subAmountStyle}>¥{settlementJpy.toLocaleString()}</div>
                        </div>
                    </div>
                    <Divider />
                    <div style={calcRowStyle}>
                        <span style={{ fontSize: font.size.sm, color: colors.text.secondary }}>
                            총 비용
                            <span style={{ fontSize: font.size.xs, color: colors.text.muted, marginLeft: '4px' }}>원가+배송</span>
                        </span>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: font.size.sm, fontWeight: 600, color: colors.danger }}>−₩{Math.round(totalCostJpy * EXCHANGE_RATE).toLocaleString()}</div>
                            <div style={subAmountStyle}>¥{Math.round(totalCostJpy).toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* 순이익 강조 영역 */}
                <div style={{
                    ...flexBetween,
                    padding: `${spacing['4']} ${spacing['4']}`,
                    background: isProfit ? '#EDFBF3' : colors.dangerLight,
                    borderTop: `1px solid ${isProfit ? '#BBF0D4' : colors.dangerLight}`,
                }}>
                    <span style={{ fontSize: font.size.sm, fontWeight: 700, color: colors.text.primary }}>순이익 (건당)</span>
                    {isProfit ? (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: font.size.base, fontWeight: 700, color: '#00884A', lineHeight: 1.2 }}>
                                +₩{profitKrw.toLocaleString()}
                            </div>
                            <div style={{ fontSize: font.size.xs, color: colors.text.muted, marginTop: '3px' }}>
                                정산 대비 {effectiveMarginPct}%
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: font.size.base, fontWeight: 700, color: colors.danger, lineHeight: 1.2 }}>
                                −₩{Math.abs(profitKrw).toLocaleString()}
                            </div>
                            <div style={{ fontSize: font.size.xs, color: colors.danger, marginTop: '3px' }}>
                                역마진 — 판매가를 올려야 합니다
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 무게 수정 확인 모달 */}
            <ConfirmModal
                isOpen={showWeightConfirm}
                onClose={() => setShowWeightConfirm(false)}
                onConfirm={() => { setShowWeightConfirm(false); setIsEditingWeight(true); }}
                title="무게를 수정할까요?"
                description={
                    product.isWeightEstimated
                        ? `AI가 예측한 무게예요 (${weight}kg).\n실제 무게와 다를 수 있으니 확인 후 수정하세요.\n수정하면 해외 배송비가 자동 재계산됩니다.`
                        : `소싱처에서 가져온 실제 무게예요 (${weight}kg).\n정말 수정하시겠어요? 수정하면 해외 배송비가 재계산됩니다.`
                }
                confirmText="수정하기"
                cancelText="취소"
                type="info"
            />

            {weightTooltipPos && !isEditingWeight && (
                <WeightTooltip pos={weightTooltipPos} isAi={product.isWeightEstimated && !isWeightUserEdited} />
            )}
        </div>
    );
};

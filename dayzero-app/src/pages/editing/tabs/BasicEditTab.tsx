import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Search, Check, X, Sparkles, Loader2, PenLine, Languages } from 'lucide-react';
import type { ProductDetail, ProductOption } from '../../../types/editing';
import { useEditingStore } from '../../../store/useEditingStore';
import { QOO10_CATEGORY_KO, toKoCategory } from '../../../mock/categoryMap';
import { PENDING_JA_TITLES } from '../../../mock/editingMock';
import { colors, font, radius, shadow, spacing, zIndex } from '../../../design/tokens';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

interface Props {
    product: ProductDetail;
}

const MAX_DESC = 10000;

const stripPrefix = (title: string) => title.replace(/^\[[^\]]+\]\s*/, '');

// ── 공통 스타일 상수 ────────────────────────────────────────────────────────
const flexBetween: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

const inputBase: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: `11px ${spacing['3']}`,
    border: `1.5px solid ${colors.border.default}`,
    borderRadius: radius.md,
    fontSize: font.size.base, color: colors.text.primary,
    outline: 'none', fontFamily: 'inherit',
    background: colors.bg.surface,
    transition: 'border-color 0.15s',
};

const sectionLabelStyle: React.CSSProperties = {
    fontSize: font.size.sm, fontWeight: 600, color: colors.text.secondary,
};

const ghostButtonBase: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
};

// ── 옵션명 mock 번역 사전 ──────────────────────────────────────────────────────
const OPTION_KO_JA: Record<string, string> = {
    '기본': '標準', '기본색': '基本色', '일반': '通常',
    '소': '小', '중': '中', '대': '大',
    'S': 'S', 'M': 'M', 'L': 'L', 'XL': 'XL', 'XXL': 'XXL',
    '화이트': 'ホワイト', '블랙': 'ブラック', '핑크': 'ピンク',
    '블루': 'ブルー', '그린': 'グリーン', '레드': 'レッド',
    '베이지': 'ベージュ', '아이보리': 'アイボリー',
    '네이비': 'ネイビー', '그레이': 'グレー',
    '옐로우': 'イエロー', '퍼플': 'パープル',
    '민트': 'ミント', '라벤더': 'ラベンダー',
    '1개': '1個', '2개': '2個', '3개': '3個', '5개': '5個',
    '1세트': '1セット', '2세트': '2セット',
};
const mockTranslateOption = (ko: string): string => OPTION_KO_JA[ko.trim()] ?? ko;

// ── 한국어 원문 hover 툴팁 ────────────────────────────────────────────────────
const KoTooltip: React.FC<{ pos: { x: number; y: number }; text: string }> = ({ pos, text }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [adjusted, setAdjusted] = useState(pos);

    useEffect(() => {
        if (!ref.current) return;
        const { width, height } = ref.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let x = pos.x + 12;
        let y = pos.y - height - 10;
        if (x + width > vw - 16) x = vw - width - 16;
        if (y < 8) y = pos.y + 16;
        setAdjusted({ x, y });
    }, [pos.x, pos.y]);

    return (
        <div ref={ref} style={{
            position: 'fixed', left: adjusted.x, top: adjusted.y,
            zIndex: zIndex.toast,
            background: colors.text.primary, color: '#fff',
            borderRadius: radius.lg, padding: `${spacing['3']} ${spacing['4']}`,
            fontSize: font.size.base, pointerEvents: 'none',
            boxShadow: shadow.lg,
            maxWidth: '400px', wordBreak: 'keep-all',
            animation: 'koIn 0.12s ease',
        }}>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: font.size.xs, marginBottom: '4px', fontWeight: 500 }}>한국어 원문</div>
            <div style={{ whiteSpace: 'normal', lineHeight: 1.4, fontWeight: 600 }}>{text}</div>
        </div>
    );
};

// ── 한국어 원문 토글 (상세설명 전용) ────────────────────────────────────────
const KoToggle: React.FC<{ text: string }> = ({ text }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ marginTop: '10px' }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: font.size.sm, color: colors.text.muted, padding: 0,
                    transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = colors.text.secondary)}
                onMouseLeave={e => (e.currentTarget.style.color = colors.text.muted)}
            >
                {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                한국어 원문 {open ? '접기' : '보기'}
            </button>
            {open && (
                <div style={{
                    marginTop: spacing['2'], padding: `${spacing['3']} ${spacing['4']}`,
                    background: colors.bg.subtle, borderRadius: radius.md,
                    borderLeft: `3px solid ${colors.border.light}`,
                    fontSize: font.size.sm, color: colors.text.secondary,
                    lineHeight: font.lineHeight.relaxed, whiteSpace: 'pre-wrap',
                    animation: 'koIn 0.16s ease',
                }}>
                    {text}
                </div>
            )}
        </div>
    );
};

// ── 구분선 ───────────────────────────────────────────────────────────────────
const Divider = () => (
    <div style={{ height: '1px', background: colors.border.default, margin: `${spacing['6']} 0` }} />
);

// ── AI 버튼 ──────────────────────────────────────────────────────────────────
const AIButton: React.FC<{
    loading: boolean;
    onClick: () => void;
    label?: string;
    loadingLabel?: string;
    disabled?: boolean;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
}> = ({ loading, onClick, label = 'AI 번역', loadingLabel = '처리 중...', disabled = false, size = 'md', icon = <Sparkles size={13} /> }) => {
    const isDisabled = loading || disabled;
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: size === 'sm' ? `5px ${spacing['2']}` : `7px ${spacing['3']}`,
                background: isDisabled ? colors.bg.subtle : colors.primaryLight,
                border: `1px solid ${isDisabled ? colors.border.default : '#C7DCFD'}`,
                borderRadius: radius.md,
                fontSize: font.size.sm, fontWeight: 600,
                color: isDisabled ? colors.text.muted : colors.primary,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.background = '#DCEEFE'; }}
            onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.background = isDisabled ? colors.bg.subtle : colors.primaryLight; }}
        >
            {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
            {loading ? loadingLabel : label}
        </button>
    );
};

// ── 카테고리 모달 ──────────────────────────────────────────────────────────────
const CategoryModal: React.FC<{
    current: string;
    onSelect: (jaPath: string) => void;
    onClose: () => void;
}> = ({ current, onSelect, onClose }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const results = Object.entries(QOO10_CATEGORY_KO).filter(([ja, ko]) =>
        !query || ko.includes(query) || ja.includes(query)
    );

    return (
        <>
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                zIndex: zIndex.modal,
            }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: zIndex.modal + 1,
                background: colors.bg.surface, borderRadius: radius.xl,
                width: '480px', maxHeight: '580px',
                display: 'flex', flexDirection: 'column',
                boxShadow: shadow.lg, overflow: 'hidden',
                animation: 'modalIn 0.18s ease',
            }}>
                <div style={{
                    ...flexBetween,
                    padding: `${spacing['5']} ${spacing['6']}`,
                    borderBottom: `1px solid ${colors.border.default}`,
                }}>
                    <span style={{ fontSize: font.size.lg, fontWeight: 700, color: colors.text.primary }}>
                        Qoo10 카테고리 변경
                    </span>
                    <button onClick={onClose} style={{
                        ...ghostButtonBase,
                        color: colors.text.muted, display: 'flex', padding: '4px', borderRadius: radius.sm,
                    }}>
                        <X size={20} />
                    </button>
                </div>
                <div style={{ padding: spacing['4'], borderBottom: `1px solid ${colors.border.default}` }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: spacing['2'],
                        padding: `10px ${spacing['3']}`,
                        border: `1.5px solid ${colors.border.default}`,
                        borderRadius: radius.md, background: colors.bg.faint,
                    }}>
                        <Search size={15} color={colors.text.muted} style={{ flexShrink: 0 }} />
                        <input
                            ref={inputRef} value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="카테고리 검색 (예: 스킨케어, 주방)"
                            style={{
                                flex: 1, border: 'none', outline: 'none',
                                background: 'transparent',
                                fontSize: font.size.base, color: colors.text.primary,
                            }}
                        />
                        {query && (
                            <button onClick={() => setQuery('')} style={{
                                ...ghostButtonBase, display: 'flex', color: colors.text.muted,
                            }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {query && (
                        <div style={{ marginTop: spacing['2'], fontSize: font.size.xs, color: colors.text.muted }}>
                            {results.length}개 결과
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {results.length === 0 ? (
                        <div style={{ padding: `${spacing['8']} ${spacing['6']}`, textAlign: 'center', color: colors.text.muted, fontSize: font.size.sm }}>
                            검색 결과가 없습니다
                        </div>
                    ) : results.map(([ja, ko]) => {
                        const isSelected = ja === current;
                        return (
                            <button key={ja}
                                onClick={() => { onSelect(ja); onClose(); }}
                                style={{
                                    ...flexBetween,
                                    width: '100%', padding: `14px ${spacing['6']}`,
                                    background: isSelected ? colors.primaryLight : 'transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left',
                                    borderBottom: `1px solid ${colors.border.default}`,
                                    transition: 'background 0.12s', gap: spacing['3'],
                                }}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = colors.bg.faint; }}
                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <div style={{
                                        fontSize: font.size.sm, fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? colors.primary : colors.text.primary, marginBottom: '3px',
                                    }}>
                                        {ko}
                                    </div>
                                    <div style={{ fontSize: font.size.xs, color: colors.text.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {ja}
                                    </div>
                                </div>
                                {isSelected && <Check size={16} color={colors.primary} style={{ flexShrink: 0 }} />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

// ── 옵션 행 ───────────────────────────────────────────────────────────────────
const OptionRow: React.FC<{
    option: ProductOption;
    imageUrl: string;
    isTranslating: boolean;
    onChange: (field: keyof ProductOption, value: string | number) => void;
    onDelete: () => void;
}> = ({ option, imageUrl, isTranslating, onChange, onDelete }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 90px 36px',
            alignItems: 'center', gap: spacing['3'],
            paddingBottom: spacing['3'],
            marginBottom: spacing['3'],
            borderBottom: `1px solid ${colors.border.default}`,
        }}>
            <img src={imageUrl} alt="" style={{
                width: '44px', height: '44px',
                borderRadius: radius.md, objectFit: 'cover',
                border: `1px solid ${colors.border.default}`, flexShrink: 0,
            }} />

            {/* 옵션명 입력 (hover → 한국어 원문 툴팁) */}
            <div
                style={{ minWidth: 0, position: 'relative' }}
                onMouseMove={(option.nameJa && option.nameJa !== option.nameKo) ? e => setTooltip({ x: e.clientX, y: e.clientY }) : undefined}
                onMouseLeave={(option.nameJa && option.nameJa !== option.nameKo) ? () => setTooltip(null) : undefined}
            >
                {isTranslating ? (
                    <div style={{
                        ...inputBase,
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: colors.primary, background: colors.primaryLight,
                        borderColor: colors.primary,
                    }}>
                        <Loader2 size={13} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                        번역 중...
                    </div>
                ) : (
                    <input
                        value={option.nameJa ?? ''}
                        onChange={e => onChange('nameJa', e.target.value)}
                        placeholder={option.nameKo || '옵션명 입력'}
                        style={inputBase}
                        onFocus={e => (e.target.style.borderColor = colors.primary)}
                        onBlur={e => (e.target.style.borderColor = colors.border.default)}
                    />
                )}
                {tooltip && option.nameKo && (
                    <KoTooltip pos={tooltip} text={option.nameKo} />
                )}
            </div>

            <input
                type="number" min={0}
                value={option.stock}
                onChange={e => onChange('stock', Number(e.target.value))}
                className="stock-input"
                style={{ ...inputBase, textAlign: 'left' }}
                onFocus={e => (e.target.style.borderColor = colors.primary)}
                onBlur={e => (e.target.style.borderColor = colors.border.default)}
            />

            <button
                onClick={() => setConfirmOpen(true)}
                style={{
                    ...ghostButtonBase,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: colors.text.muted, borderRadius: radius.sm,
                    padding: '6px', width: '100%', transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = colors.danger)}
                onMouseLeave={e => (e.currentTarget.style.color = colors.text.muted)}
            >
                <Trash2 size={14} />
            </button>

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={onDelete}
                title="옵션을 삭제할까요?"
                description={`"${option.nameKo || option.nameJa || '이 옵션'}"을 삭제하면 복구할 수 없습니다.`}
                confirmText="삭제하기"
                cancelText="취소"
            />
        </div>
    );
};

// ── 메인 탭 ────────────────────────────────────────────────────────────────────
export const BasicEditTab: React.FC<Props> = ({ product }) => {
    const { updateProduct } = useEditingStore();

    const [titleJa, setTitleJa] = useState(product.titleJa ? stripPrefix(product.titleJa) : stripPrefix(product.titleKo));
    const [descJa, setDescJa] = useState(product.descriptionJa ?? '');
    const [options, setOptions] = useState<ProductOption[]>([...product.options]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [titleTooltip, setTitleTooltip] = useState<{ x: number; y: number } | null>(null);

    const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
    const [isWritingDesc, setIsWritingDesc] = useState(false);
    const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
    const [descKo, setDescKo] = useState('');
    const [descMode, setDescMode] = useState<'ko' | 'ja'>('ja');
    const [showWriteConfirm, setShowWriteConfirm] = useState(false);
    const [showTranslateTooltip, setShowTranslateTooltip] = useState(false);
    const [translatingOptionIds, setTranslatingOptionIds] = useState<Set<string>>(new Set());

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const titleRef = useRef(titleJa);
    const descRef = useRef(descJa);
    const optionsRef = useRef(options);
    titleRef.current = titleJa;
    descRef.current = descJa;
    optionsRef.current = options;

    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        if (savedTimer.current) clearTimeout(savedTimer.current);
        setTitleJa(product.titleJa ? stripPrefix(product.titleJa) : '');
        setDescJa(product.descriptionJa ?? '');
        setOptions([...product.options]);
        setSaveStatus('idle');
        setIsTranslatingTitle(false);
        setIsWritingDesc(false);
        setIsTranslatingDesc(false);
        setDescKo('');
        setDescMode('ja');
        setShowWriteConfirm(false);
        setShowTranslateTooltip(false);
        setTranslatingOptionIds(new Set());
        setTitleTooltip(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

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
            updateProduct(product.id, {
                titleJa: titleRef.current || null,
                descriptionJa: descRef.current || null,
                options: optionsRef.current,
            });
            setSaveStatus('saved');
            savedTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
        }, 2000);
    }, [product.id, updateProduct]);

    const handleTranslateTitle = () => {
        if (isTranslatingTitle) return;
        setIsTranslatingTitle(true);
        setTimeout(() => {
            const raw = PENDING_JA_TITLES[product.id] ?? product.titleJa ?? product.titleKo;
            setTitleJa(stripPrefix(raw));
            setIsTranslatingTitle(false);
            triggerSave();
        }, 1500);
    };

    const hasDescContent = descKo.trim() || descJa.trim();

    const doWriteDesc = () => {
        setIsWritingDesc(true);
        setTimeout(() => {
            setDescKo('이 제품은 피부 타입에 맞는 순한 성분으로 만들어진 스킨케어 제품입니다. 자극 없이 촉촉하게 피부를 정돈해 드립니다.\n\n【특징】\n・민감한 피부에도 부드러운 저자극 처방\n・오래 지속되는 보습을 유지하는 히알루론산 함유\n・한국 코스메틱 브랜드의 인기 상품\n\n【사용 방법】\n세안 후 적당량을 피부에 부드럽게 발라주세요.');
            setDescMode('ko');
            setIsWritingDesc(false);
        }, 2000);
    };

    const handleWriteDesc = () => {
        if (isWritingDesc) return;
        if (hasDescContent) { setShowWriteConfirm(true); return; }
        doWriteDesc();
    };

    const handleTranslateDesc = () => {
        if (isTranslatingDesc || !descKo.trim()) return;
        setIsTranslatingDesc(true);
        setTimeout(() => {
            setDescJa('肌タイプに合わせた優しい成分で作られたスキンケア製品です。刺激なくしっとりと肌を整えます。\n\n【特徴】\n・敏感肌にも優しい低刺激処方\n・長時間保湿をキープするヒアルロン酸配合\n・韓国コスメブランドの人気商品\n\n【使用方法】\n洗顔後、適量をお肌に優しく馴染ませてください。');
            setDescMode('ja');
            setIsTranslatingDesc(false);
            triggerSave();
        }, 1500);
    };

    const handleTranslateOptions = () => {
        if (options.length === 0) return;
        const ids = new Set(options.map(o => o.id));
        setTranslatingOptionIds(ids);
        options.forEach((opt, i) => {
            setTimeout(() => {
                const jaName = mockTranslateOption(opt.nameKo);
                setOptions(prev => prev.map(o => o.id === opt.id ? { ...o, nameJa: jaName } : o));
                setTranslatingOptionIds(prev => {
                    const next = new Set(prev);
                    next.delete(opt.id);
                    return next;
                });
                if (i === options.length - 1) triggerSave();
            }, (i + 1) * 800);
        });
    };

    const updateOption = (id: string, field: keyof ProductOption, value: string | number) => {
        setOptions(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
        triggerSave();
    };

    const addOption = () => {
        setOptions(prev => [...prev, { id: `opt-${Date.now()}`, nameKo: '', nameJa: '', stock: 0 }]);
        triggerSave();
    };

    const deleteOption = (id: string) => {
        setOptions(prev => prev.filter(o => o.id !== id));
        triggerSave();
    };

    const descCount = (descMode === 'ko' ? descKo : descJa).length;
    const descCountColor =
        descCount > MAX_DESC * 0.95 ? colors.danger :
        descCount > MAX_DESC * 0.8 ? colors.warningIcon :
        colors.text.muted;

    const getOptionImage = (idx: number) =>
        product.thumbnails[idx]?.url ?? product.thumbnailUrl;

    const isTranslatingAnyOption = translatingOptionIds.size > 0;
    const hasJaTitle = !!titleJa && titleJa !== stripPrefix(product.titleKo);

    return (
        <div style={{ maxWidth: '760px' }}>
            <style>{`
                @keyframes koIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
                @keyframes modalIn { from { opacity:0; transform:translate(-50%,-48%); } to { opacity:1; transform:translate(-50%,-50%); } }
                @keyframes savedIn { from { opacity:0; } to { opacity:1; } }
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                .stock-input::-webkit-outer-spin-button,
                .stock-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .stock-input { -moz-appearance: textfield; }
            `}</style>

            {/* ── 상품명 ── */}
            <div>
                <div style={{ ...flexBetween, marginBottom: spacing['2'] }}>
                    <span style={sectionLabelStyle}>상품명</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'] }}>
                        {saveStatus === 'saving' && (
                            <span style={{ fontSize: font.size.xs, color: colors.text.muted }}>저장 중...</span>
                        )}
                        {saveStatus === 'saved' && (
                            <span style={{ fontSize: font.size.xs, color: colors.success, animation: 'savedIn 0.2s ease' }}>저장됨 ✓</span>
                        )}
                        <AIButton loading={isTranslatingTitle} onClick={handleTranslateTitle} label="AI 번역" />
                    </div>
                </div>
                {/* hover 시 한국어 원문 툴팁 */}
                <div
                    style={{ position: 'relative' }}
                    onMouseMove={(!isTranslatingTitle && hasJaTitle) ? e => setTitleTooltip({ x: e.clientX, y: e.clientY }) : undefined}
                    onMouseLeave={(!isTranslatingTitle && hasJaTitle) ? () => setTitleTooltip(null) : undefined}
                >
                    {isTranslatingTitle ? (
                        <div style={{
                            ...inputBase,
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: colors.primary, background: colors.primaryLight,
                            borderColor: colors.primary,
                        }}>
                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                            번역 중...
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={titleJa}
                            onChange={e => { setTitleJa(e.target.value); triggerSave(); }}
                            placeholder={titleJa ? '일본어 상품명을 수정하세요' : 'AI 번역 버튼을 눌러 자동 번역하거나 직접 입력하세요'}
                            style={inputBase}
                            onFocus={e => { e.target.style.borderColor = colors.primary; setTitleTooltip(null); }}
                            onBlur={e => (e.target.style.borderColor = colors.border.default)}
                        />
                    )}
                    {titleTooltip && hasJaTitle && (
                        <KoTooltip pos={titleTooltip} text={stripPrefix(product.titleKo)} />
                    )}
                </div>
            </div>

            <Divider />

            {/* ── 카테고리 ── */}
            <div>
                <div style={{ marginBottom: spacing['2'] }}>
                    <span style={sectionLabelStyle}>카테고리</span>
                </div>
                <div
                    onClick={() => setShowCategoryModal(true)}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: `11px ${spacing['3']}`,
                        border: `1.5px solid ${colors.border.default}`,
                        borderRadius: radius.md,
                        fontSize: font.size.base, color: colors.text.primary,
                        background: colors.bg.surface,
                        cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = colors.primary)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border.default)}
                >
                    {toKoCategory(product.qoo10CategoryPath)}
                    <ChevronDown size={15} color={colors.text.muted} style={{ flexShrink: 0 }} />
                </div>
                <div style={{ marginTop: '5px', paddingLeft: spacing['1'], fontSize: font.size.xs, color: colors.text.muted }}>
                    {product.qoo10CategoryPath}
                </div>
            </div>

            <Divider />

            {/* ── 옵션 ── */}
            <div>
                <div style={{ ...flexBetween, marginBottom: spacing['3'] }}>
                    <span style={sectionLabelStyle}>
                        옵션
                        <span style={{ fontSize: font.size.xs, color: colors.text.muted, fontWeight: 500, marginLeft: spacing['2'] }}>
                            {options.length}개
                        </span>
                    </span>
                    <AIButton
                        loading={isTranslatingAnyOption}
                        onClick={handleTranslateOptions}
                        label="AI 번역"
                    />
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: '44px 1fr 90px 36px',
                    paddingBottom: spacing['2'],
                    gap: spacing['3'],
                }}>
                    {['사진', '옵션명', '재고', ''].map((h, i) => (
                        <div key={i} style={{ fontSize: font.size.xs, fontWeight: 600, color: colors.text.muted }}>{h}</div>
                    ))}
                </div>

                {options.length === 0 ? (
                    <div style={{ padding: `${spacing['5']} 0`, fontSize: font.size.sm, color: colors.text.muted }}>
                        옵션이 없습니다
                    </div>
                ) : options.map((opt, idx) => (
                    <OptionRow
                        key={opt.id}
                        option={opt}
                        imageUrl={getOptionImage(idx)}
                        isTranslating={translatingOptionIds.has(opt.id)}
                        onChange={(field, value) => updateOption(opt.id, field, value)}
                        onDelete={() => deleteOption(opt.id)}
                    />
                ))}

                <button
                    onClick={addOption}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        marginTop: spacing['1'], width: '100%', padding: `10px 0`,
                        background: 'none', border: `1.5px dashed ${colors.border.light}`,
                        borderRadius: radius.md, fontSize: font.size.sm, color: colors.text.muted,
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = colors.primary;
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.background = colors.primaryLight;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = colors.text.muted;
                        e.currentTarget.style.borderColor = colors.border.light;
                        e.currentTarget.style.background = 'none';
                    }}
                >
                    <Plus size={14} /> 옵션 추가
                </button>
            </div>

            <Divider />

            {/* ── 상세설명 ── */}
            <div>
                <div style={{ ...flexBetween, marginBottom: spacing['2'] }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'] }}>
                        <span style={sectionLabelStyle}>상세설명</span>
                        {descMode === 'ko' && (
                            <span style={{ fontSize: font.size.xs, color: colors.text.muted, background: colors.bg.subtle, padding: '2px 7px', borderRadius: radius.full }}>
                                한국어 초안
                            </span>
                        )}
                        {descMode === 'ja' && descJa && (
                            <span style={{ fontSize: font.size.xs, color: colors.primary, background: colors.primaryLight, padding: '2px 7px', borderRadius: radius.full }}>
                                일본어
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'] }}>
                        <AIButton loading={isWritingDesc} onClick={handleWriteDesc} label="AI 작성" loadingLabel="작성 중..." icon={<PenLine size={13} />} />
                        <div
                            style={{ position: 'relative' }}
                            onMouseEnter={() => { if (!descKo.trim()) setShowTranslateTooltip(true); }}
                            onMouseLeave={() => setShowTranslateTooltip(false)}
                        >
                            <AIButton loading={isTranslatingDesc} onClick={handleTranslateDesc} label="AI 번역" loadingLabel="번역 중..." disabled={!descKo.trim()} icon={<Languages size={13} />} />
                            {showTranslateTooltip && !descKo.trim() && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                    background: colors.text.primary, color: '#fff',
                                    borderRadius: radius.md, padding: '6px 10px',
                                    fontSize: font.size.xs, fontWeight: 500,
                                    whiteSpace: 'nowrap', zIndex: zIndex.dropdown,
                                    pointerEvents: 'none',
                                }}>
                                    {descMode === 'ja' && descJa ? '이미 일본어로 번역되어 있습니다' : 'AI 작성을 먼저 해주세요'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <textarea
                        value={descMode === 'ko' ? descKo : descJa}
                        onChange={e => {
                            if (descMode === 'ko') {
                                setDescKo(e.target.value);
                            } else {
                                if (e.target.value.length <= MAX_DESC) { setDescJa(e.target.value); triggerSave(); }
                            }
                        }}
                        placeholder={
                            isWritingDesc ? '작성 중...' :
                            isTranslatingDesc ? '번역 중...' :
                            descMode === 'ko' ? '수정 후 AI 번역 버튼을 눌러 일본어로 변환하세요' :
                            product.translationStatus === 'completed' ? '일본어 상세설명을 수정하세요' :
                            'AI 작성 버튼으로 한국어 초안을 만들거나 직접 입력하세요'
                        }
                        disabled={isWritingDesc || isTranslatingDesc}
                        rows={10}
                        style={{
                            ...inputBase,
                            resize: 'vertical', lineHeight: font.lineHeight.relaxed, paddingBottom: '32px',
                            background: (isWritingDesc || isTranslatingDesc) ? colors.bg.faint : colors.bg.surface,
                        }}
                        onFocus={e => (e.target.style.borderColor = colors.primary)}
                        onBlur={e => (e.target.style.borderColor = colors.border.default)}
                    />
                    <div style={{
                        position: 'absolute', bottom: spacing['2'], right: spacing['3'],
                        fontSize: font.size.xs, color: descCountColor,
                        pointerEvents: 'none', transition: 'color 0.3s',
                    }}>
                        {descCount.toLocaleString()} / {MAX_DESC.toLocaleString()}
                    </div>
                </div>
                {product.descriptionKo && descMode === 'ja' && !descJa && <KoToggle text={product.descriptionKo} />}
            </div>

            <ConfirmModal
                isOpen={showWriteConfirm}
                onClose={() => setShowWriteConfirm(false)}
                onConfirm={() => { setShowWriteConfirm(false); doWriteDesc(); }}
                title="현재 내용을 지우고 다시 작성할까요?"
                description="AI 작성을 다시 실행하면 현재 작성된 내용이 모두 지워집니다."
                confirmText="다시 작성"
                cancelText="취소"
                type="info"
            />

            {showCategoryModal && (
                <CategoryModal
                    current={product.qoo10CategoryPath}
                    onSelect={(jaPath) => updateProduct(product.id, {
                        qoo10CategoryPath: jaPath,
                        qoo10CategoryId: `cat-${jaPath.replace(/[^\w]/g, '-')}`,
                    })}
                    onClose={() => setShowCategoryModal(false)}
                />
            )}
        </div>
    );
};

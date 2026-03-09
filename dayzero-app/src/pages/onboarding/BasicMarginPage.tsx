import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, Calculator, Package, Truck, Globe, RefreshCw } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';

const EXCHANGE_RATE = 9.2;
const PLATFORM_FEE_RATE = 0.12;

const inputStyles = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #E5E8EB',
    fontSize: '15px',
    color: '#191F28',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
    outline: 'none',
    fontFamily: 'Pretendard, -apple-system, sans-serif',
};

const labelStyles = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#4E5968',
    marginBottom: '8px',
};

const cardStyles = {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #F2F4F6',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
};

interface CostFieldProps {
    label: string;
    labelSub?: string;
    value: number;
    onChange: (v: number) => void;
    hint: string;
    prefix?: string;
    highlighted?: boolean;
}

function CostField({ label, labelSub, value, onChange, hint, prefix = '₩', highlighted = false }: CostFieldProps) {
    return (
        <div>
            <label style={labelStyles}>
                {label}
                {labelSub && <span style={{ fontWeight: 400, color: '#8B95A1' }}>{labelSub}</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    type="number"
                    value={value === 0 ? '' : value}
                    onChange={e => onChange(Number(e.target.value))}
                    placeholder="0"
                    style={{
                        ...inputStyles,
                        paddingLeft: '32px',
                        ...(highlighted && { borderColor: '#3182F6', background: '#F2F8FF' }),
                    }}
                />
                <span style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    color: highlighted ? '#3182F6' : '#191F28', fontWeight: 600,
                }}>
                    {prefix}
                </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8B95A1' }}>{hint}</p>
        </div>
    );
}

export default function BasicMarginPage() {
    const navigate = useNavigate();
    const { state, setState } = useOnboarding();

    const { marginType, marginValue, domesticShipping, prepCost, intlShipping } = state;
    const updateState = (updates: Partial<typeof state>) => setState(prev => ({ ...prev, ...updates }));

    const [showFeeTable, setShowFeeTable] = useState(false);
    const [showMarginTip, setShowMarginTip] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [showCalculation, setShowCalculation] = useState(false);
    const [simBaseCost, setSimBaseCost] = useState(15000);

    const { marginAmount, totalKrw, convertedJpy, finalPriceJpy, payoutJpy, payoutKrw } = useMemo(() => {
        const margin = marginType === '%' ? Math.round(simBaseCost * (marginValue / 100)) : marginValue;
        const krw = simBaseCost + margin + domesticShipping + prepCost;
        const jpyAmount = Math.round(krw / EXCHANGE_RATE);
        const finalJpy = jpyAmount + intlShipping;
        const fee = Math.round(finalJpy * PLATFORM_FEE_RATE);
        const payoutJpyVal = finalJpy - fee;
        return {
            marginAmount: margin,
            totalKrw: krw,
            convertedJpy: jpyAmount,
            finalPriceJpy: finalJpy,
            payoutJpy: payoutJpyVal,
            payoutKrw: Math.round(payoutJpyVal * EXCHANGE_RATE),
        };
    }, [marginType, marginValue, domesticShipping, prepCost, intlShipping, simBaseCost]);

    const calcRows = [
        { icon: <Package size={14} />, label: `₩${simBaseCost.toLocaleString()} + 마진 ${marginValue}%`, value: `₩${Math.round(simBaseCost + marginAmount).toLocaleString()}`, highlight: false },
        { icon: <Truck size={14} />, label: '국내배송비/작업비 합계', value: `₩${totalKrw.toLocaleString()}`, highlight: false },
        { icon: <RefreshCw size={14} />, label: `엔화 환전 (₩${EXCHANGE_RATE}:¥1)`, value: `¥${convertedJpy.toLocaleString()}`, highlight: false },
        { icon: <Globe size={14} />, label: '해외 배송비 합산', value: `¥${finalPriceJpy.toLocaleString()}`, highlight: true },
    ];

    return (
        <>
            <OnboardingLayout currentStep={3} wide>
                <div style={{ width: '100%' }}>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#191F28', textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                        마진 및 비용 기본 설정
                    </h2>
                    <p style={{ fontSize: '15px', color: '#6B7684', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                        모든 상품에 기본 적용되는 값입니다.<br />
                        상품별 개별 조정은 편집 단계에서 가능합니다.
                    </p>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'start', justifyContent: 'center', marginBottom: '8px' }}>
                        {/* 설정 컬럼 */}
                        <div style={{ width: '480px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* 마진 설정 */}
                            <div style={cardStyles}>
                                <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28' }}>마진 설정</div>
                                <div>
                                    <label style={labelStyles}>
                                        기본 마진율
                                        <span
                                            style={{ position: 'relative', display: 'inline-block', marginLeft: '6px', cursor: 'pointer', verticalAlign: 'middle' }}
                                            onMouseEnter={() => setShowMarginTip(true)}
                                            onMouseLeave={() => setShowMarginTip(false)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
                                                <circle cx="8" cy="8" r="7.5" stroke="#B0B8C1" />
                                                <text x="8" y="12" textAnchor="middle" fill="#8B95A1" fontSize="10" fontFamily="Pretendard, sans-serif" fontWeight="600">i</text>
                                            </svg>
                                            {showMarginTip && (
                                                <div style={{
                                                    position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                                                    background: '#191F28', color: '#fff', borderRadius: '10px', padding: '12px 14px',
                                                    fontSize: '12px', lineHeight: 1.7, whiteSpace: 'nowrap', zIndex: 100,
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                                }}>
                                                    <div style={{ fontWeight: 700, marginBottom: '6px', color: '#fff' }}>💡 셀러 평균 마진율</div>
                                                    <div>초보 셀러 추천 <strong style={{ color: '#60A5FA' }}>30~35%</strong></div>
                                                    <div>일반적인 범위 <strong style={{ color: '#60A5FA' }}>25~40%</strong></div>
                                                    <div>경쟁상품 많을 때 <strong style={{ color: '#FBBF24' }}>15~25%</strong></div>
                                                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#8B95A1' }}>상품 원가 대비 이익 비율입니다.</div>
                                                    <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #191F28' }} />
                                                </div>
                                            )}
                                        </span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            value={marginValue || ''}
                                            onChange={e => updateState({ marginValue: Number(e.target.value) })}
                                            placeholder="30"
                                            style={inputStyles}
                                        />
                                        <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8B95A1', fontWeight: 700, fontSize: '15px' }}>%</span>
                                    </div>
                                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#8B95A1' }}>초보 셀러에게는 <strong style={{ color: '#3182F6' }}>30%</strong> 설정을 권장합니다.</p>
                                </div>
                            </div>

                            {/* 비용 설정 */}
                            <div style={cardStyles}>
                                <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28' }}>비용 설정</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <CostField
                                        label="국내 배송비"
                                        labelSub=" (소싱처 → 집하센터)"
                                        value={domesticShipping}
                                        onChange={v => updateState({ domesticShipping: v })}
                                        hint="무료배송 상품이 대부분이라면 0원으로 두세요."
                                    />
                                    <CostField
                                        label="작업비"
                                        labelSub=" (포장/검수 등)"
                                        value={prepCost}
                                        onChange={v => updateState({ prepCost: v })}
                                        hint="배송대행사에 납부하는 검수·포장 수수료입니다."
                                    />
                                    <CostField
                                        label="해외 배송비"
                                        labelSub=" (일본 소비자까지)"
                                        value={intlShipping}
                                        onChange={v => updateState({ intlShipping: v })}
                                        hint="이용 중인 배송대행사의 요금을 입력하세요. (큐익스프레스, 링코스 등)"
                                        prefix="¥"
                                        highlighted
                                    />
                                </div>
                            </div>

                            {/* 버튼 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button
                                    onClick={() => setShowComplete(true)}
                                    style={{
                                        width: '100%', height: '52px',
                                        background: '#3182F6', color: '#FFFFFF',
                                        border: 'none', borderRadius: '12px',
                                        fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'background 0.2s, transform 0.1s',
                                    }}
                                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    설정 완료
                                    <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => navigate('/onboarding/step2')}
                                    style={{
                                        width: '100%', height: '52px',
                                        background: 'transparent', color: '#6B7684',
                                        border: 'none', fontSize: '15px', fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#191F28'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#6B7684'}
                                >
                                    이전 화면으로 돌아가기
                                </button>
                            </div>
                        </div>

                        {/* 시뮬레이션 컬럼 */}
                        <div style={{ width: '360px', flexShrink: 0 }}>
                            <div style={{ ...cardStyles, background: '#F4F5F7', border: '1px solid #E5E8EB' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calculator size={16} color="#3182F6" />
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#191F28' }}>가격 시뮬레이션</div>
                                </div>

                                {/* 원가 입력 */}
                                <div>
                                    <label style={{ ...labelStyles, fontSize: '12px', color: '#6B7684', marginBottom: '6px' }}>상품 원가 (₩)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={simBaseCost.toLocaleString()}
                                            onChange={e => setSimBaseCost(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                                            style={{ ...inputStyles, padding: '12px 36px 12px 14px', fontSize: '14px', fontWeight: 600, border: '1.5px solid #E5E8EB' }}
                                        />
                                        <Calculator size={14} color="#B0B8C1" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    </div>
                                </div>

                                {/* 최종 판매가 + 수령액 */}
                                <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E8EB', overflow: 'hidden', textAlign: 'center' }}>
                                    <div style={{ padding: '20px 16px 16px' }}>
                                        <div style={{ fontSize: '13px', color: '#4E5968', fontWeight: 600, marginBottom: '6px' }}>Qoo10 최종 판매가</div>
                                        <div style={{ color: '#3182F6', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '36px', fontWeight: 900 }}>¥{finalPriceJpy.toLocaleString()}</span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>일본 소비자가 보게 되는 가격</div>
                                    </div>
                                    <div style={{ height: '1px', background: '#F2F4F6', margin: '0 16px' }} />
                                    <div style={{ padding: '14px 16px 18px', background: '#FAFBFC' }}>
                                        <div style={{ fontSize: '12px', color: '#8B95A1', lineHeight: 1.5 }}>Qoo10 수수료 약 12% 차감 후 예상 수령액</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginTop: '5px' }}>
                                            ¥{payoutJpy.toLocaleString()}{' '}
                                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#6B7684' }}>(약 ₩{payoutKrw.toLocaleString()})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 계산 과정 보기 */}
                                <div>
                                    <button
                                        onClick={() => setShowCalculation(!showCalculation)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                            width: '100%', background: '#fff', border: '1px solid #E5E8EB',
                                            borderRadius: '10px', padding: '10px',
                                            color: '#4E5968', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                                    >
                                        {showCalculation ? '계산 과정 접기' : '계산 과정 보기'}
                                        {showCalculation ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                    {showCalculation && (
                                        <div style={{ marginTop: '10px', background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #E5E8EB', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {calcRows.map((row, i) => (
                                                <Fragment key={i}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B95A1', fontSize: '12px' }}>
                                                            {row.icon} {row.label}
                                                        </div>
                                                        <div style={{ fontSize: row.highlight ? '14px' : '13px', fontWeight: row.highlight ? 800 : 700, color: row.highlight ? '#3182F6' : '#191F28' }}>
                                                            {row.value}
                                                        </div>
                                                    </div>
                                                    {i < calcRows.length - 1 && (
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <ArrowRight size={12} color="#E5E8EB" style={{ transform: 'rotate(90deg)' }} />
                                                        </div>
                                                    )}
                                                </Fragment>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 수수료 테이블 */}
                                <div>
                                    <button
                                        onClick={() => setShowFeeTable(!showFeeTable)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                            width: '100%', background: 'transparent', border: 'none',
                                            color: '#B0B8C1', fontSize: '11px', cursor: 'pointer', padding: '4px 0',
                                        }}
                                    >
                                        Qoo10 카테고리별 수수료율 {showFeeTable ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                                    </button>
                                    {showFeeTable && (
                                        <div style={{ marginTop: '6px', background: '#fff', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', color: '#8B95A1', border: '1px solid #E5E8EB' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>패션 / 뷰티</span><span style={{ fontWeight: 600 }}>10~12%</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>기타 카테고리</span><span style={{ fontWeight: 600 }}>6~10%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </OnboardingLayout>

            {/* 완료 화면 */}
            {showComplete && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    background: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'completeFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px', maxWidth: '440px', width: '100%' }}>
                        {/* SVG 체크 애니메이션 */}
                        <svg width="72" height="72" viewBox="0 0 72 72" fill="none"
                            style={{ marginBottom: '32px', animation: 'riseUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both' }}>
                            <circle
                                cx="36" cy="36" r="33"
                                stroke="#3182F6" strokeWidth="2.5" fill="none"
                                strokeDasharray="207" strokeDashoffset="207"
                                style={{ animation: 'checkCircle 0.55s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards' }}
                            />
                            <polyline
                                points="22,36 31,46 50,26"
                                stroke="#3182F6" strokeWidth="3" fill="none"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeDasharray="50" strokeDashoffset="50"
                                style={{ animation: 'checkMark 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards' }}
                            />
                        </svg>

                        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#191F28', margin: '0 0 8px', letterSpacing: '-0.5px', animation: 'riseUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}>
                            기본 설정이 완료됐어요
                        </h2>
                        <p style={{ fontSize: '15px', color: '#6B7684', margin: '0 0 40px', lineHeight: 1.6, animation: 'riseUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}>
                            이제 첫 상품을 소싱해볼까요?
                        </p>

                        {/* 완료 항목 요약 */}
                        <div style={{ width: '100%', border: '1px solid #F2F4F6', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', animation: 'riseUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}>
                            {[
                                { label: 'Qoo10 JP 연동', desc: state.storeName || '연동 완료' },
                                { label: '배송지 및 기본 정보', desc: '출하지 · 반품지 설정 완료' },
                                { label: '마진 및 비용', desc: `마진 ${marginValue}% · 해외배송 ¥${intlShipping.toLocaleString()}` },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 20px',
                                    borderTop: i > 0 ? '1px solid #F2F4F6' : 'none',
                                    background: '#FFFFFF',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="8" fill="#EBF4FF" />
                                            <polyline points="4.5,8 6.5,10.5 11.5,5.5" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#191F28' }}>{item.label}</span>
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#8B95A1' }}>{item.desc}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => navigate('/sourcing')}
                            style={{
                                width: '100%', height: '54px',
                                background: '#3182F6', color: '#FFFFFF',
                                border: 'none', borderRadius: '14px',
                                fontSize: '16px', fontWeight: 700,
                                cursor: 'pointer', letterSpacing: '-0.2px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'background 0.15s, transform 0.1s',
                                animation: 'riseUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1B64DA'}
                            onMouseLeave={e => e.currentTarget.style.background = '#3182F6'}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            소싱 시작하기
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

import { useOnboarding, type ForwarderValue } from '../../components/onboarding/OnboardingContext';

interface ForwarderPreset {
    id: ForwarderValue;
    label: string;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
}

const PRESETS: ForwarderPreset[] = [
    {
        id: 'qx',
        label: '큐익스프레스 (Qxpress)',
        zipCode: '273-0012',
        addressLine1: '千葉県船橋市浜町2-5-7',
        addressLine2: 'MFLP船橋1-3階 Qxpress',
    },
    {
        id: 'rincos',
        label: '링코스 (Rincos)',
        zipCode: '143-0001',
        addressLine1: '東京都大田区東海4-2-3',
        addressLine2: 'リンコス東京物流管理センター',
    },
    {
        id: 'other',
        label: '직접 입력하기 (기타)',
        zipCode: '',
        addressLine1: '',
        addressLine2: '',
    }
];

export default function BasicInfoPage() {
    const navigate = useNavigate();
    const { state, setState } = useOnboarding();

    const {
        forwarder,
        zipCode,
        addressLine1,
        addressLine2,
        sameAsShipping,
        returnZipCode,
        returnAddressLine1,
        returnAddressLine2,
        contact
    } = state;

    const updateState = (updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePresetSelect = (val: ForwarderValue) => {
        const preset = PRESETS.find(p => p.id === val);
        const updates: any = { forwarder: val };

        if (preset && preset.id !== 'other') {
            updates.zipCode = preset.zipCode;
            updates.addressLine1 = preset.addressLine1;
            updates.addressLine2 = preset.addressLine2;
        } else if (preset?.id === 'other') {
            updates.zipCode = '';
            updates.addressLine1 = '';
            updates.addressLine2 = '';
        }

        updateState(updates);
        setIsDropdownOpen(false);
    };

    const isNextEnabled = () => {
        if (!forwarder) return false;
        if (!zipCode || !addressLine1) return false;

        if (!sameAsShipping) {
            if (!returnZipCode || !returnAddressLine1) return false;
        }

        if (!contact) return false;

        return true;
    };

    const handleNext = () => {
        if (!isNextEnabled()) return;
        navigate('/basic-margin');
    };

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
        fontFamily: 'Pretendard, -apple-system, sans-serif'
    };

    const labelStyles = {
        display: 'block',
        fontSize: '14px',
        fontWeight: 600,
        color: '#4E5968',
        marginBottom: '8px'
    };

    return (
        <OnboardingLayout currentStep={2}>
            <div style={{ padding: '0 20px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#191F28', textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                    배송지 및 기본 정보 입력
                </h2>
                <p style={{ fontSize: '15px', color: '#6B7684', textAlign: 'center', margin: '0 0 40px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    Qoo10 JP에 상품을 등록하려면 일본 내 출하지와 반품 주소가 필요해요.<br />
                    이용하시는 배송대행사를 선택하면 주소가 자동으로 채워집니다.
                </p>

                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #F2F4F6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px'
                }}>

                    {/* Section 1: Forwarder / Shipping Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyles}>배송대행사 선택 <span style={{ color: '#3182F6' }}>*</span></label>
                            <div style={{ position: 'relative' }} ref={dropdownRef}>
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        ...inputStyles,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        color: forwarder ? '#191F28' : '#8B95A1',
                                        border: isDropdownOpen ? '1px solid #3182F6' : '1px solid #E5E8EB',
                                        boxShadow: isDropdownOpen ? '0 0 0 3px rgba(49, 130, 246, 0.1)' : 'none',
                                        userSelect: 'none'
                                    }}
                                >
                                    <span>
                                        {forwarder ? PRESETS.find(p => p.id === forwarder)?.label : '이용하시는 배송대행사를 선택해주세요'}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        color={isDropdownOpen ? '#3182F6' : '#8B95A1'}
                                        style={{
                                            transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s ease, color 0.2s ease'
                                        }}
                                    />
                                </div>

                                {isDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        left: 0,
                                        width: '100%',
                                        background: '#FFFFFF',
                                        border: '1px solid #E5E8EB',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                        overflow: 'hidden',
                                        zIndex: 10,
                                        animation: 'dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}>
                                        <style>
                                            {`
                                            @keyframes dropdownFadeIn {
                                                from { opacity: 0; transform: translateY(-8px); }
                                                to { opacity: 1; transform: translateY(0); }
                                            }
                                            .dropdown-item {
                                                padding: 16px;
                                                font-size: 15px;
                                                color: #191F28;
                                                cursor: pointer;
                                                transition: background 0.2s ease;
                                            }
                                            .dropdown-item:hover {
                                                background: #F9FAFB;
                                            }
                                            .dropdown-item-selected {
                                                background: #F2F8FF;
                                                color: #3182F6;
                                                font-weight: 600;
                                            }
                                            .dropdown-item-selected:hover {
                                                background: #E8F3FF;
                                            }
                                            `}
                                        </style>
                                        {PRESETS.map((p) => (
                                            <div
                                                key={p.id}
                                                className={`dropdown-item ${forwarder === p.id ? 'dropdown-item-selected' : ''}`}
                                                onClick={() => handlePresetSelect(p.id)}
                                            >
                                                {p.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {forwarder && (
                            <div style={{
                                display: 'flex', flexDirection: 'column', gap: '16px',
                                padding: '20px', background: '#F9FAFB', borderRadius: '12px'
                            }}>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: '#191F28' }}>출하지 주소 (발송지)</div>
                                <div>
                                    <input
                                        value={zipCode}
                                        onChange={(e) => updateState({ zipCode: e.target.value })}
                                        placeholder="우편번호 (예: 273-0012)"
                                        style={inputStyles}
                                        disabled={forwarder !== 'other'}
                                    />
                                </div>
                                <div>
                                    <input
                                        value={addressLine1}
                                        onChange={(e) => updateState({ addressLine1: e.target.value })}
                                        placeholder="기본 주소"
                                        style={{ ...inputStyles, marginBottom: '8px' }}
                                        disabled={forwarder !== 'other'}
                                    />
                                    <input
                                        value={addressLine2}
                                        onChange={(e) => updateState({ addressLine2: e.target.value })}
                                        placeholder="상세 주소"
                                        style={inputStyles}
                                        disabled={forwarder !== 'other'}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Return Address */}
                    <div style={{ borderTop: '1px solid #F2F4F6', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ ...labelStyles, marginBottom: 0 }}>반품 주소 <span style={{ color: '#3182F6' }}>*</span></label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={sameAsShipping}
                                    onChange={(e) => updateState({ sameAsShipping: e.target.checked })}
                                    style={{
                                        width: '18px', height: '18px', cursor: 'pointer',
                                        accentColor: '#3182F6'
                                    }}
                                />
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#4E5968' }}>출하지와 동일</span>
                            </label>
                        </div>

                        {!sameAsShipping && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <input
                                        value={returnZipCode}
                                        onChange={(e) => updateState({ returnZipCode: e.target.value })}
                                        placeholder="우편번호"
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <input
                                        value={returnAddressLine1}
                                        onChange={(e) => updateState({ returnAddressLine1: e.target.value })}
                                        placeholder="기본 주소"
                                        style={{ ...inputStyles, marginBottom: '8px' }}
                                    />
                                    <input
                                        value={returnAddressLine2}
                                        onChange={(e) => updateState({ returnAddressLine2: e.target.value })}
                                        placeholder="상세 주소"
                                        style={inputStyles}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Contact */}
                    <div style={{ borderTop: '1px solid #F2F4F6', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyles}>스토어 연락처 <span style={{ color: '#3182F6' }}>*</span></label>
                            <input
                                value={contact}
                                onChange={(e) => updateState({ contact: e.target.value })}
                                placeholder="고객 응대용 연락처 입력 (예: 010-1234-5678)"
                                style={inputStyles}
                            />
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#8B95A1' }}>
                                배송 문제나 클레임 발생 시 Qoo10 또는 택배사가 연락하는 수단입니다.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={handleNext}
                            disabled={!isNextEnabled()}
                            style={{
                                width: '100%',
                                height: '52px',
                                background: !isNextEnabled() ? '#D1D6DB' : '#3182F6',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: !isNextEnabled() ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'background 0.2s, transform 0.1s',
                            }}
                            onMouseDown={(e) => {
                                if (isNextEnabled()) e.currentTarget.style.transform = 'scale(0.98)';
                            }}
                            onMouseUp={(e) => {
                                if (isNextEnabled()) e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            다음 단계로 계속
                            <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={() => navigate('/qoo10-connect')}
                            style={{
                                width: '100%',
                                height: '52px',
                                background: 'transparent',
                                color: '#6B7684',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#191F28'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#6B7684'}
                        >
                            원하는 스토어가 아닌가요? 이전 화면으로 가기
                        </button>
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
}

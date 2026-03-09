import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { SOURCING_PROVIDERS } from '../../types/sourcing';
import type { SourcingProvider } from '../../types/sourcing';
import { useSourcingStore } from '../../store/useSourcingStore';
import { Sparkles, Check } from 'lucide-react';

// Mock Category Data
const MOCK_CATEGORIES: Record<string, string[]> = {
    '올리브영': ['뷰티 > 스킨케어', '뷰티 > 메이크업', '헬스/푸드', '멘즈케어'],
    '쿠팡': ['로켓배송 > 생활용품', '가전/디지털', '식품', '홈/인테리어'],
    // Default fallback
    'default': ['전체', '인기 카테고리 1', '인기 카테고리 2']
};

export default function AutoSourcingPage() {
    const navigate = useNavigate();
    const { addSchedule, addJob } = useSourcingStore();

    const [selectedProviders, setSelectedProviders] = useState<SourcingProvider[]>(['올리브영']);
    const [selectedCriteria, setSelectedCriteria] = useState<'인기상품' | '신상품'>('인기상품');
    const [selectedCategory, setSelectedCategory] = useState<string>('뷰티 > 스킨케어');
    const [targetCount, setTargetCount] = useState<string>('50');
    const [timeString, setTimeString] = useState<string>('06:00');

    const toggleProvider = (provider: SourcingProvider) => {
        setSelectedProviders(prev =>
            prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]
        );
        // Reset category on provider change for simplicity in mock
        const newCats = MOCK_CATEGORIES[provider] || MOCK_CATEGORIES['default'];
        setSelectedCategory(newCats[0]);
    };

    const handleStart = () => {
        if (selectedProviders.length === 0) return;

        const numCount = parseInt(targetCount, 10);
        if (isNaN(numCount) || numCount < 10 || numCount > 500) {
            alert('수량은 10~500 사이로 입력해주세요.');
            return;
        }

        // 1. Create Schedules
        selectedProviders.forEach(provider => {
            addSchedule({
                id: `sched-${Date.now()}-${provider}`,
                provider,
                categoryPath: selectedCategory,
                criteria: selectedCriteria,
                targetCount: numCount,
                timeString,
                isActive: true
            });
        });

        // 2. Create immediate run Job
        addJob({
            id: `job-auto-${Date.now()}`,
            type: 'AUTO',
            provider: selectedProviders[0], // Represent the first one in mock job
            categorySummary: selectedCriteria,
            status: 'running',
            totalCount: numCount * selectedProviders.length,
            currentCount: 0,
            createdAt: new Date().toISOString()
        });

        // Navigate to running state
        navigate('/sourcing/result');
    };

    const isFormValid = selectedProviders.length > 0 &&
        parseInt(targetCount, 10) >= 10 &&
        parseInt(targetCount, 10) <= 500;

    return (
        <MainLayout>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', paddingBottom: '120px', animation: 'fadeInUp 0.4s ease' }}>
                <button
                    onClick={() => navigate('/sourcing')}
                    style={{ background: 'none', border: 'none', color: '#8B95A1', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '24px', padding: 0 }}
                >
                    ← 뒤로가기
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F2F1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A5DF2' }}>
                        <Sparkles size={20} strokeWidth={2} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#191F28' }}>
                        자동 수집 설정
                    </h1>
                </div>
                <p style={{ fontSize: '15px', color: '#6B7684', marginBottom: '40px' }}>
                    설정한 카테고리의 인기상품을 매일 정해진 시간에 자동으로 찾아드려요.
                </p>

                {/* 1. Provider Selection */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>
                        1. 소싱처 선택 <span style={{ color: '#3182F6' }}>*</span>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                        {SOURCING_PROVIDERS.map((provider) => {
                            const isSelected = selectedProviders.includes(provider.name);
                            return (
                                <div
                                    key={provider.name}
                                    onClick={() => toggleProvider(provider.name)}
                                    style={{
                                        background: isSelected ? '#F0F6FF' : '#FFFFFF',
                                        border: `1.5px solid ${isSelected ? '#3182F6' : '#E5E8EB'}`,
                                        borderRadius: '12px',
                                        padding: '16px 12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {isSelected && (
                                        <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#3182F6', borderRadius: '50%', padding: '2px', color: 'white' }}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                    )}
                                    <img src={provider.logo} alt={provider.name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain' }} />
                                    <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#191F28' : '#4E5968', textAlign: 'center' }}>
                                        {provider.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Category & Rules */}
                <div style={{ marginBottom: '40px', opacity: selectedProviders.length === 0 ? 0.4 : 1, pointerEvents: selectedProviders.length === 0 ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>
                        2. 수집 기준 설정
                    </h2>

                    <div style={{ background: '#FFFFFF', border: '1px solid #E5E8EB', borderRadius: '16px', padding: '24px' }}>
                        {/* Selected Provider Tabs logic simplified to just show settings for the primary selected one in this mock */}
                        {selectedProviders.length > 0 && (
                            <>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#3182F6', marginBottom: '16px' }}>
                                    기준 소싱처: {selectedProviders[0]} {selectedProviders.length > 1 && `외 ${selectedProviders.length - 1}개`}
                                </div>

                                <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" checked={selectedCriteria === '인기상품'} onChange={() => setSelectedCriteria('인기상품')} style={{ width: '18px', height: '18px', accentColor: '#3182F6' }} />
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#191F28' }}>인기상품 (판매량순)</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" checked={selectedCriteria === '신상품'} onChange={() => setSelectedCriteria('신상품')} style={{ width: '18px', height: '18px', accentColor: '#3182F6' }} />
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#191F28' }}>신상품 (최신 등록순)</span>
                                    </label>
                                </div>

                                <div>
                                    <div style={{ fontSize: '13px', color: '#6B7684', marginBottom: '8px', fontWeight: 500 }}>세부 카테고리 (수동 선택)</div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #D1D6DB', fontSize: '15px', color: '#191F28', fontFamily: 'Pretendard', outline: 'none', background: '#F9FAFB' }}
                                    >
                                        {(MOCK_CATEGORIES[selectedProviders[0]] || MOCK_CATEGORIES['default']).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Quantity & Time */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', opacity: selectedProviders.length === 0 ? 0.4 : 1, pointerEvents: selectedProviders.length === 0 ? 'none' : 'auto' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>소싱처별 수집 한도</h2>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                value={targetCount}
                                onChange={(e) => setTargetCount(e.target.value)}
                                style={{ width: '100%', padding: '16px', paddingRight: '40px', borderRadius: '12px', border: '1px solid #D1D6DB', fontSize: '15px', fontWeight: 600, color: '#191F28', textAlign: 'right' }}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8B95A1', fontSize: '15px' }}>건</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#8B95A1', marginTop: '8px' }}>10~500건 사이 입력</div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>매일 실행 시간</h2>
                        <select
                            value={timeString}
                            onChange={(e) => setTimeString(e.target.value)}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #D1D6DB', fontSize: '15px', fontWeight: 600, color: '#191F28', outline: 'none' }}
                        >
                            {Array.from({ length: 24 }).map((_, i) => {
                                const h = i.toString().padStart(2, '0');
                                return <option key={`${h}:00`} value={`${h}:00`}>{h}:00</option>;
                            })}
                        </select>
                    </div>
                </div>

                {/* Fixed Summary Bottom Bar */}
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    borderTop: '1px solid #E5E8EB',
                    padding: '20px 40px',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 1000,
                    boxShadow: '0 -4px 16px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ maxWidth: '800px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#191F28', marginBottom: '4px' }}>
                                총 {selectedProviders.length}개 소싱처 · {selectedCriteria} · 매일 {timeString}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6B7684' }}>
                                1회 실행 시 예상 수집 최대 {selectedProviders.length * (parseInt(targetCount, 10) || 0)}건 · 예상 소요 3분
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => navigate('/sourcing')} className="btn-google" style={{ width: '120px' }}>취소</button>
                            <button
                                onClick={handleStart}
                                className="btn-primary"
                                disabled={!isFormValid}
                                style={{ width: '160px', background: '#191F28' }}
                            >
                                완료 및 1회 시작
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

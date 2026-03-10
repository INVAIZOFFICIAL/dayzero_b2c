import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSourcingStore } from '../store/useSourcingStore';
import { MainLayout } from '../components/layout/MainLayout';
import { SOURCING_PROVIDERS } from '../types/sourcing';
import { Link2, Zap, Clock, LayoutGrid, Package, Check } from 'lucide-react';
import { UrlSourcingContent } from './sourcing/components/UrlSourcingContent';
import { colors } from '../design/tokens';

const formatLastRun = (dateString?: string) => {
    if (!dateString) return '아직 실행되지 않음';
    const date = new Date(dateString);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
};

const getProviderLogo = (providerName: string) => {
    return SOURCING_PROVIDERS.find(p => p.name === providerName)?.logo || '/logos/default.png';
};

export default function SourcingPage() {
    const navigate = useNavigate();
    const {
        schedules, toggleSchedule,
        selectedAutoFilter: selectedFilter,
        setSelectedAutoFilter: setSelectedFilter
    } = useSourcingStore();
    const [activeTab, setActiveTab] = useState<'auto' | 'url'>('auto');

    const renderTabs = () => (
        <div style={{
            display: 'inline-flex',
            background: colors.bg.subtle,
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '40px'
        }}>
            <button
                onClick={() => setActiveTab('auto')}
                style={{
                    padding: '10px 24px',
                    fontSize: '15px',
                    fontWeight: activeTab === 'auto' ? 700 : 500,
                    color: activeTab === 'auto' ? colors.text.primary : colors.text.muted,
                    background: activeTab === 'auto' ? colors.bg.surface : 'transparent',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: activeTab === 'auto' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                <Zap size={16} fill={activeTab === 'auto' ? colors.text.primary : 'none'} color={activeTab === 'auto' ? colors.text.primary : colors.text.muted} />
                자동 수집
            </button>
            <button
                onClick={() => setActiveTab('url')}
                style={{
                    padding: '10px 24px',
                    fontSize: '15px',
                    fontWeight: activeTab === 'url' ? 700 : 500,
                    color: activeTab === 'url' ? colors.text.primary : colors.text.muted,
                    background: activeTab === 'url' ? colors.bg.surface : 'transparent',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: activeTab === 'url' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                <Link2 size={16} />
                URL 수집
            </button>
        </div>
    );

    const renderSchedules = () => {
        const availableProviders = Array.from(new Set(schedules.map(s => s.provider)));
        const filters = ['전체', ...availableProviders];
        const filteredSchedules = selectedFilter === '전체' ? schedules : schedules.filter(s => s.provider === selectedFilter);

        return (
            <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>등록된 자동 수집 목록</h2>
                    <button onClick={() => navigate('/sourcing/auto')} style={{
                        background: 'none',
                        color: colors.primary,
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        + 자동 수집 추가
                    </button>
                </div>
                <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '24px' }}>
                    스케줄에 맞춰 설정한 조건대로 상품을 주기적으로 알아서 수집해요.
                </p>

                {schedules.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                style={{
                                    padding: filter === '전체' ? '8px 16px' : (selectedFilter === filter ? '8px 16px' : '8px'),
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: selectedFilter === filter ? 600 : 500,
                                    color: selectedFilter === filter ? colors.primary : colors.text.tertiary,
                                    background: selectedFilter === filter ? colors.primaryLight : colors.bg.surface,
                                    border: selectedFilter === filter ? `1px solid ${colors.primaryLight}` : `1px solid ${colors.border.default}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: filter === '전체' ? '6px' : (selectedFilter === filter ? '6px' : '0px')
                                }}
                            >
                                <div style={{
                                    width: selectedFilter === filter ? '14px' : '0px',
                                    opacity: selectedFilter === filter ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Check size={14} strokeWidth={3} style={{ flexShrink: 0 }} />
                                </div>

                                {filter !== '전체' && (
                                    <img src={getProviderLogo(filter)} alt={filter} style={{ width: '16px', height: '16px', borderRadius: '4px', objectFit: 'cover' }} />
                                )}

                                <div style={{
                                    maxWidth: filter === '전체' || selectedFilter === filter ? '100px' : '0px',
                                    opacity: filter === '전체' || selectedFilter === filter ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    {filter}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {schedules.length === 0 ? (
                    <div style={{
                        background: colors.bg.surface,
                        borderRadius: '16px',
                        border: `1px dashed ${colors.border.light}`,
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '15px', color: colors.text.tertiary, marginBottom: '16px' }}>등록된 자동 수집이 없어요.</div>
                        <button onClick={() => navigate('/sourcing/auto')} className="btn-google" style={{ maxWidth: '200px', margin: '0 auto', height: '40px' }}>
                            자동 수집 추가
                        </button>
                    </div>
                ) : filteredSchedules.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: colors.text.tertiary, fontSize: '15px', background: colors.bg.surface, borderRadius: '16px', border: `1px solid ${colors.border.default}`, animation: 'fadeIn 0.2s ease' }}>
                        해당 소싱처의 자동 수집이 없어요.
                    </div>
                ) : (
                    <div key={selectedFilter} style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeInUp 0.3s ease' }}>
                        {filteredSchedules.map(schedule => (
                            <div key={schedule.id} style={{
                                background: colors.bg.surface,
                                borderRadius: '16px',
                                padding: '20px',
                                border: `1px solid ${colors.border.default}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div
                                    onClick={() => navigate(`/sourcing/auto?edit=${schedule.id}`)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, cursor: 'pointer' }}
                                >
                                    <img src={getProviderLogo(schedule.provider)} alt={schedule.provider} style={{ width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${colors.border.default}` }} />
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                            {schedule.provider}에서
                                            <span style={{ padding: '4px 8px', background: colors.primaryLight, color: colors.primary, borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <LayoutGrid size={12} />
                                                {schedule.categoryPath}
                                            </span>
                                            카테고리 상품의
                                            <span style={{ padding: '4px 8px', background: colors.primaryLight, color: colors.primary, borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Package size={12} />
                                                {schedule.criteria}
                                            </span>
                                            을 수집해요.
                                        </div>
                                        <div style={{ fontSize: '13px', color: colors.text.tertiary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} /> 매일 {schedule.timeString}
                                            </span>
                                            <span>•</span>
                                            <span>마지막 실행: {formatLastRun(schedule.lastRunAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSchedule(schedule.id);
                                    }}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: schedule.isActive ? colors.primary : colors.border.default,
                                        border: 'none',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        padding: 0
                                    }}
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: colors.bg.surface,
                                        position: 'absolute',
                                        top: '2px',
                                        left: schedule.isActive ? '22px' : '2px',
                                        transition: 'left 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <MainLayout>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', paddingBottom: '100px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.text.primary, marginBottom: '8px' }}>
                    상품 소싱
                </h1>
                <p style={{ fontSize: '15px', color: colors.text.tertiary, marginBottom: '32px' }}>
                    소싱 방식을 선택하고 인기 상품을 빠르게 수집해보세요.
                </p>

                {renderTabs()}

                {activeTab === 'auto' ? (
                    <div key="auto" style={{ animation: 'fadeInUp 0.4s ease' }}>
                        {/* Info Callout */}
                        <div style={{ background: colors.bg.faint, borderRadius: '12px', padding: '16px', marginBottom: '32px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <Zap size={16} color={colors.primary} style={{ marginTop: '3px', flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary, marginBottom: '4px' }}>자동 수집이란?</h3>
                                <p style={{ fontSize: '14px', color: colors.text.secondary, lineHeight: '1.5' }}>
                                    원하는 쇼핑몰의 카테고리를 설정해두면 매일 오전 07시에 조건에 맞는 상품을 알아서 찾아옵니다.
                                </p>
                            </div>
                        </div>

                        {renderSchedules()}
                    </div>
                ) : (
                    <div key="url">
                        <UrlSourcingContent />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

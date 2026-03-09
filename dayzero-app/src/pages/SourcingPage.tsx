import { useNavigate } from 'react-router-dom';
import { useSourcingStore } from '../store/useSourcingStore';
import { MainLayout } from '../components/layout/MainLayout';
import { SOURCING_PROVIDERS } from '../types/sourcing';
import { Link2, Sparkles, ChevronRight, Clock, Box } from 'lucide-react';

const formatTimeAgo = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
};

const getProviderLogo = (providerName: string) => {
    return SOURCING_PROVIDERS.find(p => p.name === providerName)?.logo || '/ DayZero Logo.png';
};

export default function SourcingPage() {
    const navigate = useNavigate();
    const { jobs, schedules, unprocessedProductCount, toggleSchedule } = useSourcingStore();

    const runningJobs = jobs.filter(j => j.status === 'running' || j.status === 'queued');
    const completedJobs = jobs.filter(j => j.status === 'completed').slice(0, 5); // Max 5

    // Tab Navigation
    const renderTabs = () => (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            <button
                onClick={() => navigate('/sourcing/url')}
                style={{
                    flex: 1,
                    padding: '20px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E8EB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#3182F6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E5E8EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                }}
            >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0F6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3182F6' }}>
                    <Link2 size={24} strokeWidth={2} />
                </div>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '4px' }}>URL 수집</div>
                    <div style={{ fontSize: '13px', color: '#6B7684' }}>원하는 상품만 골라서 수집</div>
                </div>
            </button>

            <button
                onClick={() => navigate('/sourcing/auto')}
                style={{
                    flex: 1,
                    padding: '20px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E8EB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#3182F6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E5E8EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                }}
            >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F2F1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A5DF2' }}>
                    <Sparkles size={24} strokeWidth={2} />
                </div>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '4px' }}>자동 수집</div>
                    <div style={{ fontSize: '13px', color: '#6B7684' }}>매일 알아서 최신 인기상품 수집</div>
                </div>
            </button>
        </div>
    );

    const renderRunningJobs = () => {
        if (runningJobs.length === 0) return null;

        return (
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>진행 중인 수집</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {runningJobs.map(job => {
                        const percent = Math.floor((job.currentCount / job.totalCount) * 100) || 0;
                        return (
                            <div key={job.id} onClick={() => navigate('/sourcing/result')} style={{
                                background: '#FFFFFF',
                                borderRadius: '16px',
                                padding: '24px',
                                border: '1px solid #E5E8EB',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                                className="auth-card" // reuse enter animation
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#3182F6'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#E5E8EB'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={getProviderLogo(job.provider)} alt={job.provider} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E5E8EB' }} />
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>
                                                {job.provider} {job.categorySummary}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6B7684', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                {job.type === 'AUTO' ? <Sparkles size={12} color="#6A5DF2" /> : <Link2 size={12} color="#3182F6" />}
                                                {job.type === 'AUTO' ? '자동 수집 중...' : 'URL 수집 중...'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#3182F6' }}>
                                        {job.currentCount} / {job.totalCount}건 ({percent}%)
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ width: '100%', height: '8px', background: '#F2F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percent}%`,
                                        height: '100%',
                                        background: '#3182F6',
                                        borderRadius: '4px',
                                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderCompletedJobs = () => {
        if (completedJobs.length === 0) return null;

        return (
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>최근 완료된 수집</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {completedJobs.map(job => (
                        <div key={job.id} onClick={() => navigate('/sourcing/result')} style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '20px',
                            border: '1px solid #E5E8EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                        }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img src={getProviderLogo(job.provider)} alt={job.provider} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #E5E8EB' }} />
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#191F28', marginBottom: '4px' }}>
                                        {job.provider} {job.categorySummary} {job.totalCount}건 수집 완료
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#8B95A1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {job.type === 'AUTO' ? '자동 수집' : 'URL 수집'} • {formatTimeAgo(job.completedAt || job.createdAt)}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={20} color="#B0B8C1" />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSchedules = () => {
        return (
            <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28' }}>등록된 자동 수집</h2>
                    {schedules.length > 0 && (
                        <button onClick={() => navigate('/sourcing/auto')} style={{
                            background: 'none',
                            color: '#3182F6',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            + 새 자동 수집 추가
                        </button>
                    )}
                </div>

                {schedules.length === 0 ? (
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px dashed #D1D6DB',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '15px', color: '#6B7684', marginBottom: '16px' }}>등록된 자동 수집이 없어요.</div>
                        <button onClick={() => navigate('/sourcing/auto')} className="btn-google" style={{ maxWidth: '200px', margin: '0 auto', height: '40px' }}>
                            자동 수집 설정하기
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {schedules.map(schedule => (
                            <div key={schedule.id} style={{
                                background: '#FFFFFF',
                                borderRadius: '16px',
                                padding: '20px',
                                border: '1px solid #E5E8EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <img src={getProviderLogo(schedule.provider)} alt={schedule.provider} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #E5E8EB' }} />
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#191F28', marginBottom: '4px' }}>
                                            {schedule.provider} {schedule.categoryPath} • {schedule.targetCount}건
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#6B7684', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={12} /> 매일 {schedule.timeString} • {schedule.criteria}
                                        </div>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => toggleSchedule(schedule.id)}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: schedule.isActive ? '#3182F6' : '#E5E8EB',
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
                                        background: '#FFFFFF',
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
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#191F28', marginBottom: '8px' }}>
                    상품 소싱
                </h1>
                <p style={{ fontSize: '15px', color: '#6B7684', marginBottom: '32px' }}>
                    클릭 몇 번으로 잘 팔리는 상품을 모아보세요.
                </p>

                {renderTabs()}
                {renderRunningJobs()}
                {renderCompletedJobs()}
                {renderSchedules()}
            </div>

            {/* Bottom Floating Bar for collected products */}
            <div style={{
                position: 'fixed',
                bottom: '40px',
                right: 'max(40px, calc((100vw - 1200px) / 2 + 40px))',
                zIndex: 100,
            }}>
                <button style={{
                    background: '#191F28',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(25, 31, 40, 0.2)',
                    transition: 'transform 0.2s, background 0.2s',
                }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Box size={20} />
                    수집 상품 보기
                    {unprocessedProductCount > 0 && (
                        <div style={{
                            background: '#3182F6',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            marginLeft: '4px'
                        }}>
                            {unprocessedProductCount}
                        </div>
                    )}
                </button>
            </div>
        </MainLayout>
    );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useSourcingStore } from '../../store/useSourcingStore';
import { SOURCING_PROVIDERS } from '../../types/sourcing';
import type { SourcedProduct } from '../../types/sourcing';
import { Loader2, CheckCircle2, Download, Trash2, ArrowRight } from 'lucide-react';

const getProviderLogo = (providerName: string) => {
    return SOURCING_PROVIDERS.find(p => p.name === providerName)?.logo || '/ DayZero Logo.png';
};

export default function SourcingResultPage() {
    const navigate = useNavigate();
    const { jobs, updateJob, products, addProduct } = useSourcingStore();
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    // Filter to running or recently completed job for detail view
    const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

    // Mock progress simulation for the active job
    useEffect(() => {
        if (!activeJob || activeJob.status !== 'running') return;

        const interval = setInterval(() => {
            if (activeJob.currentCount < activeJob.totalCount) {
                updateJob(activeJob.id, { currentCount: activeJob.currentCount + 1 });

                // Add a mock product occasionally to the list
                if (Math.random() > 0.5) {
                    const mockProduct: SourcedProduct = {
                        id: `prod-auto-${Date.now()}`,
                        jobId: activeJob.id,
                        provider: activeJob.provider,
                        title: `${activeJob.provider} ${activeJob.categorySummary} 상품 ${activeJob.currentCount + 1}`,
                        thumbnailUrl: 'https://via.placeholder.com/150/F5F6F8/8B95A1?text=Auto',
                        originalPriceKrw: Math.floor(Math.random() * 50000) + 10000,
                        optionCount: Math.floor(Math.random() * 3) + 1,
                        sourceUrl: 'https://example.com',
                        translationStatus: 'pending',
                        qoo10Category: null,
                        editStatus: 'pending'
                    };
                    addProduct(mockProduct);
                }

            } else {
                updateJob(activeJob.id, {
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    durationString: '1분 30초',
                    duplicateCount: Math.floor(Math.random() * 5)
                });
                clearInterval(interval);
            }
        }, 800); // Ticks every 800ms

        return () => clearInterval(interval);
    }, [activeJob, updateJob, addProduct]);

    if (!activeJob) {
        return (
            <MainLayout>
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#8B95A1' }}>
                    등록된 수집 내역이 없습니다.
                </div>
            </MainLayout>
        );
    }

    const percent = Math.floor((activeJob.currentCount / activeJob.totalCount) * 100) || 0;
    const isCompleted = activeJob.status === 'completed';
    const jobProducts = products.filter(p => p.jobId === activeJob.id);

    return (
        <MainLayout>
            <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', paddingBottom: '100px', animation: 'fadeInUp 0.4s ease' }}>
                <button
                    onClick={() => navigate('/sourcing')}
                    style={{ background: 'none', border: 'none', color: '#8B95A1', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '24px', padding: 0 }}
                >
                    ← 소싱 홈으로
                </button>

                <div style={{ display: 'flex', gap: '32px' }}>
                    {/* Left: Job List Sidebar */}
                    <div style={{ width: '280px', flexShrink: 0 }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', marginBottom: '16px' }}>내역</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {jobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => setActiveJobId(job.id)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: activeJob.id === job.id ? '#F0F6FF' : '#FFFFFF',
                                        border: `1px solid ${activeJob.id === job.id ? '#3182F6' : '#E5E8EB'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <img src={getProviderLogo(job.provider)} alt={job.provider} style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#191F28', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {job.categorySummary}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                        <span style={{ color: job.status === 'running' ? '#3182F6' : '#8B95A1' }}>
                                            {job.status === 'running' ? '수집 중...' : '완료'}
                                        </span>
                                        <span style={{ color: '#6B7684', fontWeight: 500 }}>
                                            {job.currentCount}/{job.totalCount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Main Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Progress Header Card */}
                        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E8EB', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
                                <img src={getProviderLogo(activeJob.provider)} alt={activeJob.provider} style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid #E5E8EB' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        {isCompleted ? <CheckCircle2 color="#00C853" size={24} /> : <Loader2 color="#3182F6" size={24} className="spinner" />}
                                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#191F28' }}>
                                            {isCompleted ? '상품 수집을 완료했어요' : '상품 정보를 가져오고 있어요'}
                                        </h1>
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#6B7684', lineHeight: 1.5 }}>
                                        {activeJob.provider} • {activeJob.categorySummary} <br />
                                        {isCompleted ? (
                                            <>총 <b>{activeJob.totalCount}건</b> 중 <b>{activeJob.currentCount}건</b> 수집 완료 (소요시간: {activeJob.durationString})<br />중복 제외 <b>{activeJob.duplicateCount}건</b></>
                                        ) : (
                                            `잠시만 기다려주세요. 페이지를 벗어나도 백그라운드에서 계속 진행돼요.`
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* BIG Progress Bar */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px', fontWeight: 600 }}>
                                    <span style={{ color: isCompleted ? '#00C853' : '#3182F6' }}>{percent}%</span>
                                    <span style={{ color: '#4E5968' }}>{activeJob.currentCount} / {activeJob.totalCount}건</span>
                                </div>
                                <div style={{ width: '100%', height: '12px', background: '#F2F4F6', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percent}%`,
                                        height: '100%',
                                        background: isCompleted ? '#00C853' : '#3182F6',
                                        borderRadius: '6px',
                                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease'
                                    }} />
                                </div>
                            </div>

                            {isCompleted && (
                                <div style={{ display: 'flex', gap: '12px', marginTop: '32px', animation: 'fadeInUp 0.4s ease' }}>
                                    <button className="btn-primary" style={{ flex: 1, background: '#191F28', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        수집된 상품 편집하기 <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Result Table (Bottom section) */}
                        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E8EB', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E8EB' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#191F28' }}>
                                    수집 목록 {jobProducts.length > 0 && `(${jobProducts.length})`}
                                </h3>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D6DB', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#4E5968', cursor: 'pointer' }}>
                                        <Download size={14} /> 엑셀 다운로드
                                    </button>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D6DB', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#F04452', cursor: 'pointer' }}>
                                        <Trash2 size={14} /> 선택 삭제
                                    </button>
                                </div>
                            </div>

                            {jobProducts.length === 0 ? (
                                <div style={{ padding: '60px 0', textAlign: 'center', color: '#8B95A1', fontSize: '15px' }}>
                                    {isCompleted ? '수집된 상품이 없습니다.' : '상품을 수집하고 있습니다...'}
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E8EB', color: '#8B95A1' }}>
                                                <th style={{ padding: '16px 24px', width: '40px' }}><input type="checkbox" style={{ accentColor: '#3182F6' }} /></th>
                                                <th style={{ padding: '16px 8px', fontWeight: 600, width: '60px' }}>이미지</th>
                                                <th style={{ padding: '16px 8px', fontWeight: 600 }}>상품명</th>
                                                <th style={{ padding: '16px 8px', fontWeight: 600, width: '120px' }}>원가</th>
                                                <th style={{ padding: '16px 24px', fontWeight: 600, width: '100px', textAlign: 'center' }}>상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobProducts.map(product => (
                                                <tr key={product.id} style={{ borderBottom: '1px solid #F2F4F6' }}>
                                                    <td style={{ padding: '16px 24px' }}><input type="checkbox" style={{ accentColor: '#3182F6' }} /></td>
                                                    <td style={{ padding: '16px 8px' }}>
                                                        <img src={product.thumbnailUrl} alt="Thumb" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E8EB' }} />
                                                    </td>
                                                    <td style={{ padding: '16px 8px' }}>
                                                        <div style={{ color: '#191F28', fontWeight: 500, marginBottom: '4px' }}>{product.title}</div>
                                                        <div style={{ color: '#8B95A1', fontSize: '12px' }}>옵션 {product.optionCount}개</div>
                                                    </td>
                                                    <td style={{ padding: '16px 8px', color: '#4E5968', fontWeight: 500 }}>
                                                        ₩{product.originalPriceKrw.toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            background: '#E8F3FF',
                                                            color: '#3182F6'
                                                        }}>
                                                            번역 대기
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
            @keyframes spinner {
                to { transform: rotate(360deg); }
            }
            .spinner {
                animation: spinner 1s linear infinite;
            }
            `}</style>
        </MainLayout>
    );
}

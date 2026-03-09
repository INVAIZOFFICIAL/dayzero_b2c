import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Edit3, PackageSearch, PackageOpen, ChevronRight } from 'lucide-react';

type NavItem = '소싱하기' | '상품 편집하기' | '등록된 상품 보기';

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showToast, setShowToast] = useState(false);

    // active path helper
    const isSourcingActive = location.pathname.startsWith('/sourcing');

    const handleNav = (item: NavItem) => {
        if (item === '소싱하기') {
            navigate('/sourcing');
        } else {
            // Show toast for non-implemented menus
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            background: '#F9FAFB', // Reference shows light grey sidebar
            borderRight: '1px solid #E5E8EB',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 24px',
            fontFamily: 'Pretendard, -apple-system, sans-serif',
            zIndex: 1000,
        }}>
            {/* Logo */}
            <div style={{ padding: '0 12px', marginBottom: '48px', cursor: 'pointer' }} onClick={() => navigate('/sourcing')}>
                <img src="/DayZero Logo.png" alt="DayZero" style={{ height: '28px', width: 'auto' }} />
            </div>

            {/* Menu Items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#8B95A1', padding: '0 12px', marginBottom: '8px', marginTop: '16px' }}>PRODUCTS</div>

                <button
                    onClick={() => handleNav('소싱하기')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 12px',
                        background: isSourcingActive ? '#FFFFFF' : 'transparent',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: isSourcingActive ? '#191F28' : '#6B7684',
                        fontWeight: isSourcingActive ? 700 : 500,
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        boxShadow: isSourcingActive ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                    }}
                    onMouseOver={(e) => {
                        if (!isSourcingActive) e.currentTarget.style.background = '#F2F4F6';
                    }}
                    onMouseOut={(e) => {
                        if (!isSourcingActive) e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <Search size={20} color={isSourcingActive ? '#191F28' : '#8B95A1'} />
                    소싱하기
                    {isSourcingActive && <ChevronRight size={16} color="#B0B8C1" style={{ marginLeft: 'auto' }} />}
                </button>

                <button
                    onClick={() => handleNav('상품 편집하기')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: '#6B7684',
                        fontWeight: 500,
                        fontSize: '15px',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#F2F4F6'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <Edit3 size={20} color="#8B95A1" />
                    상품 편집하기
                </button>

                <button
                    onClick={() => handleNav('등록된 상품 보기')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: '#6B7684',
                        fontWeight: 500,
                        fontSize: '15px',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#F2F4F6'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <PackageOpen size={20} color="#8B95A1" />
                    등록된 상품 보기
                </button>
            </nav>

            {/* Preparation Toast */}
            {showToast && (
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'max-content',
                    background: 'rgba(25, 31, 40, 0.9)',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    zIndex: 2000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    준비 중이에요 🚧
                </div>
            )}
        </aside>
    );
};

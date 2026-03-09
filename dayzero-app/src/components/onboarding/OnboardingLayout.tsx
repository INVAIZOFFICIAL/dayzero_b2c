import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface StepItem {
    id: number;
    label: string;
    desc?: string;
}

interface OnboardingLayoutProps {
    children: ReactNode;
    currentStep: number;
    wide?: boolean;
}

const STEPS: StepItem[] = [
    { id: 1, label: '계정 연동', desc: 'Qoo10 API 연결' },
    { id: 2, label: '기본 정보 입력', desc: '배송 출하지/반품지' },
    { id: 3, label: '마진/배송비', desc: '상품 자동 가격 계산' },
];

export default function OnboardingLayout({ children, currentStep, wide }: OnboardingLayoutProps) {
    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                background: '#F9FAFB',
                fontFamily: 'Pretendard, -apple-system, sans-serif',
            }}
        >
            {/* Left Sidebar */}
            <div
                style={{
                    width: '320px',
                    background: '#FFFFFF',
                    borderRight: '1px solid #E5E8EB',
                    padding: '48px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'static',
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: '64px' }}>
                    <img
                        src="/DayZero Logo.png"
                        alt="DayZero"
                        style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                    />
                </div>

                {/* Progress Stepper */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {STEPS.map((step, idx) => {
                        const isCompleted = step.id < currentStep;
                        const isCurrent = step.id === currentStep;
                        const isUpcoming = step.id > currentStep;

                        return (
                            <div key={step.id} style={{ display: 'flex', position: 'relative' }}>
                                {/* Connecting Line */}
                                {idx < STEPS.length - 1 && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '15px',
                                            top: '32px',
                                            bottom: '-32px',
                                            width: '2px',
                                            background: isCompleted ? '#3182F6' : '#E5E8EB',
                                            zIndex: 0,
                                        }}
                                    />
                                )}

                                {/* Step Indicator */}
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isCompleted ? '#3182F6' : isCurrent ? '#FFFFFF' : '#F5F6F8',
                                        border: isCurrent ? '2px solid #3182F6' : isUpcoming ? '2px solid #E5E8EB' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isCompleted ? '#FFFFFF' : isCurrent ? '#3182F6' : '#8B95A1',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        zIndex: 1,
                                        boxShadow: isCurrent ? '0 0 0 4px rgba(49, 130, 246, 0.1)' : 'none',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                                </div>

                                {/* Step Text */}
                                <div style={{ marginLeft: '16px', paddingTop: '4px' }}>
                                    <div
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: isCurrent ? 700 : 600,
                                            color: isCurrent || isCompleted ? '#191F28' : '#8B95A1',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        {step.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '13px',
                                            color: isCurrent ? '#4E5968' : '#B0B8C1',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {step.desc}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Help Area */}
                <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                    <div
                        style={{
                            padding: '20px',
                            background: '#F5F6F8',
                            borderRadius: '16px',
                        }}
                    >
                        <p style={{ fontSize: '13px', color: '#6B7684', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                            진행 중 문제가 발생했나요?<br />
                            <a href="#" style={{ color: '#3182F6', textDecoration: 'none', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>
                                고객 지원팀에 문의하기 →
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 40px',
                    position: 'relative',
                    overflowY: 'auto',
                }}
            >
                <div style={{ width: '100%', maxWidth: wide ? '900px' : '580px', animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

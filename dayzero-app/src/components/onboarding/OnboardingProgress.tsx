import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
    currentStep: number;
    totalSteps?: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ currentStep, totalSteps = 3 }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '32px',
            width: '100%'
        }}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                    <React.Fragment key={step}>
                        {/* Step Circle */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            ...(isCompleted ? {
                                background: '#3182F6',
                                color: '#FFFFFF',
                            } : isCurrent ? {
                                background: '#FFFFFF',
                                color: '#3182F6',
                                border: '2px solid #3182F6',
                            } : {
                                background: '#F2F4F6',
                                color: '#8B95A1',
                                border: '2px solid transparent',
                            })
                        }}>
                            {isCompleted ? <Check size={18} strokeWidth={3} /> : step}
                        </div>

                        {/* Connector Line */}
                        {step < totalSteps && (
                            <div style={{
                                width: '40px',
                                height: '2px',
                                borderRadius: '1px',
                                transition: 'background 0.3s ease',
                                background: isCompleted ? '#3182F6' : '#E5E8EB',
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

import { CheckCircle2, Loader2, X, PackageOpen, Zap } from 'lucide-react';
import { colors, font } from '../../design/tokens';

export const StatusIcon: React.FC<{ status: 'running' | 'completed' | 'failed' | 'processing' | 'queued' | 'scheduled' }> = ({ status }) => (
    <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: status === 'completed' ? '#F0FFF8' : status === 'failed' ? '#FFF1F2' : (status === 'scheduled' ? '#F5F3FF' : '#EFF6FF'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    }}>
        {status === 'completed'
            ? <CheckCircle2 size={18} color={colors.success} />
            : status === 'failed'
                ? <X size={18} color={colors.danger} />
                : (status === 'scheduled'
                    ? <Zap size={18} color="#8B5CF6" fill="#8B5CF6" />
                    : <Loader2 size={18} color={colors.primary} className="spin" />
                )
        }
    </div>
);

export const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => (
    <div style={{ height: '4px', background: colors.bg.subtle, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
            height: '100%',
            width: `${max > 0 ? (value / max) * 100 : 0}%`,
            background: colors.primary,
            borderRadius: '2px',
            transition: 'width 0.4s ease',
        }} />
    </div>
);

export const EmptyState: React.FC<{ label: string }> = ({ label }) => (
    <div style={{ padding: '56px 24px', textAlign: 'center' }}>
        <PackageOpen size={36} color={colors.border.default} style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: font.size.sm, color: colors.text.muted, margin: 0 }}>{label}</p>
    </div>
);

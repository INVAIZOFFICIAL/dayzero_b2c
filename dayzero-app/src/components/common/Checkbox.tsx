import { colors, radius } from '../../design/tokens';

export const Checkbox: React.FC<{ checked: boolean; onClick: () => void }> = ({ checked, onClick }) => (
    <div
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        style={{
            width: '20px', height: '20px', flexShrink: 0,
            borderRadius: radius.xs,
            border: `2px solid ${checked ? colors.primary : colors.border.light}`,
            background: checked ? colors.primary : colors.bg.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
        }}
    >
        {checked && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                <path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )}
    </div>
);

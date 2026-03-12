import { colors, font, spacing } from '../../../design/tokens';

export type DetailTab = 'basic' | 'price' | 'thumbnail';

const TABS: { key: DetailTab; label: string }[] = [
    { key: 'basic', label: '기본 정보' },
    { key: 'price', label: '가격 정보' },
    { key: 'thumbnail', label: '썸네일/상세페이지' },
];

interface Props {
    activeTab: DetailTab;
    onChange: (tab: DetailTab) => void;
}

export const EditingTabBar: React.FC<Props> = ({ activeTab, onChange }) => (
    <div style={{
        display: 'flex',
        gap: '2px',
        borderBottom: `2px solid ${colors.border.default}`,
        marginBottom: spacing['10'],
        maxWidth: '760px',
    }}>
        {TABS.map(({ key, label }) => (
            <button
                key={key}
                onClick={() => onChange(key)}
                style={{
                    padding: `${spacing['3']} ${spacing['4']}`,
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${activeTab === key ? colors.primary : 'transparent'}`,
                    marginBottom: '-2px',
                    fontSize: font.size.base,
                    fontWeight: activeTab === key ? 700 : 500,
                    color: activeTab === key ? colors.primary : colors.text.tertiary,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: spacing['2'],
                    transition: 'color 0.15s',
                }}
            >
                {label}
            </button>
        ))}
    </div>
);

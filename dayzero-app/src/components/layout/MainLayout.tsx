import type { ReactNode } from 'react';
import { GlobalNavigationBar } from '../common/GlobalNavigationBar';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#F9FAFB',
            fontFamily: 'Pretendard, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <GlobalNavigationBar />

            <main style={{
                flex: 1,
                padding: '40px',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {children}
            </main>
        </div>
    );
};

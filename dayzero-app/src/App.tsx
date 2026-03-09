import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Qoo10ConnectPage from './pages/onboarding/Qoo10ConnectPage';
import { OnboardingProvider } from './components/onboarding/OnboardingContext';

import BasicInfoPage from './pages/onboarding/BasicInfoPage';
import BasicMarginPage from './pages/onboarding/BasicMarginPage';
import SourcingPage from './pages/SourcingPage';

export default function App() {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/onboarding/step1" element={<Qoo10ConnectPage />} />
          <Route path="/onboarding/step2" element={<BasicInfoPage />} />
          <Route path="/onboarding/step3" element={<BasicMarginPage />} />
          <Route path="/sourcing" element={<SourcingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </OnboardingProvider>
  );
}


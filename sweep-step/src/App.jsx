import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { useAppStore } from './hooks/useAppStore';
import PinGate from './components/PinGate';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import { Resentments } from './pages/Resentments';
import { Fears } from './pages/Fears';
import { SexInventory } from './pages/SexInventory';
import { Harms } from './pages/Harms';
import Milestones from './pages/Milestones';
import Settings from './pages/Settings';
import { Export } from './pages/Export';
import { getDefaultStore, STORAGE_KEY } from './store/schema';

function AppInner() {
  const { store, setStore } = useAppStore();

  // Not onboarded yet — show onboarding
  if (!store.user.onboardingComplete) {
    return (
      <Onboarding
        onComplete={(data) => {
          setStore((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              pronouns: data.pronouns,
              higherPowerTerm: data.higherPowerTerm,
              sobrietyDate: data.sobrietyDate,
              pinHash: data.pinHash,
              onboardingComplete: true,
            },
          }));
        }}
      />
    );
  }

  const handleWipe = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStore(getDefaultStore());
  };

  return (
    <PinGate store={store} onWipe={handleWipe}>
      <Layout sobrietyDate={store.user.sobrietyDate}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resentments" element={<Resentments />} />
          <Route path="/fears" element={<Fears />} />
          <Route path="/sex-inventory" element={<SexInventory />} />
          <Route path="/harms" element={<Harms />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/export" element={<Export />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </PinGate>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </BrowserRouter>
  );
}

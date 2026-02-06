import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import DeepfakeApp from './components/DeepfakeApp';
import VerificationApp from './components/VerificationApp';

type View = 'HOME' | 'DEEPFAKE' | 'VERIFICATION';

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');

  const renderContent = () => {
    switch (view) {
      case 'DEEPFAKE':
        return <DeepfakeApp />;
      case 'VERIFICATION':
        return <VerificationApp onBack={() => setView('HOME')} />;
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };

  const getHeaderProps = () => {
    switch (view) {
      case 'DEEPFAKE':
        return { titleSuffix: 'FORENSIC', subtitle: 'DEEPFAKE DETECTION PLATFORM v2.4.0' };
      case 'VERIFICATION':
        return { titleSuffix: 'TRUTH', subtitle: 'MULTIMODAL FACT VERIFICATION v1.0.0' };
      default:
        return { titleSuffix: 'SUITE', subtitle: 'INTEGRATED FORENSIC PLATFORM' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">
      <Header 
        onLogoClick={() => setView('HOME')} 
        {...getHeaderProps()} 
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
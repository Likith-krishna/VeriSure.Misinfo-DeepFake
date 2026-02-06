import React from 'react';
import { ScanFace, Shield, ArrowRight, MessageSquare, Scale } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: 'DEEPFAKE' | 'VERIFICATION') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-2 bg-slate-800/50 rounded-full mb-6 border border-slate-700">
          <Shield className="w-4 h-4 text-cyan-400 mr-2" />
          <span className="text-xs font-mono text-cyan-300">VERISURE FORENSIC AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Digital Truth <span className="text-cyan-500">Assessment</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          VeriSure is a professional-grade forensic platform designed to detect manipulation in digital media. 
          Leveraging state-of-the-art AI models to expose deepfakes and verify integrity.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Deepfake Finder Card */}
        <div 
          onClick={() => onNavigate('DEEPFAKE')}
          className="group relative bg-slate-900 rounded-2xl border border-slate-800 p-8 cursor-pointer hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ScanFace size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <ScanFace className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
              Deepfake Finder
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
            </h3>
            <p className="text-slate-400 mb-6">
              Analyze images and videos for signs of AI manipulation. Detect GAN artifacts, frequency anomalies, and anatomical inconsistencies using our multi-model forensic engine.
            </p>
            <span className="text-xs font-mono text-cyan-500 border border-cyan-900/50 bg-cyan-950/30 px-2 py-1 rounded">
              GEMINI-3-FLASH VISION
            </span>
          </div>
        </div>

        {/* Verification Card */}
        <div 
          onClick={() => onNavigate('VERIFICATION')}
          className="group relative bg-slate-900 rounded-2xl border border-slate-800 p-8 cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Scale size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
              Fact Verification
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
            </h3>
            <p className="text-slate-400 mb-6">
              Forensic-grade fact checking using live OSINT. Verifies claims against government registries, major news agencies, and known fact/myth databases.
            </p>
            <span className="text-xs font-mono text-blue-500 border border-blue-900/50 bg-blue-950/30 px-2 py-1 rounded">
              GEMINI-3-FLASH + SEARCH
            </span>
          </div>
        </div>

      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-600 text-sm font-mono">
          SECURE SYSTEM ACCESS • ENCRYPTED SESSION
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
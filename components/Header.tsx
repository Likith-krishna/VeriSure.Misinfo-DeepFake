import React from 'react';
import { ShieldCheck, Cpu, Lock } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  titleSuffix?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onLogoClick, 
  titleSuffix = "FORENSIC", 
  subtitle = "DEEPFAKE DETECTION PLATFORM v2.4.0" 
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
      <div 
        className={`flex items-center space-x-3 ${onLogoClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
        onClick={onLogoClick}
      >
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center">
            VERISURE <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-cyan-900 text-cyan-300 border border-cyan-700 font-mono">{titleSuffix}</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide">{subtitle}</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4" />
          <span>GPU ACCELERATED</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400">
          <Lock className="w-4 h-4" />
          <span>SECURE ENVIRONMENT</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
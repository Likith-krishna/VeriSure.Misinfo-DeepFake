import React from 'react';
import { OverlayMode } from '../types';

interface ForensicViewerProps {
  imageUrl: string;
  overlayMode: OverlayMode;
  verdict: string;
}

const ForensicViewer: React.FC<ForensicViewerProps> = ({ imageUrl, overlayMode, verdict }) => {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-2xl group">
      {/* Base Image */}
      <img 
        src={imageUrl} 
        alt="Evidence" 
        className="w-full h-full object-cover relative z-10"
      />

      {/* Grid Overlay */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${overlayMode === 'GRID' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>
      </div>

      {/* Heatmap Overlay */}
      {/* In a real app, this would be a canvas rendering the actual heatmap from the backend. 
          Here we use a CSS gradient to simulate a detection on the face. */}
      <div className={`absolute inset-0 z-20 pointer-events-none mix-blend-color transition-opacity duration-500 ${overlayMode === 'HEATMAP' ? 'opacity-80' : 'opacity-0'}`}>
        <div className="w-full h-full bg-gradient-to-tr from-transparent via-red-500/50 to-transparent" 
             style={{ 
               background: verdict === 'FAKE' || verdict === 'SUSPICIOUS'
                ? 'radial-gradient(circle at 50% 40%, rgba(255, 0, 0, 0.6) 0%, rgba(255, 100, 0, 0.3) 30%, transparent 70%)' 
                : 'radial-gradient(circle at 50% 40%, rgba(0, 255, 100, 0.3) 0%, transparent 60%)'
             }}
        ></div>
      </div>

      {/* ELA (Error Level Analysis) Simulation */}
      <div className={`absolute inset-0 z-20 pointer-events-none mix-blend-difference transition-opacity duration-300 ${overlayMode === 'ELA' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full bg-slate-200 contrast-[200%] brightness-50 grayscale opacity-20"></div>
      </div>

      {/* Scanning Line Animation (Always active to look cool, or conditional) */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <div className="w-full h-1 bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan opacity-30"></div>
      </div>

      {/* Metadata HUD */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded text-[10px] font-mono text-cyan-400">
          MASK_RCNN_DETECTED: TRUE <br/>
          CONFIDENCE_THRESHOLD: 0.85
        </div>
      </div>
    </div>
  );
};

export default ForensicViewer;
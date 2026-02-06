import React, { useEffect, useState } from 'react';
import { Activity, Aperture, Binary, Scan, Search } from 'lucide-react';
import { AnalysisStep } from '../types';

interface AnalyzingOverlayProps {
  step: AnalysisStep;
}

const steps = [
  { id: AnalysisStep.PREPROCESSING, label: 'Standardizing Input & Noise Removal', icon: Binary },
  { id: AnalysisStep.FACE_DETECTION, label: 'Locating Facial Landmarks (MTCNN)', icon: Scan },
  { id: AnalysisStep.SPATIAL_ANALYSIS, label: 'Spatial Artifact Detection (CNN)', icon: Search },
  { id: AnalysisStep.FREQUENCY_ANALYSIS, label: 'Frequency Domain Scan (DFT)', icon: Activity },
  { id: AnalysisStep.AGGREGATING, label: 'Aggregating Model Ensembles', icon: Aperture },
];

const AnalyzingOverlay: React.FC<AnalyzingOverlayProps> = ({ step }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Generate some fake "terminal" logs based on the current step
    const interval = setInterval(() => {
      const ms = Math.floor(Math.random() * 900) + 100;
      const newLog = `[${new Date().toLocaleTimeString()}.${ms}] PROCESS_PID_${Math.floor(Math.random()*9999)}: ${step}... OK`;
      setLogs(prev => [...prev.slice(-6), newLog]);
    }, 400);
    return () => clearInterval(interval);
  }, [step]);

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-slate-900 border border-cyan-500/30 rounded-xl p-8 shadow-2xl shadow-cyan-900/20">
      <div className="flex flex-col items-center">
        
        {/* Animated Scanner Graphic */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center">
             <Aperture className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-mono text-cyan-400 mb-6 tracking-widest">ANALYSIS IN PROGRESS</h2>

        <div className="w-full space-y-3 mb-8">
          {steps.map((s, idx) => {
            const isActive = s.id === step;
            const isCompleted = currentStepIndex > idx;
            const Icon = s.icon;

            return (
              <div 
                key={s.id}
                className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
                  isActive 
                    ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-100 scale-105 shadow-lg shadow-cyan-900/20' 
                    : isCompleted 
                      ? 'bg-slate-800/50 border-slate-700 text-slate-400' 
                      : 'bg-transparent border-transparent text-slate-600'
                }`}
              >
                <div className={`mr-4 p-2 rounded-full ${isActive ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : isCompleted ? 'text-green-500' : 'text-slate-600'}`} />
                </div>
                <span className="font-mono text-sm">{s.label}</span>
                {isActive && <span className="ml-auto text-xs animate-pulse text-cyan-400">PROCESSING</span>}
                {isCompleted && <span className="ml-auto text-xs text-green-500">DONE</span>}
              </div>
            );
          })}
        </div>

        {/* Fake Terminal */}
        <div className="w-full bg-black rounded-md p-4 font-mono text-xs text-green-500/80 border border-slate-800 h-32 overflow-hidden flex flex-col justify-end">
          {logs.map((log, i) => (
            <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-slate-500 mr-2">{'>'}</span>
              {log}
            </div>
          ))}
          <div className="animate-pulse">_</div>
        </div>

      </div>
    </div>
  );
};

export default AnalyzingOverlay;
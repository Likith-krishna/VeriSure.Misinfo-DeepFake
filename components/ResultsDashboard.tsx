import React, { useState } from 'react';
import { ForensicReport, OverlayMode } from '../types';
import ForensicViewer from './ForensicViewer';
import { Download, AlertTriangle, CheckCircle, Eye, Grid, Layers, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsDashboardProps {
  report: ForensicReport;
  file: File;
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report, file, onReset }) => {
  const [overlay, setOverlay] = useState<OverlayMode>('NONE');
  
  // Create object URL for preview
  const imageUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

  const getVerdictColor = (v: string) => {
    switch (v) {
      case 'FAKE': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'SUSPICIOUS': return 'text-amber-500 border-amber-500 bg-amber-500/10';
      default: return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            FORENSIC REPORT <span className="ml-3 text-sm font-mono text-slate-500">ID: {report.id.slice(0, 8)}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Generated on {new Date(report.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onReset} className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            Analyze New File
          </button>
          <button className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center transition-colors shadow-lg shadow-cyan-900/20">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visuals */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-1">
            <ForensicViewer imageUrl={imageUrl} overlayMode={overlay} verdict={report.verdict} />
            
            {/* Viewer Controls */}
            <div className="flex items-center justify-center p-3 gap-2 bg-slate-900 border-t border-slate-800 rounded-b-lg">
              <button 
                onClick={() => setOverlay('NONE')}
                className={`p-2 rounded flex items-center space-x-2 text-xs font-mono transition-colors ${overlay === 'NONE' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Eye className="w-4 h-4" /> <span>ORIGINAL</span>
              </button>
              <button 
                onClick={() => setOverlay('HEATMAP')}
                className={`p-2 rounded flex items-center space-x-2 text-xs font-mono transition-colors ${overlay === 'HEATMAP' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Layers className="w-4 h-4" /> <span>HEATMAP</span>
              </button>
              <button 
                onClick={() => setOverlay('ELA')}
                className={`p-2 rounded flex items-center space-x-2 text-xs font-mono transition-colors ${overlay === 'ELA' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Activity className="w-4 h-4" /> <span>ELA</span>
              </button>
              <button 
                onClick={() => setOverlay('GRID')}
                className={`p-2 rounded flex items-center space-x-2 text-xs font-mono transition-colors ${overlay === 'GRID' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Grid className="w-4 h-4" /> <span>GRID</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-cyan-500" />
              MODEL CONFIDENCE BREAKDOWN
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.modelScores} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 10}} interval={0} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="score" barSize={12} radius={[0, 4, 4, 0]}>
                    {report.modelScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score > 50 && report.verdict !== 'REAL' ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Data & Verdict */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Verdict Card */}
          <div className={`p-6 rounded-xl border ${getVerdictColor(report.verdict)} relative overflow-hidden`}>
            <div className="relative z-10">
              <h3 className="text-sm font-mono opacity-80 mb-1">FINAL VERDICT</h3>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-black tracking-tighter">{report.verdict}</span>
                <div className="text-right">
                  <div className="text-3xl font-bold">{report.confidence.toFixed(1)}%</div>
                  <div className="text-xs opacity-75 font-mono">CONFIDENCE SCORE</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <div className="flex items-center text-sm font-medium">
                  {report.verdict === 'REAL' ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mr-2" />
                  )}
                  {report.verdict === 'REAL' 
                    ? "No significant manipulation artifacts detected across tested modalities."
                    : "High probability of AI manipulation detected in facial regions."
                  }
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              {report.verdict === 'REAL' ? <CheckCircle size={120} /> : <AlertTriangle size={120} />}
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-300 mb-4">FORENSIC FINDINGS</h3>
            <div className="space-y-4">
              {report.explanation.map((exp, idx) => (
                <div key={idx} className="flex items-start text-sm text-slate-400">
                  <span className="mr-2 text-cyan-500 mt-1">●</span>
                  {exp}
                </div>
              ))}
            </div>
          </div>

          {/* Artifact Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-500 mb-1">SPATIAL ARTIFACTS</div>
              <div className="text-xl font-mono text-white">{report.artifacts.spatialInconsistencies}%</div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full" 
                  style={{ width: `${report.artifacts.spatialInconsistencies}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-500 mb-1">FREQ ANOMALIES</div>
              <div className="text-xl font-mono text-white">{report.artifacts.frequencyAnomalies}%</div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${report.artifacts.frequencyAnomalies}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-500 mb-1">COMPRESSION GHOSTS</div>
              <div className="text-xl font-mono text-white">{report.artifacts.compressionGhosting}%</div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${report.artifacts.compressionGhosting}%` }}
                ></div>
              </div>
            </div>
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-500 mb-1">METADATA INTEGRITY</div>
              <div className={`text-xl font-mono ${report.artifacts.metadataIntegrity ? 'text-green-500' : 'text-red-500'}`}>
                {report.artifacts.metadataIntegrity ? 'VALID' : 'CORRUPT'}
              </div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${report.artifacts.metadataIntegrity ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
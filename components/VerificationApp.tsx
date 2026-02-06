import React, { useState } from 'react';
import { 
  Search, ShieldCheck, AlertTriangle, FileText, 
  Image as ImageIcon, ArrowLeft, Loader2, CheckCircle, 
  XCircle, Globe, Scale, BookOpen 
} from 'lucide-react';
import { verifyInformation } from '../services/verificationService';
import { VerificationReport, VerificationVerdict } from '../types';

interface VerificationAppProps {
  onBack: () => void;
}

const VerificationApp: React.FC<VerificationAppProps> = ({ onBack }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleVerify = async () => {
    if (!textInput && !selectedFile) return;
    
    setLoading(true);
    setReport(null);
    setError(null);
    setStage('INITIALIZING_OSINT_PIPELINE');

    try {
      // Simulate stages for UX
      const stages = [
        'EXTRACTING_ATOMIC_CLAIMS',
        'SEARCHING_TRUSTED_REGISTRIES',
        'CROSS_REFERENCING_GOVERNMENT_DATABASES',
        'ANALYZING_FACTS_AND_MYTHS',
        'COMPILING_FORENSIC_REPORT'
      ];

      // Start the actual request
      const verificationPromise = verifyInformation(textInput, selectedFile);
      
      // Animate stages
      for (const s of stages) {
        setStage(s);
        await new Promise(r => setTimeout(r, 800));
      }

      const result = await verificationPromise;
      setReport(result);
    } catch (err: any) {
      console.error(err);
      
      let msg = "Verification failed. Unable to access trusted sources at this time.";
      if (err.message?.includes("429") || err.message?.includes("quota") || err.status === 429) {
        msg = "High Demand: Verification engine request limit reached. Please wait a moment.";
      }
      
      setError(msg);
    } finally {
      setLoading(false);
      setStage('');
    }
  };

  const getVerdictBadge = (verdict: VerificationVerdict) => {
    const styles = {
      'VERIFIED_TRUE': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      'VERIFIED_FALSE': 'bg-red-500/20 text-red-400 border-red-500/50',
      'PARTIALLY_MISLEADING': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      'TRUE_BUT_MISLEADING': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'OUTDATED': 'bg-slate-500/20 text-slate-400 border-slate-500/50',
      'UNVERIFIABLE': 'bg-slate-700/50 text-slate-300 border-slate-600',
      'BEYOND_KNOWLEDGE': 'bg-slate-800 text-slate-400 border-slate-700'
    };

    const labels = {
      'VERIFIED_TRUE': '✅ VERIFIED TRUE',
      'VERIFIED_FALSE': '❌ VERIFIED FALSE',
      'PARTIALLY_MISLEADING': '⚠️ MISLEADING',
      'TRUE_BUT_MISLEADING': '⚠️ CONTEXT MISSING',
      'OUTDATED': '🕒 OUTDATED',
      'UNVERIFIABLE': '❓ UNVERIFIABLE',
      'BEYOND_KNOWLEDGE': '🚫 UNKNOWN'
    };

    return (
      <div className={`px-4 py-2 rounded-lg border font-bold text-sm tracking-wide flex items-center justify-center ${styles[verdict] || styles['UNVERIFIABLE']}`}>
        {labels[verdict] || verdict}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">BACK_TO_HOME</span>
        </button>
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono text-blue-300">LIVE_INTERNET_ACCESS_ENABLED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center mb-6">
              <div className="bg-blue-900/30 p-2 rounded mr-3 border border-blue-500/20">
                <Scale className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Truth Assessment</h2>
                <p className="text-xs text-slate-500">Cross-reference claims against global trust registries.</p>
              </div>
            </div>

            <textarea
              className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-slate-600"
              placeholder="Paste a claim, news article text, or social media forward here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />

            <div className="mt-4">
              <label className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${selectedFile ? 'border-blue-500 bg-blue-900/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}>
                <div className="flex flex-col items-center pt-5 pb-6">
                  {selectedFile ? (
                    <div className="flex items-center text-blue-400">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm font-mono truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-xs">Attach Evidence Image (Optional)</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </label>
            </div>

            <button 
              onClick={handleVerify}
              disabled={loading || (!textInput && !selectedFile)}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center justify-center ${
                loading || (!textInput && !selectedFile)
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {stage.replace(/_/g, ' ')}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  INITIATE VERIFICATION
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 font-mono space-y-2">
            <p>SCOPE OF INVESTIGATION:</p>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-slate-600" /> Government Gazettes & Portals</div>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-slate-600" /> Major International News Agencies</div>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-slate-600" /> Official Verified Handles</div>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-slate-600" /> Fact-Check Repositories</div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {!report && !loading && (
             <div className="h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-slate-800 rounded-xl min-h-[400px]">
               <ShieldCheck className="w-20 h-20 mb-4 opacity-10" />
               <p className="font-mono text-sm">AWAITING INVESTIGATION REQUEST</p>
             </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center mb-6">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {report && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
              
              {/* Verdict Card */}
              <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs font-mono text-slate-500 mb-1">CASE ID: {report.id.slice(0,8)}</div>
                    <h1 className="text-2xl font-bold text-white">Forensic Conclusion</h1>
                  </div>
                  {getVerdictBadge(report.verdict)}
                </div>
                
                <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 text-slate-300 text-sm leading-relaxed">
                  <span className="text-blue-400 font-bold mr-2">SUMMARY:</span>
                  {report.summary}
                </div>
              </div>

              {/* Claims Breakdown */}
              <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center">
                   <FileText className="w-4 h-4 mr-2 text-blue-400" />
                   <h3 className="font-bold text-slate-200 text-sm">ATOMIC CLAIMS ANALYSIS</h3>
                </div>
                <div className="divide-y divide-slate-800">
                  {report.claims.map((claim, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-slate-200 font-medium text-sm flex-1 mr-4">"{claim.text}"</p>
                        <span className={`text-[10px] font-mono px-2 py-1 rounded border ${
                          claim.status === 'VERIFIED' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' :
                          claim.status === 'DEBUNKED' ? 'text-red-400 border-red-900 bg-red-900/20' :
                          'text-slate-400 border-slate-700 bg-slate-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{claim.reasoning}</p>
                      
                      {claim.citations && claim.citations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {claim.citations.slice(0, 2).map((cite, cIdx) => (
                            <a 
                              key={cIdx} 
                              href={cite} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-blue-400/70 hover:text-blue-400 flex items-center bg-blue-900/10 px-2 py-1 rounded hover:bg-blue-900/30 transition-colors"
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              SOURCE REF {cIdx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Facts & Myths & Sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                  <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
                    ESTABLISHED FACTS
                  </h3>
                  <ul className="space-y-2">
                    {report.factsAnalysis.provenFacts.length > 0 ? (
                      report.factsAnalysis.provenFacts.map((fact, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start">
                          <span className="text-emerald-500 mr-2 mt-0.5">●</span>
                          {fact}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-600 italic">No specific established facts cited.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                   <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-blue-400" />
                    SOURCE REGISTRY
                  </h3>
                  <div className="space-y-2">
                    {report.sources.length > 0 ? (
                      report.sources.slice(0, 5).map((source, i) => (
                        <a 
                          key={i} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block text-xs text-slate-400 hover:text-blue-400 truncate border-b border-slate-800 pb-2 last:border-0"
                        >
                          <span className="text-slate-600 mr-2">[{i+1}]</span>
                          {source.title}
                        </a>
                      ))
                    ) : (
                      <div className="text-xs text-slate-600 italic">No external web sources could be linked.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationApp;
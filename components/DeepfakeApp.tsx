import React, { useState } from 'react';
import UploadSection from './UploadSection';
import AnalyzingOverlay from './AnalyzingOverlay';
import ResultsDashboard from './ResultsDashboard';
import { analyzeImage } from '../services/analysisService';
import { ForensicReport, AnalysisStep } from '../types';

const DeepfakeApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setReport(null);
    setStep(AnalysisStep.UPLOADING);

    try {
      // Simulate steps for UI effect
      const steps = [
        AnalysisStep.PREPROCESSING,
        AnalysisStep.FACE_DETECTION,
        AnalysisStep.SPATIAL_ANALYSIS,
        AnalysisStep.FREQUENCY_ANALYSIS,
        AnalysisStep.AGGREGATING
      ];

      // Start analysis in background
      const analysisPromise = analyzeImage(selectedFile);

      // Show steps animation
      for (const s of steps) {
        setStep(s);
        await new Promise(r => setTimeout(r, 800));
      }

      const result = await analysisPromise;
      setReport(result);
      setStep(AnalysisStep.COMPLETE);
    } catch (err: any) {
      console.error(err);
      
      // Handle Quota/429 errors specifically
      let msg = "Analysis failed. Please try again or use a clearer image.";
      if (err.message?.includes("429") || err.message?.includes("quota") || err.status === 429) {
        msg = "System Busy: API request limit reached. Please wait a minute and try again.";
      } else if (err.message?.includes("Candidate was stopped")) {
         msg = "Analysis halted by safety filters. The image may violate content policies.";
      }
      
      setError(msg);
      setStep(AnalysisStep.IDLE);
    }
  };

  const handleReset = () => {
    setFile(null);
    setReport(null);
    setStep(AnalysisStep.IDLE);
    setError(null);
  };

  return (
    <div className="w-full">
      {step === AnalysisStep.IDLE && (
        <UploadSection onFileSelect={handleFileSelect} error={error} />
      )}

      {step !== AnalysisStep.IDLE && step !== AnalysisStep.COMPLETE && (
        <AnalyzingOverlay step={step} />
      )}

      {step === AnalysisStep.COMPLETE && report && file && (
        <ResultsDashboard report={report} file={file} onReset={handleReset} />
      )}
    </div>
  );
};

export default DeepfakeApp;
export type Verdict = 'REAL' | 'FAKE' | 'SUSPICIOUS';

export interface ModelScore {
  name: string;
  score: number; // 0-100
  description: string;
  weight: number;
}

export interface ForensicReport {
  id: string;
  timestamp: string;
  filename: string;
  verdict: Verdict;
  confidence: number;
  processingTimeMs: number;
  modelScores: ModelScore[];
  artifacts: {
    spatialInconsistencies: number; // 0-100
    frequencyAnomalies: number; // 0-100
    compressionGhosting: number; // 0-100
    metadataIntegrity: boolean;
  };
  explanation: string[];
}

export enum AnalysisStep {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PREPROCESSING = 'PREPROCESSING',
  FACE_DETECTION = 'FACE_DETECTION',
  SPATIAL_ANALYSIS = 'SPATIAL_ANALYSIS',
  FREQUENCY_ANALYSIS = 'FREQUENCY_ANALYSIS',
  AGGREGATING = 'AGGREGATING',
  COMPLETE = 'COMPLETE'
}

export type OverlayMode = 'NONE' | 'HEATMAP' | 'ELA' | 'GRID';

// --- Verification Types ---

export type VerificationVerdict = 
  | 'VERIFIED_TRUE' 
  | 'VERIFIED_FALSE' 
  | 'PARTIALLY_MISLEADING' 
  | 'TRUE_BUT_MISLEADING' 
  | 'OUTDATED' 
  | 'UNVERIFIABLE' 
  | 'BEYOND_KNOWLEDGE';

export interface AtomicClaim {
  text: string;
  status: 'VERIFIED' | 'DEBUNKED' | 'DISPUTED' | 'UNVERIFIABLE';
  confidence: number;
  reasoning: string;
  citations: string[]; // URLs relevant to this specific claim
}

export interface VerificationSource {
  title: string;
  uri: string;
}

export interface VerificationReport {
  id: string;
  timestamp: string;
  verdict: VerificationVerdict;
  confidence: number;
  summary: string;
  claims: AtomicClaim[];
  sources: VerificationSource[];
  factsAnalysis: {
    provenFacts: string[];
    mythChecks: string[];
  };
}
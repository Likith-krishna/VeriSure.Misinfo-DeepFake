# VERISURE FORENSIC AI - TECHNICAL REQUIREMENTS DOCUMENT (v2.4.0)

## 1. DEPENDENCY MANIFEST
The following modules must be accessible via importmaps or package.json:
- React Framework: react@^19.2.4, react-dom@^19.2.4
- AI Engine: @google/genai@^1.40.0 (Supports Gemini 3 Flash/Pro)
- UI/UX: lucide-react@^0.563.0 (Forensic Icons)
- Data Viz: recharts@^3.7.0 (Metric Breakdown)
- Styles: tailwindcss@^3.x (PostCSS)

## 2. SYSTEM ARCHITECTURE
- Frontend: Single Page Application (SPA) with Atomic Component Structure.
- API Strategy: Client-side direct integration with Gemini API via environment keys.
- Data Flow: 
  1. Image/Text Ingestion -> 
  2. Base64 Encoding -> 
  3. Gemini Multi-modal Inference (Vision/Search) -> 
  4. Structured JSON Parsing -> 
  5. UI Forensic Visualization.

## 3. CORE ANALYTIC ENGINES
### 3.1 Vision Forensics (Deepfake Detection)
- Model: gemini-3-flash-preview
- Methods: Spatial Artifact Analysis, Frequency Domain Inspection (DFT Simulation).
- Verdicts: REAL, SUSPICIOUS, FAKE.

### 3.2 Search Grounding (Fact Verification)
- Model: gemini-3-flash-preview (Search-enabled)
- Tools: Google Search (googleSearch tool).
- Sources: Verified URLs, citations, and grounding metadata.

## 4. DEPLOYMENT REQUIREMENTS
- Browser: Modern Chromium, Firefox, or Safari (ESM support required).
- Env Variables: process.env.API_KEY (Mandatory).
- Media: Supported formats include JPEG, PNG, WEBP (Max 25MB).

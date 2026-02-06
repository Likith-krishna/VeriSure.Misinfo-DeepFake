import { GoogleGenAI, Type } from "@google/genai";
import { VerificationReport, VerificationVerdict } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const verifyInformation = async (text: string, image?: File): Promise<VerificationReport> => {
  const startTime = performance.now();

  try {
    const parts: any[] = [];
    
    if (image) {
      const base64Data = await fileToBase64(image);
      parts.push({ inlineData: { mimeType: image.type, data: base64Data } });
    }
    
    if (text) {
      parts.push({ text: text });
    }

    if (parts.length === 0) {
      throw new Error("No input provided");
    }

    const systemPrompt = `
    You are the Principal AI Verification Scientist for VeriSure.
    Your task is to verify the provided content (text, image, or both) with absolute rigor using Google Search.
    
    # SYSTEM RULES
    1. **NO CLAIM IS TRUE WITHOUT EVIDENCE**: You must corroborate claims with external trusted sources.
    2. **TRUSTED SOURCES ONLY**: Prioritize Government (.gov), National News Agencies (Reuters, AP, BBC, etc.), and Official Organization Channels. Ignore blogs or random social media.
    3. **VERDICT LOGIC**:
       - 1+ Gov source or 2+ Major News sources confirming -> VERIFIED_TRUE
       - Official denial -> VERIFIED_FALSE
       - Conflicting info -> DISPUTED / UNVERIFIABLE
       - No results -> UNVERIFIABLE (Do not guess)
    4. **IMAGE FORENSICS**: If an image is provided, analyze its context. Is it reused? Is it outdated? Does the caption match the visual evidence?
    
    # OUTPUT FORMAT
    You must output a JSON object matching the schema.
    `;

    parts.push({ text: systemPrompt });

    // Using gemini-3-flash-preview which supports googleSearch and has higher rate limits
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { 
              type: Type.STRING, 
              enum: ['VERIFIED_TRUE', 'VERIFIED_FALSE', 'PARTIALLY_MISLEADING', 'TRUE_BUT_MISLEADING', 'OUTDATED', 'UNVERIFIABLE', 'BEYOND_KNOWLEDGE'] 
            },
            confidence: { type: Type.NUMBER, description: "0-100 confidence in the verdict" },
            summary: { type: Type.STRING, description: "Executive summary of the investigation" },
            claims: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The atomic claim being checked" },
                  status: { type: Type.STRING, enum: ['VERIFIED', 'DEBUNKED', 'DISPUTED', 'UNVERIFIABLE'] },
                  reasoning: { type: Type.STRING, description: "Why this specific status was assigned" },
                  citations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant URLs for this claim" }
                },
                required: ["text", "status", "reasoning", "citations"]
              }
            },
            factsAnalysis: {
              type: Type.OBJECT,
              properties: {
                provenFacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Established facts found during search" },
                mythChecks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Common myths or hoaxes related to this topic" }
              },
              required: ["provenFacts", "mythChecks"]
            }
          },
          required: ["verdict", "confidence", "summary", "claims", "factsAnalysis"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from verification model");
    
    const data = JSON.parse(jsonText);

    // Extract sources from grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || "External Source",
        uri: chunk.web.uri
      }));

    // Deduplicate sources
    const uniqueSources = Array.from(new Map(sources.map((s: any) => [s.uri, s])).values());

    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      verdict: data.verdict,
      confidence: data.confidence,
      summary: data.summary,
      claims: data.claims,
      factsAnalysis: data.factsAnalysis,
      sources: uniqueSources as any[]
    };

  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
};
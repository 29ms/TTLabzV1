import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Mission, LabTrack, LabCategory, LabDifficulty, MediaType, QuickScenario, SubmissionPlatform } from "../types";
import { GoogleGenAI } from "@google/genai";

// ===== SIMPLE DAILY LIMIT (LAUNCH SAFETY) =====
const DAILY_LIMIT = 20;

function todayKey1() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function checkDailyLimit() {
  const today = todayKey1();

  const savedDay = localStorage.getItem("ai_day");
  let count = Number(localStorage.getItem("ai_count") || "0");

  // reset next day
  if (savedDay !== today) {
    localStorage.setItem("ai_day", today);
    localStorage.setItem("ai_count", "0");
    count = 0;
  }

  if (count >= DAILY_LIMIT) {
    throw new Error("Daily AI limit reached. Try again tomorrow.");
  }

  localStorage.setItem("ai_count", String(count + 1));
}

// ---- Global AI safety + rate limit (client-side MVP) ----
const MIN_MS_BETWEEN_CALLS = 12_000; // 12 seconds
const DAILY_FREE_CALLS = 30;         // adjust for your free tier

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function enforceClientLimits() {
  const now = Date.now();

  // 1) spam click throttle
  const last = Number(localStorage.getItem("ttlabs_ai_last_ms") || "0");
  if (last && now - last < MIN_MS_BETWEEN_CALLS) {
    const wait = Math.ceil((MIN_MS_BETWEEN_CALLS - (now - last)) / 1000);
    throw new Error(`Please wait ${wait}s before generating again.`);
  }

  // 2) daily cap (free tier protection)
  const key = todayKey();
  const savedDay = localStorage.getItem("ttlabs_ai_day") || key;
  let count = Number(localStorage.getItem("ttlabs_ai_count") || "0");

  // new day → reset
  if (savedDay !== key) {
    localStorage.setItem("ttlabs_ai_day", key);
    localStorage.setItem("ttlabs_ai_count", "0");
    count = 0;
  }

  if (count >= DAILY_FREE_CALLS) {
    throw new Error(`Daily AI limit reached (${DAILY_FREE_CALLS}). Try again tomorrow or upgrade to Pro.`);
  }

  // record attempt
  localStorage.setItem("ttlabs_ai_last_ms", String(now));
  localStorage.setItem("ttlabs_ai_count", String(count + 1));
}

// Wrap any Gemini call with limits + consistent error handling
export async function safeGemini<T>(fn: () => Promise<T>): Promise<T> {
checkDailyLimit();
  enforceClientLimits();
  try {
    return await fn();
  } catch (err) {
    // If Gemini fails, roll back the "count" so users don't lose quota on errors
    const count = Number(localStorage.getItem("ttlabs_ai_count") || "0");
    if (count > 0) localStorage.setItem("ttlabs_ai_count", String(count - 1));
    throw err;
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY. Add it to .env.local and restart dev server.");
}

const SYSTEM_INSTRUCTION = `You are a friendly Tech Mentor for kids. 
Tone: Super simple, like you are talking to a 10-year-old. No "tech" jargon.
Behavior: Look at the image carefully. ONLY talk about what is actually in the image. Do not guess things that aren't visible. If the user mentions something that isn't in the image, gently correct them.

Structure your feedback exactly like this:
1. WHAT I SAW: [One simple sentence about a specific detail in the image or user's answer]
2. THE BIG TRICK: [Explain why this is a risk using a real-world example like a "trap" or a "fake friend"]
3. NEXT STEP: [One easy thing to do right now to be safe]`;

export class GeminiService {
  async getMentorFeedback(missionContext: string, userResponse: string, imageData?: string) {
const ai = new GoogleGenAI({ apiKey: API_KEY });    try {
      const parts: any[] = [
        { text: `MISSION: ${missionContext}\n\nUSER SAID: ${userResponse}\n\nPlease give feedback in the simple 3-part format. Be kind and very clear.` }
      ];

      if (imageData) {
        const base64Data = imageData.split(',')[1] || imageData;
        parts.push({
          inlineData: {
            mimeType: 'image/png',
            data: base64Data
          }
        });
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Feedback error:", error);
      return "WHAT I SAW: I'm having a little trouble seeing right now.\nTHE BIG TRICK: Even computers get tired!\nNEXT STEP: Try asking me one more time.";
    }
  }

  // New Structured Pointers Logic
  async getStructuredResearchPointers(topic: string, sectionTitle: string, currentText: string): Promise<string> {
const ai = new GoogleGenAI({ apiKey: API_KEY });    const prompt = `
      TOPIC: "${topic}"
      SECTION: "${sectionTitle}"
      USER CONTENT SO FAR: "${currentText}"
      
      INSTRUCTION: Provide structural guidance, suggest angles to explore, questions to think about, or improvements.
      STRICT RULES: 
      - NEVER write paragraphs for the user.
      - NEVER complete sections.
      - NEVER generate copy-paste content.
      - MUST begin with phrases like "You may want to consider...", "Think about explaining...", "A strong methodology usually includes...", or "Have you defined...".
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.7 }
      });
      return response.text || "AI pointer system unavailable. Focus on clarity and data validity.";
    } catch (e) {
      return "You may want to consider double-checking your primary sources for this section.";
    }
  }

  // New Submission Recommendations Logic
  async getSubmissionRecommendations(topic: string, metadata: string): Promise<SubmissionPlatform[]> {
const ai = new GoogleGenAI({ apiKey: API_KEY });    const prompt = `
      RESEARCH TOPIC: "${topic}"
      RESEARCH CONTEXT: "${metadata}"
      
      Based on this metadata, suggest 8-12 academic or professional platforms where this research could be submitted.
      Consider if it is AI-focused, business-focused, technical, or social science based.
      Return exactly a JSON array of objects with keys: "name", "url", "reason".
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                url: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "url", "reason"]
            }
          }
        }
      });
      return JSON.parse(response.text);
    } catch (e) {
      return [
        { name: "IEEE", url: "https://www.ieee.org", reason: "Standard for technical and engineering research." },
        { name: "Medium", url: "https://medium.com", reason: "Good for general technical outreach." }
      ];
    }
  }

  async generateDynamicScenario(track: LabTrack | 'ALL'): Promise<QuickScenario> {
  checkDailyLimit();
const ai = new GoogleGenAI({ apiKey: API_KEY });
const trackConstraint = track === 'ALL' ? 'any topic' : `the ${track} topic`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a simple "True or False" question for a kid about ${trackConstraint}. 
        Keep the language very easy. 
        Return it in JSON with: id, prompt, track, correctAnswer, explanation, mediaType (set to 'IMAGE'), mediaPrompt (a prompt for a clear, simple image of an SMS, email, or profile showing the trick).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              prompt: { type: Type.STRING },
              track: { type: Type.STRING },
              correctAnswer: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING },
              mediaType: { type: Type.STRING },
              mediaPrompt: { type: Type.STRING }
            },
            required: ["id", "prompt", "track", "correctAnswer", "explanation", "mediaType", "mediaPrompt"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (err) {
      return {
        id: `fb-${Date.now()}`,
        prompt: "A random person DMs you for your password. Is it safe to give it?",
        track: "LIFE",
        correctAnswer: false,
        explanation: "Never share passwords with strangers!"
      };
    }
  }

  async suggestNeuralArchitecture(dataDescription: string): Promise<{ layers: string[], reasoning: string }> {
const ai = new GoogleGenAI({ apiKey: API_KEY });
try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `DATA SPECIFICATION: "${dataDescription}"\n\nSuggest a deep neural network architecture. Return JSON: { layers: string[], reasoning: string }.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              layers: { type: Type.ARRAY, items: { type: Type.STRING } },
              reasoning: { type: Type.STRING }
            },
            required: ["layers", "reasoning"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (err) {
      return { layers: ["Input", "Dense_64", "ReLU", "Dropout", "Dense_1", "Sigmoid"], reasoning: "Standard binary classification baseline." };
    }
  }

  async simulateTrainingStep(arch: string[]): Promise<{ loss: number, accuracy: number, log: string }> {
const ai = new GoogleGenAI({ apiKey: API_KEY });
try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Simulate one training epoch for: ${arch.join(' -> ')}. Return JSON: { loss: float, accuracy: float, log: string }.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              loss: { type: Type.NUMBER },
              accuracy: { type: Type.NUMBER },
              log: { type: Type.STRING }
            },
            required: ["loss", "accuracy", "log"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (err) {
      return { loss: 0.35, accuracy: 0.88, log: "Optimization cycle active." };
    }
  }

  async refineTopic(rawTopic: string): Promise<string> {
const ai = new GoogleGenAI({ apiKey: API_KEY });
try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user wants to research: "${rawTopic}". Rephrase this into a clear, simple one-sentence research title. Return ONLY the refined title string.`,
      });
      return response.text.trim().replace(/^"|"$/g, '');
    } catch (err) {
      return "How our phones track us and why it matters.";
    }
  }

  async generateResearchTopic(category?: string): Promise<string> {
const ai = new GoogleGenAI({ apiKey: API_KEY });
const categoryPrompt = category ? ` related to ${category}` : "";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a clear, simple research topic${categoryPrompt} (one sentence) for a student study.`,
      });
      return response.text.trim();
    } catch (err) {
      return "The danger of sharing too much on social media.";
    }
  }

  async simulateResearchData(topic: string, demographics: any): Promise<{ findings: string[], analysis: string }> {
const ai = new GoogleGenAI({ apiKey: API_KEY });  
try {
      const prompt = `Topic: ${topic}\nDemographics: ${JSON.stringify(demographics)}\nGenerate 3 simple key findings (percentages) and a short 3-sentence analysis. Use JSON format.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              analysis: { type: Type.STRING }
            },
            required: ["findings", "analysis"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (err) {
      return { findings: ["45% awareness level", "20% tool adoption", "35% risk indifference"], analysis: "Data shows moderate engagement." };
    }
  }

  async generateResearchPaper(topic: string, data: any, demographics: any): Promise<string> {
const ai = new GoogleGenAI({ apiKey: API_KEY });
try {
      const prompt = `Topic: ${topic}\nFindings: ${data.findings.join(', ')}\nAnalysis: ${data.analysis}\nGenerate a simple, clear research paper as PLAIN TEXT.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      return "RESEARCH PAPER\n====================\n\nTitle: " + topic;
    }
  }

  async generateSimilarMission(originalMission: Mission, userResponse: string, feedback: string): Promise<Mission> {
const ai = new GoogleGenAI({ apiKey: API_KEY });    try {
      const prompt = `ORIGINAL: ${originalMission.title}\nUSER: ${userResponse}\nFEEDBACK: ${feedback}\nGenerate a NEW remedial mission using VERY SIMPLE language. Return JSON.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              scenario: { type: Type.STRING },
              task: { type: Type.STRING },
            },
            required: ["title", "description", "scenario", "task"],
          },
        },
      });
      const data = JSON.parse(response.text || '{}');
      return { ...originalMission, id: `rem-${Date.now()}`, ...data, completed: false };
    } catch (error) {
      return { ...originalMission, id: `rem-fb-${Date.now()}`, completed: false };
    }
  }
}

export const geminiService = new GeminiService();
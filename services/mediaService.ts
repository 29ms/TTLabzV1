import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY. Add it to .env.local and restart dev server.");
}

export class MediaService {
  async generateImage(prompt: string): Promise<string> {
const ai = new GoogleGenAI({ apiKey: API_KEY });
try {
      // Enhance prompt to ensure textual details are large and visible
      let finalPrompt = prompt + " Ensure any text shown is in a LARGE, BOLD, and VERY CLEAR font so it is easy to read. Do not use cursive or small fonts.";
      
      if (prompt.toLowerCase().includes('data broker') || prompt.toLowerCase().includes('guessed')) {
        finalPrompt += " The image MUST contain a list with at least one item clearly labeled 'GUESSED INTERESTS' or 'ESTIMATED AGE' in big letters. Show a digital profile report.";
      }
      
      if (prompt.toLowerCase().includes('sms') || prompt.toLowerCase().includes('text message') || prompt.toLowerCase().includes('iphone')) {
        finalPrompt += " Make it look like a real phone screen with one single text message balloon. The link in the message should be the most visible part.";
      }

      if (prompt.toLowerCase().includes('email')) {
        finalPrompt += " Show an email inbox screen with one large subject line and a big colorful button that says 'CLAIM NOW' or 'CLICK HERE'.";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: finalPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data returned");
    } catch (error) {
      console.error("Image Gen Error:", error);
      throw error;
    }
  }

  async generateVideo(prompt: string): Promise<string> {
   if (!API_KEY) {
  throw new Error("Missing VITE_GEMINI_API_KEY. Add it to .env.local.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed: No URI returned from operations.");

const fetchResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
const blob = await fetchResponse.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Video Gen Error:", error);
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        if (aistudio && typeof aistudio.openSelectKey === 'function') {
          await aistudio.openSelectKey();
        }
      }
      throw error;
    }
  }
}

export const mediaService = new MediaService();

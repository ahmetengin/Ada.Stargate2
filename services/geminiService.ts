

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, ModelType, GroundingSource, RegistryEntry, Tender, UserProfile, TenantConfig } from "../types";
import { generateBaseSystemInstruction, generateContextBlock } from "./prompts";
import { handleGeminiError, formatHistory } from "./geminiUtils";

// Re-export LiveSession
export { LiveSession } from "./liveService";

const createClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// COST OPTIMIZATION: Max history length to send to API
export const MAX_HISTORY_LENGTH = 10; 

export const streamChatResponse = async (
  messages: Message[],
  model: ModelType,
  useSearch: boolean,
  useThinking: boolean,
  registry: RegistryEntry[],
  tenders: Tender[],
  userProfile: UserProfile,
  vesselsInPort: number,
  tenantConfig: TenantConfig, // NEW: Pass tenantConfig
  onChunk: (text: string, grounding?: GroundingSource[]) => void,
  onUsage?: (usage: any) => void
) => {
  try {
    const ai = createClient();
    
    let dynamicSystemInstruction = generateBaseSystemInstruction(tenantConfig) + generateContextBlock(registry, tenders, userProfile, vesselsInPort);

    if (userProfile.legalStatus === 'RED') {
       dynamicSystemInstruction += `\n\n**CRITICAL LEGAL ALERT:** User is in breach. Deny operational requests and cite the breach.`;
    }

    // COST OPTIMIZATION: Slice history to prevent context bloating
    const fullHistory = messages.slice(0, -1);
    const optimizedHistory = fullHistory.slice(-MAX_HISTORY_LENGTH);
    
    // Add a summary marker if history was truncated
    if (fullHistory.length > MAX_HISTORY_LENGTH) {
        console.debug(`[Cost-Aware] History truncated from ${fullHistory.length} to ${MAX_HISTORY_LENGTH} messages.`);
    }

    const chat: Chat = ai.chats.create({
      model: model === ModelType.Pro ? 'gemini-3-pro-preview' : 'gemini-2.5-flash',
      history: formatHistory(optimizedHistory), 
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.5,
        ...(useSearch && { tools: [{ googleSearch: {} }] }),
        ...(useThinking && { thinkingConfig: { thinkingBudget: 2048 } }),
      },
    });

    const lastMessage = messages[messages.length - 1];
    const messageParts: any[] = [];
    if(lastMessage.text) messageParts.push({ text: lastMessage.text });
    if(lastMessage.attachments) {
        lastMessage.attachments.forEach(a => {
            messageParts.push({ inlineData: { mimeType: a.mimeType, data: a.data } });
        });
    }

    if (messageParts.length === 0) {
       console.warn("Attempted to send an empty message. Aborting.");
       return; 
    }
    
    const result = await chat.sendMessageStream({ message: messageParts });

    for await (const chunk of result) {
      const text = (chunk as GenerateContentResponse).text;
      const groundingMetadata = (chunk as GenerateContentResponse).candidates?.[0]?.groundingMetadata;
      
      let groundingSources: GroundingSource[] | undefined;
      if (groundingMetadata?.groundingChunks) {
         groundingSources = groundingMetadata.groundingChunks
            .filter((c: any) => c.web?.uri && c.web?.title)
            .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));
      }

      if (text) {
        onChunk(text, groundingSources);
      }
    }

    const usage = (chat as any)?.context?.getLatestResponse()?.usageMetadata;
    if (onUsage && usage) {
      onUsage(usage);
    }

  } catch (error: any)
   {
    handleGeminiError(error);
  }
};

export const generateSimpleResponse = async (
    prompt: string,
    userProfile: UserProfile,
    registry: RegistryEntry[],
    tenders: Tender[],
    vesselsInPort: number,
    messages: Message[], // Added messages for context
    tenantConfig: TenantConfig // NEW: Pass tenantConfig
): Promise<string> => {
    try {
        const ai = createClient();
        const systemInstruction = generateBaseSystemInstruction(tenantConfig) + generateContextBlock(registry, tenders, userProfile, vesselsInPort);
        
        // Use optimized history for simple response as well
        const optimizedHistory = messages.slice(-MAX_HISTORY_LENGTH);

        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: formatHistory(optimizedHistory),
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });

        const response = await chat.sendMessage({ message: prompt });
        
        return response.text || "I'm having trouble connecting to the network right now.";
    } catch (error) {
        console.error("Simple Response Generation Error:", error);
        return "System Offline. Please try again.";
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
   try {
      const ai = createClient();
      const response = await ai.models.generateImages({
         model: 'imagen-4.0-generate-001',
         prompt,
         config: { numberOfImages: 1, aspectRatio: '16:9' }
      });
      const base64 = response.generatedImages?.[0]?.image?.imageBytes;
      if (!base64) throw new Error("No image generated");
      return base64;
   } catch (error: any) {
      handleGeminiError(error);
      return "";
   }
};
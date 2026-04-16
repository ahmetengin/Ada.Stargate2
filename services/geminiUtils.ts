import { Message, MessageRole, Attachment } from "../types";

export const isImage = (mimeType: string) => mimeType.startsWith('image/');

export const decodeBase64ToText = (base64: string): string => {
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Decoding failed", e);
    return "Error decoding file content.";
  }
};

// Helper to normalize API errors
export const handleGeminiError = (error: any) => {
  console.error("Gemini API Error:", error);
  
  const errString = JSON.stringify(error);
  const isQuotaError = 
    error.status === 429 || 
    error.code === 429 ||
    (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota') || error.message.includes('RESOURCE_EXHAUSTED'))) ||
    (error.error && (error.error.code === 429 || error.error.status === 'RESOURCE_EXHAUSTED')) ||
    errString.includes('RESOURCE_EXHAUSTED');

  if (isQuotaError) {
    throw new Error('API_QUOTA_EXCEEDED');
  }
  throw error;
};

/**
 * Converts our app's Message format to the SDK's content format
 */
export const formatHistory = (messages: Message[]) => {
  let formatted = messages
    .filter(m => m.role !== MessageRole.System && !m.generatedImage) 
    .map(m => {
      const parts: any[] = [];
      
      if (m.attachments && m.attachments.length > 0) {
        m.attachments.forEach(a => {
          if (isImage(a.mimeType)) {
            parts.push({
              inlineData: {
                mimeType: a.mimeType,
                data: a.data
              }
            });
          } else {
            // Handle text/code files by decoding and embedding
            const textContent = decodeBase64ToText(a.data);
            parts.push({ text: `[Attachment: ${a.name || 'File'}]\n\`\`\`\n${textContent}\n\`\`\`\n` });
          }
        });
      }

      if (m.text) {
        parts.push({ text: m.text });
      }

      return {
        role: m.role,
        parts: parts
      };
    })
    // CRITICAL FIX for 'ContentUnion is required'
    .filter(m => m.parts.length > 0); 

  // FIX: Gemini API requires history to start with a 'user' turn.
  // We remove leading 'model' messages (e.g., initial system greeting) until a user message is found.
  while (formatted.length > 0 && formatted[0].role === MessageRole.Model) {
    formatted.shift();
  }

  return formatted;
};
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// This function is the main handler for the serverless function.
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // 1. Check for POST request
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Check for API Key
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    return response.status(500).json({ error: "Lỗi cấu hình máy chủ: API key bị thiếu." });
  }

  try {
    // 3. Parse request body
    const { imageBase64, mimeType, prompt } = request.body;
    if (!imageBase64 || !mimeType || !prompt) {
      return response.status(400).json({ error: 'Thiếu trường bắt buộc: imageBase64, mimeType, hoặc prompt.' });
    }

    // 4. Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 5. Prepare parts for the API call
    const imagePart = {
      inlineData: { data: imageBase64, mimeType: mimeType },
    };
    const textPart = { text: prompt };

    // 6. Call the Gemini API
    const geminiResponse: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // 7. Process the response from Gemini
    let newImageUrl: string | null = null;
    let newText = '';

    for (const part of geminiResponse.candidates?.[0]?.content?.parts || []) {
      if (part.text) {
        newText += part.text;
      } else if (part.inlineData) {
        const { data, mimeType } = part.inlineData;
        newImageUrl = `data:${mimeType};base64,${data}`;
      }
    }
    
    // 8. Send the result back to the frontend
    if (newImageUrl) {
        return response.status(200).json({ imageUrl: newImageUrl, text: newText.trim() });
    } else {
        return response.status(500).json({ error: 'Model không trả về hình ảnh. Vui lòng thử một câu lệnh khác.' });
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
    return response.status(500).json({ error: `Đã xảy ra lỗi máy chủ nội bộ: ${errorMessage}` });
  }
}

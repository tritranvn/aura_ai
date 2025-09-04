
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { EditedImageResult } from '../types';

// Utility to convert a file to a base64 generative part for the API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix "data:image/png;base64,", so we split it off.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as a data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const editImageWithNanoBanana = async (
  imageFile: File,
  prompt: string
): Promise<EditedImageResult | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = { text: prompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  let newImageUrl: string | null = null;
  let newText = '';

  // The response can contain multiple parts, iterate through them to find image and text
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.text) {
      newText += part.text;
    } else if (part.inlineData) {
      const { data, mimeType } = part.inlineData;
      newImageUrl = `data:${mimeType};base64,${data}`;
    }
  }

  if (newImageUrl) {
    return { imageUrl: newImageUrl, text: newText.trim() };
  }

  // If no image was returned, return null to indicate failure
  return null;
};

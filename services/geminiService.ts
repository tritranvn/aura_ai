import type { EditedImageResult } from '../types';

// Utility to convert a file to a base64 string and get its mime type.
const getFileData = (file: File): Promise<{ imageBase64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL: "data:image/png;base64,the_base_64_string"
        const [header, imageBase64] = reader.result.split(',');
        if (!header || !imageBase64) {
             return reject(new Error("Invalid file data format."));
        }
        const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
        resolve({ imageBase64, mimeType });
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export const editImageWithNanoBanana = async (
  imageFile: File,
  prompt: string
): Promise<EditedImageResult | null> => {
  try {
    const { imageBase64, mimeType } = await getFileData(imageFile);

    // Call our own serverless function endpoint
    const response = await fetch('/api/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        prompt,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
        // The server responded with an error status (4xx or 5xx)
        // Use the error message from the server's JSON response if available
        throw new Error(result.error || `Yêu cầu thất bại với mã trạng thái ${response.status}`);
    }

    // Check if the result has the expected structure
    if (result.imageUrl) {
        return result as EditedImageResult;
    } else {
        // This case might happen if the server response is 200 OK but doesn't contain an image.
        console.error("API response was OK but did not contain an image URL.", result);
        return null;
    }

  } catch (error) {
    console.error("Error editing image:", error);
    // Re-throw the error so the UI component can catch it and display a message
    throw error;
  }
};

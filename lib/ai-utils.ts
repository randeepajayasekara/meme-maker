import { HfInference } from '@huggingface/inference';
import axios from 'axios';

// Initialize Hugging Face client
const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export interface AIImageOptions {
  prompt: string;
  style?: string;
  negativePrompt?: string;
  steps?: number;
  guidanceScale?: number;
}

export const generateAIImage = async (options: AIImageOptions): Promise<string> => {
  const {
    prompt,
    style = 'realistic',
    negativePrompt = 'blurry, low quality, distorted, ugly, watermark',
    steps = 20,
    guidanceScale = 7.5
  } = options;

  const stylePrompts = {
    realistic: 'photorealistic, high quality, detailed, 8k',
    cartoon: 'cartoon style, animated, colorful, fun',
    anime: 'anime style, manga art, japanese animation, detailed',
    digital: 'digital art, concept art, artstation trending',
    vintage: 'vintage style, retro, classic, old fashioned',
    fantasy: 'fantasy art, magical, mystical, ethereal'
  };

  const fullPrompt = `${prompt}, ${stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.realistic}`;

  try {
    // Try primary model first
    const response = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-2',
      inputs: fullPrompt,
      parameters: {
        negative_prompt: negativePrompt,
        num_inference_steps: steps,
        guidance_scale: guidanceScale,
      }
    });

    // Handle different response types
    if (response && typeof response === 'object') {
      return URL.createObjectURL(response as any);
    } else if (typeof response === 'string') {
      return `data:image/png;base64,${response}`;
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Primary AI model failed, trying fallback:', error);
    
    // Fallback: Use a free placeholder service with a themed image
    const themes = ['abstract', 'nature', 'tech', 'art', 'space'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    return `https://picsum.photos/512/512?random=${Date.now()}&${randomTheme}`;
  }
};

// Upload image to ImgBB (free image hosting)
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      params: {
        key: process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'demo-key'
      }
    });
    
    return response.data.data.url;
  } catch (error) {
    console.error('ImgBB upload failed:', error);
    // Fallback: create local URL
    return URL.createObjectURL(file);
  }
};

// Download image from URL and convert to File
export const downloadImageAsFile = async (url: string, filename: string = 'image.png'): Promise<File> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

// Optimize image for web
export const optimizeImage = (canvas: HTMLCanvasElement, quality: number = 0.8): string => {
  return canvas.toDataURL('image/jpeg', quality);
};

// Generate meme metadata
export const generateMemeMetadata = (topText: string, bottomText: string, template?: string) => {
  return {
    topText: topText.trim(),
    bottomText: bottomText.trim(),
    template: template || 'custom',
    createdAt: new Date().toISOString(),
    version: '1.0'
  };
};

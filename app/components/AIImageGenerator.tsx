'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HfInference } from '@huggingface/inference';

interface AIImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
  onClose: () => void;
}

const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({ onImageGenerated, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const styles = [
    { id: 'realistic', name: 'Realistic', prompt: 'photorealistic, high quality, detailed' },
    { id: 'cartoon', name: 'Cartoon', prompt: 'cartoon style, animated, colorful' },
    { id: 'anime', name: 'Anime', prompt: 'anime style, manga art, japanese animation' },
    { id: 'digital', name: 'Digital Art', prompt: 'digital art, concept art, artstation' },
    { id: 'vintage', name: 'Vintage', prompt: 'vintage style, retro, old fashioned' },
    { id: 'fantasy', name: 'Fantasy', prompt: 'fantasy art, magical, mystical' }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
      if (!apiKey) {
        throw new Error('Hugging Face API key not found');
      }

      // Using Hugging Face's free Stable Diffusion model
      const hf = new HfInference(apiKey);
      
      const selectedStylePrompt = styles.find(s => s.id === selectedStyle)?.prompt || '';
      const fullPrompt = `${prompt}, ${selectedStylePrompt}`;

      console.log('Generating image with prompt:', fullPrompt);

      const response = await hf.textToImage({
        model: 'runwayml/stable-diffusion-v1-5', // More reliable model
        inputs: fullPrompt,
        parameters: {
          negative_prompt: 'blurry, low quality, distorted, ugly, nsfw',
          num_inference_steps: 15,
          guidance_scale: 7.5,
        }
      });

      // Convert response to URL
      let imageUrl: string;
      try {
        // Try to treat as Blob first
        if (response && typeof response === 'object') {
          imageUrl = URL.createObjectURL(response as Blob);
        } else {
          // Fallback: treat as base64 string
          const base64String = typeof response === 'string' ? response : String(response);
          // Remove data URL prefix if present
          const cleanBase64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
          imageUrl = `data:image/png;base64,${cleanBase64}`;
        }
      } catch (blobError) {
        // If blob creation fails, try as base64
        const base64String = typeof response === 'string' ? response : String(response);
        const cleanBase64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        imageUrl = `data:image/png;base64,${cleanBase64}`;
      }
      
      console.log('Image generated successfully');
      setGeneratedImages(prev => [imageUrl, ...prev]);
      
    } catch (error) {
      console.error('Error generating image:', error);
      
      // More specific error handling
      let errorMessage = 'Failed to generate image';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'API key not configured properly';
        } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (error.message.includes('NSFW') || error.message.includes('safety')) {
          errorMessage = 'Content blocked by safety filter. Try a different prompt.';
        }
      }
      
      console.log(`Using fallback image generation: ${errorMessage}`);
      
      // Generate a local fallback image using canvas
      await generateFallbackImage();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackImage = async () => {
    try {
      // Create a canvas element to generate a custom image
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Style-based colors
      const styleColors: { [key: string]: { bg: string; text: string } } = {
        realistic: { bg: '#8B4513', text: '#FFFFFF' },
        cartoon: { bg: '#FF6B6B', text: '#FFFFFF' },
        anime: { bg: '#FF69B4', text: '#FFFFFF' },
        digital: { bg: '#4169E1', text: '#FFFFFF' },
        vintage: { bg: '#DEB887', text: '#8B4513' },
        fantasy: { bg: '#9370DB', text: '#FFFFFF' }
      };

      const colors = styleColors[selectedStyle] || { bg: '#4ECDC4', text: '#FFFFFF' };

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, colors.bg);
      gradient.addColorStop(1, colors.bg + '80');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add prompt text
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Word wrap the prompt
      const words = prompt.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 400 && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      // Draw text lines
      const lineHeight = 40;
      const startY = 256 - (lines.length * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), 256, startY + index * lineHeight);
      });

      // Add style indicator
      ctx.font = 'italic 16px Arial';
      ctx.fillText(`${selectedStyle} style`, 256, 480);

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setGeneratedImages(prev => [imageUrl, ...prev]);
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating fallback image:', error);
      
      // Final fallback - use a placeholder service
      const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const placeholderUrl = `https://via.placeholder.com/512x512/${randomColor}/FFFFFF?text=${encodeURIComponent(prompt.slice(0, 20))}`;
      setGeneratedImages(prev => [placeholderUrl, ...prev]);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageGenerated(imageUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                🤖 AI Image Generator
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Create custom images with artificial intelligence
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Choose Style
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-lg text-xs font-medium transition-all ${
                    selectedStyle === style.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {style.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Describe your image
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A funny cat wearing sunglasses in space..."
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-zinc-500 dark:placeholder-zinc-400"
                onKeyPress={(e) => e.key === 'Enter' && generateImage()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                         rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg transition-all btn-glow"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full spinner" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate'
                )}
              </motion.button>
            </div>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Generated Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer hover-zoom"
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Use This Image</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Tips for better results:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Be specific about what you want to see</li>
              <li>• Include adjectives like "funny", "dramatic", "colorful"</li>
              <li>• Mention the setting or background</li>
              <li>• Try different styles to match your meme's tone</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIImageGenerator;

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from './ControlPanel';
import CanvasArea from './CanvasArea';
import WelcomePage from './WelcomePage';
import AIImageGenerator from './AIImageGenerator';
import TemplateLibrary from './TemplateLibrary';

// Import Fabric.js dynamically to avoid SSR issues
declare global {
  interface Window {
    fabric: any;
  }
}

export interface TextSettings {
  topText: string;
  bottomText: string;
  font: string;
  color: string;
  fontSize: number;
  strokeEnabled: boolean;
}

const MemeGenerator: React.FC = () => {
  const [canvas, setCanvas] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [textSettings, setTextSettings] = useState<TextSettings>({
    topText: '',
    bottomText: '',
    font: 'Impact',
    color: '#ffffff',
    fontSize: 48,
    strokeEnabled: true,
  });

  // Load Fabric.js dynamically
  useEffect(() => {
    const loadFabric = async () => {
      if (typeof window !== 'undefined' && !window.fabric) {
        const fabricModule = await import('fabric');
        // Fabric v6 exports everything directly
        window.fabric = fabricModule;
        setFabricLoaded(true);
      } else if (window.fabric) {
        setFabricLoaded(true);
      }
    };
    
    loadFabric();
  }, []);

  // Initialize canvas when component mounts and Fabric is loaded
  useEffect(() => {
    if (!fabricLoaded) return;
    
    const canvasElement = document.getElementById('meme-canvas') as HTMLCanvasElement;
    if (canvasElement && !canvas && window.fabric) {
      const fabricCanvas = new window.fabric.Canvas(canvasElement, {
        width: 600,
        height: 600,
        backgroundColor: '#f3f4f6',
      });
      setCanvas(fabricCanvas);

      // Cleanup function
      return () => {
        if (fabricCanvas) {
          fabricCanvas.dispose();
        }
      };
    }
  }, [fabricLoaded, canvas]);

  // Handle AI generated image
  const handleAIImageGenerated = (imageUrl: string) => {
    handleImageLoad(imageUrl);
  };

  // Handle template selection
  const handleTemplateSelected = (imageUrl: string) => {
    handleImageLoad(imageUrl);
  };

  // Generic image loading function
  const handleImageLoad = async (imageUrl: string) => {
    if (!canvas || !fabricLoaded || !window.fabric) return;

    try {
      setUploadedImage(imageUrl);
      
      // Load image onto canvas using the correct Fabric.js v6 API
      const img = await window.fabric.FabricImage.fromURL(imageUrl);
      
      // Clear canvas - use remove method for all objects
      canvas.getObjects().forEach((obj: any) => {
        canvas.remove(obj);
      });
      
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgWidth = img.getScaledWidth();
      const imgHeight = img.getScaledHeight();
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - imgWidth * scale) / 2,
        top: (canvasHeight - imgHeight * scale) / 2,
        selectable: false,
        evented: false,
      });
      
      canvas.add(img);
      canvas.sendObjectToBack(img); // Move to back using Fabric v6 API
      canvas.renderAll();
      
      // Re-add text after image is loaded
      updateTexts();
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Error loading image. Please try again.');
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        await handleImageLoad(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update text on canvas
  const updateTexts = () => {
    if (!canvas || !window.fabric) return;

    try {
      // Remove existing text objects
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        if (obj.type === 'text' || obj.type === 'textbox') {
          canvas.remove(obj);
        }
      });

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      // Add top text if exists
      if (textSettings.topText.trim()) {
        const topText = new window.fabric.Text(textSettings.topText.toUpperCase(), {
          left: canvasWidth / 2,
          top: 50,
          originX: 'center',
          originY: 'top',
          fontFamily: textSettings.font,
          fontSize: textSettings.fontSize,
          fill: textSettings.color,
          stroke: textSettings.strokeEnabled ? '#000000' : '',
          strokeWidth: textSettings.strokeEnabled ? 3 : 0,
          textAlign: 'center',
          fontWeight: 'bold',
          selectable: true,
        });
        canvas.add(topText);
      }

      // Add bottom text if exists
      if (textSettings.bottomText.trim()) {
        const bottomText = new window.fabric.Text(textSettings.bottomText.toUpperCase(), {
          left: canvasWidth / 2,
          top: canvasHeight - 50,
          originX: 'center',
          originY: 'bottom',
          fontFamily: textSettings.font,
          fontSize: textSettings.fontSize,
          fill: textSettings.color,
          stroke: textSettings.strokeEnabled ? '#000000' : '',
          strokeWidth: textSettings.strokeEnabled ? 3 : 0,
          textAlign: 'center',
          fontWeight: 'bold',
          selectable: true,
        });
        canvas.add(bottomText);
      }

      canvas.renderAll();
    } catch (error) {
      console.error('Error updating texts:', error);
    }
  };

  // Update texts when settings change
  useEffect(() => {
    if (fabricLoaded) {
      updateTexts();
    }
  }, [textSettings, canvas, fabricLoaded]);

  // Download meme
  const downloadMeme = () => {
    if (!canvas || !window.fabric) return;

    try {
      // Create download link
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading meme:', error);
      alert('Error downloading meme. Please try again.');
    }
  };

  return (
    <>
      {/* Welcome Page */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomePage onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {/* Main Application */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showWelcome ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="fixed inset-0 gradient-bg-overlay -z-10" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-dark rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-6 border-b border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-3xl font-bold text-white mb-2 gradient-text"
                  >
                    🎭 Meme Generator Pro
                  </motion.h1>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-zinc-300"
                  >
                    Create viral memes with AI-powered tools and templates
                  </motion.p>
                </div>
                
                {/* Quick Action Buttons */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex space-x-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAIGenerator(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white 
                             rounded-lg font-medium hover:shadow-lg transition-all btn-glow text-sm"
                  >
                    🤖 AI Generate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTemplateLibrary(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white 
                             rounded-lg font-medium hover:shadow-lg transition-all btn-glow text-sm"
                  >
                    📚 Templates
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Control Panel - Left Column */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="lg:col-span-1"
              >
                <ControlPanel
                  textSettings={textSettings}
                  setTextSettings={setTextSettings}
                  onImageUpload={handleImageUpload}
                  onAIGenerate={() => setShowAIGenerator(true)}
                  onTemplateSelect={() => setShowTemplateLibrary(true)}
                />
              </motion.div>

              {/* Canvas Area - Right Column */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="lg:col-span-2"
              >
                <CanvasArea
                  onDownload={downloadMeme}
                  hasImage={!!uploadedImage}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showAIGenerator && (
            <AIImageGenerator
              onImageGenerated={handleAIImageGenerated}
              onClose={() => setShowAIGenerator(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTemplateLibrary && (
            <TemplateLibrary
              onTemplateSelect={handleTemplateSelected}
              onClose={() => setShowTemplateLibrary(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default MemeGenerator;

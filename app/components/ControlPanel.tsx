'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TextSettings } from './MemeGenerator';

interface ControlPanelProps {
  textSettings: TextSettings;
  setTextSettings: React.Dispatch<React.SetStateAction<TextSettings>>;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIGenerate: () => void;
  onTemplateSelect: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  textSettings,
  setTextSettings,
  onImageUpload,
  onAIGenerate,
  onTemplateSelect,
}) => {
  const fonts = ['Impact', 'Arial', 'Times New Roman', 'Helvetica', 'Comic Sans MS'];

  const handleTextChange = (field: keyof TextSettings, value: string | number | boolean) => {
    setTextSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Image & Template Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="glass-dark rounded-xl p-6 border border-zinc-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🖼️</span>
          Image & Templates
        </h3>
        
        <div className="space-y-4">
          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Upload Image
            </label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="block w-full text-sm text-zinc-300
                         file:mr-4 file:py-3 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-medium
                         file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white
                         hover:file:from-blue-600 hover:file:to-purple-700
                         file:cursor-pointer cursor-pointer file:transition-all"
              />
            </motion.div>
            <p className="text-xs text-zinc-400 mt-2">
              Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* AI Generation */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAIGenerate}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white 
                     rounded-lg font-medium hover:shadow-lg transition-all btn-glow
                     border border-purple-400/30"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xl">🤖</span>
              <div className="text-left">
                <div className="font-semibold">AI Image Generation</div>
                <div className="text-xs opacity-90">Create custom images with AI</div>
              </div>
            </div>
          </motion.button>

          {/* Template Gallery */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTemplateSelect}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white 
                     rounded-lg font-medium hover:shadow-lg transition-all btn-glow
                     border border-blue-400/30"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xl">📚</span>
              <div className="text-left">
                <div className="font-semibold">Template Library</div>
                <div className="text-xs opacity-90">Popular meme templates</div>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Text Controls Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="glass-dark rounded-xl p-6 border border-zinc-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">✏️</span>
          Text Controls
        </h3>
        
        <div className="space-y-6">
          {/* Top Text Input */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label htmlFor="topText" className="block text-sm font-medium text-zinc-300 mb-2">
              Top Text
            </label>
            <input
              id="topText"
              type="text"
              value={textSettings.topText}
              onChange={(e) => handleTextChange('topText', e.target.value)}
              placeholder="Enter top text..."
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600/50 rounded-lg 
                       text-white placeholder-zinc-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent backdrop-blur-sm
                       transition-all smooth-transition"
            />
          </motion.div>

          {/* Bottom Text Input */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label htmlFor="bottomText" className="block text-sm font-medium text-zinc-300 mb-2">
              Bottom Text
            </label>
            <input
              id="bottomText"
              type="text"
              value={textSettings.bottomText}
              onChange={(e) => handleTextChange('bottomText', e.target.value)}
              placeholder="Enter bottom text..."
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600/50 rounded-lg 
                       text-white placeholder-zinc-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent backdrop-blur-sm
                       transition-all smooth-transition"
            />
          </motion.div>

          {/* Font Selection */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <label htmlFor="font" className="block text-sm font-medium text-zinc-300 mb-2">
              Font Family
            </label>
            <select
              id="font"
              value={textSettings.font}
              onChange={(e) => handleTextChange('font', e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600/50 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent backdrop-blur-sm transition-all smooth-transition"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Text Color */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label htmlFor="color" className="block text-sm font-medium text-zinc-300 mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  id="color"
                  type="color"
                  value={textSettings.color}
                  onChange={(e) => handleTextChange('color', e.target.value)}
                  className="w-16 h-12 bg-zinc-800/50 border border-zinc-600/50 rounded-lg cursor-pointer 
                           hover:border-blue-400 transition-colors"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-zinc-300 font-mono bg-zinc-800/30 px-3 py-2 rounded-lg border border-zinc-600/30">
                  {textSettings.color.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Font Size */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <label htmlFor="fontSize" className="block text-sm font-medium text-zinc-300 mb-2">
              Font Size: <span className="text-blue-400 font-mono">{textSettings.fontSize}px</span>
            </label>
            <div className="relative">
              <input
                id="fontSize"
                type="range"
                min="20"
                max="100"
                value={textSettings.fontSize}
                onChange={(e) => handleTextChange('fontSize', parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-700/50 rounded-lg appearance-none cursor-pointer 
                         backdrop-blur-sm"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-2">
                <span>20px</span>
                <span>100px</span>
              </div>
            </div>
          </motion.div>

          {/* Text Stroke Toggle */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-600/30"
          >
            <div>
              <label htmlFor="stroke" className="text-sm font-medium text-zinc-300">
                Text Outline
              </label>
              <p className="text-xs text-zinc-400 mt-1">Add black outline for better readability</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="stroke"
              type="button"
              onClick={() => handleTextChange('strokeEnabled', !textSettings.strokeEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                       ${textSettings.strokeEnabled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-zinc-600'}`}
            >
              <motion.span
                animate={{ x: textSettings.strokeEnabled ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ControlPanel;

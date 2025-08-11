'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CanvasAreaProps {
  onDownload: () => void;
  hasImage: boolean;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ onDownload, hasImage }) => {
  return (
    <div className="space-y-6">
      {/* Canvas Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass-dark rounded-xl p-6 border border-zinc-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🎨</span>
          Canvas & Preview
        </h3>
        
        {/* Canvas Wrapper with responsive design */}
        <div className="relative bg-zinc-800/30 rounded-xl p-6 flex items-center justify-center min-h-[500px] border border-zinc-600/30 backdrop-blur-sm">
          <div className="relative">
            <motion.canvas
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              id="meme-canvas"
              className="border-2 border-zinc-500/50 rounded-xl shadow-2xl max-w-full h-auto 
                       hover:border-blue-400/50 transition-colors duration-300"
              style={{ maxHeight: '500px' }}
            />
            
            {/* Overlay message when no image is uploaded */}
            {!hasImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm rounded-xl"
              >
                <div className="text-center text-zinc-300 max-w-md px-6">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-6xl mb-6 opacity-50"
                  >
                    🎭
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-3 gradient-text">
                    Ready to Create?
                  </h4>
                  <p className="text-zinc-400 mb-4 leading-relaxed">
                    Upload an image, generate with AI, or choose from our template library to get started
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                      🤖 AI Generate
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                      📚 Templates
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                      📁 Upload
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Canvas Instructions */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
        >
          <p className="text-sm text-blue-200 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            <span className="font-semibold">Pro Tips:</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-300/80">
            <div className="flex items-center">
              <span className="mr-2">•</span>
              <span>Drag text objects to reposition them</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">•</span>
              <span>Use high contrast colors for readability</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">•</span>
              <span>Enable text outline for better visibility</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">•</span>
              <span>Try different fonts to match your meme's mood</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Download Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="glass-dark rounded-xl p-6 border border-zinc-700/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-1 flex items-center">
              <span className="mr-2">💾</span>
              Export Your Meme
            </h4>
            <p className="text-sm text-zinc-400">
              Download your creation as a high-quality PNG image
            </p>
          </div>
          
          <motion.button
            whileHover={{ 
              scale: hasImage ? 1.05 : 1,
              y: hasImage ? -2 : 0
            }}
            whileTap={{ scale: hasImage ? 0.95 : 1 }}
            onClick={onDownload}
            disabled={!hasImage}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 
                     ${hasImage 
                       ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl btn-glow' 
                       : 'bg-zinc-700/50 cursor-not-allowed opacity-50 border border-zinc-600/30'
                     }`}
          >
            <div className="flex items-center space-x-3">
              <motion.svg
                animate={{ rotate: hasImage ? [0, 15, -15, 0] : 0 }}
                transition={{ duration: 0.5, repeat: hasImage ? Infinity : 0, repeatDelay: 3 }}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </motion.svg>
              <span>Download Meme</span>
            </div>
          </motion.button>
        </div>

        {!hasImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
          >
            <p className="text-amber-200 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              <span>Create your meme first to enable downloading</span>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Stats and Social Preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="glass-dark rounded-xl p-6 border border-zinc-700/50"
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🚀</span>
          Coming Soon
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-white font-medium">Social Media Sharing</p>
                <p className="text-zinc-400 text-xs">Direct share to platforms</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-lg border border-green-500/20 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-white font-medium">Meme Analytics</p>
                <p className="text-zinc-400 text-xs">Track your meme's success</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CanvasArea;

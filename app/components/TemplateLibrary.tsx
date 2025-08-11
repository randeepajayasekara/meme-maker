'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import axios from 'axios';

interface Template {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  tags: string[];
  downloads: number;
  createdAt: Date;
}

interface TemplateLibraryProps {
  onTemplateSelect: (imageUrl: string) => void;
  onClose: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onTemplateSelect, onClose }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'reaction', name: 'Reaction', icon: '😱' },
    { id: 'animals', name: 'Animals', icon: '🐱' },
    { id: 'celebrities', name: 'Celebrities', icon: '🌟' },
    { id: 'movies', name: 'Movies & TV', icon: '🎬' },
    { id: 'politics', name: 'Politics', icon: '🏛️' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'custom', name: 'My Templates', icon: '💎' }
  ];

  // Popular meme templates (fallback data)
  const popularTemplates: Omit<Template, 'id'>[] = [
    {
      name: "Drake Pointing",
      imageUrl: "https://i.imgflip.com/30b1gx.jpg",
      category: "reaction",
      tags: ["drake", "pointing", "choice", "preference"],
      downloads: 0,
      createdAt: new Date()
    },
    {
      name: "Distracted Boyfriend",
      imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
      category: "reaction",
      tags: ["boyfriend", "distracted", "choice", "temptation"],
      downloads: 0,
      createdAt: new Date()
    },
    {
      name: "Two Buttons",
      imageUrl: "https://i.imgflip.com/1g8my4.jpg",
      category: "reaction",
      tags: ["choice", "decision", "buttons", "difficulty"],
      downloads: 0,
      createdAt: new Date()
    },
    {
      name: "Change My Mind",
      imageUrl: "https://i.imgflip.com/24y43o.jpg",
      category: "reaction",
      tags: ["steven crowder", "debate", "opinion", "change"],
      downloads: 0,
      createdAt: new Date()
    },
    {
      name: "Woman Yelling at Cat",
      imageUrl: "https://i.imgflip.com/345v97.jpg",
      category: "animals",
      tags: ["woman", "cat", "yelling", "argument"],
      downloads: 0,
      createdAt: new Date()
    },
    {
      name: "Expanding Brain",
      imageUrl: "https://i.imgflip.com/1jwhww.jpg",
      category: "reaction",
      tags: ["brain", "expanding", "evolution", "intelligence"],
      downloads: 0,
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templatesRef = collection(db, 'templates');
      const snapshot = await getDocs(templatesRef);
      
      const firestoreTemplates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Template[];

      // Combine with popular templates if Firestore is empty
      if (firestoreTemplates.length === 0) {
        setTemplates(popularTemplates.map((template, index) => ({
          ...template,
          id: `popular-${index}`
        })));
      } else {
        setTemplates(firestoreTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fallback to popular templates
      setTemplates(popularTemplates.map((template, index) => ({
        ...template,
        id: `popular-${index}`
      })));
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = async (template: Template) => {
    try {
      // Increment download count
      if (template.id.startsWith('popular-')) {
        // For popular templates, just use the image
        onTemplateSelect(template.imageUrl);
      } else {
        // For Firestore templates, increment download count
        const templateRef = doc(db, 'templates', template.id);
        await addDoc(collection(db, 'downloads'), {
          templateId: template.id,
          downloadedAt: new Date()
        });
        onTemplateSelect(template.imageUrl);
      }
      onClose();
    } catch (error) {
      console.error('Error selecting template:', error);
      onTemplateSelect(template.imageUrl);
      onClose();
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'demo-key');

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formData);
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading to ImgBB:', error);
      // Fallback: create a local URL for demo
      return URL.createObjectURL(file);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await uploadToImgBB(file);
      
      const newTemplate = {
        name: file.name.replace(/\.[^/.]+$/, ""),
        imageUrl,
        category: 'custom',
        tags: ['custom', 'user-upload'],
        downloads: 0,
        createdAt: new Date()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'templates'), newTemplate);
      
      setTemplates(prev => [{
        ...newTemplate,
        id: docRef.id
      }, ...prev]);
      
      setShowUpload(false);
    } catch (error) {
      console.error('Error uploading template:', error);
    } finally {
      setLoading(false);
    }
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
          className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                📚 Template Library
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Choose from thousands of popular meme templates
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                         rounded-lg font-medium hover:shadow-lg transition-all btn-glow text-sm"
              >
                Upload Template
              </motion.button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 
                           bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-zinc-500 dark:placeholder-zinc-400"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium 
                            whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full spinner" />
                <span className="ml-3 text-zinc-600 dark:text-zinc-400">Loading templates...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer hover-zoom"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 
                                  hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Use Template</span>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {template.name}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                            {template.category}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {template.downloads} uses
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">😔</div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">No templates found</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* Upload Modal */}
          {showUpload && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Upload Custom Template
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-zinc-500 dark:text-zinc-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-medium
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100 dark:file:bg-zinc-700 dark:file:text-zinc-200
                           file:cursor-pointer cursor-pointer"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowUpload(false)}
                    className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateLibrary;

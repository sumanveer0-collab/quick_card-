'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Download, Share2, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { businessCardTemplates } from '@/lib/business-cards/templates';
import { BusinessCardTemplate } from '@/types/business-card.types';

export default function BusinessCardPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  const [template, setTemplate] = useState<BusinessCardTemplate | null>(null);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    const found = businessCardTemplates.find(t => t.id === templateId);
    if (found) {
      setTemplate(found);
    }
  }, [templateId]);

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Template not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-md border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/business-cards">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <div>
              <h1 className="text-white font-semibold text-lg">{template.title}</h1>
              <p className="text-sm text-gray-400 capitalize">{template.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <Link href={`/business-cards/editor/${template.id}`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium">
                <Edit className="w-4 h-4" />
                Customize
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg">Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentSide('front')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentSide === 'front'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setCurrentSide('back')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentSide === 'back'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Card Display */}
              <div className="aspect-[3.5/2] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center p-8">
                <div
                  className="w-full h-full rounded-lg shadow-2xl"
                  style={{
                    background: template.previewGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <div className="w-full h-full p-6 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-lg font-bold mb-2">{template.title}</div>
                      <div className="text-sm opacity-70">{template.category}</div>
                    </div>
                    <div className="text-xs opacity-50">
                      <div>Sample Name</div>
                      <div>Position Title</div>
                      <div>contact@example.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href={`/business-cards/editor/${template.id}`}>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all">
                  <Edit className="w-5 h-5" />
                  Customize This Template
                </button>
              </Link>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all border border-white/20">
                <Download className="w-5 h-5" />
                Download Preview
              </button>
            </div>
          </motion.div>

          {/* Template Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Details Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Template Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Category</div>
                  <div className="text-white capitalize">{template.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Style</div>
                  <div className="text-white">{template.title}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Type</div>
                  <div className="flex gap-2">
                    {template.isPremium && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                        Premium
                      </span>
                    )}
                    {template.isPopular && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Features</h3>
              <div className="space-y-3">
                {[
                  'Fully customizable design',
                  'Front and back sides',
                  'High-resolution export',
                  'Print-ready PDF',
                  'Professional typography',
                  'Easy to edit',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">1,234</div>
                  <div className="text-xs text-gray-400">Views</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">567</div>
                  <div className="text-xs text-gray-400">Downloads</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

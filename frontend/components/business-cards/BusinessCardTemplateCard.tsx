'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { BusinessCardTemplate } from '@/types/business-card.types';

interface BusinessCardTemplateCardProps {
  template: BusinessCardTemplate;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function BusinessCardTemplateCard({
  template,
  index,
  isFavorite,
  onToggleFavorite,
}: BusinessCardTemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/50">
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
            <Star className="w-3 h-3" />
            Premium
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(template.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all duration-300 group/fav"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-white group-hover/fav:text-red-400'
            }`}
          />
        </button>

        {/* Template Preview */}
        <div className="relative aspect-[3.5/2] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          {/* Animated Gradient Border on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          
          {/* Preview Image Placeholder */}
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <div 
              className="w-full h-full rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
              style={{ 
                background: template.previewGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {/* Mini Card Preview */}
              <div className="w-full h-full p-4 flex flex-col justify-between text-white">
                <div>
                  <div className="text-xs font-bold mb-1">{template.title}</div>
                  <div className="text-[8px] opacity-70">{template.category}</div>
                </div>
                <div className="text-[6px] opacity-50">
                  <div>Sample Name</div>
                  <div>Position Title</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
            <Link href={`/business-cards/preview/${template.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <Eye className="w-5 h-5 text-white" />
              </motion.button>
            </Link>
            <Link href={`/business-cards/editor/${template.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg"
              >
                <Edit className="w-5 h-5 text-white" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {template.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-blue-300 border border-blue-400/30">
              {template.category}
            </span>
            {template.isPopular && (
              <span className="text-xs text-yellow-400 font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400" />
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

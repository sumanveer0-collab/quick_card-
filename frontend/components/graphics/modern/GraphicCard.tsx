'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface GraphicCardProps {
  children: React.ReactNode
  onClick: () => void
  delay?: number
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export default function GraphicCard({ 
  children, 
  onClick, 
  delay = 0,
  aspectRatio = 'square'
}: GraphicCardProps) {
  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]'
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${aspectClasses[aspectRatio]} relative group bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden`}
    >
      {/* Content */}
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Plus Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Plus className="w-4 h-4 text-white" />
      </motion.div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </motion.button>
  )
}

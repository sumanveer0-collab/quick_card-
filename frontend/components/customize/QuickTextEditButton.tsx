'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Edit3, Type } from 'lucide-react'

interface QuickTextEditButtonProps {
  element: any
  onEdit: () => void
  displayScale: number
}

export default function QuickTextEditButton({ 
  element, 
  onEdit, 
  displayScale 
}: QuickTextEditButtonProps) {
  const buttonStyle = {
    left: (element.x + element.width - 30) * displayScale,
    top: (element.y - 30) * displayScale,
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={onEdit}
      className="absolute z-40 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      style={buttonStyle}
      title="Edit text (Double-click)"
    >
      <Edit3 className="w-4 h-4" />
    </motion.button>
  )
}
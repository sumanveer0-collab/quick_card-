'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FlipHorizontal, PanelLeftClose, PanelRightClose, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { EditorState } from '@/types/business-card.types';

interface EditorToolbarProps {
  editorState: EditorState;
  onToggleSide: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
}

export default function EditorToolbar({
  editorState,
  onToggleSide,
  onToggleLeftSidebar,
  onToggleRightSidebar,
}: EditorToolbarProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLeftSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Toggle Left Sidebar"
        >
          <PanelLeftClose className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Side Toggle */}
        <motion.button
          onClick={onToggleSide}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <FlipHorizontal className="w-5 h-5" />
          <span className="capitalize">{editorState.currentSide} Side</span>
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleRightSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Toggle Right Sidebar"
        >
          <PanelRightClose className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

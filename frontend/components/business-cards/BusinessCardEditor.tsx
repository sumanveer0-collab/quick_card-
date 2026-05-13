'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Download, Undo, Redo, ZoomIn, ZoomOut, Grid, 
  Eye, Layers, Settings, ArrowLeft, Share2, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { BusinessCardDesign, EditorState } from '@/types/business-card.types';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import EditorProperties from './EditorProperties';
import EditorToolbar from './EditorToolbar';
import ExportModal from './ExportModal';
import { toast } from 'react-hot-toast';

interface BusinessCardEditorProps {
  initialDesign: BusinessCardDesign;
}

export default function BusinessCardEditor({ initialDesign }: BusinessCardEditorProps) {
  const [design, setDesign] = useState<BusinessCardDesign>(initialDesign);
  const [editorState, setEditorState] = useState<EditorState>({
    currentSide: 'front',
    selectedElementId: null,
    zoom: 100,
    showGrid: true,
    showGuides: true,
    snapToGrid: true,
    history: [initialDesign],
    historyIndex: 0,
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const canvasRef = useRef<any>(null);

  // Update design and add to history
  const updateDesign = useCallback((newDesign: BusinessCardDesign) => {
    setDesign(newDesign);
    setEditorState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newDesign);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Undo/Redo
  const undo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        setDesign(prev.history[newIndex]);
        return { ...prev, historyIndex: newIndex };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        setDesign(prev.history[newIndex]);
        return { ...prev, historyIndex: newIndex };
      }
      return prev;
    });
  }, []);

  // Save design
  const saveDesign = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save design
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Design saved successfully!');
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  // Zoom controls
  const zoomIn = () => {
    setEditorState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 10, 200),
    }));
  };

  const zoomOut = () => {
    setEditorState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 10, 25),
    }));
  };

  const resetZoom = () => {
    setEditorState(prev => ({ ...prev, zoom: 100 }));
  };

  // Toggle side
  const toggleSide = () => {
    setEditorState(prev => ({
      ...prev,
      currentSide: prev.currentSide === 'front' ? 'back' : 'front',
      selectedElementId: null,
    }));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-slate-800/50 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/business-cards">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <div>
            <h1 className="text-white font-semibold">{design.title}</h1>
            <p className="text-xs text-gray-400">Business Card Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={editorState.historyIndex === 0}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={redo}
            disabled={editorState.historyIndex === editorState.history.length - 1}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-5 h-5 text-white" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Zoom Controls */}
          <button
            onClick={zoomOut}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-1 hover:bg-white/10 rounded-lg transition-colors text-white text-sm font-medium min-w-[60px]"
          >
            {editorState.zoom}%
          </button>
          <button
            onClick={zoomIn}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Grid Toggle */}
          <button
            onClick={() => setEditorState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
            className={`p-2 rounded-lg transition-colors ${
              editorState.showGrid ? 'bg-blue-600' : 'hover:bg-white/10'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-5 h-5 text-white" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Save & Export */}
          <button
            onClick={saveDesign}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors text-white font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence>
          {leftSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="w-80 bg-slate-800/50 backdrop-blur-md border-r border-white/10 overflow-y-auto"
            >
              <EditorSidebar
                design={design}
                editorState={editorState}
                onUpdateDesign={updateDesign}
                onUpdateEditorState={setEditorState}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <EditorToolbar
            editorState={editorState}
            onToggleSide={toggleSide}
            onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
            onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
          />

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-slate-900/50 p-8">
            <EditorCanvas
              ref={canvasRef}
              design={design}
              editorState={editorState}
              onUpdateDesign={updateDesign}
              onUpdateEditorState={setEditorState}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <AnimatePresence>
          {rightSidebarOpen && (
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="w-80 bg-slate-800/50 backdrop-blur-md border-l border-white/10 overflow-y-auto"
            >
              <EditorProperties
                design={design}
                editorState={editorState}
                onUpdateDesign={updateDesign}
                onUpdateEditorState={setEditorState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <ExportModal
            design={design}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

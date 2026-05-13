'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Lock, Unlock, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { BusinessCardDesign, EditorState } from '@/types/business-card.types';

interface EditorPropertiesProps {
  design: BusinessCardDesign;
  editorState: EditorState;
  onUpdateDesign: (design: BusinessCardDesign) => void;
  onUpdateEditorState: (state: EditorState) => void;
}

export default function EditorProperties({
  design,
  editorState,
  onUpdateDesign,
  onUpdateEditorState,
}: EditorPropertiesProps) {
  const selectedElement = design[editorState.currentSide].elements.find(
    el => el.id === editorState.selectedElementId
  );

  const updateElement = (updates: any) => {
    if (!selectedElement) return;

    const newDesign = { ...design };
    const elementIndex = newDesign[editorState.currentSide].elements.findIndex(
      el => el.id === selectedElement.id
    );
    
    if (elementIndex !== -1) {
      newDesign[editorState.currentSide].elements[elementIndex] = {
        ...newDesign[editorState.currentSide].elements[elementIndex],
        ...updates,
      };
      onUpdateDesign(newDesign);
    }
  };

  const deleteElement = () => {
    if (!selectedElement) return;

    const newDesign = { ...design };
    newDesign[editorState.currentSide].elements = newDesign[editorState.currentSide].elements.filter(
      el => el.id !== selectedElement.id
    );
    onUpdateDesign(newDesign);
    onUpdateEditorState({ ...editorState, selectedElementId: null });
  };

  const moveLayer = (direction: 'up' | 'down') => {
    if (!selectedElement) return;

    const newDesign = { ...design };
    const elements = newDesign[editorState.currentSide].elements;
    const currentIndex = elements.findIndex(el => el.id === selectedElement.id);
    
    if (direction === 'up' && currentIndex < elements.length - 1) {
      [elements[currentIndex], elements[currentIndex + 1]] = [elements[currentIndex + 1], elements[currentIndex]];
    } else if (direction === 'down' && currentIndex > 0) {
      [elements[currentIndex], elements[currentIndex - 1]] = [elements[currentIndex - 1], elements[currentIndex]];
    }
    
    onUpdateDesign(newDesign);
  };

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-white font-semibold mb-2">No Element Selected</h3>
        <p className="text-gray-400 text-sm">
          Select an element on the canvas to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Properties</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveLayer('up')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => moveLayer('down')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={deleteElement}
              className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-400 capitalize">{selectedElement.type} Element</div>
      </div>

      <div className="p-4 space-y-6">
        {/* Position */}
        <div>
          <label className="text-white text-sm font-medium mb-2 block">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">X</label>
              <input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) => updateElement({ x: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Y</label>
              <input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) => updateElement({ y: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Size (for shapes and images) */}
        {(selectedElement.type === 'shape' || selectedElement.type === 'qr') && (
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Size</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Width</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.width || 0)}
                  onChange={(e) => updateElement({ width: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Height</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.height || 0)}
                  onChange={(e) => updateElement({ height: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <>
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Text Content</label>
              <textarea
                value={selectedElement.text || ''}
                onChange={(e) => updateElement({ text: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Font Size</label>
              <input
                type="range"
                min="8"
                max="72"
                value={selectedElement.fontSize || 16}
                onChange={(e) => updateElement({ fontSize: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{selectedElement.fontSize || 16}px</div>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Font Weight</label>
              <select
                value={selectedElement.fontWeight || 'normal'}
                onChange={(e) => updateElement({ fontWeight: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="600">Semi Bold</option>
                <option value="300">Light</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => updateElement({ color: e.target.value })}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => updateElement({ color: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Text Align</label>
              <div className="grid grid-cols-3 gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateElement({ textAlign: align })}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      selectedElement.textAlign === align
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Shape Properties */}
        {selectedElement.type === 'shape' && (
          <>
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Fill Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.fill || '#3b82f6'}
                  onChange={(e) => updateElement({ fill: e.target.value })}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.fill || '#3b82f6'}
                  onChange={(e) => updateElement({ fill: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {selectedElement.shape === 'rectangle' && (
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Border Radius</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={selectedElement.borderRadius || 0}
                  onChange={(e) => updateElement({ borderRadius: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{selectedElement.borderRadius || 0}px</div>
              </div>
            )}
          </>
        )}

        {/* Opacity */}
        <div>
          <label className="text-white text-sm font-medium mb-2 block">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedElement.opacity || 1}
            onChange={(e) => updateElement({ opacity: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-gray-400 mt-1">{Math.round((selectedElement.opacity || 1) * 100)}%</div>
        </div>

        {/* Rotation */}
        <div>
          <label className="text-white text-sm font-medium mb-2 block">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation || 0}
            onChange={(e) => updateElement({ rotation: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-gray-400 mt-1">{selectedElement.rotation || 0}°</div>
        </div>
      </div>
    </div>
  );
}

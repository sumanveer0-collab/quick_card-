'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Type, Image, Square, Circle, Star, Waves, QrCode, 
  Upload, Layers, Palette, Sparkles, Plus 
} from 'lucide-react';
import { BusinessCardDesign, EditorState, CardElement } from '@/types/business-card.types';
import BackgroundColorPicker from '@/components/shared/BackgroundColorPicker';
import { isGradientBackground } from '@/lib/background-palette';

interface EditorSidebarProps {
  design: BusinessCardDesign;
  editorState: EditorState;
  onUpdateDesign: (design: BusinessCardDesign) => void;
  onUpdateEditorState: (state: EditorState) => void;
}

const tabs = [
  { id: 'elements', label: 'Elements', icon: Square },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'graphics', label: 'Graphics', icon: Sparkles },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'uploads', label: 'Uploads', icon: Upload },
  { id: 'layers', label: 'Layers', icon: Layers },
];

export default function EditorSidebar({
  design,
  editorState,
  onUpdateDesign,
  onUpdateEditorState,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState('elements');

  const addTextElement = () => {
    const newElement: CardElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'Double click to edit',
      x: 100,
      y: 100,
      fontSize: 16,
      fontWeight: 'normal',
      color: '#000000',
      zIndex: design[editorState.currentSide].elements.length + 1,
    };

    const newDesign = { ...design };
    newDesign[editorState.currentSide].elements.push(newElement);
    onUpdateDesign(newDesign);
  };

  const addShapeElement = (shape: 'rectangle' | 'circle') => {
    const newElement: CardElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shape,
      x: 100,
      y: 100,
      width: 100,
      height: shape === 'circle' ? 100 : 60,
      fill: '#3b82f6',
      zIndex: design[editorState.currentSide].elements.length + 1,
    };

    const newDesign = { ...design };
    newDesign[editorState.currentSide].elements.push(newElement);
    onUpdateDesign(newDesign);
  };

  const addQRElement = () => {
    const newElement: CardElement = {
      id: `qr-${Date.now()}`,
      type: 'qr',
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      qrData: 'https://example.com',
      qrColor: '#000000',
      qrBackground: '#ffffff',
      zIndex: design[editorState.currentSide].elements.length + 1,
    };

    const newDesign = { ...design };
    newDesign[editorState.currentSide].elements.push(newElement);
    onUpdateDesign(newDesign);
  };

  const currentElements = design[editorState.currentSide].elements;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Basic Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={addTextElement}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <Type className="w-6 h-6 text-blue-400" />
                  <span className="text-xs text-white">Text</span>
                </button>
                <button
                  onClick={() => addShapeElement('rectangle')}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <Square className="w-6 h-6 text-purple-400" />
                  <span className="text-xs text-white">Rectangle</span>
                </button>
                <button
                  onClick={() => addShapeElement('circle')}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <Circle className="w-6 h-6 text-pink-400" />
                  <span className="text-xs text-white">Circle</span>
                </button>
                <button
                  onClick={addQRElement}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <QrCode className="w-6 h-6 text-green-400" />
                  <span className="text-xs text-white">QR Code</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Text Presets</h3>
              <div className="space-y-2">
                {['Heading', 'Subheading', 'Body Text', 'Caption'].map((preset) => (
                  <button
                    key={preset}
                    onClick={addTextElement}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left"
                  >
                    <span className="text-white text-sm">{preset}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graphics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Graphic Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Wave', 'Blob', 'Line', 'Curve'].map((graphic) => (
                  <button
                    key={graphic}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                  >
                    <Waves className="w-6 h-6 text-cyan-400" />
                    <span className="text-xs text-white">{graphic}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'background' && (
          <div className="bg-white rounded-xl p-3 -mx-1">
            <BackgroundColorPicker
              value={design[editorState.currentSide].background.color || '#ffffff'}
              onChange={(color) => {
                if (isGradientBackground(color)) {
                  const newDesign = { ...design };
                  newDesign[editorState.currentSide].background = {
                    type: 'gradient',
                    color: color,
                  };
                  onUpdateDesign(newDesign);
                  return;
                }
                const newDesign = { ...design };
                newDesign[editorState.currentSide].background = {
                  type: 'solid',
                  color,
                };
                onUpdateDesign(newDesign);
              }}
              title="Background color"
              showGradients
            />
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Upload Assets</h3>
              <button className="w-full p-8 bg-white/5 hover:bg-white/10 rounded-lg border-2 border-dashed border-white/20 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Layers</h3>
              <span className="text-xs text-gray-400">{currentElements.length} items</span>
            </div>
            {currentElements.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No elements yet
              </div>
            ) : (
              <div className="space-y-1">
                {[...currentElements].reverse().map((element) => (
                  <button
                    key={element.id}
                    onClick={() => onUpdateEditorState({ ...editorState, selectedElementId: element.id })}
                    className={`w-full p-3 rounded-lg border transition-colors text-left ${
                      editorState.selectedElementId === element.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {element.type === 'text' && <Type className="w-4 h-4 text-blue-400" />}
                      {element.type === 'shape' && <Square className="w-4 h-4 text-purple-400" />}
                      {element.type === 'qr' && <QrCode className="w-4 h-4 text-green-400" />}
                      <span className="text-white text-sm">
                        {element.type === 'text' ? element.text?.substring(0, 20) : element.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

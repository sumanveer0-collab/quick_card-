'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group } from 'react-konva';
import { BusinessCardDesign, EditorState, CardElement } from '@/types/business-card.types';
import Konva from 'konva';

interface EditorCanvasProps {
  design: BusinessCardDesign;
  editorState: EditorState;
  onUpdateDesign: (design: BusinessCardDesign) => void;
  onUpdateEditorState: (state: EditorState) => void;
}

const EditorCanvas = forwardRef<any, EditorCanvasProps>(
  ({ design, editorState, onUpdateDesign, onUpdateEditorState }, ref) => {
    const stageRef = useRef<Konva.Stage>(null);
    
    // Business card dimensions in pixels (at 300 DPI)
    // Standard: 85mm x 55mm = 1004px x 650px at 300 DPI
    const cardWidth = 1004;
    const cardHeight = 650;
    const scale = editorState.zoom / 100;

    const currentSide = design[editorState.currentSide];

    const handleElementDragEnd = (elementId: string, e: any) => {
      const newDesign = { ...design };
      const element = newDesign[editorState.currentSide].elements.find(el => el.id === elementId);
      if (element) {
        element.x = e.target.x();
        element.y = e.target.y();
        onUpdateDesign(newDesign);
      }
    };

    const handleElementClick = (elementId: string) => {
      onUpdateEditorState({ ...editorState, selectedElementId: elementId });
    };

    const renderElement = (element: CardElement) => {
      const isSelected = editorState.selectedElementId === element.id;

      switch (element.type) {
        case 'text':
          return (
            <Text
              key={element.id}
              id={element.id}
              x={element.x}
              y={element.y}
              text={element.text || ''}
              fontSize={element.fontSize || 16}
              fontFamily={element.fontFamily || 'Arial'}
              fontStyle={element.fontWeight === 'bold' ? 'bold' : 'normal'}
              fill={element.color || '#000000'}
              align={element.textAlign || 'left'}
              opacity={element.opacity || 1}
              rotation={element.rotation || 0}
              draggable
              onDragEnd={(e) => handleElementDragEnd(element.id, e)}
              onClick={() => handleElementClick(element.id)}
              onTap={() => handleElementClick(element.id)}
              stroke={isSelected ? '#3b82f6' : undefined}
              strokeWidth={isSelected ? 2 : 0}
            />
          );

        case 'shape':
          if (element.shape === 'rectangle') {
            return (
              <Rect
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                width={element.width || 100}
                height={element.height || 100}
                fill={element.fill || '#3b82f6'}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth || 0}
                cornerRadius={element.borderRadius || 0}
                opacity={element.opacity || 1}
                rotation={element.rotation || 0}
                draggable
                onDragEnd={(e) => handleElementDragEnd(element.id, e)}
                onClick={() => handleElementClick(element.id)}
                onTap={() => handleElementClick(element.id)}
              />
            );
          } else if (element.shape === 'circle') {
            return (
              <Circle
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                radius={(element.width || 100) / 2}
                fill={element.fill || '#3b82f6'}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth || 0}
                opacity={element.opacity || 1}
                draggable
                onDragEnd={(e) => handleElementDragEnd(element.id, e)}
                onClick={() => handleElementClick(element.id)}
                onTap={() => handleElementClick(element.id)}
              />
            );
          }
          return null;

        case 'qr':
          return (
            <Group
              key={element.id}
              id={element.id}
              x={element.x}
              y={element.y}
              draggable
              onDragEnd={(e) => handleElementDragEnd(element.id, e)}
              onClick={() => handleElementClick(element.id)}
              onTap={() => handleElementClick(element.id)}
            >
              <Rect
                width={element.width || 80}
                height={element.height || 80}
                fill={element.qrBackground || '#ffffff'}
                stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                strokeWidth={2}
              />
              <Text
                x={(element.width || 80) / 2}
                y={(element.height || 80) / 2}
                text="QR"
                fontSize={20}
                fill="#666"
                align="center"
                offsetX={15}
                offsetY={10}
              />
            </Group>
          );

        default:
          return null;
      }
    };

    return (
      <div className="flex items-center justify-center w-full h-full">
        <div 
          className="relative bg-white rounded-lg shadow-2xl"
          style={{
            width: cardWidth * scale,
            height: cardHeight * scale,
          }}
        >
          {/* Grid overlay */}
          {editorState.showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
              }}
            />
          )}

          <Stage
            ref={stageRef}
            width={cardWidth * scale}
            height={cardHeight * scale}
            scaleX={scale}
            scaleY={scale}
            onClick={(e) => {
              // Deselect when clicking on empty space
              if (e.target === e.target.getStage()) {
                onUpdateEditorState({ ...editorState, selectedElementId: null });
              }
            }}
          >
            <Layer>
              {/* Background */}
              <Rect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                fill={currentSide.background.color || '#ffffff'}
              />

              {/* Elements */}
              {currentSide.elements
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map(renderElement)}
            </Layer>
          </Stage>

          {/* Safe area guides */}
          {editorState.showGuides && (
            <div 
              className="absolute border-2 border-dashed border-blue-400/50 pointer-events-none"
              style={{
                top: 20 * scale,
                left: 20 * scale,
                right: 20 * scale,
                bottom: 20 * scale,
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;

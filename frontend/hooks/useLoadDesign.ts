import { useCallback, useState } from 'react';
import { designAPI } from '@/lib/api/designs';
import { useEditorStore } from '@/store/editor.store';
import toast from 'react-hot-toast';

export function useLoadDesign() {
  const [loading, setLoading] = useState(false);
  const { setBackground, selectElement } = useEditorStore();

  /**
   * Load a design by ID and restore it to the editor
   */
  const loadDesign = useCallback(
    async (designId: string) => {
      setLoading(true);
      try {
        const design = await designAPI.getDesign(designId);

        // Clear current selection
        selectElement(null);

        // Restore canvas background
        if (design.canvas?.background) {
          setBackground(design.canvas.background);
        }

        // Restore elements
        if (design.elements && design.elements.length > 0) {
          // Clear existing elements and load new ones
          const editorStore = useEditorStore.getState();
          editorStore.reset();

          // Add each element
          design.elements.forEach((element) => {
            editorStore.addElement({
              type: element.type as any,
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
              rotation: element.rotation,
              text: element.text,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fill: element.fill,
              stroke: element.stroke,
              strokeWidth: element.strokeWidth,
              align: element.align,
              verticalAlign: element.verticalAlign,
              letterSpacing: element.letterSpacing,
              lineHeight: element.lineHeight,
              padding: element.padding,
              src: element.src,
              shapeType: element.shapeType,
              cornerRadius: element.cornerRadius,
              locked: element.locked,
              visible: element.visible,
              opacity: element.opacity,
            });
          });

          // Restore background after reset
          if (design.canvas?.background) {
            setBackground(design.canvas.background);
          }
        }

        toast.success(`Loaded: ${design.designName}`);
        return design;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to load design';
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setBackground, selectElement],
  );

  return {
    loadDesign,
    loading,
  };
}

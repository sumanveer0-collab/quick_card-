import { useEffect, useRef, useCallback } from 'react';
import { designAPI, UpdateDesignPayload } from '@/lib/api/designs';
import { useEditorStore } from '@/store/editor.store';
import toast from 'react-hot-toast';

interface UseAutoSaveOptions {
  designId: string | null;
  enabled: boolean;
  debounceMs?: number;
}

export function useAutoSave({ designId, enabled, debounceMs = 2000 }: UseAutoSaveOptions) {
  const { elements, background, zoom } = useEditorStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const saveDesign = useCallback(async () => {
    if (!designId || !enabled || isSavingRef.current) return;

    // Create a snapshot of current state
    const currentState = JSON.stringify({ elements, background });

    // Skip if nothing changed
    if (currentState === lastSavedRef.current) return;

    isSavingRef.current = true;

    try {
      const payload: UpdateDesignPayload = {
        canvas: {
          width: 1125,
          height: 675,
          background,
        },
        elements,
      };

      await designAPI.updateDesign(designId, payload);
      lastSavedRef.current = currentState;
      
      // Silent success (no toast for auto-save)
      console.log('✅ Auto-saved design');
    } catch (error: any) {
      console.error('❌ Auto-save failed:', error);
      // Only show error toast for auto-save failures
      toast.error('Auto-save failed. Please save manually.');
    } finally {
      isSavingRef.current = false;
    }
  }, [designId, enabled, elements, background]);

  // Debounced auto-save
  useEffect(() => {
    if (!enabled || !designId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveDesign();
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [elements, background, enabled, designId, debounceMs, saveDesign]);

  // Manual save function
  const manualSave = useCallback(async () => {
    if (!designId) {
      toast.error('No design ID provided');
      return false;
    }

    try {
      const payload: UpdateDesignPayload = {
        canvas: {
          width: 1125,
          height: 675,
          background,
        },
        elements,
      };

      await designAPI.updateDesign(designId, payload);
      lastSavedRef.current = JSON.stringify({ elements, background });
      toast.success('Design saved successfully!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save design';
      toast.error(errorMessage);
      return false;
    }
  }, [designId, elements, background]);

  return {
    manualSave,
    isSaving: isSavingRef.current,
  };
}

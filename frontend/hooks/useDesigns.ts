import { useState, useCallback } from 'react';
import { designAPI, Design, CreateDesignPayload, UpdateDesignPayload } from '@/lib/api/designs';
import toast from 'react-hot-toast';

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * Fetch all designs
   */
  const fetchDesigns = useCallback(async (pageNum: number = 1, limit: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await designAPI.getDesigns(pageNum, limit);
      setDesigns(response.designs);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch designs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new design
   */
  const createDesign = useCallback(async (payload: CreateDesignPayload): Promise<Design | null> => {
    setLoading(true);
    setError(null);
    try {
      const newDesign = await designAPI.createDesign(payload);
      setDesigns((prev) => [newDesign, ...prev]);
      toast.success('Design saved successfully!');
      return newDesign;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create design';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a design
   */
  const updateDesign = useCallback(
    async (designId: string, payload: UpdateDesignPayload): Promise<Design | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedDesign = await designAPI.updateDesign(designId, payload);
        setDesigns((prev) =>
          prev.map((design) => (design._id === designId ? updatedDesign : design)),
        );
        toast.success('Design updated successfully!');
        return updatedDesign;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update design';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Delete a design
   */
  const deleteDesign = useCallback(async (designId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await designAPI.deleteDesign(designId);
      setDesigns((prev) => prev.filter((design) => design._id !== designId));
      toast.success('Design deleted successfully!');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete design';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Duplicate a design
   */
  const duplicateDesign = useCallback(async (designId: string): Promise<Design | null> => {
    setLoading(true);
    setError(null);
    try {
      const duplicatedDesign = await designAPI.duplicateDesign(designId);
      setDesigns((prev) => [duplicatedDesign, ...prev]);
      toast.success('Design duplicated successfully!');
      return duplicatedDesign;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to duplicate design';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rename a design
   */
  const renameDesign = useCallback(
    async (designId: string, newName: string): Promise<Design | null> => {
      setLoading(true);
      setError(null);
      try {
        const renamedDesign = await designAPI.renameDesign(designId, newName);
        setDesigns((prev) =>
          prev.map((design) => (design._id === designId ? renamedDesign : design)),
        );
        toast.success('Design renamed successfully!');
        return renamedDesign;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to rename design';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    designs,
    loading,
    error,
    total,
    page,
    totalPages,
    fetchDesigns,
    createDesign,
    updateDesign,
    deleteDesign,
    duplicateDesign,
    renameDesign,
  };
}

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Types
export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'logo' | 'qr';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
  padding?: { horizontal: number; vertical: number };

  // Image properties
  src?: string;

  // Shape properties
  shapeType?: 'rect' | 'circle' | 'line';
  cornerRadius?: number;

  // Layer properties
  zIndex: number;
  locked?: boolean;
  visible?: boolean;
  opacity?: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  background: string;
  showGrid?: boolean;
  showBleed?: boolean;
  showTrim?: boolean;
  showSafety?: boolean;
}

export interface Design {
  _id: string;
  userId: string;
  designName: string;
  canvas: CanvasConfig;
  elements: CanvasElement[];
  previewImage?: string;
  isTemplate: boolean;
  isActive: boolean;
  version: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDesignPayload {
  designName: string;
  canvas: CanvasConfig;
  elements: CanvasElement[];
  previewImage?: string;
  isTemplate?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateDesignPayload extends Partial<CreateDesignPayload> {
  isActive?: boolean;
}

export interface DesignListResponse {
  designs: Design[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DesignStatsResponse {
  totalDesigns: number;
  totalElements: number;
  lastModified: string | null;
}

// API Client
class DesignAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Create a new design
   */
  async createDesign(payload: CreateDesignPayload): Promise<Design> {
    const response = await axios.post(
      `${API_BASE_URL}/designs`,
      payload,
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Get all designs for the authenticated user
   */
  async getDesigns(page: number = 1, limit: number = 20): Promise<DesignListResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/designs?page=${page}&limit=${limit}`,
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Get a single design by ID
   */
  async getDesign(designId: string): Promise<Design> {
    const response = await axios.get(
      `${API_BASE_URL}/designs/${designId}`,
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Update a design
   */
  async updateDesign(designId: string, payload: UpdateDesignPayload): Promise<Design> {
    const response = await axios.put(
      `${API_BASE_URL}/designs/${designId}`,
      payload,
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Delete a design
   */
  async deleteDesign(designId: string): Promise<{ message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/designs/${designId}`,
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Duplicate a design
   */
  async duplicateDesign(designId: string): Promise<Design> {
    const response = await axios.post(
      `${API_BASE_URL}/designs/${designId}/duplicate`,
      {},
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Rename a design
   */
  async renameDesign(designId: string, newName: string): Promise<Design> {
    const response = await axios.put(
      `${API_BASE_URL}/designs/${designId}/rename`,
      { designName: newName },
      this.getAuthHeaders(),
    );
    return response.data;
  }

  /**
   * Get design statistics
   */
  async getStats(): Promise<DesignStatsResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/designs/stats`,
      this.getAuthHeaders(),
    );
    return response.data;
  }
}

export const designAPI = new DesignAPI();

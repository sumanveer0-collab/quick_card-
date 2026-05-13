export interface BusinessCardTemplate {
  id: string;
  title: string;
  category: string;
  isPremium?: boolean;
  isPopular?: boolean;
  previewGradient?: string;
  front: BusinessCardSide;
  back: BusinessCardSide;
}

export interface BusinessCardSide {
  background: BackgroundConfig;
  elements: CardElement[];
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  gradient?: GradientConfig;
  image?: string;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
  stops?: number[];
}

export interface CardElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'icon' | 'qr' | 'line' | 'wave' | 'blob';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
  
  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow?: string;
  gradient?: GradientConfig;
  
  // Shape specific
  shape?: 'rectangle' | 'circle' | 'triangle' | 'polygon';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  
  // Image specific
  src?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  
  // Icon specific
  iconName?: string;
  iconColor?: string;
  
  // QR specific
  qrData?: string;
  qrColor?: string;
  qrBackground?: string;
  
  // Wave/Blob specific
  path?: string;
  points?: number[];
  
  // Effects
  shadow?: ShadowConfig;
  blur?: number;
  
  // Constraints
  locked?: boolean;
  editable?: boolean;
}

export interface ShadowConfig {
  x: number;
  y: number;
  blur: number;
  color: string;
}

export interface BusinessCardDesign {
  id?: string;
  userId?: string;
  templateId: string;
  title: string;
  front: BusinessCardSide;
  back: BusinessCardSide;
  metadata: {
    width: number;
    height: number;
    unit: 'mm' | 'inch' | 'px';
    dpi: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  quality: number;
  dpi: number;
  includeBleed: boolean;
  bleedSize?: number;
  side: 'front' | 'back' | 'both';
}

export interface EditorState {
  currentSide: 'front' | 'back';
  selectedElementId: string | null;
  zoom: number;
  showGrid: boolean;
  showGuides: boolean;
  snapToGrid: boolean;
  history: BusinessCardDesign[];
  historyIndex: number;
}

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  thumbnail?: string;
}

'use client';

export interface CardDesign {
  id: string;
  background: string;
  elements: CardElement[];
}

export type CardElement =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; fill: string; opacity?: number; radius?: number }
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: string; opacity?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: string; width?: number; opacity?: number }
  | { kind: 'text'; x: number; y: number; text: string; size: number; fill: string; weight?: string; align?: 'left' | 'center' | 'right'; opacity?: number; spacing?: number }
  | { kind: 'triangle'; points: string; fill: string; opacity?: number };

// ─── 25 unique visiting card designs ─────────────────────────────────────────
export const CARD_DESIGNS: CardDesign[] = [
  // 1. Corporate Blue – left panel
  {
    id: 'corp-blue',
    background: '#ffffff',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 110, h: 200, fill: '#1e40af' },
      { kind: 'rect', x: 105, y: 0, w: 25, h: 200, fill: '#3b82f6', opacity: 0.6 },
      { kind: 'text', x: 30, y: 28, text: 'CORP', size: 11, fill: '#fff', weight: 'bold' },
      { kind: 'text', x: 145, y: 68, text: 'John Anderson', size: 13, fill: '#1e293b', weight: 'bold' },
      { kind: 'text', x: 145, y: 86, text: 'Chief Executive Officer', size: 8, fill: '#64748b' },
      { kind: 'rect', x: 145, y: 96, w: 180, h: 1, fill: '#e2e8f0' },
      { kind: 'text', x: 145, y: 110, text: 'john@company.com', size: 7, fill: '#475569' },
      { kind: 'text', x: 145, y: 122, text: '+91 98765 43210', size: 7, fill: '#475569' },
    ],
  },

  // 2. Luxury Black Gold
  {
    id: 'luxury-gold',
    background: '#0a0a0a',
    elements: [
      { kind: 'rect', x: 0, y: 88, w: 350, h: 2, fill: '#d4af37' },
      { kind: 'rect', x: 0, y: 112, w: 350, h: 2, fill: '#d4af37', opacity: 0.3 },
      { kind: 'circle', cx: 320, cy: 30, r: 22, fill: '#d4af37', opacity: 0.15 },
      { kind: 'text', x: 175, y: 55, text: 'ALEXANDER KNIGHT', size: 14, fill: '#d4af37', weight: 'bold', align: 'center', spacing: 2 },
      { kind: 'text', x: 175, y: 105, text: 'Executive Director', size: 8, fill: '#ffffff', align: 'center', spacing: 1 },
      { kind: 'text', x: 175, y: 140, text: 'alexander@luxury.com  •  +91 98765 43210', size: 7, fill: '#a18a50', align: 'center' },
    ],
  },

  // 3. Creative Gradient Purple
  {
    id: 'creative-purple',
    background: '#667eea',
    elements: [
      { kind: 'rect', x: 175, y: 0, w: 175, h: 200, fill: '#764ba2', opacity: 0.7 },
      { kind: 'circle', cx: 290, cy: 40, r: 50, fill: '#f093fb', opacity: 0.18 },
      { kind: 'circle', cx: 60, cy: 160, r: 35, fill: '#ffffff', opacity: 0.08 },
      { kind: 'text', x: 30, y: 60, text: 'CREATIVE', size: 18, fill: '#fff', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 30, y: 82, text: 'STUDIO', size: 18, fill: '#fff', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 30, y: 120, text: 'Alex Johnson', size: 12, fill: '#fff', weight: 'bold' },
      { kind: 'text', x: 30, y: 136, text: 'Creative Director', size: 8, fill: 'rgba(255,255,255,0.85)' },
      { kind: 'text', x: 30, y: 158, text: 'alex@creative.com  |  +91 98765 43210', size: 7, fill: 'rgba(255,255,255,0.7)' },
    ],
  },

  // 4. Minimal White
  {
    id: 'minimal-white',
    background: '#ffffff',
    elements: [
      { kind: 'rect', x: 30, y: 3, w: 2, h: 60, fill: '#000000' },
      { kind: 'text', x: 42, y: 22, text: 'MINIMAL', size: 20, fill: '#000', weight: 'bold', spacing: 6 },
      { kind: 'text', x: 42, y: 44, text: 'Design Studio', size: 8, fill: '#666', spacing: 1 },
      { kind: 'rect', x: 30, y: 100, w: 290, h: 1, fill: '#e2e8f0' },
      { kind: 'text', x: 30, y: 120, text: 'Jane Smith', size: 11, fill: '#000' },
      { kind: 'text', x: 30, y: 136, text: 'jane@minimal.com  •  +91 98765 43210', size: 7, fill: '#999' },
    ],
  },

  // 5. Tech Dark Cyan
  {
    id: 'tech-dark',
    background: '#0f172a',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 3, fill: '#06b6d4' },
      { kind: 'rect', x: 270, y: 40, w: 80, h: 55, fill: '#06b6d4', opacity: 0.1 },
      { kind: 'rect', x: 30, y: 118, w: 100, h: 1, fill: '#06b6d4', opacity: 0.5 },
      { kind: 'rect', x: 30, y: 128, w: 70, h: 1, fill: '#06b6d4', opacity: 0.3 },
      { kind: 'text', x: 30, y: 50, text: 'TECH', size: 20, fill: '#fff', weight: 'bold', spacing: 2 },
      { kind: 'text', x: 30, y: 72, text: 'INNOVATIONS', size: 20, fill: '#fff', weight: 'bold', spacing: 2 },
      { kind: 'text', x: 30, y: 108, text: 'Sarah Tech', size: 13, fill: '#06b6d4', weight: 'bold' },
      { kind: 'text', x: 30, y: 142, text: 'Chief Technology Officer', size: 8, fill: 'rgba(255,255,255,0.75)' },
      { kind: 'text', x: 30, y: 160, text: 'sarah@techinnovations.com', size: 7, fill: '#06b6d4' },
    ],
  },

  // 6. Real Estate Green
  {
    id: 'real-estate',
    background: '#ffffff',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 55, fill: '#059669' },
      { kind: 'rect', x: 0, y: 55, w: 350, h: 4, fill: '#d4af37' },
      { kind: 'text', x: 20, y: 24, text: 'Jennifer Martinez', size: 13, fill: '#fff', weight: 'bold' },
      { kind: 'text', x: 20, y: 42, text: 'Licensed Real Estate Agent', size: 7, fill: 'rgba(255,255,255,0.9)' },
      { kind: 'text', x: 20, y: 80, text: 'Premier Properties Group', size: 9, fill: '#059669', weight: 'bold' },
      { kind: 'rect', x: 20, y: 92, w: 200, h: 1, fill: '#e5e7eb' },
      { kind: 'text', x: 20, y: 108, text: 'jennifer@premier.com', size: 7, fill: '#475569' },
      { kind: 'text', x: 20, y: 120, text: '+91 98765 43210', size: 7, fill: '#475569' },
    ],
  },

  // 7. Medical Blue
  {
    id: 'medical-blue',
    background: '#ffffff',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 18, h: 200, fill: '#0ea5e9' },
      { kind: 'rect', x: 280, y: 50, w: 12, h: 60, fill: '#0ea5e9', opacity: 0.2 },
      { kind: 'rect', x: 252, y: 72, w: 68, h: 12, fill: '#0ea5e9', opacity: 0.2 },
      { kind: 'text', x: 36, y: 55, text: 'Dr. Sarah Johnson', size: 13, fill: '#0f172a', weight: 'bold' },
      { kind: 'text', x: 36, y: 72, text: 'MD, FACP', size: 8, fill: '#0ea5e9', weight: 'bold' },
      { kind: 'text', x: 36, y: 86, text: 'Internal Medicine', size: 8, fill: '#64748b' },
      { kind: 'rect', x: 36, y: 98, w: 200, h: 1, fill: '#bae6fd' },
      { kind: 'text', x: 36, y: 112, text: 'dr.sarah@citymedical.com', size: 7, fill: '#0369a1' },
      { kind: 'text', x: 36, y: 124, text: '+91 98765 43210', size: 7, fill: '#475569' },
    ],
  },

  // 8. Photography Dark
  {
    id: 'photography',
    background: '#111827',
    elements: [
      { kind: 'rect', x: 195, y: 0, w: 155, h: 200, fill: '#1f2937' },
      { kind: 'rect', x: 0, y: 155, w: 195, h: 3, fill: '#f59e0b' },
      { kind: 'text', x: 20, y: 50, text: 'STUDIO', size: 22, fill: '#fff', weight: 'bold', spacing: 4 },
      { kind: 'text', x: 20, y: 74, text: 'PHOTO', size: 22, fill: '#fff', weight: 'bold', spacing: 4 },
      { kind: 'text', x: 20, y: 108, text: 'Lisa Anderson', size: 11, fill: '#f9fafb' },
      { kind: 'text', x: 20, y: 124, text: 'Professional Photographer', size: 7, fill: '#9ca3af' },
      { kind: 'text', x: 20, y: 168, text: 'lisa@studiophoto.com', size: 7, fill: '#d1d5db' },
    ],
  },

  // 9. Restaurant Warm
  {
    id: 'restaurant',
    background: '#fef3c7',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 200, fill: '#fed7aa', opacity: 0.4 },
      { kind: 'rect', x: 0, y: 155, w: 350, h: 45, fill: '#7c2d12' },
      { kind: 'circle', cx: 320, cy: 25, r: 18, fill: '#d97706', opacity: 0.3 },
      { kind: 'circle', cx: 30, cy: 170, r: 14, fill: '#d97706', opacity: 0.2 },
      { kind: 'text', x: 175, y: 45, text: 'BELLA CUCINA', size: 16, fill: '#7c2d12', weight: 'bold', align: 'center', spacing: 2 },
      { kind: 'text', x: 175, y: 62, text: 'Authentic Italian Cuisine', size: 7, fill: '#9a3412', align: 'center' },
      { kind: 'rect', x: 60, y: 72, w: 230, h: 1, fill: '#d97706', opacity: 0.4 },
      { kind: 'text', x: 175, y: 100, text: 'Chef Marco Rossi', size: 10, fill: '#7c2d12', align: 'center' },
      { kind: 'text', x: 175, y: 170, text: '+91 98765 43210  •  www.bellacucina.com', size: 7, fill: '#fed7aa', align: 'center' },
    ],
  },

  // 10. Modern Navy Split
  {
    id: 'navy-split',
    background: '#1e3a8a',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 14, h: 200, fill: '#c0c0c0' },
      { kind: 'text', x: 35, y: 55, text: 'CORPORATE', size: 17, fill: '#fff', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 35, y: 76, text: 'SOLUTIONS', size: 17, fill: '#fff', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 35, y: 112, text: 'Robert Wilson', size: 12, fill: '#c0c0c0', weight: 'bold' },
      { kind: 'text', x: 35, y: 128, text: 'Senior Consultant', size: 8, fill: 'rgba(255,255,255,0.85)' },
      { kind: 'rect', x: 35, y: 140, w: 240, h: 1, fill: '#c0c0c0', opacity: 0.3 },
      { kind: 'text', x: 35, y: 156, text: 'robert@corporate.com  |  +91 98765 43210', size: 7, fill: 'rgba(255,255,255,0.7)' },
    ],
  },

  // 11. Rose Pink Elegant
  {
    id: 'rose-elegant',
    background: '#fff1f2',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 80, fill: '#be123c' },
      { kind: 'circle', cx: 310, cy: 40, r: 30, fill: '#f43f5e', opacity: 0.2 },
      { kind: 'text', x: 20, y: 30, text: 'ROSE BEAUTY', size: 14, fill: '#fff', weight: 'bold', spacing: 2 },
      { kind: 'text', x: 20, y: 50, text: 'Luxury Spa & Salon', size: 7, fill: 'rgba(255,255,255,0.85)' },
      { kind: 'text', x: 20, y: 106, text: 'Priya Sharma', size: 13, fill: '#881337', weight: 'bold' },
      { kind: 'text', x: 20, y: 122, text: 'Beauty Consultant', size: 8, fill: '#be123c' },
      { kind: 'rect', x: 20, y: 133, w: 200, h: 1, fill: '#fda4af' },
      { kind: 'text', x: 20, y: 148, text: 'priya@rosebeauty.in  •  +91 98765 43210', size: 7, fill: '#9f1239' },
    ],
  },

  // 12. Emerald Green
  {
    id: 'emerald',
    background: '#064e3b',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 200, fill: '#065f46', opacity: 0.5 },
      { kind: 'circle', cx: 300, cy: 160, r: 60, fill: '#10b981', opacity: 0.08 },
      { kind: 'rect', x: 0, y: 0, w: 6, h: 200, fill: '#6ee7b7' },
      { kind: 'text', x: 28, y: 52, text: 'EMERALD', size: 19, fill: '#6ee7b7', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 28, y: 74, text: 'FINANCE', size: 19, fill: '#fff', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 28, y: 112, text: 'Rahul Mehta', size: 12, fill: '#fff', weight: 'bold' },
      { kind: 'text', x: 28, y: 128, text: 'Investment Advisor', size: 8, fill: '#a7f3d0' },
      { kind: 'text', x: 28, y: 158, text: 'rahul@emeraldfinance.in  |  +91 98765 43210', size: 7, fill: '#6ee7b7' },
    ],
  },

  // 13. Orange Bold
  {
    id: 'orange-bold',
    background: '#fff7ed',
    elements: [
      { kind: 'rect', x: 220, y: 0, w: 130, h: 200, fill: '#ea580c' },
      { kind: 'circle', cx: 270, cy: 90, r: 45, fill: '#fb923c', opacity: 0.3 },
      { kind: 'text', x: 20, y: 50, text: 'BOLD', size: 26, fill: '#ea580c', weight: 'bold', spacing: 5 },
      { kind: 'text', x: 20, y: 78, text: 'AGENCY', size: 14, fill: '#7c2d12', weight: 'bold', spacing: 2 },
      { kind: 'rect', x: 20, y: 90, w: 180, h: 2, fill: '#ea580c' },
      { kind: 'text', x: 20, y: 116, text: 'Arun Patel', size: 13, fill: '#1c1917', weight: 'bold' },
      { kind: 'text', x: 20, y: 132, text: 'Brand Strategist', size: 8, fill: '#78716c' },
      { kind: 'text', x: 20, y: 158, text: 'arun@boldagency.in', size: 7, fill: '#57534e' },
    ],
  },

  // 14. Ink Black Minimal
  {
    id: 'ink-black',
    background: '#18181b',
    elements: [
      { kind: 'rect', x: 30, y: 0, w: 2, h: 200, fill: '#a1a1aa' },
      { kind: 'text', x: 50, y: 45, text: 'STUDIO', size: 16, fill: '#fff', weight: 'bold', spacing: 5 },
      { kind: 'text', x: 50, y: 65, text: 'NOIR', size: 16, fill: '#a1a1aa', weight: 'bold', spacing: 5 },
      { kind: 'rect', x: 50, y: 100, w: 250, h: 1, fill: '#3f3f46' },
      { kind: 'text', x: 50, y: 120, text: 'Vikram Das', size: 13, fill: '#f4f4f5', weight: 'bold' },
      { kind: 'text', x: 50, y: 136, text: 'Art Director', size: 8, fill: '#71717a' },
      { kind: 'text', x: 50, y: 160, text: 'vikram@studionoir.in  •  +91 98765 43210', size: 7, fill: '#a1a1aa' },
    ],
  },

  // 15. Sky Blue Architect
  {
    id: 'sky-architect',
    background: '#f0f9ff',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 6, fill: '#0284c7' },
      { kind: 'rect', x: 0, y: 194, w: 350, h: 6, fill: '#0284c7' },
      { kind: 'rect', x: 0, y: 6, w: 55, h: 188, fill: '#e0f2fe' },
      { kind: 'text', x: 75, y: 48, text: 'ARCHI', size: 15, fill: '#0c4a6e', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 75, y: 66, text: 'SPACE', size: 15, fill: '#0284c7', weight: 'bold', spacing: 3 },
      { kind: 'rect', x: 75, y: 80, w: 220, h: 1, fill: '#bae6fd' },
      { kind: 'text', x: 75, y: 100, text: 'Neha Gupta', size: 13, fill: '#0c4a6e', weight: 'bold' },
      { kind: 'text', x: 75, y: 116, text: 'Senior Architect', size: 8, fill: '#0369a1' },
      { kind: 'text', x: 75, y: 148, text: 'neha@archispace.in  |  +91 98765 43210', size: 7, fill: '#0369a1' },
    ],
  },

  // 16. Indigo Wave
  {
    id: 'indigo-wave',
    background: '#1e1b4b',
    elements: [
      { kind: 'rect', x: 0, y: 130, w: 350, h: 70, fill: '#312e81', opacity: 0.8 },
      { kind: 'circle', cx: 320, cy: 30, r: 50, fill: '#4f46e5', opacity: 0.12 },
      { kind: 'circle', cx: 10, cy: 180, r: 35, fill: '#818cf8', opacity: 0.1 },
      { kind: 'text', x: 25, y: 44, text: 'WAVE', size: 22, fill: '#818cf8', weight: 'bold', spacing: 4 },
      { kind: 'text', x: 25, y: 66, text: 'DIGITAL', size: 14, fill: '#fff', weight: 'bold', spacing: 2 },
      { kind: 'text', x: 25, y: 100, text: 'Ananya Roy', size: 12, fill: '#c7d2fe', weight: 'bold' },
      { kind: 'text', x: 25, y: 115, text: 'Digital Marketing Lead', size: 8, fill: '#a5b4fc' },
      { kind: 'text', x: 25, y: 155, text: 'ananya@wavedigital.in  •  +91 98765 43210', size: 7, fill: '#818cf8' },
    ],
  },

  // 17. Teal Consultant
  {
    id: 'teal-consult',
    background: '#ffffff',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 70, fill: '#0d9488' },
      { kind: 'rect', x: 0, y: 70, w: 350, h: 5, fill: '#fbbf24' },
      { kind: 'circle', cx: 320, cy: 35, r: 28, fill: '#2dd4bf', opacity: 0.2 },
      { kind: 'text', x: 20, y: 28, text: 'TEAL', size: 14, fill: '#fff', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 20, y: 48, text: 'CONSULTING', size: 10, fill: 'rgba(255,255,255,0.85)', spacing: 2 },
      { kind: 'text', x: 20, y: 98, text: 'Kiran Nair', size: 13, fill: '#134e4a', weight: 'bold' },
      { kind: 'text', x: 20, y: 114, text: 'Business Consultant', size: 8, fill: '#0d9488' },
      { kind: 'rect', x: 20, y: 126, w: 200, h: 1, fill: '#ccfbf1' },
      { kind: 'text', x: 20, y: 144, text: 'kiran@tealconsult.in  |  +91 98765 43210', size: 7, fill: '#115e59' },
    ],
  },

  // 18. Yellow Startup
  {
    id: 'yellow-startup',
    background: '#fefce8',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 200, fill: '#fef08a', opacity: 0.3 },
      { kind: 'rect', x: 0, y: 0, w: 8, h: 200, fill: '#ca8a04' },
      { kind: 'circle', cx: 305, cy: 155, r: 50, fill: '#fbbf24', opacity: 0.15 },
      { kind: 'text', x: 28, y: 42, text: 'SPARK', size: 22, fill: '#78350f', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 28, y: 64, text: 'LABS', size: 14, fill: '#ca8a04', weight: 'bold', spacing: 2 },
      { kind: 'rect', x: 28, y: 78, w: 200, h: 2, fill: '#fbbf24' },
      { kind: 'text', x: 28, y: 106, text: 'Deepak Singh', size: 12, fill: '#451a03', weight: 'bold' },
      { kind: 'text', x: 28, y: 122, text: 'Co-Founder & CEO', size: 8, fill: '#92400e' },
      { kind: 'text', x: 28, y: 158, text: 'deepak@sparklabs.in  •  +91 98765 43210', size: 7, fill: '#78350f' },
    ],
  },

  // 19. Red Bold Lawyer
  {
    id: 'red-lawyer',
    background: '#fff',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 120, h: 200, fill: '#991b1b' },
      { kind: 'rect', x: 120, y: 0, w: 4, h: 200, fill: '#dc2626', opacity: 0.4 },
      { kind: 'text', x: 20, y: 40, text: 'LAW', size: 14, fill: '#fca5a5', weight: 'bold', spacing: 2 },
      { kind: 'text', x: 20, y: 56, text: 'FIRM', size: 14, fill: '#fff', weight: 'bold', spacing: 2 },
      { kind: 'rect', x: 20, y: 68, w: 80, h: 1, fill: '#fca5a5', opacity: 0.5 },
      { kind: 'text', x: 145, y: 60, text: 'Meera Joshi', size: 14, fill: '#1c1917', weight: 'bold' },
      { kind: 'text', x: 145, y: 78, text: 'Senior Advocate', size: 8, fill: '#991b1b' },
      { kind: 'rect', x: 145, y: 90, w: 180, h: 1, fill: '#fee2e2' },
      { kind: 'text', x: 145, y: 108, text: 'meera@lawfirm.in', size: 7, fill: '#44403c' },
      { kind: 'text', x: 145, y: 122, text: '+91 98765 43210', size: 7, fill: '#44403c' },
    ],
  },

  // 20. Pastel Minimal
  {
    id: 'pastel-minimal',
    background: '#fdf4ff',
    elements: [
      { kind: 'circle', cx: 300, cy: 40, r: 38, fill: '#e879f9', opacity: 0.12 },
      { kind: 'circle', cx: 30, cy: 170, r: 28, fill: '#a855f7', opacity: 0.1 },
      { kind: 'rect', x: 30, y: 100, w: 290, h: 1, fill: '#e9d5ff' },
      { kind: 'text', x: 30, y: 48, text: 'Sonia Kapoor', size: 16, fill: '#6b21a8', weight: 'bold' },
      { kind: 'text', x: 30, y: 68, text: 'Fashion Designer', size: 8, fill: '#a855f7', spacing: 1 },
      { kind: 'text', x: 30, y: 120, text: 'sonia@kapoordesigns.in', size: 7, fill: '#7e22ce' },
      { kind: 'text', x: 30, y: 134, text: '+91 98765 43210', size: 7, fill: '#9333ea' },
    ],
  },

  // 21. Classic Black Border
  {
    id: 'classic-border',
    background: '#fff',
    elements: [
      { kind: 'rect', x: 6, y: 6, w: 338, h: 188, fill: 'none', opacity: 0 },
      { kind: 'rect', x: 0, y: 0, w: 350, h: 4, fill: '#000' },
      { kind: 'rect', x: 0, y: 196, w: 350, h: 4, fill: '#000' },
      { kind: 'rect', x: 0, y: 0, w: 4, h: 200, fill: '#000' },
      { kind: 'rect', x: 346, y: 0, w: 4, h: 200, fill: '#000' },
      { kind: 'text', x: 175, y: 58, text: 'RAVI KUMAR', size: 16, fill: '#000', weight: 'bold', align: 'center', spacing: 3 },
      { kind: 'rect', x: 80, y: 72, w: 190, h: 1, fill: '#000' },
      { kind: 'text', x: 175, y: 90, text: 'Chartered Accountant', size: 8, fill: '#333', align: 'center', spacing: 1 },
      { kind: 'rect', x: 80, y: 104, w: 190, h: 1, fill: '#e5e7eb' },
      { kind: 'text', x: 175, y: 126, text: 'ravi@ravikumar.in  •  +91 98765 43210', size: 7, fill: '#555', align: 'center' },
    ],
  },

  // 22. Gradient Sunset
  {
    id: 'sunset-gradient',
    background: '#ff6b35',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 200, fill: '#f7c59f', opacity: 0.4 },
      { kind: 'rect', x: 0, y: 130, w: 350, h: 70, fill: '#c0392b', opacity: 0.5 },
      { kind: 'circle', cx: 300, cy: 25, r: 35, fill: '#fff', opacity: 0.07 },
      { kind: 'text', x: 25, y: 42, text: 'SUNSET', size: 20, fill: '#fff', weight: 'bold', spacing: 4 },
      { kind: 'text', x: 25, y: 64, text: 'EVENTS', size: 13, fill: 'rgba(255,255,255,0.9)', spacing: 2 },
      { kind: 'text', x: 25, y: 102, text: 'Pooja Verma', size: 12, fill: '#fff', weight: 'bold' },
      { kind: 'text', x: 25, y: 118, text: 'Event Planner', size: 8, fill: 'rgba(255,255,255,0.85)' },
      { kind: 'text', x: 25, y: 158, text: 'pooja@sunsetevents.in  |  +91 98765 43210', size: 7, fill: 'rgba(255,255,255,0.8)' },
    ],
  },

  // 23. Steel Gray
  {
    id: 'steel-gray',
    background: '#f1f5f9',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 200, fill: '#e2e8f0' },
      { kind: 'rect', x: 0, y: 0, w: 350, h: 65, fill: '#334155' },
      { kind: 'rect', x: 0, y: 65, w: 350, h: 3, fill: '#94a3b8' },
      { kind: 'circle', cx: 320, cy: 32, r: 22, fill: '#475569', opacity: 0.4 },
      { kind: 'text', x: 20, y: 25, text: 'STEEL', size: 13, fill: '#e2e8f0', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 20, y: 44, text: 'INDUSTRIES', size: 10, fill: '#94a3b8', spacing: 2 },
      { kind: 'text', x: 20, y: 96, text: 'Suresh Reddy', size: 13, fill: '#0f172a', weight: 'bold' },
      { kind: 'text', x: 20, y: 112, text: 'Operations Manager', size: 8, fill: '#475569' },
      { kind: 'text', x: 20, y: 148, text: 'suresh@steelindustries.in  •  +91 98765 43210', size: 7, fill: '#64748b' },
    ],
  },

  // 24. QR Modern
  {
    id: 'qr-modern',
    background: '#ffffff',
    elements: [
      { kind: 'rect', x: 250, y: 40, w: 80, h: 80, fill: '#f3f4f6', radius: 8 },
      { kind: 'rect', x: 262, y: 52, w: 22, h: 22, fill: '#1f2937' },
      { kind: 'rect', x: 294, y: 52, w: 22, h: 22, fill: '#1f2937' },
      { kind: 'rect', x: 262, y: 84, w: 22, h: 22, fill: '#1f2937' },
      { kind: 'rect', x: 294, y: 84, w: 10, h: 10, fill: '#1f2937' },
      { kind: 'rect', x: 312, y: 84, w: 4, h: 22, fill: '#1f2937' },
      { kind: 'text', x: 270, y: 135, text: 'Scan to connect', size: 6, fill: '#3b82f6', align: 'center' },
      { kind: 'text', x: 20, y: 50, text: 'DIGITAL', size: 18, fill: '#1f2937', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 20, y: 72, text: 'CONNECT', size: 18, fill: '#1f2937', weight: 'bold', spacing: 3 },
      { kind: 'text', x: 20, y: 110, text: 'David Chen', size: 12, fill: '#1f2937', weight: 'bold' },
      { kind: 'text', x: 20, y: 126, text: 'Digital Marketing Specialist', size: 7, fill: '#6b7280' },
      { kind: 'text', x: 20, y: 160, text: 'david@digitalconnect.in  |  +91 98765 43210', size: 7, fill: '#9ca3af' },
    ],
  },

  // 25. Vintage Brown
  {
    id: 'vintage-brown',
    background: '#fef3c7',
    elements: [
      { kind: 'rect', x: 0, y: 0, w: 350, h: 200, fill: '#d97706', opacity: 0.08 },
      { kind: 'rect', x: 12, y: 12, w: 326, h: 176, fill: 'none', opacity: 0 },
      { kind: 'rect', x: 12, y: 12, w: 326, h: 2, fill: '#92400e' },
      { kind: 'rect', x: 12, y: 186, w: 326, h: 2, fill: '#92400e' },
      { kind: 'rect', x: 12, y: 12, w: 2, h: 176, fill: '#92400e' },
      { kind: 'rect', x: 336, y: 12, w: 2, h: 176, fill: '#92400e' },
      { kind: 'circle', cx: 175, cy: 62, r: 28, fill: '#d97706', opacity: 0.15 },
      { kind: 'text', x: 175, y: 50, text: 'HERITAGE', size: 14, fill: '#78350f', weight: 'bold', align: 'center', spacing: 3 },
      { kind: 'text', x: 175, y: 68, text: 'CRAFTS', size: 10, fill: '#92400e', align: 'center', spacing: 2 },
      { kind: 'rect', x: 70, y: 82, w: 210, h: 1, fill: '#d97706', opacity: 0.5 },
      { kind: 'text', x: 175, y: 108, text: 'Aarti Sharma', size: 12, fill: '#451a03', weight: 'bold', align: 'center' },
      { kind: 'text', x: 175, y: 124, text: 'Master Artisan', size: 7, fill: '#92400e', align: 'center', spacing: 1 },
      { kind: 'text', x: 175, y: 162, text: 'aarti@heritagecrafts.in  •  +91 98765 43210', size: 7, fill: '#78350f', align: 'center' },
    ],
  },
];

// ─── SVG renderer ─────────────────────────────────────────────────────────────
// Internal canvas: 350×200, scaled to fit the container via viewBox
function renderElement(el: CardElement, i: number): React.ReactNode {
  switch (el.kind) {
    case 'rect':
      return (
        <rect
          key={i}
          x={el.x} y={el.y} width={el.w} height={el.h}
          fill={el.fill}
          rx={el.radius ?? 0}
          opacity={el.opacity ?? 1}
        />
      );
    case 'circle':
      return (
        <circle
          key={i}
          cx={el.cx} cy={el.cy} r={el.r}
          fill={el.fill}
          opacity={el.opacity ?? 1}
        />
      );
    case 'line':
      return (
        <line
          key={i}
          x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2}
          stroke={el.stroke}
          strokeWidth={el.width ?? 1}
          opacity={el.opacity ?? 1}
        />
      );
    case 'triangle':
      return (
        <polygon
          key={i}
          points={el.points}
          fill={el.fill}
          opacity={el.opacity ?? 1}
        />
      );
    case 'text': {
      const anchor = el.align === 'center' ? 'middle' : el.align === 'right' ? 'end' : 'start';
      return (
        <text
          key={i}
          x={el.x} y={el.y}
          fontSize={el.size}
          fontWeight={el.weight ?? 'normal'}
          fill={el.fill}
          textAnchor={anchor}
          letterSpacing={el.spacing ?? 0}
          opacity={el.opacity ?? 1}
        >
          {el.text}
        </text>
      );
    }
    default:
      return null;
  }
}

interface Props {
  design: CardDesign;
}

export default function BusinessCardMiniPreview({ design }: Props) {
  return (
    <svg
      viewBox="0 0 350 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ display: 'block' }}
    >
      {/* Background */}
      <rect x={0} y={0} width={350} height={200} fill={design.background} />
      {/* Elements */}
      {design.elements.map((el, i) => renderElement(el, i))}
    </svg>
  );
}

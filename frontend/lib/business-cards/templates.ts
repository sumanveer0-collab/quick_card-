import { BusinessCardTemplate } from '@/types/business-card.types';

export const businessCardTemplates: BusinessCardTemplate[] = [
  // Corporate Blue Business Card
  {
    id: 'corporate-blue-001',
    title: 'Corporate Blue Professional',
    category: 'corporate',
    isPopular: true,
    previewGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Blue side panel
        {
          id: 'panel-1',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 0,
          width: 120,
          height: 200,
          fill: '#1e40af',
          zIndex: 1,
        },
        // Angular accent
        {
          id: 'accent-1',
          type: 'shape',
          shape: 'polygon',
          x: 100,
          y: 0,
          width: 40,
          height: 200,
          fill: '#3b82f6',
          opacity: 0.7,
          zIndex: 2,
        },
        // Logo placeholder
        {
          id: 'logo-1',
          type: 'text',
          text: 'LOGO',
          x: 30,
          y: 30,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ffffff',
          zIndex: 3,
        },
        // Name
        {
          id: 'name-1',
          type: 'text',
          text: 'John Anderson',
          x: 160,
          y: 80,
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1e293b',
          zIndex: 3,
        },
        // Position
        {
          id: 'position-1',
          type: 'text',
          text: 'Chief Executive Officer',
          x: 160,
          y: 115,
          fontSize: 14,
          color: '#64748b',
          zIndex: 3,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#f8fafc',
      },
      elements: [
        // Contact icons and info
        {
          id: 'phone-icon',
          type: 'text',
          text: '📞',
          x: 40,
          y: 60,
          fontSize: 20,
          zIndex: 2,
        },
        {
          id: 'phone-text',
          type: 'text',
          text: '+1 (555) 123-4567',
          x: 80,
          y: 65,
          fontSize: 14,
          color: '#334155',
          zIndex: 2,
        },
        {
          id: 'email-icon',
          type: 'text',
          text: '✉️',
          x: 40,
          y: 100,
          fontSize: 20,
          zIndex: 2,
        },
        {
          id: 'email-text',
          type: 'text',
          text: 'john@company.com',
          x: 80,
          y: 105,
          fontSize: 14,
          color: '#334155',
          zIndex: 2,
        },
        {
          id: 'web-icon',
          type: 'text',
          text: '🌐',
          x: 40,
          y: 140,
          fontSize: 20,
          zIndex: 2,
        },
        {
          id: 'web-text',
          type: 'text',
          text: 'www.company.com',
          x: 80,
          y: 145,
          fontSize: 14,
          color: '#334155',
          zIndex: 2,
        },
      ],
    },
  },

  // Luxury Black Gold Card
  {
    id: 'luxury-black-gold-001',
    title: 'Luxury Black & Gold',
    category: 'luxury',
    isPremium: true,
    isPopular: true,
    previewGradient: 'linear-gradient(135deg, #000000 0%, #d4af37 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#0a0a0a',
      },
      elements: [
        // Gold curved line
        {
          id: 'gold-curve',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 90,
          width: 350,
          height: 3,
          fill: '#d4af37',
          zIndex: 1,
        },
        // Name
        {
          id: 'name-luxury',
          type: 'text',
          text: 'ALEXANDER KNIGHT',
          x: 175,
          y: 70,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2,
          zIndex: 2,
        },
        // Title
        {
          id: 'title-luxury',
          type: 'text',
          text: 'Executive Director',
          x: 175,
          y: 110,
          fontSize: 14,
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: 1,
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#0a0a0a',
      },
      elements: [
        // Gold accent line
        {
          id: 'gold-line-back',
          type: 'shape',
          shape: 'rectangle',
          x: 40,
          y: 50,
          width: 270,
          height: 2,
          fill: '#d4af37',
          zIndex: 1,
        },
        // Contact info
        {
          id: 'contact-luxury',
          type: 'text',
          text: '+1 (555) 987-6543\nalexander@luxury.com\nwww.luxury.com',
          x: 175,
          y: 90,
          fontSize: 13,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.8,
          zIndex: 2,
        },
      ],
    },
  },

  // Modern Gradient Card
  {
    id: 'modern-gradient-001',
    title: 'Modern Gradient Wave',
    category: 'modern',
    isPopular: true,
    previewGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
    front: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          colors: ['#1a1a2e', '#16213e'],
          angle: 135,
        },
      },
      elements: [
        // Gradient wave shape
        {
          id: 'wave-1',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 0,
          width: 350,
          height: 100,
          fill: 'linear-gradient(90deg, #ff6b6b, #ee5a6f)',
          opacity: 0.8,
          zIndex: 1,
        },
        // Name
        {
          id: 'name-modern',
          type: 'text',
          text: 'Sarah Mitchell',
          x: 30,
          y: 120,
          fontSize: 26,
          fontWeight: 'bold',
          color: '#ffffff',
          zIndex: 2,
        },
        // Position
        {
          id: 'position-modern',
          type: 'text',
          text: 'Creative Director',
          x: 30,
          y: 150,
          fontSize: 14,
          color: '#ff6b6b',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          colors: ['#1a1a2e', '#16213e'],
          angle: 135,
        },
      },
      elements: [
        // QR code placeholder
        {
          id: 'qr-modern',
          type: 'shape',
          shape: 'rectangle',
          x: 230,
          y: 50,
          width: 80,
          height: 80,
          fill: '#ffffff',
          borderRadius: 8,
          zIndex: 2,
        },
        // Contact info
        {
          id: 'contact-modern',
          type: 'text',
          text: '📱 +1 (555) 234-5678\n✉️ sarah@creative.com\n🌐 creative.com',
          x: 30,
          y: 60,
          fontSize: 12,
          color: '#ffffff',
          lineHeight: 2,
          zIndex: 2,
        },
      ],
    },
  },

  // Creative Designer Card
  {
    id: 'creative-designer-001',
    title: 'Creative Geometric',
    category: 'creative',
    previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Geometric shapes
        {
          id: 'geo-1',
          type: 'shape',
          shape: 'circle',
          x: 280,
          y: 20,
          width: 60,
          height: 60,
          fill: '#667eea',
          opacity: 0.3,
          zIndex: 1,
        },
        {
          id: 'geo-2',
          type: 'shape',
          shape: 'rectangle',
          x: 20,
          y: 140,
          width: 80,
          height: 80,
          fill: '#764ba2',
          opacity: 0.2,
          rotation: 45,
          zIndex: 1,
        },
        // Name
        {
          id: 'name-creative',
          type: 'text',
          text: 'MAYA CHEN',
          x: 30,
          y: 80,
          fontSize: 28,
          fontWeight: 'bold',
          color: '#667eea',
          zIndex: 2,
        },
        // Title
        {
          id: 'title-creative',
          type: 'text',
          text: 'Graphic Designer',
          x: 30,
          y: 110,
          fontSize: 14,
          color: '#64748b',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          colors: ['#667eea', '#764ba2'],
          angle: 135,
        },
      },
      elements: [
        // Contact info
        {
          id: 'contact-creative',
          type: 'text',
          text: 'maya@design.studio\n+1 (555) 345-6789\ndesign.studio',
          x: 175,
          y: 90,
          fontSize: 14,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 2,
          zIndex: 2,
        },
      ],
    },
  },

  // Minimal White Business Card
  {
    id: 'minimal-white-001',
    title: 'Minimal Clean White',
    category: 'minimal',
    isPopular: true,
    previewGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Thin accent line
        {
          id: 'line-1',
          type: 'shape',
          shape: 'rectangle',
          x: 30,
          y: 95,
          width: 290,
          height: 1,
          fill: '#e2e8f0',
          zIndex: 1,
        },
        // Name
        {
          id: 'name-minimal',
          type: 'text',
          text: 'David Park',
          x: 30,
          y: 70,
          fontSize: 24,
          fontWeight: '600',
          color: '#0f172a',
          zIndex: 2,
        },
        // Title
        {
          id: 'title-minimal',
          type: 'text',
          text: 'Product Manager',
          x: 30,
          y: 110,
          fontSize: 12,
          color: '#64748b',
          letterSpacing: 1,
          textTransform: 'uppercase',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Simple contact layout
        {
          id: 'contact-minimal',
          type: 'text',
          text: 'T  +1 (555) 456-7890\nE  david@company.com\nW  company.com',
          x: 30,
          y: 70,
          fontSize: 11,
          color: '#475569',
          lineHeight: 2.2,
          zIndex: 2,
        },
      ],
    },
  },

  // QR Business Card
  {
    id: 'qr-business-001',
    title: 'QR Code Modern',
    category: 'qr',
    isPremium: true,
    previewGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    front: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          colors: ['#6366f1', '#8b5cf6'],
          angle: 135,
        },
      },
      elements: [
        // Profile circle
        {
          id: 'profile-circle',
          type: 'shape',
          shape: 'circle',
          x: 135,
          y: 40,
          width: 80,
          height: 80,
          fill: '#ffffff',
          zIndex: 1,
        },
        // Name
        {
          id: 'name-qr',
          type: 'text',
          text: 'Emma Wilson',
          x: 175,
          y: 135,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          zIndex: 2,
        },
        // QR code
        {
          id: 'qr-front',
          type: 'shape',
          shape: 'rectangle',
          x: 255,
          y: 140,
          width: 60,
          height: 60,
          fill: '#ffffff',
          borderRadius: 8,
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Social media icons
        {
          id: 'social-qr',
          type: 'text',
          text: '🔗 linkedin.com/in/emmawilson\n📷 @emmawilson\n🐦 @emmawilson',
          x: 30,
          y: 70,
          fontSize: 12,
          color: '#334155',
          lineHeight: 2.5,
          zIndex: 2,
        },
      ],
    },
  },

  // Restaurant Business Card
  {
    id: 'restaurant-001',
    title: 'Restaurant Warm',
    category: 'restaurant',
    previewGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
    front: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          colors: ['#fed7aa', '#fdba74'],
          angle: 135,
        },
      },
      elements: [
        // Restaurant name
        {
          id: 'restaurant-name',
          type: 'text',
          text: 'BELLA CUCINA',
          x: 175,
          y: 70,
          fontSize: 26,
          fontWeight: 'bold',
          color: '#7c2d12',
          textAlign: 'center',
          letterSpacing: 2,
          zIndex: 2,
        },
        // Tagline
        {
          id: 'tagline',
          type: 'text',
          text: 'Authentic Italian Cuisine',
          x: 175,
          y: 100,
          fontSize: 12,
          color: '#9a3412',
          textAlign: 'center',
          fontWeight: '300',
          zIndex: 2,
        },
        // Chef name
        {
          id: 'chef-name',
          type: 'text',
          text: 'Chef Marco Rossi',
          x: 175,
          y: 140,
          fontSize: 16,
          color: '#7c2d12',
          textAlign: 'center',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#7c2d12',
      },
      elements: [
        // Reservation info
        {
          id: 'reservation',
          type: 'text',
          text: 'RESERVATIONS\n+1 (555) 567-8901\n\n123 Main Street\nCity, State 12345\n\nwww.bellacucina.com',
          x: 175,
          y: 60,
          fontSize: 12,
          color: '#fed7aa',
          textAlign: 'center',
          lineHeight: 1.8,
          zIndex: 2,
        },
      ],
    },
  },

  // Tech Startup Business Card
  {
    id: 'tech-startup-001',
    title: 'Tech Startup Neon',
    category: 'tech',
    isPremium: true,
    previewGradient: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#0f172a',
      },
      elements: [
        // Neon glow effect
        {
          id: 'neon-line',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 0,
          width: 350,
          height: 4,
          fill: '#3b82f6',
          shadow: {
            x: 0,
            y: 0,
            blur: 20,
            color: '#3b82f6',
          },
          zIndex: 1,
        },
        // Grid background pattern
        {
          id: 'grid-pattern',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 0,
          width: 350,
          height: 200,
          fill: 'transparent',
          stroke: '#1e40af',
          strokeWidth: 1,
          opacity: 0.2,
          zIndex: 0,
        },
        // Name
        {
          id: 'name-tech',
          type: 'text',
          text: 'ALEX CHEN',
          x: 30,
          y: 80,
          fontSize: 28,
          fontWeight: 'bold',
          color: '#3b82f6',
          zIndex: 2,
        },
        // Title
        {
          id: 'title-tech',
          type: 'text',
          text: 'CTO & Co-Founder',
          x: 30,
          y: 115,
          fontSize: 14,
          color: '#60a5fa',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#0f172a',
      },
      elements: [
        // Tech icons and contact
        {
          id: 'contact-tech',
          type: 'text',
          text: '💻 alex@techstartup.io\n🚀 techstartup.io\n📱 +1 (555) 678-9012',
          x: 30,
          y: 70,
          fontSize: 13,
          color: '#60a5fa',
          lineHeight: 2.2,
          zIndex: 2,
        },
      ],
    },
  },

  // Real Estate Business Card
  {
    id: 'real-estate-001',
    title: 'Real Estate Professional',
    category: 'real-estate',
    previewGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Green accent bar
        {
          id: 'accent-bar',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 0,
          width: 350,
          height: 60,
          fill: '#059669',
          zIndex: 1,
        },
        // Name
        {
          id: 'name-realestate',
          type: 'text',
          text: 'Jennifer Martinez',
          x: 30,
          y: 25,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#ffffff',
          zIndex: 2,
        },
        // Title
        {
          id: 'title-realestate',
          type: 'text',
          text: 'Licensed Real Estate Agent',
          x: 30,
          y: 90,
          fontSize: 14,
          color: '#059669',
          fontWeight: '600',
          zIndex: 2,
        },
        // Company
        {
          id: 'company-realestate',
          type: 'text',
          text: 'Premier Properties Group',
          x: 30,
          y: 115,
          fontSize: 12,
          color: '#64748b',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#f0fdf4',
      },
      elements: [
        // Contact info
        {
          id: 'contact-realestate',
          type: 'text',
          text: '📞 +1 (555) 789-0123\n✉️ jennifer@premierproperties.com\n🏠 www.premierproperties.com\n📍 456 Oak Avenue, Suite 200',
          x: 30,
          y: 50,
          fontSize: 11,
          color: '#166534',
          lineHeight: 2.5,
          zIndex: 2,
        },
      ],
    },
  },

  // Photography Business Card
  {
    id: 'photography-001',
    title: 'Photography Portfolio',
    category: 'photography',
    previewGradient: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#1f2937',
      },
      elements: [
        // Camera icon placeholder
        {
          id: 'camera-icon',
          type: 'text',
          text: '📷',
          x: 30,
          y: 30,
          fontSize: 40,
          zIndex: 2,
        },
        // Name
        {
          id: 'name-photo',
          type: 'text',
          text: 'LUCAS BROWN',
          x: 30,
          y: 110,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ffffff',
          letterSpacing: 2,
          zIndex: 2,
        },
        // Title
        {
          id: 'title-photo',
          type: 'text',
          text: 'Professional Photographer',
          x: 30,
          y: 140,
          fontSize: 12,
          color: '#9ca3af',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Portfolio info
        {
          id: 'portfolio-photo',
          type: 'text',
          text: '📸 Portfolio: lucasbrown.photo\n📧 lucas@photography.com\n📱 +1 (555) 890-1234\n📍 Available for bookings worldwide',
          x: 30,
          y: 50,
          fontSize: 11,
          color: '#374151',
          lineHeight: 2.5,
          zIndex: 2,
        },
      ],
    },
  },

  // Medical Professional Card
  {
    id: 'medical-001',
    title: 'Medical Professional',
    category: 'medical',
    previewGradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    front: {
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [
        // Medical cross accent
        {
          id: 'medical-accent',
          type: 'shape',
          shape: 'rectangle',
          x: 0,
          y: 0,
          width: 100,
          height: 200,
          fill: '#0ea5e9',
          zIndex: 1,
        },
        // Name
        {
          id: 'name-medical',
          type: 'text',
          text: 'Dr. Sarah Johnson',
          x: 130,
          y: 70,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#0f172a',
          zIndex: 2,
        },
        // Credentials
        {
          id: 'credentials',
          type: 'text',
          text: 'MD, FACP',
          x: 130,
          y: 95,
          fontSize: 12,
          color: '#0ea5e9',
          fontWeight: '600',
          zIndex: 2,
        },
        // Specialty
        {
          id: 'specialty',
          type: 'text',
          text: 'Internal Medicine',
          x: 130,
          y: 115,
          fontSize: 13,
          color: '#64748b',
          zIndex: 2,
        },
      ],
    },
    back: {
      background: {
        type: 'solid',
        color: '#f0f9ff',
      },
      elements: [
        // Clinic info
        {
          id: 'clinic-info',
          type: 'text',
          text: 'City Medical Center\n789 Health Plaza, Suite 300\n\n📞 +1 (555) 901-2345\n✉️ dr.johnson@citymedical.com\n🌐 citymedical.com\n\nBy Appointment Only',
          x: 30,
          y: 40,
          fontSize: 11,
          color: '#0c4a6e',
          lineHeight: 2,
          zIndex: 2,
        },
      ],
    },
  },
];

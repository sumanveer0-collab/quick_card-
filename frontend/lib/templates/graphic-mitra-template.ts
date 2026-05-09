import { CanvasElement } from '@/store/editor.store'

/**
 * Graphic Mitra Studio Business Card Template
 * Based on the VistaPrint design with yellow/orange and blue/gray color scheme
 */

export const graphicMitraTemplate: CanvasElement[] = [
  // Top Yellow/Orange Background Rectangle
  {
    id: 'bg_top_yellow',
    type: 'shape',
    shapeType: 'rect',
    x: 37.5, // Start at bleed
    y: 37.5, // Start at bleed
    width: 1050, // Full card width
    height: 200, // Top section height
    fill: '#F5A623', // Orange/Yellow color
    stroke: 'transparent',
    strokeWidth: 0,
    cornerRadius: 0,
    rotation: 0,
    zIndex: 0,
    visible: true,
    locked: false,
  },

  // Middle Blue/Gray Background Rectangle
  {
    id: 'bg_middle_blue',
    type: 'shape',
    shapeType: 'rect',
    x: 37.5,
    y: 237.5, // After top section
    width: 1050,
    height: 150, // Middle section height
    fill: '#5B7C99', // Blue/Gray color
    stroke: 'transparent',
    strokeWidth: 0,
    cornerRadius: 0,
    rotation: 0,
    zIndex: 1,
    visible: true,
    locked: false,
  },

  // Bottom Dark Background Rectangle
  {
    id: 'bg_bottom_dark',
    type: 'shape',
    shapeType: 'rect',
    x: 37.5,
    y: 387.5, // After middle section
    width: 1050,
    height: 250, // Bottom section height
    fill: '#2C2C2C', // Dark gray/black
    stroke: 'transparent',
    strokeWidth: 0,
    cornerRadius: 0,
    rotation: 0,
    zIndex: 2,
    visible: true,
    locked: false,
  },

  // Bottom Yellow/Orange Banner Rectangle
  {
    id: 'bg_bottom_banner',
    type: 'shape',
    shapeType: 'rect',
    x: 200, // Centered with margin
    y: 480,
    width: 650,
    height: 80,
    fill: '#F5A623', // Orange/Yellow color
    stroke: 'transparent',
    strokeWidth: 0,
    cornerRadius: 8,
    rotation: 0,
    zIndex: 3,
    visible: true,
    locked: false,
  },

  // Top Text: "GRAPHIC MITRA STUDIO" (on yellow background)
  {
    id: 'text_top_company',
    type: 'text',
    text: 'GRAPHIC MITRA STUDIO',
    x: 100,
    y: 80,
    width: 850,
    height: 100,
    fontSize: 42,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#FFFFFF', // White text
    stroke: undefined,
    strokeWidth: 0,
    align: 'center',
    verticalAlign: 'middle',
    letterSpacing: 2,
    lineHeight: 1.2,
    rotation: 0,
    zIndex: 4,
    visible: true,
    locked: false,
    padding: { horizontal: 12, vertical: 8 },
  },

  // Middle Text: "GRAPHIC MITRA STUDIO" (on blue background)
  {
    id: 'text_middle_company',
    type: 'text',
    text: 'GRAPHIC MITRA STUDIO',
    x: 100,
    y: 250,
    width: 850,
    height: 120,
    fontSize: 48,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#FFFFFF', // White text
    stroke: '#000000', // Black outline
    strokeWidth: 2,
    align: 'center',
    verticalAlign: 'middle',
    letterSpacing: 3,
    lineHeight: 1.2,
    rotation: 0,
    zIndex: 5,
    visible: true,
    locked: false,
    padding: { horizontal: 12, vertical: 8 },
  },

  // Bottom Banner Text: "Phone / Other"
  {
    id: 'text_bottom_contact',
    type: 'text',
    text: 'Phone / Other',
    x: 250,
    y: 490,
    width: 550,
    height: 60,
    fontSize: 32,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#FFFFFF', // White text
    stroke: undefined,
    strokeWidth: 0,
    align: 'center',
    verticalAlign: 'middle',
    letterSpacing: 1,
    lineHeight: 1.2,
    rotation: 0,
    zIndex: 6,
    visible: true,
    locked: false,
    padding: { horizontal: 12, vertical: 8 },
  },

  // Decorative Icon/Symbol (optional - placeholder for logo)
  {
    id: 'icon_top_left',
    type: 'shape',
    shapeType: 'circle',
    x: 80,
    y: 60,
    width: 40,
    height: 40,
    fill: '#FFFFFF',
    stroke: 'transparent',
    strokeWidth: 0,
    rotation: 0,
    zIndex: 7,
    visible: true,
    locked: false,
  },
]

export default graphicMitraTemplate

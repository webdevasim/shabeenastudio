export type SilhouetteId = 't-shirt' | 'hoodie' | 'mug' | 'cap';

export interface Silhouette {
  id: SilhouetteId;
  name: string;
  category: string;
  basePrice: number;
  printPrice: number;
  icon: string;
  gsm: string;
  material: string;
  description?: string;
  sizes: string[];
  colors: GarmentColor[];
  mockupImages: {
    front: string;
    back: string;
  };
  printSafeDims: {
    label: string;
    widthCm: string;
    heightCm: string;
  };
}

export interface GarmentColor {
  id: string;
  name: string;
  hex: string;
  filterStyle?: string;
  tintOverlay?: string;
}

export type ViewAngle = 'front' | 'back' | 'sleeve' | 'neck';

export interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'symbol';
  name: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  src?: string;
  svgString?: string;
  visible: boolean;
}

export interface CustomProject {
  id: string;
  title: string;
  silhouetteId: SilhouetteId;
  color: GarmentColor;
  size: string;
  currentView: ViewAngle;
  quantity: number;
  layers: {
    front: CanvasLayer[];
    back: CanvasLayer[];
  };
  backPrintActive: boolean;
  notes?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  edition: string;
  category: SilhouetteId | 'oversized' | 'hoodie' | 'mug' | 'cap';
  gsm: string;
  fit: string;
  fabric: string;
  image: string;
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: string[];
  description: string;
}

export interface CartItem {
  id: string;
  isCustom: boolean;
  productId?: string;
  title: string;
  silhouetteName: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
  specsSummary?: string;
  customDetails?: {
    textSummary?: string;
    backPrintIncluded?: boolean;
    gsm?: string;
  };
}

export interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  badge: string;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CustomProject, GarmentColor, Product, SilhouetteId, ViewAngle } from '../types';
import { SILHOUETTES } from '../data/products';

interface StoreState {
  // Navigation / Route
  activeScreen: 'home' | 'studio';
  setActiveScreen: (screen: 'home' | 'studio') => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  appliedCoupon: string | null;
  discountPercentage: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;

  // Customizer State
  customProject: {
    id: string;
    title: string;
    silhouetteId: SilhouetteId;
    color: GarmentColor;
    size: string;
    currentView: ViewAngle;
    quantity: number;
    textString: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    textScale: number;
    inkColor: string;
    uploadedImage: string | null;
    uploadedFileName: string | null;
    uploadedFileSize: string | null;
    selectedSymbolId: string | null;
    backPrintActive: boolean;
    backTextString: string;
    zoom: number;
    gridVisible: boolean;
    activeTab: 'artwork' | 'text' | 'clipart' | 'layers';
    // Position within printable box (percentages)
    placementX: number;
    placementY: number;
    rotation: number;
  };
  setCustomProjectSilhouette: (id: SilhouetteId) => void;
  setCustomProjectColor: (color: GarmentColor) => void;
  setCustomProjectSize: (size: string) => void;
  setCustomProjectView: (view: ViewAngle) => void;
  setCustomProjectQuantity: (qty: number) => void;
  setCustomProjectText: (text: string) => void;
  setCustomProjectFont: (font: string) => void;
  setCustomProjectTextAlign: (align: 'left' | 'center' | 'right') => void;
  setCustomProjectTextScale: (scale: number) => void;
  setCustomProjectInkColor: (color: string) => void;
  setCustomProjectUpload: (image: string | null, name?: string | null, size?: string | null) => void;
  setCustomProjectSymbol: (symbolId: string | null) => void;
  setCustomProjectBackPrint: (active: boolean) => void;
  setCustomProjectBackText: (text: string) => void;
  setCustomProjectZoom: (zoom: number) => void;
  toggleCustomProjectGrid: () => void;
  setCustomProjectTab: (tab: 'artwork' | 'text' | 'clipart' | 'layers') => void;
  setCustomPlacement: (x: number, y: number) => void;
  setCustomRotation: (rot: number) => void;
  resetCustomArtwork: () => void;

  // Modals & Overlays
  isSizeChartOpen: boolean;
  setSizeChartOpen: (open: boolean) => void;
  isSpecSheetOpen: boolean;
  setSpecSheetOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isPreviewModalOpen: boolean;
  setPreviewModalOpen: (open: boolean) => void;
}

const defaultSilhouette = SILHOUETTES[0];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      activeScreen: 'home',
      setActiveScreen: (screen) => {
        set({ activeScreen: screen });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      // Cart State
      cart: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      appliedCoupon: null,
      discountPercentage: 0,

      addToCart: (item) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(
          (c) => c.isCustom === item.isCustom &&
                 c.productId === item.productId &&
                 c.size === item.size &&
                 c.colorName === item.colorName &&
                 c.title === item.title
        );

        if (existingIndex > -1 && !item.isCustom) {
          const updated = [...currentCart];
          updated[existingIndex].quantity += item.quantity;
          set({ cart: updated, isCartOpen: true });
        } else {
          set({ cart: [item, ...currentCart], isCartOpen: true });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      updateCartQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
          ),
        });
      },

      clearCart: () => set({ cart: [], appliedCoupon: null, discountPercentage: 0 }),

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'FIRSTDROP') {
          set({ appliedCoupon: 'FIRSTDROP', discountPercentage: 10 });
          return { success: true, message: 'FIRSTDROP applied! 10% discount on order.' };
        }
        if (clean === 'STREETWEAR15') {
          set({ appliedCoupon: 'STREETWEAR15', discountPercentage: 15 });
          return { success: true, message: 'STREETWEAR15 applied! 15% discount on order.' };
        }
        return { success: false, message: 'Invalid or expired coupon code. Try FIRSTDROP' };
      },

      removeCoupon: () => set({ appliedCoupon: null, discountPercentage: 0 }),

      // Wishlist State
      wishlist: ['prod-kintsugi', 'prod-metropolitan'],
      isWishlistOpen: false,
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      toggleWishlist: (productId) => {
        const current = get().wishlist;
        if (current.includes(productId)) {
          set({ wishlist: current.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...current, productId] });
        }
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Custom Project State
      customProject: {
        id: 'proj-001',
        title: 'Untitled_01.tee',
        silhouetteId: 't-shirt',
        color: defaultSilhouette.colors[0],
        size: 'L',
        currentView: 'front',
        quantity: 1,
        textString: 'NOT AVAILABLE IN STORES',
        fontFamily: 'Monument Extended',
        textAlign: 'center',
        textScale: 32,
        inkColor: '#ffffff',
        uploadedImage: null,
        uploadedFileName: 'Geometric_Grid_2024.svg',
        uploadedFileSize: 'Vector Layer • Scaled at 100%',
        selectedSymbolId: 'geometric-grid',
        backPrintActive: false,
        backTextString: 'SHABEENA STUDIO // DROP 04',
        zoom: 100,
        gridVisible: true,
        activeTab: 'artwork',
        placementX: 0,
        placementY: 0,
        rotation: 0,
      },

      setCustomProjectSilhouette: (id) => {
        const sil = SILHOUETTES.find((s) => s.id === id) || defaultSilhouette;
        set((state) => ({
          customProject: {
            ...state.customProject,
            silhouetteId: id,
            color: sil.colors[0],
            size: sil.sizes.includes(state.customProject.size) ? state.customProject.size : sil.sizes[0],
          },
        }));
      },

      setCustomProjectColor: (color) => {
        set((state) => ({
          customProject: { ...state.customProject, color },
        }));
      },

      setCustomProjectSize: (size) => {
        set((state) => ({
          customProject: { ...state.customProject, size },
        }));
      },

      setCustomProjectView: (view) => {
        set((state) => ({
          customProject: { ...state.customProject, currentView: view },
        }));
      },

      setCustomProjectQuantity: (qty) => {
        if (qty < 1) return;
        set((state) => ({
          customProject: { ...state.customProject, quantity: qty },
        }));
      },

      setCustomProjectText: (text) => {
        set((state) => ({
          customProject: { ...state.customProject, textString: text },
        }));
      },

      setCustomProjectFont: (font) => {
        set((state) => ({
          customProject: { ...state.customProject, fontFamily: font },
        }));
      },

      setCustomProjectTextAlign: (align) => {
        set((state) => ({
          customProject: { ...state.customProject, textAlign: align },
        }));
      },

      setCustomProjectTextScale: (scale) => {
        set((state) => ({
          customProject: { ...state.customProject, textScale: scale },
        }));
      },

      setCustomProjectInkColor: (color) => {
        set((state) => ({
          customProject: { ...state.customProject, inkColor: color },
        }));
      },

      setCustomProjectUpload: (image, name, size) => {
        set((state) => ({
          customProject: {
            ...state.customProject,
            uploadedImage: image,
            uploadedFileName: name || null,
            uploadedFileSize: size || null,
          },
        }));
      },

      setCustomProjectSymbol: (symbolId) => {
        set((state) => ({
          customProject: {
            ...state.customProject,
            selectedSymbolId: symbolId,
          },
        }));
      },

      setCustomProjectBackPrint: (active) => {
        set((state) => ({
          customProject: { ...state.customProject, backPrintActive: active },
        }));
      },

      setCustomProjectBackText: (text) => {
        set((state) => ({
          customProject: { ...state.customProject, backTextString: text },
        }));
      },

      setCustomProjectZoom: (zoom) => {
        const bounded = Math.max(70, Math.min(150, zoom));
        set((state) => ({
          customProject: { ...state.customProject, zoom: bounded },
        }));
      },

      toggleCustomProjectGrid: () => {
        set((state) => ({
          customProject: { ...state.customProject, gridVisible: !state.customProject.gridVisible },
        }));
      },

      setCustomProjectTab: (tab) => {
        set((state) => ({
          customProject: { ...state.customProject, activeTab: tab },
        }));
      },

      setCustomPlacement: (x, y) => {
        set((state) => ({
          customProject: { ...state.customProject, placementX: x, placementY: y },
        }));
      },

      setCustomRotation: (rot) => {
        set((state) => ({
          customProject: { ...state.customProject, rotation: rot },
        }));
      },

      resetCustomArtwork: () => {
        set((state) => ({
          customProject: {
            ...state.customProject,
            uploadedImage: null,
            uploadedFileName: null,
            uploadedFileSize: null,
            selectedSymbolId: null,
            textString: 'NOT AVAILABLE IN STORES',
            placementX: 0,
            placementY: 0,
            rotation: 0,
          },
        }));
      },

      // Modals
      isSizeChartOpen: false,
      setSizeChartOpen: (open) => set({ isSizeChartOpen: open }),
      isSpecSheetOpen: false,
      setSpecSheetOpen: (open) => set({ isSpecSheetOpen: open }),
      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      isCheckoutOpen: false,
      setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      isPreviewModalOpen: false,
      setPreviewModalOpen: (open) => set({ isPreviewModalOpen: open }),
    }),
    {
      name: 'shabeena-studio-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        customProject: state.customProject,
      }),
    }
  )
);

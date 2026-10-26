"use client";
import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryMatrix } from './components/CategoryMatrix';
import { ProductGrid } from './components/ProductGrid';
import { CustomizerPromo } from './components/CustomizerPromo';
import { PrecisionProtocol } from './components/PrecisionProtocol';
import { TrustGrid } from './components/TrustGrid';
import { CommunityReviews } from './components/CommunityReviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CustomStudio } from './components/studio/CustomStudio';
import { CartDrawer } from './components/modals/CartDrawer';
import { WishlistDrawer } from './components/modals/WishlistDrawer';
import { SizeChartModal } from './components/modals/SizeChartModal';
import { SpecSheetModal } from './components/modals/SpecSheetModal';
import { QuickViewModal } from './components/modals/QuickViewModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { SearchModal } from './components/modals/SearchModal';
import { StudioPreviewModal } from './components/modals/StudioPreviewModal';

export default function App() {
  const { activeScreen, isSearchOpen, setSearchOpen } = useStore();

  // Keyboard shortcut: Cmd/Ctrl + K to open search, ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  return (
    <div className="min-h-screen bg-[#f9f9f7] text-[#1a1c1b] font-sans antialiased selection:bg-[#ff5a36] selection:text-white">
      {activeScreen === 'studio' ? (
        /* SCREEN 2: CUSTOM PRODUCT DESIGNER WORKBENCH */
        <CustomStudio />
      ) : (
        /* SCREEN 1: HOMEPAGE & EDITORIAL STOREFRONT */
        <div className="flex flex-col min-h-screen">
          <AnnouncementBar />
          <Header />
          <main className="flex-1">
            <Hero />
            <CategoryMatrix />
            <ProductGrid />
            <CustomizerPromo />
            <PrecisionProtocol />
            <TrustGrid />
            <CommunityReviews />
            <Newsletter />
          </main>
          <Footer />
        </div>
      )}

      {/* Global Interactive Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <SizeChartModal />
      <SpecSheetModal />
      <QuickViewModal />
      <CheckoutModal />
      <SearchModal />
      <StudioPreviewModal />
    </div>
  );
}

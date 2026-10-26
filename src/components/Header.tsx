import Link from 'next/link';
import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    setActiveScreen,
    activeScreen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const scrollToSection = (id: string) => {
    if (activeScreen !== 'home') {
      setActiveScreen('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#f9f9f7]/90 backdrop-blur-md text-[#b52603] top-0 sticky z-40 border-b border-[#e2e3e1] transition-all duration-200 ease-out">
      <div className="w-full px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Brand Logo / Wordmark */}
        <button
          onClick={() => setActiveScreen('home')}
          className="text-lg md:text-xl font-bold tracking-widest uppercase text-[#1a1c1b] hover:opacity-90 transition-opacity font-display flex items-center gap-1.5"
        >
          <span>SHABEENA STUDIO</span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('featured-collection')}
            className="text-[#1a1c1b] font-semibold text-sm hover:text-[#ff5a36] transition-colors duration-150"
          >
            Shop
          </button>
          <Link
            href="/shop/category/t-shirts"
            className="text-[#5b403a] font-medium hover:text-[#1a1c1b] transition-colors duration-150 text-sm"
          >
            T-Shirts
          </Link>

          <Link
            href="/shop/category/hoodies"
            className="text-[#5b403a] font-medium hover:text-[#1a1c1b] transition-colors duration-150 text-sm"
          >
            Hoodies
          </Link>
          <button
            onClick={() => setActiveScreen('studio')}
            className="text-[#5b403a] font-medium hover:text-[#1a1c1b] transition-colors duration-150 text-sm flex items-center gap-1.5"
          >
            <span>Custom Studio</span>
            <span className="bg-[#ff5a36] text-white font-mono text-[9px] px-1.5 py-0.5 rounded tracking-wider uppercase font-bold">
              LAB
            </span>
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-[#5b403a] font-medium hover:text-[#1a1c1b] transition-colors duration-150 text-sm"
          >
            Our Story
          </button>
        </nav>

        {/* Trailing Action Icons */}
        <div className="flex items-center space-x-4 sm:space-x-5 text-[#1a1c1b]">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search catalog"
            className="hover:text-[#ff5a36] transition-colors duration-150 flex items-center cursor-pointer p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={() => setActiveScreen('studio')}
            aria-label="Custom Atelier Studio"
            className="hover:text-[#ff5a36] transition-colors duration-150 hidden sm:flex items-center gap-1 text-xs font-mono font-semibold uppercase text-[#5b403a] border border-[#e2e3e1] px-2 py-1 rounded-sm bg-white hover:border-[#1a1c1b]"
            type="button"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a36]" />
            <span>Open Studio</span>
          </button>

          <Link href="/account" aria-label="Sign in or manage account" className="hover:text-[#ff5a36] transition-colors text-sm font-semibold whitespace-nowrap">Account</Link>
          <button
            onClick={() => setWishlistOpen(true)}
            aria-label="Wishlist"
            className="relative hover:text-[#ff5a36] transition-colors duration-150 flex items-center cursor-pointer p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {totalWishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1a1c1b] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {totalWishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Shopping Bag"
            className="relative hover:text-[#ff5a36] transition-colors duration-150 flex items-center cursor-pointer p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff5a36] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1a1c1b] p-1 flex items-center"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f9f9f7] border-b border-[#e2e3e1] px-4 py-4 space-y-3">
          <button
            onClick={() => scrollToSection('featured-collection')}
            className="block w-full text-left font-medium text-sm text-[#1a1c1b] py-1"
          >
            Shop Collection
          </button>
          <Link
            href="/shop/category/t-shirts"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-sm text-[#5b403a] py-1"
          >
            T-Shirts
          </Link>

          <Link
            href="/shop/category/hoodies"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-sm text-[#5b403a] py-1"
          >
            Hoodies
          </Link>
          <button
            onClick={() => {
              setActiveScreen('studio');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-semibold text-sm text-[#ff5a36] py-1 flex items-center justify-between"
          >
            <span>Custom Studio Workbench</span>
            <span className="bg-[#ff5a36] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
              LAB
            </span>
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left font-medium text-sm text-[#5b403a] py-1"
          >
            The Precision Protocol
          </button>
        </div>
      )}
    </header>
  );
};

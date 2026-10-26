import React from 'react';
import { useStore } from '../store/useStore';

export const Footer: React.FC = () => {
  const { setActiveScreen, setSizeChartOpen, setSpecSheetOpen } = useStore();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-xs text-[#5f5e5e] border-t border-[#e2e3e1] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#e2e3e1]">
          {/* Brand Narrative Column */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => setActiveScreen('home')}
              className="text-lg md:text-xl font-bold tracking-widest uppercase text-[#1a1c1b] block font-display text-left"
            >
              SHABEENA STUDIO
            </button>
            <p className="text-sm text-[#5f5e5e] max-w-sm leading-relaxed">
              Contemporary minimalist streetwear and custom garment atelier based in India. Blending Japanese structural silhouettes with precision printing technologies.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-[#1a1c1b]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff5a36] transition-colors text-xs font-mono tracking-wider uppercase font-bold"
              >
                IG / @shabeenastudio
              </a>
              <span className="text-[#dadad8]">•</span>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff5a36] transition-colors text-xs font-mono tracking-wider uppercase font-bold"
              >
                X / @shabeenahq
              </a>
            </div>
          </div>

          {/* Links Matrix Column */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h5 className="font-mono text-xs tracking-widest text-[#1a1c1b] uppercase font-semibold mb-4">
                Storefront
              </h5>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => scrollToSection('featured-collection')}
                    className="text-[#5b403a] hover:text-[#ff5a36] transition-colors text-left"
                  >
                    Shop All
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveScreen('studio')}
                    className="text-[#5b403a] hover:text-[#ff5a36] transition-colors text-left"
                  >
                    Custom Studio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="text-[#5b403a] hover:text-[#ff5a36] transition-colors text-left"
                  >
                    Size Guide &amp; Fabric Care
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSpecSheetOpen(true)}
                    className="text-[#5b403a] hover:text-[#ff5a36] transition-colors text-left"
                  >
                    Print Spec Sheet
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-xs tracking-widest text-[#1a1c1b] uppercase font-semibold mb-4">
                Logistics
              </h5>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <span className="text-[#5b403a]">PAN-India Shipping</span>
                </li>
                <li>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5b403a] hover:text-[#ff5a36] transition-colors"
                  >
                    WhatsApp Concierge
                  </a>
                </li>
                <li>
                  <span className="text-[#5b403a]">BlueDart &amp; Delhivery Express</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-xs tracking-widest text-[#1a1c1b] uppercase font-semibold mb-4">
                Legal
              </h5>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#privacy" className="text-[#5b403a] hover:text-[#ff5a36] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-[#5b403a] hover:text-[#ff5a36] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#returns" className="text-[#5b403a] hover:text-[#ff5a36] transition-colors">
                    Returns &amp; Exchange
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#5f5e5e] text-xs">
            © 2024 SHABEENA STUDIO. Crafted with precision for India. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#5f5e5e]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              UPI / Cards / NetBanking Supported
            </span>
            <span className="text-[#dadad8]">•</span>
            <span>Fast PAN-India Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

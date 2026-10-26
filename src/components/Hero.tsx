import React from 'react';
import { useStore } from '../store/useStore';

export const Hero: React.FC = () => {
  const { setActiveScreen } = useStore();

  const scrollToCollection = () => {
    const el = document.getElementById('featured-collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#f9f9f7] overflow-hidden border-b border-[#e2e3e1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Focus */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-[1px] bg-[#ff5a36]" />
              <span className="font-mono text-[10px] sm:text-xs tracking-widest text-[#5b403a] uppercase font-semibold">
                NEW SEASON / MONOCHROME &amp; STATEMENTS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1a1c1b] tracking-tighter uppercase leading-[0.95] font-display">
              WEAR WHAT
              <br />
              YOU THINK.
            </h1>

            <p className="text-base sm:text-lg text-[#5f5e5e] max-w-xl font-normal leading-relaxed">
              Original statements. Your own creations. Heavyweight 240 GSM French Terry and combed cotton crafted to stand out in the streets.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={scrollToCollection}
                className="h-[52px] px-8 bg-[#2f3130] hover:bg-black text-[#f1f1ef] text-sm font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm cursor-pointer"
              >
                <span>Shop The Collection</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => setActiveScreen('studio')}
                className="h-[52px] px-8 bg-white border-2 border-[#ff5a36] text-[#1a1c1b] hover:bg-[#f4f4f2] text-sm font-semibold rounded-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#ff5a36]" />
                <span>Create Your Own Studio</span>
              </button>
            </div>

            {/* Trust Metas */}
            <div className="pt-6 border-t border-[#e2e3e1] flex flex-wrap items-center gap-y-2 gap-x-6 text-[#5b403a] text-[11px] font-mono tracking-wider uppercase font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ff5a36]">check_circle</span>
                <span>240 GSM Heavyweight Combed Cotton</span>
              </div>
              <span className="hidden sm:inline text-[#dadad8]">•</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ff5a36]">check_circle</span>
                <span>Screen &amp; DTF Japanese Pigments</span>
              </div>
              <span className="hidden sm:inline text-[#dadad8]">•</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ff5a36]">check_circle</span>
                <span>Pan-India Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Mockup & Atelier Spec */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white p-4 md:p-6 border border-[#e2e3e1] shadow-sm">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f2] flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  alt="Silence is Luxury Streetwear Lookbook"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAatnxRTmAEMj4EXljhY-9yyEtJE6Wsc7LuEqR7Iw0B1nCYCjYQOUNIHeerC7eTeWiUYb8olQzn06Jfl_hT6J-mIuMuv7Y-0A1fl2dPtW9ss8nws3_vnSpzEI8Cpwi-h1x7ZtItkOxAxBt0oKl7FtE1TYMHCZ35eRrYlIvPP78lVBeNyolK8WOSdG_8WrBDjrhwZPz4XK7BHRPIPmk1-op_ASiJkPmnpqtJeAXYL36bTNROl8mvw1E"
                />

                {/* Floating Graphic Overlay Tag */}
                <div className="absolute top-4 left-4 bg-[#2f3130]/90 text-[#f1f1ef] px-3 py-1 text-[10px] tracking-widest uppercase font-mono font-semibold">
                  Statement Tee // 01
                </div>

                {/* Floating Spec Tag Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-[#e2e3e1] px-3 py-2 text-left shadow-sm">
                  <div className="text-[9px] tracking-widest text-[#ff5a36] uppercase font-semibold font-mono">
                    Drop 04 // Studio Limited
                  </div>
                  <div className="text-sm font-semibold text-[#1a1c1b] font-display">
                    SILENCE IS LUXURY
                  </div>
                  <div className="text-[11px] text-[#5f5e5e]">Heavy French Combed Terry • Boxy Fit</div>
                </div>
              </div>
            </div>

            {/* Industrial Accent Lines */}
            <div className="hidden sm:flex absolute -bottom-3 -left-3 bg-[#f9f9f7] border border-[#e2e3e1] px-3 py-1 items-center gap-2 text-[#5b403a] font-mono text-[9px] tracking-widest uppercase font-semibold">
              <span className="w-1.5 h-1.5 bg-[#ff5a36] rounded-full" />
              Architectural Standard 1.0
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

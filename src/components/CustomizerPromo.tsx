import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export const CustomizerPromo: React.FC = () => {
  const { setActiveScreen, setCustomProjectText } = useStore();
  const [promoText, setPromoText] = useState('NO BAD VIBES');

  const handleLaunchStudio = () => {
    if (promoText) {
      setCustomProjectText(promoText);
    }
    setActiveScreen('studio');
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#e2e3e1]" id="custom-studio-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5a36]" />
              <span className="font-mono text-xs tracking-widest text-[#ff5a36] uppercase font-semibold">
                LAB 01 / ON-DEMAND ATELIER
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1c1b] tracking-tight uppercase leading-[0.98] font-display">
              YOUR IDEA.
              <br />
              YOUR STYLE.
            </h2>

            <p className="text-base sm:text-lg text-[#5f5e5e] leading-relaxed">
              Upload your design, add your words, and turn something ordinary into something completely yours. Single piece orders or bulk crew merchandise with zero setup fees.
            </p>

            {/* Feature Bullet List */}
            <ul className="space-y-3 pt-2 text-sm text-[#1a1c1b]">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#e2e3e1] flex items-center justify-center text-[#ff5a36] font-bold text-xs">
                  ✓
                </span>
                <span>Direct-To-Film (DTF) &amp; High-Density Screen Printing</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#e2e3e1] flex items-center justify-center text-[#ff5a36] font-bold text-xs">
                  ✓
                </span>
                <span>No minimum order quantity (MOQ: 1 Unit)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#e2e3e1] flex items-center justify-center text-[#ff5a36] font-bold text-xs">
                  ✓
                </span>
                <span>Free 300+ DPI vector file prep &amp; visual review</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={handleLaunchStudio}
                className="h-[52px] inline-flex items-center justify-center px-8 bg-[#ff5a36] hover:bg-[#e84a27] text-white font-semibold text-sm rounded-sm shadow-md transition-colors duration-150 cursor-pointer"
              >
                Launch Custom Studio →
              </button>
              <p className="font-mono text-[10px] text-[#5f5e5e] tracking-wider uppercase mt-2.5">
                ⚡ Instant live 3D preview • Same day production dispatch available
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Apparel Customizer Preview */}
          <div className="lg:col-span-7">
            <div className="bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm p-4 md:p-6 shadow-sm">
              {/* Customizer Toolbar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e3e1] text-xs font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[#1a1c1b] font-semibold">
                    <span className="material-symbols-outlined text-[18px]">palette</span>
                    Blank: Heavy Tee
                  </span>
                  <span className="text-[#dadad8]">|</span>
                  <span className="text-[#5f5e5e]">Color: Washed Bone</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#5f5e5e] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  300 DPI Vector Ready
                </div>
              </div>

              {/* Canvas Workspace with Bounding Box Overlay */}
              <div className="relative my-4 aspect-[4/3] bg-[#f4f4f2] border border-dashed border-[#e2e3e1] flex items-center justify-center overflow-hidden customizer-grid-pattern">
                {/* Center Garment Graphic */}
                <div className="relative w-64 md:w-80 h-auto flex flex-col items-center">
                  <img
                    className="w-full object-contain filter drop-shadow-md select-none"
                    alt="Blank washed bone heavyweight t-shirt"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh9o7ygGtvCYcX_paLNV6KOASb7jAreSRs18MJSOZLfnMlE-wbyEZQuq5_T8nbXAOb-iDVzawJybsG37YobZlUkDP5iAj3V5kz7Y-i8TVZrPZuxIzyCpG2J4xJ7FYSKeys16z8n3Y3QPeuIb-bKQK8LUodncXBhocueCreZ_lD3QdnMDXuSEQ-hc7Y4HgmzYosg57qPHMZcY7-FlzU1W-4HafU8R27AlSreKmW2UbqiFnggeEFF_4"
                  />

                  {/* Interactive Printable Bounding Box */}
                  <div
                    onClick={handleLaunchStudio}
                    className="absolute top-[28%] w-[52%] h-[40%] border-2 border-[#ff5a36] bg-[#ff5a36]/5 flex flex-col items-center justify-center text-center p-2 cursor-pointer group hover:bg-[#ff5a36]/10 transition-colors"
                  >
                    <span className="font-bold text-[#1a1c1b] text-xs md:text-sm tracking-widest uppercase font-display">
                      {promoText}
                    </span>
                    <span className="font-mono text-[8px] text-[#ff5a36] uppercase mt-1 tracking-wider font-semibold">
                      Print Box Safe (12" x 14")
                    </span>

                    {/* Drag Handles */}
                    <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#ff5a36]" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#ff5a36]" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#ff5a36]" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#ff5a36]" />
                  </div>
                </div>

                {/* Floating Canvas Controls */}
                <div className="absolute bottom-3 left-3 bg-white border border-[#e2e3e1] px-3 py-1.5 flex items-center gap-3 text-xs shadow-sm">
                  <span className="text-[#1a1c1b] font-medium">Placement: Chest Center</span>
                  <span className="text-[#dadad8]">/</span>
                  <span className="text-[#5f5e5e] font-mono">X: 0mm Y: +45mm</span>
                </div>
              </div>

              {/* Upload Selector Dock */}
              <div className="p-3 bg-white border border-[#e2e3e1] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-sm bg-[#f4f4f2] border border-[#e2e3e1] flex items-center justify-center text-[#5b403a]">
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1a1c1b]">Upload Art / Typeset Text</div>
                    <div className="font-mono text-[10px] text-[#5f5e5e]">
                      SVG, AI, High-Res PNG (Min 300 DPI)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleLaunchStudio}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#e2e3e1] hover:border-[#1a1c1b] bg-[#f9f9f7] transition-colors"
                    type="button"
                  >
                    Add Text
                  </button>
                  <button
                    onClick={handleLaunchStudio}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1a1c1b] text-white hover:bg-black transition-colors"
                    type="button"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

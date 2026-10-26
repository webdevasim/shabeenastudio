import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SILHOUETTES, PRESET_SYMBOLS } from '../../data/products';

export const StudioPreviewModal: React.FC = () => {
  const {
    isPreviewModalOpen,
    setPreviewModalOpen,
    customProject,
    addToCart,
  } = useStore();

  const [previewView, setPreviewView] = useState<'front' | 'back'>('front');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isPreviewModalOpen) return null;

  const currentSil =
    SILHOUETTES.find((s) => s.id === customProject.silhouetteId) || SILHOUETTES[0];
  const activeSymbol = PRESET_SYMBOLS.find((s) => s.id === customProject.selectedSymbolId);

  const mockImage =
    previewView === 'back'
      ? currentSil.mockupImages.back
      : currentSil.mockupImages.front;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleAddToBag = () => {
    addToCart({
      id: `custom-${Date.now()}`,
      isCustom: true,
      title: `Custom ${currentSil.name}: ${customProject.textString.slice(0, 24)}...`,
      silhouetteName: currentSil.name,
      price: currentSil.basePrice + currentSil.printPrice + (customProject.backPrintActive ? 400 : 0),
      quantity: customProject.quantity,
      size: customProject.size,
      colorName: customProject.color.name,
      colorHex: customProject.color.hex,
      image: currentSil.mockupImages.front,
      specsSummary: `${currentSil.gsm} • DTF High-Density`,
    });
    setPreviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setPreviewModalOpen(false)}
      />

      <div className="relative w-full max-w-3xl bg-[#f9f9f7] rounded-sm shadow-2xl border border-[#e2e3e1] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e3e1] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5a36] text-xl">visibility</span>
            <h3 className="text-base font-bold text-[#1a1c1b] font-display uppercase tracking-tight">
              Photorealistic Atelier Mockup
            </h3>
          </div>
          <button
            onClick={() => setPreviewModalOpen(false)}
            className="w-8 h-8 rounded-sm hover:bg-[#eeeeec] flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* View Switcher Controls */}
        <div className="p-3 bg-[#f4f4f2] border-b border-[#e2e3e1] flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewView('front')}
              className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${
                previewView === 'front' ? 'bg-[#2f3130] text-white' : 'bg-white text-[#1a1c1b] border border-[#e2e3e1]'
              }`}
            >
              Front Angle
            </button>
            <button
              onClick={() => setPreviewView('back')}
              className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${
                previewView === 'back' ? 'bg-[#2f3130] text-white' : 'bg-white text-[#1a1c1b] border border-[#e2e3e1]'
              }`}
            >
              Back Angle
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5f5e5e] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>300 DPI DTF HD Matrix</span>
          </div>
        </div>

        {/* Photorealistic Center Showcase */}
        <div className="relative aspect-[4/3] bg-[#eeeeec] flex items-center justify-center p-6 overflow-hidden">
          <div className="relative w-full max-w-[420px] aspect-[3/4] flex items-center justify-center">
            {/* Garment Image */}
            <img
              src={mockImage}
              alt="Custom Garment Mockup"
              className="w-full h-full object-contain filter drop-shadow-lg"
              style={{ filter: customProject.color.filterStyle || 'none' }}
            />

            {/* Custom Artwork Overlay */}
            <div
              className="absolute z-10 p-2 flex flex-col items-center justify-center text-center select-none"
              style={{
                color: customProject.inkColor,
                transform: `translate(${customProject.placementX * 0.75}px, ${customProject.placementY * 0.75}px) rotate(${customProject.rotation}deg)`,
              }}
            >
              {customProject.uploadedImage ? (
                <img
                  src={customProject.uploadedImage}
                  alt="Upload"
                  className="max-h-20 object-contain drop-shadow"
                />
              ) : activeSymbol ? (
                <div
                  className="w-20 h-10 mb-1"
                  dangerouslySetInnerHTML={{ __html: activeSymbol.svg }}
                />
              ) : (
                <div className="w-20 h-10 mb-1 border border-current grid grid-cols-4 grid-rows-2 relative overflow-hidden">
                  <div className="border-r border-b border-current/40" />
                  <div className="border-r border-b border-current/40 bg-current/20" />
                  <div className="border-r border-b border-current/40" />
                  <div className="border-b border-current/40 bg-current/10" />
                  <div className="border-r border-current/40 bg-current/30" />
                  <div className="border-r border-current/40" />
                  <div className="border-r border-current/40 bg-current/20" />
                  <div className="border-current/40" />
                </div>
              )}

              <h3
                className="font-bold uppercase tracking-tight leading-tight max-w-[180px]"
                style={{
                  fontSize: `${Math.max(10, customProject.textScale * 0.35)}px`,
                  fontFamily: customProject.fontFamily,
                  textAlign: customProject.textAlign,
                }}
              >
                {previewView === 'back' && customProject.backPrintActive
                  ? customProject.backTextString
                  : customProject.textString}
              </h3>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#e2e3e1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#5f5e5e]">
              {customProject.color.name} • Size {customProject.size} • {currentSil.gsm.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 border border-[#e2e3e1] hover:border-[#1a1c1b] text-[#1a1c1b] text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>{downloadSuccess ? 'Downloaded!' : 'Save Mockup PNG'}</span>
            </button>
            <button
              onClick={handleAddToBag}
              className="px-5 py-2 bg-[#ff5a36] hover:bg-[#e84a27] text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

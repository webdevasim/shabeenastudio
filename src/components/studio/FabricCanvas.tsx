import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { SILHOUETTES, PRESET_SYMBOLS } from '../../data/products';

interface FabricCanvasProps {
  onCaptureThumbnail?: (dataUrl: string) => void;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({ onCaptureThumbnail }) => {
  const {
    customProject,
    setCustomPlacement,
    setCustomRotation,
    resetCustomArtwork,
  } = useStore();

  const currentSilhouette =
    SILHOUETTES.find((s) => s.id === customProject.silhouetteId) || SILHOUETTES[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // Scaling state
  const [isScaling, setIsScaling] = useState(false);
  const [scaleStart, setScaleStart] = useState({ x: 0, scale: 1 });
  const [localScale, setLocalScale] = useState(1);

  // Rotating state
  const [isRotating, setIsRotating] = useState(false);

  // Active symbol SVG
  const activeSymbol = PRESET_SYMBOLS.find((s) => s.id === customProject.selectedSymbolId);

  // Current mockup image based on view
  const currentMockup =
    customProject.currentView === 'back'
      ? currentSilhouette.mockupImages.back
      : currentSilhouette.mockupImages.front;

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking on the artwork body, not buttons/handles
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.classList.contains('transformer-handle')) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: customProject.placementX, y: customProject.placementY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.classList.contains('transformer-handle')) {
      return;
    }
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setInitialPos({ x: customProject.placementX, y: customProject.placementY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        // Restrict drag inside safe bounds approx
        const newX = Math.max(-140, Math.min(140, initialPos.x + dx));
        const newY = Math.max(-120, Math.min(120, initialPos.y + dy));
        setCustomPlacement(newX, newY);
      } else if (isScaling) {
        const delta = (e.clientX - scaleStart.x) * 0.005;
        const newScale = Math.max(0.6, Math.min(1.8, scaleStart.scale + delta));
        setLocalScale(newScale);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const dx = touch.clientX - dragStart.x;
        const dy = touch.clientY - dragStart.y;
        const newX = Math.max(-140, Math.min(140, initialPos.x + dx));
        const newY = Math.max(-120, Math.min(120, initialPos.y + dy));
        setCustomPlacement(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsScaling(false);
      setIsRotating(false);
    };

    if (isDragging || isScaling || isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isScaling, isRotating, dragStart, initialPos, scaleStart, setCustomPlacement]);

  const handleStartScale = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScaling(true);
    setScaleStart({ x: e.clientX, scale: localScale });
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomRotation((customProject.rotation + 45) % 360);
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8 bg-[#f6f6f3] select-none ${
        customProject.gridVisible ? 'grid-pattern' : ''
      }`}
      id="canvasViewport"
    >
      {/* Scalable Garment Mockup Container */}
      <div
        className="relative w-full max-w-[480px] sm:max-w-[530px] md:max-w-[560px] aspect-[3/4] flex items-center justify-center transition-transform duration-150"
        style={{
          transform: `scale(${customProject.zoom / 100})`,
        }}
        id="garmentContainer"
      >
        {/* Garment Base Layer Image */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <img
            src={currentMockup}
            alt={currentSilhouette.name}
            className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
            style={{
              filter: customProject.color.filterStyle || 'none',
            }}
          />

          {/* Color Tint Blend (Subtle realistic fabric tinting) */}
          {customProject.color.hex !== '#1e1e1e' && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-color opacity-35"
              style={{ backgroundColor: customProject.color.hex }}
            />
          )}
        </div>

        {/* PRINT-SAFE AREA BOUNDARY (12" x 16" bounds) */}
        <div
          ref={boundaryRef}
          className="relative z-10 w-[58%] h-[56%] -mt-6 border-2 border-dashed border-[#ff5a36]/80 rounded-sm flex items-center justify-center p-2 bg-[#ff5a36]/[0.02]"
          id="printBoundary"
        >
          {/* Safe Area Top Badge */}
          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-[#2f3130] text-[#f1f1ef] text-[9px] font-mono tracking-widest uppercase rounded-sm border border-[#e2e3e1] shadow-sm z-30">
            {currentSilhouette.printSafeDims.label}
          </div>

          {/* Dimension Guides */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-mono text-[#5f5e5e] tracking-widest uppercase">
            {currentSilhouette.printSafeDims.heightCm}
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#5f5e5e] tracking-widest uppercase">
            {currentSilhouette.printSafeDims.widthCm}
          </div>

          {/* Active Interactive Artwork Layer with Transformer Handles */}
          <div
            ref={artworkRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              transform: `translate(${customProject.placementX}px, ${customProject.placementY}px) scale(${localScale}) rotate(${customProject.rotation}deg)`,
              color: customProject.inkColor,
            }}
            className={`relative z-20 p-3 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            } border border-[#ff5a36] bg-black/[0.04] transition-shadow shadow-sm group select-none`}
            id="artworkElement"
          >
            {/* Transformer Pin: Top-Left Scale */}
            <div
              onMouseDown={handleStartScale}
              title="Scale Artwork"
              className="transformer-handle absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-[#ff5a36] rounded-sm shadow-sm hover:scale-125 transition-transform cursor-nwse-resize z-30"
            />

            {/* Transformer Pin: Top-Right Rotate Badge */}
            <button
              onClick={handleRotate}
              title="Rotate Artwork (+45°)"
              className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-[#2f3130] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ff5a36] transition-colors cursor-pointer z-30"
            >
              <span className="material-symbols-outlined text-[13px]">refresh</span>
            </button>

            {/* Transformer Pin: Bottom-Left Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetCustomArtwork();
              }}
              title="Reset Artwork"
              className="absolute -bottom-3.5 -left-3.5 w-6 h-6 bg-white border border-[#e2e3e1] text-[#ba1a1a] rounded-full flex items-center justify-center shadow-md hover:bg-[#ba1a1a] hover:text-white transition-colors cursor-pointer z-30"
            >
              <span className="material-symbols-outlined text-[13px]">close</span>
            </button>

            {/* Transformer Pin: Bottom-Right Scale */}
            <div
              onMouseDown={handleStartScale}
              title="Scale Artwork"
              className="transformer-handle absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-[#ff5a36] rounded-sm shadow-sm hover:scale-125 transition-transform cursor-nwse-resize z-30"
            />

            {/* Graphic Vector & Typography Motif */}
            <div className="flex flex-col items-center justify-center text-center p-2 select-none pointer-events-none drop-shadow">
              {/* Uploaded Image or Preset Symbol Motif */}
              {customProject.uploadedImage ? (
                <div className="max-w-[160px] max-h-[100px] mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={customProject.uploadedImage}
                    alt="Custom Upload"
                    className="max-h-24 object-contain filter drop-shadow"
                  />
                </div>
              ) : activeSymbol ? (
                <div
                  className="w-24 h-12 mb-2 flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: activeSymbol.svg }}
                />
              ) : (
                /* Default Geometric Brutalist Wireframe Motif */
                <div className="w-24 h-12 mb-2 border border-current grid grid-cols-4 grid-rows-2 relative overflow-hidden">
                  <div className="border-r border-b border-current/40" />
                  <div className="border-r border-b border-current/40 bg-current/20" />
                  <div className="border-r border-b border-current/40" />
                  <div className="border-b border-current/40 bg-current/10" />
                  <div className="border-r border-current/40 bg-current/30" />
                  <div className="border-r border-current/40" />
                  <div className="border-r border-current/40 bg-current/20" />
                  <div className="border-current/40" />
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] tracking-widest text-current/90">
                    SHB-240-IND
                  </div>
                </div>
              )}

              {/* Live Design Text */}
              <h2
                className="font-bold uppercase tracking-tight leading-tight max-w-[220px] transition-all"
                style={{
                  fontSize: `${Math.max(12, customProject.textScale * 0.45)}px`,
                  fontFamily: customProject.fontFamily,
                  textAlign: customProject.textAlign,
                }}
              >
                {customProject.currentView === 'back' && customProject.backPrintActive
                  ? customProject.backTextString || 'BACK PRINT ARCHIVE'
                  : customProject.textString || 'NOT AVAILABLE IN STORES'}
              </h2>

              {/* Accent Subtitle Motif */}
              <div className="mt-1 flex items-center gap-2">
                <span className="h-[1px] w-5 bg-current opacity-60" />
                <p className="font-mono text-[9px] uppercase tracking-widest text-current/90 font-semibold">
                  NEW DELHI 2024
                </p>
                <span className="h-[1px] w-5 bg-current opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Studio Placement Alignment Crosshairs */}
        <div className="absolute inset-x-0 top-1/2 border-t border-[#5f5e5e]/15 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 border-l border-[#5f5e5e]/15 pointer-events-none" />
      </div>
    </div>
  );
};

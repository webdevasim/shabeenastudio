import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { SILHOUETTES, PRESET_SYMBOLS, FONT_OPTIONS } from '../../data/products';
import { FabricCanvas } from './FabricCanvas';
import { SilhouetteId, ViewAngle } from '../../types';

export const CustomStudio: React.FC = () => {
  const {
    customProject,
    setCustomProjectSilhouette,
    setCustomProjectColor,
    setCustomProjectSize,
    setCustomProjectView,
    setCustomProjectQuantity,
    setCustomProjectText,
    setCustomProjectFont,
    setCustomProjectTextAlign,
    setCustomProjectTextScale,
    setCustomProjectInkColor,
    setCustomProjectUpload,
    setCustomProjectSymbol,
    setCustomProjectBackPrint,
    setCustomProjectBackText,
    setCustomProjectZoom,
    toggleCustomProjectGrid,
    setCustomProjectTab,
    setCustomPlacement,
    setActiveScreen,
    setSizeChartOpen,
    setSpecSheetOpen,
    setPreviewModalOpen,
    addToCart,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const currentSilhouette =
    SILHOUETTES.find((s) => s.id === customProject.silhouetteId) || SILHOUETTES[0];

  // Pricing calculations
  const basePrice = currentSilhouette.basePrice;
  const frontPrintPrice = currentSilhouette.printPrice;
  const backPrintPrice = customProject.backPrintActive ? 400 : 0;
  const unitPrice = basePrice + frontPrintPrice + backPrintPrice;

  // Bulk tier discounts
  let discountRate = 0;
  if (customProject.quantity >= 10) {
    discountRate = 0.25;
  } else if (customProject.quantity >= 3) {
    discountRate = 0.1;
  }

  const discountedUnitPrice = Math.round(unitPrice * (1 - discountRate));
  const totalPrice = discountedUnitPrice * customProject.quantity;

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        setCustomProjectUpload(result, file.name, `${(file.size / 1024).toFixed(1)} KB`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add customized item to cart
  const handleAddToBag = () => {
    addToCart({
      id: `custom-${Date.now()}`,
      isCustom: true,
      title: `Custom ${currentSilhouette.name}: ${customProject.textString.slice(0, 24)}...`,
      silhouetteName: currentSilhouette.name,
      price: discountedUnitPrice,
      quantity: customProject.quantity,
      size: customProject.size,
      colorName: customProject.color.name,
      colorHex: customProject.color.hex,
      image: currentSilhouette.mockupImages.front,
      specsSummary: `${currentSilhouette.gsm} • ${customProject.backPrintActive ? 'Front & Back DTF' : 'Front DTF HD'}`,
      customDetails: {
        textSummary: customProject.textString,
        backPrintIncluded: customProject.backPrintActive,
        gsm: currentSilhouette.gsm,
      },
    });
  };

  const handleSaveDesign = () => {
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const centerArtwork = () => {
    setCustomPlacement(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f7] text-[#1a1c1b]">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* TOP STUDIO TASK HEADER */}
      <header className="sticky top-0 z-40 bg-[#f9f9f7]/95 backdrop-blur-md border-b border-[#e2e3e1] px-4 md:px-6 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => setActiveScreen('home')}
            className="w-9 h-9 rounded-sm border border-[#e2e3e1] flex items-center justify-center bg-white text-[#1a1c1b] hover:border-[#1a1c1b] transition-colors"
            title="Back to Catalog"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm md:text-base text-[#1a1c1b] tracking-tight font-display">
                Custom Project: {customProject.title}
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-sm bg-[#e2e3e1] text-[10px] font-semibold text-[#5b403a] uppercase font-mono">
                D2C V2.4
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5f5e5e]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs">Saved just now</span>
              <span className="text-[#e2e3e1]">•</span>
              <span className="hidden sm:inline text-xs text-[#5b403a] font-mono">
                {currentSilhouette.gsm.split(' ')[0]} {currentSilhouette.gsm.split(' ')[1]} Heavy Cotton
              </span>
            </div>
          </div>
        </div>

        {/* Center Studio Status Tag */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#f4f4f2] rounded-sm border border-[#e2e3e1]">
          <span className="material-symbols-outlined text-[#ff5a36] text-base">verified</span>
          <span className="text-[#1a1c1b] uppercase text-[10px] tracking-wider font-semibold font-mono">
            DTF HD COLOR MATRIX • ACTIVE
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setPreviewModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[#1a1c1b] text-xs font-medium border border-[#e2e3e1] rounded-sm hover:border-[#1a1c1b] bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Preview</span>
          </button>
          <button
            onClick={handleAddToBag}
            className="h-10 px-4 md:px-5 rounded-sm bg-[#ff5a36] hover:bg-[#e84a27] text-white text-sm md:text-base font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span>Add to Bag</span>
            <span className="opacity-40">|</span>
            <span className="font-bold">₹{discountedUnitPrice.toLocaleString('en-IN')}</span>
          </button>
        </div>
      </header>

      {/* TWO-COLUMN STUDIO WORKBENCH */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] mx-auto overflow-hidden">
        {/* LEFT COLUMN: LIVE MOCKUP & CANVAS WORK AREA */}
        <section className="w-full lg:w-[63%] xl:w-[66%] min-h-[550px] lg:min-h-[calc(100vh-4rem)] flex flex-col relative bg-[#f9f9f7] border-r border-[#e2e3e1]">
          {/* Studio Top Canvas Toolbar */}
          <div className="w-full px-4 md:px-6 py-2.5 bg-[#f4f4f2]/70 border-b border-[#e2e3e1] flex items-center justify-between">
            {/* DPI Check Pill */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono">
                  HIGH-RES 300 DPI DETECTED
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-[#5f5e5e]">
                A3 DTF (297 × 420 mm)
              </span>
            </div>

            {/* Zoom, Grid, Center Canvas Controls */}
            <div className="flex items-center gap-1 bg-white border border-[#e2e3e1] rounded-sm p-0.5 shadow-sm">
              <button
                onClick={() => setCustomProjectZoom(customProject.zoom - 10)}
                className="w-7 h-7 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors rounded-sm"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="font-mono text-xs px-2 text-[#1a1c1b] font-medium" id="zoomLevel">
                {customProject.zoom}%
              </span>
              <button
                onClick={() => setCustomProjectZoom(customProject.zoom + 10)}
                className="w-7 h-7 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors rounded-sm"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>

              <div className="w-[1px] h-4 bg-[#e2e3e1] my-auto mx-0.5" />

              <button
                onClick={toggleCustomProjectGrid}
                className={`px-2 h-7 flex items-center gap-1 text-xs transition-colors rounded-sm ${
                  customProject.gridVisible ? 'bg-[#eeeeec] text-[#1a1c1b] font-semibold' : 'text-[#5f5e5e]'
                }`}
                title="Toggle Print Safe Grid"
              >
                <span className="material-symbols-outlined text-[15px]">grid_on</span>
                <span className="text-[11px] font-medium hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={centerArtwork}
                className="w-7 h-7 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors rounded-sm"
                title="Center Artwork Alignment"
              >
                <span className="material-symbols-outlined text-[16px]">filter_center_focus</span>
              </button>
            </div>
          </div>

          {/* Canvas Workspace Area */}
          <FabricCanvas />

          {/* Bottom Floating Perspective & View Switcher Bar */}
          <div className="w-full px-4 py-3 bg-[#f9f9f7] border-t border-[#e2e3e1] flex items-center justify-between">
            {/* View Angle Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setCustomProjectView('front')}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide border flex items-center gap-1.5 shadow-sm transition-all ${
                  customProject.currentView === 'front'
                    ? 'bg-[#2f3130] text-[#f1f1ef] border-[#2f3130]'
                    : 'bg-white text-[#1a1c1b] border-[#e2e3e1] hover:border-[#1a1c1b]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a36]" />
                <span>Front View</span>
              </button>

              <button
                onClick={() => {
                  setCustomProjectView('back');
                  setCustomProjectBackPrint(true);
                }}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  customProject.currentView === 'back'
                    ? 'bg-[#2f3130] text-[#f1f1ef] border-[#2f3130]'
                    : 'bg-white text-[#1a1c1b] border-[#e2e3e1] hover:border-[#1a1c1b]'
                }`}
              >
                <span>Back View</span>
                <span className="text-[10px] text-[#5f5e5e] font-mono">
                  {customProject.backPrintActive ? '₹400' : '₹0'}
                </span>
              </button>

              <button
                onClick={() => setCustomProjectView('sleeve')}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
                  customProject.currentView === 'sleeve'
                    ? 'bg-[#2f3130] text-[#f1f1ef] border-[#2f3130]'
                    : 'bg-white text-[#1a1c1b] border-[#e2e3e1] hover:border-[#1a1c1b]'
                }`}
              >
                <span>Left Sleeve</span>
              </button>

              <button
                onClick={() => setCustomProjectView('neck')}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors hidden sm:block ${
                  customProject.currentView === 'neck'
                    ? 'bg-[#2f3130] text-[#f1f1ef] border-[#2f3130]'
                    : 'bg-white text-[#1a1c1b] border-[#e2e3e1] hover:border-[#1a1c1b]'
                }`}
              >
                <span>Woven Neck Label</span>
              </button>
            </div>

            {/* Garment Spec Overlay Trigger */}
            <button
              onClick={() => setSpecSheetOpen(true)}
              className="hidden md:flex items-center gap-1 text-xs text-[#1a1c1b] font-mono hover:text-[#ff5a36] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Print Spec Sheet</span>
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: CUSTOMIZATION CONTROL PANEL */}
        <section className="w-full lg:w-[37%] xl:w-[34%] bg-white overflow-y-auto max-h-[calc(100vh-4rem)] flex flex-col divide-y divide-[#e2e3e1]">
          {/* Segment 1: Silhouette Selector Matrix */}
          <div className="p-4 md:p-5">
            <label className="block text-[11px] font-semibold text-[#5b403a] uppercase tracking-wider mb-2.5 font-mono">
              Select Garment Silhouette
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SILHOUETTES.map((sil) => {
                const isActive = customProject.silhouetteId === sil.id;
                return (
                  <div
                    key={sil.id}
                    onClick={() => setCustomProjectSilhouette(sil.id as SilhouetteId)}
                    className={`flex flex-col items-center p-2 rounded-sm cursor-pointer text-center group transition-all ${
                      isActive
                        ? 'border-2 border-[#1a1c1b] bg-[#f9f9f7]'
                        : 'border border-[#e2e3e1] hover:border-[#1a1c1b] bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-sm flex items-center justify-center mb-1 transition-colors ${
                        isActive
                          ? 'bg-[#e8e8e6] text-[#1a1c1b]'
                          : 'bg-[#eeeeec] text-[#5f5e5e] group-hover:text-[#1a1c1b]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{sil.icon}</span>
                    </div>
                    <span
                      className={`text-xs ${
                        isActive ? 'font-bold text-[#1a1c1b]' : 'font-medium text-[#1a1c1b]'
                      }`}
                    >
                      {sil.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#5f5e5e]">
                      ₹{sil.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segment 2: Blank Specifications (Step 01 • Garment Base) */}
          <div className="p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5b403a] uppercase tracking-wider font-mono">
                Step 01 • Garment Base
              </span>
              <span className="font-mono text-xs text-[#b52603] font-semibold">
                Ready to Personalize
              </span>
            </div>

            {/* Fabric Spec Callout */}
            <div className="p-3 bg-[#f9f9f7] rounded-sm border border-[#e2e3e1] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#1a1c1b] text-lg mt-0.5">texture</span>
              <div>
                <h4 className="text-xs font-bold text-[#1a1c1b] font-display">
                  {currentSilhouette.gsm}
                </h4>
                <p className="text-xs text-[#5f5e5e] mt-0.5 leading-relaxed">
                  {currentSilhouette.material}
                </p>
              </div>
            </div>

            {/* Garment Color Palette */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1a1c1b]">Colorway:</span>
                <span className="font-mono text-xs text-[#5f5e5e] font-medium" id="selectedColorLabel">
                  {customProject.color.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {currentSilhouette.colors.map((color) => {
                  const isSelected = customProject.color.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setCustomProjectColor(color)}
                      className={`relative w-7 h-7 rounded-full border border-[#e2e3e1] transition-all focus:outline-none ${
                        isSelected ? 'ring-2 ring-offset-2 ring-[#1a1c1b]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Chips Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1a1c1b]">Garment Fit Size:</span>
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="text-xs text-[#ff5a36] font-medium hover:underline flex items-center gap-0.5"
                >
                  <span>Size Chart & Fit Guide</span>
                  <span className="material-symbols-outlined text-[14px]">straighten</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {currentSilhouette.sizes.map((sz) => {
                  const isSelected = customProject.size === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setCustomProjectSize(sz)}
                      className={`h-11 rounded-sm font-mono text-xs transition-colors flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#2f3130] text-white font-bold border border-[#2f3130] shadow-sm'
                          : 'border border-[#e2e3e1] font-semibold text-[#1a1c1b] hover:border-[#1a1c1b] bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Segment 3: Customization Layers / Tools Tabs (Step 02 • Artwork & Typography) */}
          <div className="p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5b403a] uppercase tracking-wider font-mono">
                Step 02 • Artwork & Typography
              </span>
              <span className="font-mono text-xs text-[#5f5e5e]">
                {customProject.currentView === 'back' ? 'Back Spine Layer' : 'Front Chest Layer'}
              </span>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-[#e2e3e1] text-xs font-medium">
              <button
                onClick={() => setCustomProjectTab('artwork')}
                className={`pb-2 px-3 flex items-center gap-1.5 transition-colors ${
                  customProject.activeTab === 'artwork'
                    ? 'border-b-2 border-[#ff5a36] font-semibold text-[#ff5a36]'
                    : 'text-[#5f5e5e] hover:text-[#1a1c1b]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Upload Artwork</span>
              </button>
              <button
                onClick={() => setCustomProjectTab('text')}
                className={`pb-2 px-3 flex items-center gap-1.5 transition-colors ${
                  customProject.activeTab === 'text'
                    ? 'border-b-2 border-[#ff5a36] font-semibold text-[#ff5a36]'
                    : 'text-[#5f5e5e] hover:text-[#1a1c1b]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">title</span>
                <span>Add Text</span>
              </button>
              <button
                onClick={() => setCustomProjectTab('clipart')}
                className={`pb-2 px-3 flex items-center gap-1.5 transition-colors ${
                  customProject.activeTab === 'clipart'
                    ? 'border-b-2 border-[#ff5a36] font-semibold text-[#ff5a36]'
                    : 'text-[#5f5e5e] hover:text-[#1a1c1b]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">category</span>
                <span>Symbols</span>
              </button>
              <button
                onClick={() => setCustomProjectTab('layers')}
                className={`pb-2 px-3 flex items-center gap-1.5 transition-colors ${
                  customProject.activeTab === 'layers'
                    ? 'border-b-2 border-[#ff5a36] font-semibold text-[#ff5a36]'
                    : 'text-[#5f5e5e] hover:text-[#1a1c1b]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">layers</span>
                <span>Layers (2)</span>
              </button>
            </div>

            {/* TAB CONTENT 1: UPLOAD ARTWORK */}
            {customProject.activeTab === 'artwork' && (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#e2e3e1] hover:border-[#ff5a36] bg-[#f4f4f2] rounded-sm p-5 text-center transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-white border border-[#e2e3e1] flex items-center justify-center mb-2 text-[#1a1c1b] group-hover:text-[#ff5a36] transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-xl">cloud_upload</span>
                  </div>
                  <p className="text-xs font-medium text-[#1a1c1b]">
                    Drag & Drop your PNG, SVG, or AI file here
                  </p>
                  <p className="font-mono text-[10px] text-[#5f5e5e] mt-1">
                    Max 25MB • 300 DPI Transparent Vector recommended
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-sm bg-[#2f3130] text-white text-xs font-semibold hover:bg-black transition-colors shadow-sm"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Active Upload Card */}
                {customProject.uploadedFileName && (
                  <div className="p-2.5 bg-[#f9f9f7] rounded-sm border border-[#e2e3e1] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-sm bg-[#2f3130] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                        {customProject.uploadedFileName.endsWith('.svg')
                          ? 'SVG'
                          : customProject.uploadedFileName.endsWith('.png')
                          ? 'PNG'
                          : 'IMG'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#1a1c1b]">
                          {customProject.uploadedFileName}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700">
                          {customProject.uploadedFileSize || 'Vector Layer • Scaled at 100%'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCustomProjectUpload(null, null, null)}
                      className="text-[#5f5e5e] hover:text-[#ba1a1a] transition-colors p-1"
                      title="Delete Uploaded Artwork"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: ADD TEXT */}
            {customProject.activeTab === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1c1b] mb-1">
                    Text String Content
                  </label>
                  <input
                    type="text"
                    value={
                      customProject.currentView === 'back'
                        ? customProject.backTextString
                        : customProject.textString
                    }
                    onChange={(e) => {
                      if (customProject.currentView === 'back') {
                        setCustomProjectBackText(e.target.value);
                      } else {
                        setCustomProjectText(e.target.value);
                      }
                    }}
                    placeholder="Enter Custom Text"
                    className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-3 py-2 text-xs focus:border-[#1a1c1b] focus:ring-0 outline-none uppercase font-semibold text-[#1a1c1b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5f5e5e] mb-1">
                      Font Family
                    </label>
                    <select
                      value={customProject.fontFamily}
                      onChange={(e) => setCustomProjectFont(e.target.value)}
                      className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-2 py-1.5 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5f5e5e] mb-1">
                      Text Alignment
                    </label>
                    <div className="flex border border-[#e2e3e1] rounded-sm overflow-hidden bg-[#f9f9f7]">
                      <button
                        onClick={() => setCustomProjectTextAlign('left')}
                        className={`flex-1 py-1 text-center transition-colors ${
                          customProject.textAlign === 'left'
                            ? 'bg-[#2f3130] text-white'
                            : 'text-[#5f5e5e] hover:bg-[#e2e3e1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">format_align_left</span>
                      </button>
                      <button
                        onClick={() => setCustomProjectTextAlign('center')}
                        className={`flex-1 py-1 text-center transition-colors ${
                          customProject.textAlign === 'center'
                            ? 'bg-[#2f3130] text-white'
                            : 'text-[#5f5e5e] hover:bg-[#e2e3e1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">format_align_center</span>
                      </button>
                      <button
                        onClick={() => setCustomProjectTextAlign('right')}
                        className={`flex-1 py-1 text-center transition-colors ${
                          customProject.textAlign === 'right'
                            ? 'bg-[#2f3130] text-white'
                            : 'text-[#5f5e5e] hover:bg-[#e2e3e1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">format_align_right</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Scale Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#5f5e5e] font-medium">Text Scale Size</span>
                    <span className="font-mono text-[#1a1c1b]">{customProject.textScale} pt</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={customProject.textScale}
                    onChange={(e) => setCustomProjectTextScale(Number(e.target.value))}
                    className="w-full accent-[#ff5a36] h-1 bg-[#e2e3e1] rounded-sm cursor-pointer"
                  />
                </div>

                {/* Ink Color Swatches */}
                <div>
                  <span className="block text-xs font-semibold text-[#1a1c1b] mb-1.5">Ink Color:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { hex: '#ffffff', title: 'Solid White' },
                      { hex: '#ff5a36', title: 'Vermilion Red' },
                      { hex: '#ffd000', title: 'Tokyo Yellow' },
                      { hex: '#111111', title: 'Pitch Black' },
                      { hex: '#1877f2', title: 'Cobalt Royal Blue' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setCustomProjectInkColor(c.hex)}
                        className={`w-6 h-6 rounded-full border border-[#e2e3e1] transition-transform ${
                          customProject.inkColor === c.hex
                            ? 'ring-2 ring-offset-2 ring-[#1a1c1b] scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.title}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: SYMBOLS */}
            {customProject.activeTab === 'clipart' && (
              <div className="space-y-3">
                <span className="text-xs font-medium text-[#5f5e5e] block">
                  Select brutalist vector motif or brand emblem:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_SYMBOLS.map((sym) => {
                    const isSelected = customProject.selectedSymbolId === sym.id;
                    return (
                      <div
                        key={sym.id}
                        onClick={() => {
                          setCustomProjectSymbol(isSelected ? null : sym.id);
                          setCustomProjectUpload(null, null, null);
                        }}
                        className={`p-2.5 rounded-sm border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                          isSelected
                            ? 'border-2 border-[#1a1c1b] bg-[#f9f9f7]'
                            : 'border-[#e2e3e1] hover:border-[#1a1c1b] bg-white'
                        }`}
                      >
                        <div
                          className="w-20 h-12 flex items-center justify-center text-[#1a1c1b] mb-1"
                          dangerouslySetInnerHTML={{ __html: sym.svg }}
                        />
                        <span className="text-[11px] font-semibold text-[#1a1c1b] line-clamp-1">
                          {sym.name}
                        </span>
                        <span className="text-[9px] text-[#5f5e5e] font-mono">{sym.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: LAYERS */}
            {customProject.activeTab === 'layers' && (
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#5f5e5e]">check_box</span>
                    <span className="font-medium text-[#1a1c1b]">Garment Base ({currentSilhouette.name})</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#5f5e5e]">Base Layer</span>
                </div>
                <div className="p-2 bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#ff5a36]">check_box</span>
                    <span className="font-medium text-[#1a1c1b]">
                      Vector Graphic ({customProject.uploadedFileName || 'Geometric Wireframe'})
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700">DTF HD</span>
                </div>
                <div className="p-2 bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#ff5a36]">check_box</span>
                    <span className="font-medium text-[#1a1c1b]">
                      Typography ("{customProject.textString.slice(0, 16)}...")
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#5f5e5e]">{customProject.fontFamily}</span>
                </div>
              </div>
            )}
          </div>

          {/* Segment 4: Dynamic Transparent Pricing & Quantity */}
          <div className="p-4 md:p-5 bg-[#f4f4f2]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5b403a] uppercase tracking-wider font-mono">
                Pricing Breakdown
              </span>
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-sm">
                GST Included
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5f5e5e]">
                <span>Base Garment ({currentSilhouette.name} {currentSilhouette.gsm.split(' ')[0]})</span>
                <span className="font-mono text-[#1a1c1b]">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#5f5e5e]">
                <span>Front Print (A3 DTF Full Color HD)</span>
                <span className="font-mono text-[#1a1c1b]">₹{frontPrintPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#5f5e5e]">
                <span>Back Print Configuration</span>
                <span className="font-mono text-[#5f5e5e]">
                  {customProject.backPrintActive ? '₹400 (Active)' : '₹0 (None)'}
                </span>
              </div>

              {discountRate > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Bulk Discount Applied ({(discountRate * 100).toFixed(0)}% Off)</span>
                  <span className="font-mono">-₹{(unitPrice * discountRate).toFixed(0)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#e2e3e1] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#1a1c1b] font-display">
                  Total Price per Unit
                </span>
                <span className="text-lg md:text-xl font-bold text-[#1a1c1b] font-display">
                  ₹{discountedUnitPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Bulk Quantity Incentive Banner */}
            <div className="p-2 bg-[#ffdad2]/30 border border-[#ffb4a3] rounded-sm text-center">
              <p className="font-mono text-[11px] text-[#3d0600] font-semibold">
                Order 3+ for 10% off | 10+ for 25% off bulk rate
              </p>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[#1a1c1b]">Order Quantity:</span>
              <div className="flex items-center border border-[#e2e3e1] rounded-sm bg-white">
                <button
                  onClick={() => setCustomProjectQuantity(customProject.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors"
                  id="qtyDecBtn"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-9 text-center font-mono text-xs font-bold text-[#1a1c1b]" id="qtyCounter">
                  {customProject.quantity}
                </span>
                <button
                  onClick={() => setCustomProjectQuantity(customProject.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors"
                  id="qtyIncBtn"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Segment 5: Primary Action Buttons & Guarantees */}
          <div className="p-4 md:p-5 space-y-2.5">
            {saveSuccessMsg && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center rounded-sm font-medium animate-fadeIn">
                Design saved to your atelier draft archive!
              </div>
            )}

            {/* Primary Action CTA Button */}
            <button
              onClick={handleAddToBag}
              className="w-full h-12 rounded-sm bg-[#ff5a36] hover:bg-[#e84a27] text-white text-sm md:text-base font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
              <span>
                Add Custom Garment to Bag - ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Secondary Save Button */}
            <button
              onClick={handleSaveDesign}
              className="w-full h-10 rounded-sm bg-white text-[#1a1c1b] border border-[#e2e3e1] text-xs font-semibold hover:border-[#1a1c1b] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">bookmark_border</span>
              <span>Save Design for Later</span>
            </button>

            {/* Dispatch & Logistics Notice */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-center text-[#5f5e5e]">
              <span className="material-symbols-outlined text-sm text-[#1a1c1b]">local_shipping</span>
              <span className="font-mono text-[11px]">
                Ships in 48-72 hours across India via BlueDart / Delhivery
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

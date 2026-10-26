import React from 'react';
import { useStore } from '../../store/useStore';
import { SILHOUETTES } from '../../data/products';

export const SpecSheetModal: React.FC = () => {
  const { isSpecSheetOpen, setSpecSheetOpen, customProject } = useStore();

  if (!isSpecSheetOpen) return null;

  const currentSil =
    SILHOUETTES.find((s) => s.id === customProject.silhouetteId) || SILHOUETTES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setSpecSheetOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl border border-[#e2e3e1] overflow-hidden z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e3e1] flex items-center justify-between bg-[#f9f9f7]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5a36] text-xl">description</span>
            <h3 className="text-base font-bold text-[#1a1c1b] font-display uppercase tracking-tight">
              Industrial Print Spec Sheet
            </h3>
          </div>
          <button
            onClick={() => setSpecSheetOpen(false)}
            className="w-8 h-8 rounded-sm hover:bg-[#eeeeec] flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Spec Content */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="p-3 bg-[#f4f4f2] rounded-sm border border-[#e2e3e1] flex justify-between items-center font-mono">
            <div>
              <span className="text-[10px] text-[#5f5e5e] uppercase">Active Matrix</span>
              <div className="font-bold text-[#1a1c1b] text-sm">DTF HD COLOR MATRIX V2.4</div>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-xs font-semibold text-[10px]">
              CERTIFIED 300+ DPI
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3 border border-[#e2e3e1] rounded-sm">
              <span className="text-[10px] text-[#5f5e5e] uppercase block mb-1">Print Safe Bound</span>
              <span className="font-bold text-[#1a1c1b]">{currentSil.printSafeDims.label}</span>
              <p className="text-[10px] text-[#5f5e5e] mt-1">
                {currentSil.printSafeDims.widthCm} × {currentSil.printSafeDims.heightCm}
              </p>
            </div>
            <div className="p-3 border border-[#e2e3e1] rounded-sm">
              <span className="text-[10px] text-[#5f5e5e] uppercase block mb-1">Color System</span>
              <span className="font-bold text-[#1a1c1b]">Japanese Ultra-Chrome Pigment</span>
              <p className="text-[10px] text-[#5f5e5e] mt-1">Water-based, zero plasticizer</p>
            </div>
            <div className="p-3 border border-[#e2e3e1] rounded-sm">
              <span className="text-[10px] text-[#5f5e5e] uppercase block mb-1">Curing Parameter</span>
              <span className="font-bold text-[#1a1c1b]">165°C / 15s High Barometric</span>
              <p className="text-[10px] text-[#5f5e5e] mt-1">Double heat press seal</p>
            </div>
            <div className="p-3 border border-[#e2e3e1] rounded-sm">
              <span className="text-[10px] text-[#5f5e5e] uppercase block mb-1">Wash Resilience</span>
              <span className="font-bold text-[#1a1c1b]">60+ Domestic Cycles</span>
              <p className="text-[10px] text-[#5f5e5e] mt-1">No cracking, peel or bleed</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e2e3e1]">
            <h4 className="font-semibold text-[#1a1c1b] mb-1">Care &amp; Wash Protocol:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#5f5e5e] leading-relaxed">
              <li>Machine wash cold inside-out with like colors</li>
              <li>Do not iron directly over printed vector or typographical layers</li>
              <li>Tumble dry low or hang dry in shade to preserve cotton density</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

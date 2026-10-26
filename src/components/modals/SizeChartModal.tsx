import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

export const SizeChartModal: React.FC = () => {
  const { isSizeChartOpen, setSizeChartOpen, customProject } = useStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [garmentType, setGarmentType] = useState<'tee' | 'hoodie'>(
    customProject.silhouetteId === 'hoodie' ? 'hoodie' : 'tee'
  );

  if (!isSizeChartOpen) return null;

  const teeSizes = [
    { size: 'S', chestIn: 40, lengthIn: 27.5, sleeveIn: 8.5, chestCm: 101.6, lengthCm: 69.8, sleeveCm: 21.6 },
    { size: 'M', chestIn: 42, lengthIn: 28.5, sleeveIn: 9.0, chestCm: 106.7, lengthCm: 72.4, sleeveCm: 22.8 },
    { size: 'L', chestIn: 44, lengthIn: 29.5, sleeveIn: 9.5, chestCm: 111.8, lengthCm: 74.9, sleeveCm: 24.1 },
    { size: 'XL', chestIn: 46, lengthIn: 30.5, sleeveIn: 10.0, chestCm: 116.8, lengthCm: 77.5, sleeveCm: 25.4 },
    { size: 'XXL', chestIn: 48, lengthIn: 31.5, sleeveIn: 10.5, chestCm: 121.9, lengthCm: 80.0, sleeveCm: 26.7 },
  ];

  const hoodieSizes = [
    { size: 'S', chestIn: 42, lengthIn: 27.0, sleeveIn: 24.5, chestCm: 106.7, lengthCm: 68.6, sleeveCm: 62.2 },
    { size: 'M', chestIn: 44, lengthIn: 28.0, sleeveIn: 25.0, chestCm: 111.8, lengthCm: 71.1, sleeveCm: 63.5 },
    { size: 'L', chestIn: 46, lengthIn: 29.0, sleeveIn: 25.5, chestCm: 116.8, lengthCm: 73.7, sleeveCm: 64.8 },
    { size: 'XL', chestIn: 48, lengthIn: 30.0, sleeveIn: 26.0, chestCm: 121.9, lengthCm: 76.2, sleeveCm: 66.0 },
    { size: 'XXL', chestIn: 50, lengthIn: 31.0, sleeveIn: 26.5, chestCm: 127.0, lengthCm: 78.7, sleeveCm: 67.3 },
  ];

  const currentData = garmentType === 'tee' ? teeSizes : hoodieSizes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setSizeChartOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl border border-[#e2e3e1] overflow-hidden z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e3e1] flex items-center justify-between bg-[#f9f9f7]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5a36] text-xl">straighten</span>
            <h3 className="text-base font-bold text-[#1a1c1b] font-display uppercase tracking-tight">
              Garment Sizing &amp; Fit Guide
            </h3>
          </div>
          <button
            onClick={() => setSizeChartOpen(false)}
            className="w-8 h-8 rounded-sm hover:bg-[#eeeeec] flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="p-4 border-b border-[#e2e3e1] flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex border border-[#e2e3e1] rounded-sm overflow-hidden text-xs">
            <button
              onClick={() => setGarmentType('tee')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                garmentType === 'tee' ? 'bg-[#2f3130] text-white' : 'text-[#5f5e5e] hover:bg-[#f4f4f2]'
              }`}
            >
              240 GSM Boxy Tee
            </button>
            <button
              onClick={() => setGarmentType('hoodie')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                garmentType === 'hoodie' ? 'bg-[#2f3130] text-white' : 'text-[#5f5e5e] hover:bg-[#f4f4f2]'
              }`}
            >
              420 GSM Hoodie
            </button>
          </div>

          <div className="flex items-center gap-1 border border-[#e2e3e1] rounded-sm p-0.5 text-xs font-mono">
            <button
              onClick={() => setUnit('in')}
              className={`px-2 py-1 rounded-xs transition-colors ${
                unit === 'in' ? 'bg-[#1a1c1b] text-white font-bold' : 'text-[#5f5e5e]'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2 py-1 rounded-xs transition-colors ${
                unit === 'cm' ? 'bg-[#1a1c1b] text-white font-bold' : 'text-[#5f5e5e]'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#e2e3e1] text-[#5f5e5e]">
                <th className="py-2 px-3 font-semibold">SIZE</th>
                <th className="py-2 px-3 font-semibold">CHEST</th>
                <th className="py-2 px-3 font-semibold">LENGTH</th>
                <th className="py-2 px-3 font-semibold">SLEEVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeec]">
              {currentData.map((row) => (
                <tr key={row.size} className="hover:bg-[#f9f9f7] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#1a1c1b]">{row.size}</td>
                  <td className="py-2.5 px-3 text-[#1a1c1b]">
                    {unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#1a1c1b]">
                    {unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#1a1c1b]">
                    {unit === 'in' ? `${row.sleeveIn}"` : `${row.sleeveCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Notes Callout */}
          <div className="mt-4 p-3 bg-[#f4f4f2] rounded-sm border border-[#e2e3e1] text-[11px] text-[#5f5e5e] space-y-1">
            <p className="font-semibold text-[#1a1c1b]">Streetwear Silhouette Note:</p>
            <p>
              Our garments are cut with an intentional boxy drop-shoulder streetwear fit. For an exaggerated oversized look, we recommend ordering one size up.
            </p>
            <p>
              All cotton is bio-washed and pre-shrunk. Zero shrink guaranteed when washed in cold water.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

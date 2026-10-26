import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PRODUCTS, SILHOUETTES } from '../../data/products';
import { SilhouetteId } from '../../types';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    setQuickViewProduct,
    setCustomProjectSilhouette,
    setActiveScreen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.edition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gsm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSilhouettes = SILHOUETTES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProduct = (p: (typeof PRODUCTS)[0]) => {
    setSearchOpen(false);
    setQuickViewProduct(p);
  };

  const handleSelectSilhouette = (id: string) => {
    setSearchOpen(false);
    setCustomProjectSilhouette(id as SilhouetteId);
    setActiveScreen('studio');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl border border-[#e2e3e1] overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e2e3e1] flex items-center gap-3 bg-[#f9f9f7]">
          <span className="material-symbols-outlined text-[#5f5e5e] text-xl">search</span>
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search heavyweight tees, hoodies, GSM, custom blanks..."
            className="w-full bg-transparent border-none text-sm text-[#1a1c1b] placeholder:text-[#c8c6c5] focus:outline-none focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#5f5e5e] hover:text-[#1a1c1b] p-1"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-mono text-[#5f5e5e] hover:text-[#1a1c1b] px-2 py-1 border border-[#e2e3e1] rounded-xs bg-white"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Silhouettes */}
          <div>
            <span className="font-mono text-[10px] uppercase text-[#5f5e5e] font-semibold tracking-wider block mb-2">
              Custom Studio Blanks
            </span>
            <div className="grid grid-cols-2 gap-2">
              {filteredSilhouettes.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSilhouette(s.id)}
                  className="p-2 border border-[#e2e3e1] rounded-sm hover:border-[#ff5a36] bg-[#f9f9f7] cursor-pointer flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-[#ff5a36]">{s.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-[#1a1c1b]">{s.name}</div>
                    <div className="text-[10px] text-[#5f5e5e] font-mono">From ₹{s.basePrice}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Products */}
          <div>
            <span className="font-mono text-[10px] uppercase text-[#5f5e5e] font-semibold tracking-wider block mb-2">
              Drop 04 Products ({filteredProducts.length})
            </span>
            {filteredProducts.length === 0 ? (
              <p className="text-xs text-[#5f5e5e] py-4 text-center">
                No matching garments found for "{searchQuery}".
              </p>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="p-2 border border-[#e2e3e1] rounded-sm hover:border-[#1a1c1b] bg-white cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-xs" />
                      <div>
                        <h4 className="text-xs font-semibold text-[#1a1c1b]">{p.title}</h4>
                        <span className="text-[10px] text-[#5f5e5e] font-mono">{p.gsm} • {p.edition}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#1a1c1b]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

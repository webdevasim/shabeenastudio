import React from 'react';

export const TrustGrid: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-[#e2e3e1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Pillar 1 */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-sm bg-[#f4f4f2] border border-[#e2e3e1] flex items-center justify-center text-[#ff5a36] shrink-0">
              <span className="material-symbols-outlined text-[24px]">layers</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1c1b] font-display">240-420 GSM Blanks</h4>
              <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">
                Durable, heavy combed cotton and French Terry engineered for structure and comfort.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-sm bg-[#f4f4f2] border border-[#e2e3e1] flex items-center justify-center text-[#ff5a36] shrink-0">
              <span className="material-symbols-outlined text-[24px]">water_drop</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1c1b] font-display">Fade-Proof Pigments</h4>
              <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">
                Japanese water-based DTF inks tested to withstand 60+ domestic machine wash cycles.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-sm bg-[#f4f4f2] border border-[#e2e3e1] flex items-center justify-center text-[#ff5a36] shrink-0">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1c1b] font-display">100% Secure Checkout</h4>
              <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">
                Seamless UPI, Credit/Debit cards, Net Banking, and COD across 28,000+ PIN codes.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-sm bg-[#f4f4f2] border border-[#e2e3e1] flex items-center justify-center text-[#ff5a36] shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1c1b] font-display">Express Shipping</h4>
              <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">
                Free delivery on orders over ₹1,499 with 7-day hassle-free size exchange protocol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

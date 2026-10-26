import React from 'react';

export const PrecisionProtocol: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#f9f9f7] border-b border-[#e2e3e1]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs tracking-widest text-[#ff5a36] uppercase font-semibold">
            The Precision Protocol
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1c1b] tracking-tight mt-1 font-display">
            From Idea to Wardrobe
          </h2>
          <p className="text-base text-[#5f5e5e] mt-2">
            Effortless creation built on industrial-standard Japanese garment engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white p-8 border border-[#e2e3e1] flex flex-col justify-between relative group hover:border-[#1a1c1b] transition-colors">
            <span className="text-4xl md:text-5xl font-extrabold block text-[#e2e3e1] group-hover:text-[#ff5a36] transition-colors font-display">
              01
            </span>
            <div className="my-4">
              <h3 className="text-xl font-bold text-[#1a1c1b] mb-2 font-display">
                Choose Your Canvas
              </h3>
              <p className="text-sm text-[#5f5e5e] leading-relaxed">
                Select from our curated blank matrix: 240 GSM boxy tees, 400 GSM French Terry hoodies, ceramic matte mugs, or unstructured cotton dad caps.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e2e3e1] flex items-center text-[10px] text-[#5f5e5e] uppercase tracking-wider font-mono font-semibold">
              <span>Standard Fit &amp; Oversized Available</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 border border-[#e2e3e1] flex flex-col justify-between relative group hover:border-[#1a1c1b] transition-colors">
            <span className="text-4xl md:text-5xl font-extrabold block text-[#e2e3e1] group-hover:text-[#ff5a36] transition-colors font-display">
              02
            </span>
            <div className="my-4">
              <h3 className="text-xl font-bold text-[#1a1c1b] mb-2 font-display">
                Upload or Typeset
              </h3>
              <p className="text-sm text-[#5f5e5e] leading-relaxed">
                Drag and drop your raw vector artwork, photography, or typeset words directly in our browser customizer with real-time print layer preview.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e2e3e1] flex items-center text-[10px] text-[#5f5e5e] uppercase tracking-wider font-mono font-semibold">
              <span>Automated File DPI Enhancement</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 border border-[#e2e3e1] flex flex-col justify-between relative group hover:border-[#1a1c1b] transition-colors">
            <span className="text-4xl md:text-5xl font-extrabold block text-[#e2e3e1] group-hover:text-[#ff5a36] transition-colors font-display">
              03
            </span>
            <div className="my-4">
              <h3 className="text-xl font-bold text-[#1a1c1b] mb-2 font-display">
                Handcrafted &amp; Shipped
              </h3>
              <p className="text-sm text-[#5f5e5e] leading-relaxed">
                Printed using high-spec Japanese DTF technology, heat cured, inspected for seams, and dispatched via express air courier in 3–5 business days.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e2e3e1] flex items-center text-[10px] text-[#5f5e5e] uppercase tracking-wider font-mono font-semibold">
              <span>PAN-India Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

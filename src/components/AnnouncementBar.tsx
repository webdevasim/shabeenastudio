import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#2f3130] text-[#f1f1ef] px-4 py-2 text-center border-b border-[#e2e3e1]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a36] animate-pulse inline-block" />
          Complimentary Pan-India Express Shipping on Orders Above ₹1,499
        </span>
        <span className="hidden md:inline text-[#c8c6c5]">•</span>
        <span className="hidden md:inline text-xs text-[#f1f1ef]/90">
          WhatsApp Concierge:{' '}
          <a
            className="hover:text-[#ff5a36] transition-colors duration-150 font-medium font-mono"
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
          >
            +91 98765 43210
          </a>
        </span>
      </div>
    </div>
  );
};

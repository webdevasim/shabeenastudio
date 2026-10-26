import React from 'react';
import { REVIEWS } from '../data/products';

export const CommunityReviews: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#f9f9f7] border-b border-[#e2e3e1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#ff5a36] uppercase font-semibold">
              Community Verified
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1c1b] tracking-tight mt-1 font-display">
              Worn Across India.
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-[#5f5e5e] flex items-center gap-2">
            <span className="font-bold text-[#1a1c1b]">4.9 / 5.0 Rating</span> from 1,240+ verified streetwear orders.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 border border-[#e2e3e1] flex flex-col justify-between hover:border-[#1a1c1b] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#ff5a36] text-sm">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px] fill">
                        star
                      </span>
                    ))}
                  </div>
                  <span className="bg-[#f4f4f2] text-[#1a1c1b] font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase font-semibold">
                    {review.badge}
                  </span>
                </div>
                <p className="text-sm text-[#1a1c1b] mb-6 leading-relaxed font-normal">
                  {review.text}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e2e3e1] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f4f4f2] overflow-hidden border border-[#e2e3e1]">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1a1c1b]">{review.author}</div>
                  <div className="font-mono text-[10px] text-[#5f5e5e] tracking-wider uppercase font-medium">
                    {review.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

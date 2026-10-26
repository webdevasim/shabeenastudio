
import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../data/products';

const categorySlug = (title: string): string => {
  const name = title.toLowerCase();

  if (name.includes('shirt')) return 't-shirts';
  if (name.includes('hoodie') || name.includes('sweat')) return 'hoodies';
  if (name.includes('mug')) return 'mugs';
  if (name.includes('cap')) return 'caps';

  return name.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

export const CategoryMatrix: React.FC = () => {
  return (
    <section
      className="py-16 md:py-24 bg-white border-b border-[#e2e3e1]"
      id="category-section"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#e2e3e1]">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#ff5a36] uppercase font-semibold">
              Curated Silhouettes
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1c1b] tracking-tight mt-1 font-display">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-sm font-semibold text-[#1a1c1b] hover:text-[#ff5a36] inline-flex items-center gap-1 transition-colors"
          >
            <span>Explore Complete Matrix</span>
            <span className="material-symbols-outlined text-[16px]">
              north_east
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/category/${categorySlug(cat.title)}`}
              className="group relative bg-[#f9f9f7] border border-[#e2e3e1] hover:border-[#1a1c1b] transition-all duration-200 overflow-hidden flex flex-col"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-[#f4f4f2] relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 tracking-wider uppercase font-mono font-semibold ${
                    cat.gsmBadge === 'Custom Ready'
                      ? 'bg-[#ff5a36] text-white'
                      : 'bg-[#2f3130] text-[#f1f1ef]'
                  }`}
                >
                  {cat.gsmBadge}
                </span>
              </div>

              <div className="p-5 flex items-center justify-between border-t border-[#e2e3e1] bg-white">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1b] group-hover:text-[#ff5a36] transition-colors font-display">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#5f5e5e] mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#5f5e5e] group-hover:text-[#ff5a36] group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useStore } from '../../store/useStore';
import { PRODUCTS } from '../../data/products';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: (typeof PRODUCTS)[0]) => {
    addToCart({
      id: `wish-${product.id}-${Date.now()}`,
      isCustom: false,
      productId: product.id,
      title: product.title,
      silhouetteName: product.category === 'hoodie' ? 'French Terry Hoodie' : 'Heavyweight Boxy Tee',
      price: product.price,
      quantity: 1,
      size: 'L',
      colorName: product.colors[0].name,
      colorHex: product.colors[0].hex,
      image: product.image,
      specsSummary: `${product.gsm} • ${product.fit}`,
    });
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setWishlistOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#f9f9f7] h-full shadow-2xl flex flex-col z-10 border-l border-[#e2e3e1]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#e2e3e1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#ff5a36] fill">favorite</span>
            <h2 className="text-base font-bold text-[#1a1c1b] font-display uppercase tracking-tight">
              Wishlist ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={() => setWishlistOpen(false)}
            className="w-8 h-8 rounded-sm hover:bg-[#eeeeec] flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5f5e5e]">
              <div className="w-16 h-16 rounded-full bg-[#eeeeec] flex items-center justify-center mb-4 text-[#5f5e5e]">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <h3 className="text-base font-bold text-[#1a1c1b] font-display">Your wishlist is empty</h3>
              <p className="text-xs text-[#5f5e5e] max-w-xs mt-1">
                Save your favorite streetwear silhouettes and customized prototypes to view them anytime.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-3.5 border border-[#e2e3e1] rounded-sm flex gap-3 relative group"
              >
                <div className="w-20 h-24 bg-[#f4f4f2] rounded-xs overflow-hidden shrink-0 border border-[#e2e3e1]">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-semibold text-[#1a1c1b] line-clamp-1">{p.title}</h4>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="text-[#5f5e5e] hover:text-[#ba1a1a] p-0.5"
                        title="Remove from wishlist"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <span className="font-mono text-[10px] text-[#5f5e5e]">{p.edition}</span>
                    <div className="text-xs font-bold text-[#1a1c1b] mt-1 font-mono">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToBag(p)}
                    className="w-full py-1.5 bg-[#2f3130] hover:bg-black text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

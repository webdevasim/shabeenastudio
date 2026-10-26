import { cartWhatsApp } from '../../lib/whatsapp';
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';


const ADMIN_BASE_URL = "http://localhost/shabeena_work/admin/";

function resolveCartImage(image?: string): string {
  if (!image) return "";

  const path = image.trim().replace(/\\/g, "/");

  // Repair URLs generated with the old incorrect admin base.
  if (/^https?:\/\/localhost\/admin\//i.test(path)) {
    return path.replace(
      /^https?:\/\/localhost\/admin\//i,
      ADMIN_BASE_URL
    );
  }

  // Already a complete URL.
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Root-relative URL.
  if (path.startsWith("/")) {
    return `http://localhost${path}`;
  }

  // Relative path stored in the database.
  return new URL(path, ADMIN_BASE_URL).href;
}

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    setCheckoutOpen,
    setActiveScreen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  // Subtotal calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercentage) / 100);
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const freeShippingThreshold = 1499;
  const shippingFee = subtotalAfterDiscount >= freeShippingThreshold || cart.length === 0 ? 0 : 99;
  const grandTotal = subtotalAfterDiscount + shippingFee;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotalAfterDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#f9f9f7] h-full shadow-2xl flex flex-col z-10 border-l border-[#e2e3e1]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#e2e3e1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#ff5a36]">shopping_bag</span>
            <h2 className="text-base font-bold text-[#1a1c1b] font-display uppercase tracking-tight">
              Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-sm hover:bg-[#eeeeec] flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#f4f4f2] px-4 sm:px-5 py-3 border-b border-[#e2e3e1]">
          {amountToFreeShipping > 0 ? (
            <div>
              <div className="flex justify-between text-xs mb-1.5 text-[#1a1c1b]">
                <span>
                  Add <strong className="font-mono">₹{amountToFreeShipping}</strong> more for{' '}
                  <strong className="text-[#ff5a36]">FREE Pan-India Delivery</strong>
                </span>
                <span className="font-mono text-[11px] text-[#5f5e5e]">
                  {Math.min(100, Math.round((subtotalAfterDiscount / freeShippingThreshold) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#e2e3e1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff5a36] transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotalAfterDiscount / freeShippingThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
              <span>You unlocked Complimentary Pan-India Express Delivery!</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5f5e5e]">
              <div className="w-16 h-16 rounded-full bg-[#eeeeec] flex items-center justify-center mb-4 text-[#5f5e5e]">
                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
              </div>
              <h3 className="text-base font-bold text-[#1a1c1b] font-display">Your bag is empty</h3>
              <p className="text-xs text-[#5f5e5e] max-w-xs mt-1 mb-6">
                Explore our heavyweight collection or create an original in the custom studio workbench.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  setActiveScreen('studio');
                }}
                className="px-6 py-2.5 bg-[#ff5a36] text-white text-xs font-semibold rounded-sm hover:bg-[#e84a27] transition-colors"
              >
                Launch Custom Studio
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 border border-[#e2e3e1] rounded-sm flex gap-3 relative group"
              >
                {/* Thumbnail */}
                {/* Thumbnail */}
<div className="w-20 h-24 bg-[#f4f4f2] rounded-xs overflow-hidden shrink-0 relative border border-[#e2e3e1]">
  {item.image ? (
    <img
      src={resolveCartImage(item.image)}
      alt={item.title}
      className="w-full h-full object-contain p-1"
      onError={(e) => {
        console.error(
          "Cart image failed:",
          e.currentTarget.src
        );
      }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-[#5f5e5e]">
      <span className="material-symbols-outlined text-2xl">
        image
      </span>
    </div>
  )}

  {item.isCustom && (
    <span className="absolute top-1 left-1 bg-[#ff5a36] text-white font-mono text-[8px] font-bold px-1 rounded uppercase">
      Custom
    </span>
  )}
</div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-semibold text-[#1a1c1b] line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#5f5e5e] hover:text-[#ba1a1a] transition-colors p-0.5"
                        title="Remove Item"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5f5e5e]">
                      <span className="font-mono bg-[#f4f4f2] px-1.5 py-0.5 rounded-xs border border-[#e2e3e1]">
                        Size: {item.size}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-[#dadad8]"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.colorName}
                      </span>
                    </div>

                    {item.specsSummary && (
                      <p className="text-[10px] text-[#5f5e5e] mt-1 font-mono">
                        {item.specsSummary}
                      </p>
                    )}
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#e2e3e1] rounded-xs bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">remove</span>
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-bold text-[#1a1c1b]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>

                    <div className="font-mono font-bold text-xs text-[#1a1c1b]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Pricing & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#e2e3e1] space-y-3.5">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 text-xs rounded-sm">
                  <span className="font-mono text-emerald-800 font-semibold">
                    ✓ Code {appliedCoupon} applied ({discountPercentage}% off)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#ba1a1a] hover:underline font-mono text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. FIRSTDROP)"
                    className="flex-1 bg-[#f9f9f7] border border-[#e2e3e1] px-3 py-1.5 text-xs text-[#1a1c1b] rounded-sm focus:border-[#1a1c1b] outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#2f3130] text-white text-xs font-semibold rounded-sm hover:bg-black transition-colors font-mono"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                <p className="text-[10px] text-[#ba1a1a] mt-1 font-mono">{couponMsg.text}</p>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5f5e5e]">
                <span>Cart Subtotal</span>
                <span className="font-mono text-[#1a1c1b]">₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Special Discount ({discountPercentage}%)</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5f5e5e]">
                <span>Pan-India Shipping</span>
                <span className="font-mono text-[#1a1c1b]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase font-mono text-[11px]">
                      FREE
                    </span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-[#e2e3e1] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#1a1c1b] font-display">Grand Total</span>
                <span className="text-lg font-bold text-[#1a1c1b] font-display">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-[#5f5e5e] text-right font-mono">Inclusive of all taxes &amp; GST</p>
            </div>

            <button type="button" onClick={() => cartWhatsApp(cart)} className="w-full h-12 bg-[#168b50] hover:bg-[#117040] text-white font-semibold text-sm rounded-sm">Enquire about Cart on WhatsApp</button>
            {/* Checkout Trigger */}
            <button
              onClick={handleProceedCheckout}
              className="w-full h-12 bg-[#ff5a36] hover:bg-[#e84a27] text-white font-semibold text-sm rounded-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Proceed to 1-Click Checkout</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

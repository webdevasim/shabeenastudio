import { productWhatsApp } from '../../lib/whatsapp';
import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';

type ApiVariant = {
  id: string | number;
  product_id: string | number;
  size: string;
  color: string;
  gsm?: string | number | null;
  price_paise: number | string;
  stock: number | string;
};

type ProductWithVariants = Product & {
  variants?: ApiVariant[];
  sizes?: string[];
  description?: string;
  originalPrice?: number;
};

const priceOf = (variant: ApiVariant) => {
  const price = Number(variant.price_paise);
  return Number.isFinite(price) ? price / 100 : 0;
};
const stockOf = (variant: ApiVariant) => {
  const stock = Number(variant.stock);
  return Number.isFinite(stock) ? Math.max(0, stock) : 0;
};
const hexOf = (name: string) => {
  const known: Record<string, string> = {
    black: '#222222', white: '#f5f5f5', red: '#d62828', blue: '#2563eb',
    navy: '#1e293b', green: '#15803d', olive: '#65743a', grey: '#808080',
    gray: '#808080', beige: '#d6c2a1', cream: '#f2e8d5', brown: '#795548',
    pink: '#ec4899', purple: '#7e22ce', yellow: '#eab308', orange: '#f97316',
  };
  return known[name.trim().toLowerCase()] || '#b8b8b8';
};

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    setActiveScreen,
    setCustomProjectText,
    setSizeChartOpen,
  } = useStore();

  const product = quickViewProduct as ProductWithVariants | null;
  const variants = useMemo(() => product?.variants || [], [product?.id, product?.variants]);
  const colors = useMemo(() => {
    const names = Array.from(new Set(variants.map((variant) => String(variant.color || '').trim()).filter(Boolean)));
    if (names.length) return names.map((name) => ({ name, hex: hexOf(name) }));
    return product?.colors || [];
  }, [variants, product?.colors]);
  const sizes = useMemo(() => Array.from(new Set(variants.map((variant) => String(variant.size || '').trim()).filter(Boolean))), [variants]);
  const gsms = useMemo(() => Array.from(new Set(variants.map((variant) => String(variant.gsm ?? '').trim()).filter(Boolean))), [variants]);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedGsm, setSelectedGsm] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    const firstAvailable = variants.find((variant) => stockOf(variant) > 0);
    setSelectedSize(firstAvailable?.size || sizes[0] || '');
    const firstColorName = firstAvailable?.color?.toLowerCase();
    const firstColorIdx = firstColorName ? colors.findIndex((color) => color.name.toLowerCase() === firstColorName) : 0;
    setSelectedColorIdx(Math.max(0, firstColorIdx));
    setSelectedGsm(String(firstAvailable?.gsm ?? gsms[0] ?? ''));
    setQuantity(1);
  }, [product?.id, variants, sizes, colors, gsms]);

  if (!product) return null;

  const activeColor = colors[selectedColorIdx] || colors[0];
  const matchingVariants = variants.filter((variant) =>
    (!activeColor || variant.color.toLowerCase() === activeColor.name.toLowerCase()) &&
    (!selectedSize || variant.size === selectedSize) &&
    (!selectedGsm || String(variant.gsm ?? '') === selectedGsm)
  );
  const selectedVariant = matchingVariants.find((variant) => stockOf(variant) > 0) || matchingVariants[0];
  const availableStock = selectedVariant ? stockOf(selectedVariant) : 0;
  const hasVariants = variants.length > 0;
  const canOrder = Boolean(selectedVariant && availableStock > 0 && quantity <= availableStock);
  const currentPrice = selectedVariant ? priceOf(selectedVariant) : product.price;

  const handleAdd = () => {
    if (!canOrder || !selectedVariant || !activeColor) return;
    addToCart({
      id: `prod-${product.id}-${Date.now()}`,
      isCustom: false,
      productId: product.id,
      title: product.title,
      silhouetteName: product.category === 'hoodie' ? 'French Terry Hoodie' : 'Heavyweight Boxy Tee',
      price: currentPrice,
      quantity,
      size: selectedVariant.size,
      colorName: selectedVariant.color,
      colorHex: hexOf(selectedVariant.color),
      image: product.image,
      specsSummary: `${selectedVariant.gsm || product.gsm} • ${product.fit}`,
      customDetails: { gsm: String(selectedVariant.gsm || product.gsm || '') },
    });
    setQuickViewProduct(null);
  };

  const handleRemix = () => {
    const cleanText = product.title.replace(/['"“”]/g, '').toUpperCase();
    setCustomProjectText(cleanText);
    setQuickViewProduct(null);
    setActiveScreen('studio');
  };

  const chooseColor = (idx: number) => {
    const nextColor = colors[idx];
    setSelectedColorIdx(idx);
    const nextVariant = variants.find((variant) => nextColor && variant.color.toLowerCase() === nextColor.name.toLowerCase() && (!selectedSize || variant.size === selectedSize) && (!selectedGsm || String(variant.gsm ?? '') === selectedGsm) && stockOf(variant) > 0)
      || variants.find((variant) => nextColor && variant.color.toLowerCase() === nextColor.name.toLowerCase() && stockOf(variant) > 0);
    if (nextVariant) {
      setSelectedSize(nextVariant.size);
      setSelectedGsm(String(nextVariant.gsm ?? ''));
      setQuantity(1);
    }
  };

  const chooseSize = (size: string) => {
    const nextVariant = variants.find((variant) => activeColor && variant.color.toLowerCase() === activeColor.name.toLowerCase() && variant.size === size && (!selectedGsm || String(variant.gsm ?? '') === selectedGsm) && stockOf(variant) > 0)
      || variants.find((variant) => activeColor && variant.color.toLowerCase() === activeColor.name.toLowerCase() && variant.size === size && stockOf(variant) > 0);
    setSelectedSize(size);
    if (nextVariant) {
      setSelectedGsm(String(nextVariant.gsm ?? ''));
      setQuantity(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setQuickViewProduct(null)} />
      <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-[#e2e3e1] overflow-hidden z-10 flex flex-col md:flex-row max-h-[95vh] overflow-y-auto">
        <div className="w-full md:w-1/2 aspect-[3/4] bg-[#f4f4f2] relative border-b md:border-b-0 md:border-r border-[#e2e3e1]">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          {product.badge && <span className="absolute top-3 left-3 bg-[#2f3130] text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider font-semibold">{product.badge}</span>}
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-[#ff5a36] uppercase tracking-wider font-semibold">{product.edition}</span>
                <h3 className="text-lg font-bold text-[#1a1c1b] font-display mt-0.5">{product.title}</h3>
              </div>
              <button type="button" aria-label="Close product details" onClick={() => setQuickViewProduct(null)} className="text-[#5f5e5e] hover:text-[#1a1c1b] p-1"><span className="material-symbols-outlined text-xl">close</span></button>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold text-[#1a1c1b] font-display">₹{currentPrice.toLocaleString('en-IN')}</span>
              {product.originalPrice && <span className="text-xs text-[#5f5e5e] line-through font-mono">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
            </div>
            {product.description && <p className="text-xs text-[#5f5e5e] mt-3 leading-relaxed">{product.description}</p>}

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium"><span className="text-[#1a1c1b]">Colorway:</span><span className="font-mono text-[#5f5e5e]">{activeColor?.name || 'Unavailable'}</span></div>
              <div className="flex items-center gap-2 flex-wrap">
                {colors.map((color, idx) => {
                  const hasStock = variants.some((variant) => variant.color.toLowerCase() === color.name.toLowerCase() && stockOf(variant) > 0);
                  return <button key={color.name} type="button" disabled={!hasStock && hasVariants} onClick={() => chooseColor(idx)} aria-label={`Select ${color.name}`} className={`w-6 h-6 rounded-full border border-[#dadad8] transition-transform disabled:opacity-30 disabled:cursor-not-allowed ${selectedColorIdx === idx ? 'ring-2 ring-offset-2 ring-[#1a1c1b] scale-110' : ''}`} style={{ backgroundColor: color.hex }} title={`${color.name}${hasStock ? '' : ' (out of stock)'}`} />;
                })}
              </div>
            </div>

            {gsms.length > 1 && <div className="mt-4"><span className="block text-xs mb-1.5 font-medium text-[#1a1c1b]">Fabric weight:</span><div className="flex flex-wrap gap-2">{gsms.map((gsm) => <button key={gsm} type="button" onClick={() => { setSelectedGsm(gsm); const available = variants.find((variant) => activeColor && variant.color.toLowerCase() === activeColor.name.toLowerCase() && variant.size === selectedSize && String(variant.gsm ?? '') === gsm && stockOf(variant) > 0); if (available) setQuantity(1); }} className={`px-3 py-2 border text-xs ${selectedGsm === gsm ? 'bg-[#2f3130] text-white border-[#2f3130]' : 'border-[#e2e3e1]'}`}>{gsm}</button>)}</div></div>}

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium"><span className="text-[#1a1c1b]">Garment Size:</span><button type="button" onClick={() => setSizeChartOpen(true)} className="text-[#ff5a36] hover:underline flex items-center gap-0.5 text-[11px]"><span>Size Chart</span><span className="material-symbols-outlined text-[12px]">straighten</span></button></div>
              {sizes.length ? <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">{sizes.map((size) => {
                const sizeVariants = variants.filter((variant) => activeColor && variant.color.toLowerCase() === activeColor.name.toLowerCase() && variant.size === size && (!selectedGsm || String(variant.gsm ?? '') === selectedGsm));
                const stock = sizeVariants.reduce((sum, variant) => sum + stockOf(variant), 0);
                const available = stockVariantsForSize(variants, activeColor?.name, size, selectedGsm).length > 0;
                return <button key={size} type="button" disabled={!available} onClick={() => chooseSize(size)} className={`h-9 rounded-sm border transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${selectedSize === size ? 'bg-[#2f3130] text-white font-bold border-[#2f3130]' : 'border-[#e2e3e1] text-[#1a1c1b] hover:border-[#1a1c1b] bg-white'}`} title={available ? `${stock} in stock` : 'Out of stock'}>{size}</button>;
              })}</div> : <p className="text-xs text-red-600">No size variants have been added for this product.</p>}
              {selectedVariant && availableStock > 0 && <p className="mt-1 text-[11px] text-[#5f5e5e]">{availableStock} available</p>}
              {hasVariants && !selectedVariant && <p className="mt-1 text-[11px] text-red-600">This combination is unavailable. Choose another color, size, or fabric weight.</p>}
              {!hasVariants && <p className="mt-1 text-[11px] text-red-600">No inventory variants are configured. Ordering is disabled until stock is added in admin.</p>}
            </div>

            <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#1a1c1b]">Quantity:</span><div className="flex items-center border border-[#e2e3e1] rounded-xs bg-white"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec]">−</button><span className="w-8 text-center font-mono text-xs font-bold text-[#1a1c1b]">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={!selectedVariant || quantity >= availableStock} onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} className="w-7 h-7 flex items-center justify-center text-[#1a1c1b] hover:bg-[#eeeeec] disabled:opacity-30">+</button></div></div>
          </div>

          <div className="mt-6 space-y-2">
            <button type="button" disabled={!canOrder} onClick={() => productWhatsApp(product, selectedVariant?.color || activeColor?.name || 'Not selected', selectedVariant?.size || selectedSize, quantity)} className="w-full py-3 bg-[#168b50] hover:bg-[#117040] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm">Order via WhatsApp</button>
            <button type="button" disabled={!canOrder} onClick={handleAdd} className="w-full h-11 bg-[#ff5a36] hover:bg-[#e84a27] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-base">shopping_bag</span><span>{canOrder ? `Add to Bag • ₹${(currentPrice * quantity).toLocaleString('en-IN')}` : 'Unavailable'}</span></button>
            <button type="button" onClick={handleRemix} className="w-full h-9 bg-white border border-[#e2e3e1] hover:border-[#1a1c1b] text-[#1a1c1b] font-medium text-xs rounded-sm transition-colors flex items-center justify-center gap-1.5 font-mono"><span className="material-symbols-outlined text-sm">edit</span><span>Remix this artwork in Studio</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

function stockVariantsForSize(variants: ApiVariant[], colorName: string | undefined, size: string, gsm: string) {
  return variants.filter((variant) => (!colorName || variant.color.toLowerCase() === colorName.toLowerCase()) && variant.size === size && (!gsm || String(variant.gsm ?? '') === gsm) && stockOf(variant) > 0);
}

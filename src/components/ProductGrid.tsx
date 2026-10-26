
import React, { useEffect, useState } from 'react';
import { productWhatsApp } from '../lib/whatsapp';
import { useStore } from '../store/useStore';
import { Product } from '../types';

// Your working PHP API endpoint.
const API_URL =
  'http://localhost/shabeena_work/php-api/public/api/products';

// IMPORTANT: Change this if your admin panel is in a different folder.
// This should point to the folder containing products.php.
const ADMIN_BASE_URL =
  'http://localhost/shabeena_work/admin/';

type ApiProduct = {
  id: string | number;
  slug?: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string | null;
  image?: string | null;
  price_paise?: number | string;
  price?: number | string;
  active?: number | string | boolean;
  gsm?: string | number;
  fit?: string;
  edition?: string;
  badge?: string;
  colors?: Array<{ name: string; hex: string }>;
  variants?: ApiVariant[];
};

type ApiVariant = {
  id: string | number;
  product_id: string | number;
  size: string;
  color: string;
  gsm?: string | number | null;
  price_paise: number | string;
  stock: number | string;
};

type ProductColor = { name: string; hex: string };
type StoreProduct = Product & {
  variants?: ApiVariant[];
  sizes?: string[];
  description?: string;
  originalPrice?: number;
};

function colorHex(name: string): string {
  const known: Record<string, string> = {
    black: '#222222', white: '#f5f5f5', red: '#d62828', blue: '#2563eb',
    navy: '#1e293b', green: '#15803d', olive: '#65743a', grey: '#808080',
    gray: '#808080', beige: '#d6c2a1', cream: '#f2e8d5', brown: '#795548',
    pink: '#ec4899', purple: '#7e22ce', yellow: '#eab308', orange: '#f97316',
  };
  return known[name.trim().toLowerCase()] || '#b8b8b8';
}

function variantPrice(variant: ApiVariant): number {
  const paise = Number(variant.price_paise);
  return Number.isFinite(paise) ? paise / 100 : 0;
}

function variantStock(variant: ApiVariant): number {
  const stock = Number(variant.stock);
  return Number.isFinite(stock) ? Math.max(0, stock) : 0;
}

function resolveImageUrl(image?: string | null): string {
  if (!image) return '';

  const path = image.trim();

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith('//')) {
    return `${window.location.protocol}${path}`;
  }

  // A path beginning with / is relative to the web server root.
  if (path.startsWith('/')) {
    return `http://localhost${path}`;
  }

  // Relative upload paths are stored relative to the admin directory.
  return new URL(path, ADMIN_BASE_URL).href;
}

function getProductPrice(item: ApiProduct): number {
  // The PHP database stores prices in paise.
  if (item.price_paise !== undefined && item.price_paise !== null) {
    const paise = Number(item.price_paise);
    return Number.isFinite(paise) ? paise / 100 : 0;
  }

  // Some API responses may already return the price in rupees.
  const rupees = Number(item.price ?? 0);
  return Number.isFinite(rupees) ? rupees : 0;
}

function normalizeProduct(item: ApiProduct): Product {
  const category = (item.category || 'T-Shirts').trim();
  const normalizedCategory = category.toLowerCase();
  const variants = Array.isArray(item.variants) ? item.variants : [];
  const variantColors: ProductColor[] = [];
  for (const variant of variants) {
    const name = String(variant.color || '').trim();
    if (name && !variantColors.some((color) => color.name.toLowerCase() === name.toLowerCase())) {
      variantColors.push({ name, hex: colorHex(name) });
    }
  }
  const colors = variantColors.length
    ? variantColors
    : item.colors && item.colors.length > 0
      ? item.colors
      : [];
  const sizes = Array.from(new Set(variants.map((variant) => String(variant.size || '').trim()).filter(Boolean)));
  const prices = variants.map(variantPrice).filter((price) => price > 0);
  const product = {
    id: String(item.id),
    slug: item.slug || String(item.id),
    title: item.title,
    category: normalizedCategory.includes('hoodie') ? 'hoodie' : category,
    price: prices.length ? Math.min(...prices) : getProductPrice(item),
    image: resolveImageUrl(item.image_url || item.image),
    colors,
    sizes,
    variants,
    description: item.description || '',
    gsm: String(variants.find((variant) => variant.gsm)?.gsm ?? item.gsm ?? '—'),
    fit: item.fit ?? 'Relaxed Fit',
    fabric: 'Cotton',
    edition: item.edition ?? category.toUpperCase(),
    badge: item.badge ?? '',
  } as unknown as StoreProduct;
  return product as Product;
}

function extractProducts(response: unknown): ApiProduct[] {
  // Support APIs returning either an array or an object containing products.
  if (Array.isArray(response)) {
    return response as ApiProduct[];
  }

  if (response && typeof response === 'object') {
    const data = response as {
      products?: unknown;
      data?: unknown;
    };

    if (Array.isArray(data.products)) {
      return data.products as ApiProduct[];
    }

    if (Array.isArray(data.data)) {
      return data.data as ApiProduct[];
    }
  }

  throw new Error(
    'The products API returned an unexpected response format.'
  );
}

export const ProductGrid: React.FC = () => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    setCustomProjectText,
    setActiveScreen,
  } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [selectedColors, setSelectedColors] = useState<{
    [productId: string]: number;
  }>({});

  const [addedItemNotice, setAddedItemNotice] =
    useState<string | null>(null);

  // Fetch products from PHP/MySQL when the component mounts.
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setApiError(null);

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(
            `Products API returned HTTP ${response.status}.`
          );
        }

        const json: unknown = await response.json();
        const apiProducts = extractProducts(json);

        const mappedProducts = apiProducts
          .filter((item) => {
            // If active is supplied, only display active products.
            if (item.active === undefined || item.active === null) {
              return true;
            }

            return !(
              item.active === false ||
              item.active === 0 ||
              item.active === '0'
            );
          })
          .map(normalizeProduct);

        setProducts(mappedProducts);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Failed to load products:', error);

        setApiError(
          error instanceof Error
            ? error.message
            : 'Unable to load products.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const handleQuickAdd = (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const item = product as StoreProduct;
    const variants = item.variants || [];
    if (!variants.length) {
      setQuickViewProduct(product);
      return;
    }

    const colorIdx = selectedColors[product.id] ?? 0;
    const color = product.colors[colorIdx] || product.colors[0];
    const matchingColor = variants.filter((variant) =>
      color ? variant.color.toLowerCase() === color.name.toLowerCase() : true
    );
    const inStock = matchingColor.filter((variant) => variantStock(variant) > 0);
    const variant = inStock.find((candidate) => candidate.size.toUpperCase() === 'L') || inStock[0];
    if (!variant) {
      setQuickViewProduct(product);
      return;
    }

    addToCart({
      id: `prod-${product.id}-${Date.now()}`,
      isCustom: false,
      productId: product.id,
      title: product.title,
      silhouetteName: product.category === 'hoodie' ? 'French Terry Hoodie' : 'Heavyweight Boxy Tee',
      price: variantPrice(variant),
      quantity: 1,
      size: variant.size,
      colorName: variant.color,
      colorHex: colorHex(variant.color),
      image: product.image,
      specsSummary: `${variant.gsm || product.gsm} • ${product.fit}`,
      customDetails: { gsm: String(variant.gsm || product.gsm || '') },
    });

    setAddedItemNotice(`${product.title} (${variant.size}, ${variant.color})`);
    window.setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const handleRemixInStudio = (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const cleanText = product.title
      .replace(/['"“”]/g, '')
      .toUpperCase();

    setCustomProjectText(cleanText);
    setActiveScreen('studio');
  };

  return (
    <section
      className="py-16 md:py-24 bg-[#f9f9f7] border-b border-[#e2e3e1]"
      id="featured-collection"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest text-[#ff5a36] uppercase font-semibold">
            Drop 04 Archive
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1c1b] tracking-tight mt-1 font-display">
            Made To Make A Statement.
          </h2>

          <p className="text-base text-[#5f5e5e] max-w-2xl mt-2">
            Curated streetwear graphics, witty cultural motifs, and raw
            typography on luxury silhouettes.
          </p>
        </div>

        {addedItemNotice && (
          <div className="mb-6 p-3 bg-[#2f3130] text-white text-xs font-mono flex items-center justify-between rounded-sm">
            <span>Added {addedItemNotice} to Bag</span>
            <span className="text-[#ff5a36] font-bold">
              ADDED
            </span>
          </div>
        )}

        {loading && (
          <div className="py-16 text-center text-[#5f5e5e]">
            Loading products...
          </div>
        )}

        {!loading && apiError && (
          <div className="py-8 px-4 border border-red-300 bg-red-50 text-red-800">
            <p className="font-semibold">Unable to load products.</p>
            <p className="text-sm mt-2">{apiError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#2f3130] text-white text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !apiError && products.length === 0 && (
          <div className="py-16 text-center text-[#5f5e5e]">
            <p className="text-lg font-semibold">No products available yet.</p>
            <p className="text-sm mt-2">
              Add an active product in your admin panel and refresh this page.
            </p>
          </div>
        )}

        {!loading && !apiError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const activeColorIdx = selectedColors[product.id] || 0;
              const activeColor = product.colors[activeColorIdx];

              return (
                <div
                  key={product.id}
                  onClick={() => setQuickViewProduct(product)}
                  className="bg-white border border-[#e2e3e1] group hover:border-[#1a1c1b] transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f2]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          console.error(
                            'Product image failed to load:',
                            product.image
                          );
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-[#5f5e5e]">
                        No image available
                      </div>
                    )}

                    {product.badge && (
                      <div
                        className={`absolute top-3 left-3 text-[9px] px-2 py-0.5 uppercase tracking-widest font-mono font-semibold ${
                          product.badge === 'BESTSELLER'
                            ? 'bg-[#ff5a36] text-white'
                            : 'bg-[#2f3130] text-white'
                        }`}
                      >
                        {product.badge}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label="Add to Wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1a1c1b] hover:text-[#ff5a36] transition-colors shadow-sm"
                      type="button"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isWishlisted ? 'text-[#ff5a36] fill' : ''
                        }`}
                      >
                        favorite
                      </span>
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white via-white/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="flex-1 py-2.5 bg-[#2f3130] hover:bg-black text-[#f1f1ef] text-xs font-semibold rounded-sm transition-colors text-center"
                        type="button"
                      >
                        Quick Add
                      </button>

                      <button
                        onClick={(e) => handleRemixInStudio(product, e)}
                        title="Customize This Graphic in Studio"
                        className="px-2.5 py-2.5 bg-white border border-[#e2e3e1] hover:border-[#ff5a36] text-[#1a1c1b] text-xs font-semibold rounded-sm transition-colors text-center flex items-center justify-center"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          edit
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const variants = (product as StoreProduct).variants || [];
                      const matching = variants.filter((variant) =>
                        activeColor ? variant.color.toLowerCase() === activeColor.name.toLowerCase() : true
                      );
                      const enquiryVariant = matching.find((variant) => variant.size.toUpperCase() === 'L' && variantStock(variant) > 0)
                        || matching.find((variant) => variantStock(variant) > 0);
                      productWhatsApp(
                        product,
                        enquiryVariant?.color || activeColor?.name || 'Not selected',
                        enquiryVariant?.size || 'Select size',
                        1
                      );
                    }}
                    className="mx-4 mt-3 bg-[#168b50] text-white py-2 text-xs font-semibold hover:bg-[#117040]"
                  >
                    WhatsApp Enquiry · Available Size
                  </button>

                  <div className="p-4 flex flex-col space-y-3">
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.colors.map((color, idx) => {
                        const isActiveColor = activeColorIdx === idx;

                        return (
                          <button
                            key={color.name}
                            type="button"
                            aria-label={`Select ${color.name}`}
                            onClick={() =>
                              setSelectedColors((prev) => ({
                                ...prev,
                                [product.id]: idx,
                              }))
                            }
                            className={`w-3.5 h-3.5 rounded-full border border-[#dadad8] transition-all ${
                              isActiveColor
                                ? 'ring-1 ring-offset-1 ring-[#1a1c1b] scale-110'
                                : ''
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-[#1a1c1b] group-hover:text-[#ff5a36] transition-colors leading-snug">
                          {product.title}
                        </h3>

                        <span className="font-mono text-[10px] tracking-wider text-[#5f5e5e] uppercase">
                          {product.edition}
                        </span>
                      </div>

                      <div className="text-base text-[#1a1c1b] font-bold whitespace-nowrap font-display">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

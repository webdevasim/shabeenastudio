
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "../../../store/useStore";
import type { CartItem } from "../../../types";

const API_URL =
  "http://localhost/shabeena_work/php-api/public/api/products";

const ADMIN_BASE_URL =
  "http://localhost/shabeena_work/admin/";

interface ApiVariant {
  id: number | string;
  product_id?: number | string;
  size?: string | null;
  color?: string | null;
  gsm?: string | number | null;
  price_paise?: number | string | null;
  stock?: number | string | null;
}

interface ApiProduct {
  id: number | string;
  slug?: string | null;
  title?: string;
  name?: string;
  description?: string | null;
  category?: string | null;
  price?: number | string | null;
  price_paise?: number | string | null;
  base_price_paise?: number | string | null;
  image?: string | null;
  image_url?: string | null;
  gsm?: string | null;
  fit?: string | null;
  fabric?: string | null;
  variants?: ApiVariant[];
}

function resolveImage(path?: string | null): string {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  if (path.startsWith("/")) {
    return `http://localhost${path}`;
  }

  return new URL(path, ADMIN_BASE_URL).href;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function getBasePrice(product: ApiProduct): number {
  if (product.price_paise != null) {
    return Number(product.price_paise) / 100;
  }

  if (product.base_price_paise != null) {
    return Number(product.base_price_paise) / 100;
  }

  return Number(product.price ?? 0);
}

function getVariantPrice(
  variant: ApiVariant,
  fallback: number
): number {
  if (variant.price_paise == null) return fallback;
  return Number(variant.price_paise) / 100;
}

function colorToHex(color: string): string {
  const colors: Record<string, string> = {
    black: "#111111",
    white: "#FFFFFF",
    red: "#DC2626",
    blue: "#2563EB",
    navy: "#1E3A5F",
    green: "#15803D",
    olive: "#708238",
    yellow: "#FACC15",
    pink: "#EC4899",
    purple: "#9333EA",
    grey: "#808080",
    gray: "#808080",
    beige: "#D5C5A3",
    cream: "#FFFDD0",
    brown: "#92400E",
    maroon: "#800000",
    orange: "#F97316",
  };

  const normalized = color.trim().toLowerCase();

  if (/^#[0-9a-f]{3,8}$/i.test(normalized)) {
    return normalized;
  }

  return colors[normalized] ?? "#888888";
}

function extractProducts(payload: unknown): ApiProduct[] {
  if (Array.isArray(payload)) {
    return payload as ApiProduct[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const response = payload as Record<string, unknown>;

  if (Array.isArray(response.products)) {
    return response.products as ApiProduct[];
  }

  if (Array.isArray(response.data)) {
    return response.data as ApiProduct[];
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    Array.isArray(
      (response.data as Record<string, unknown>).products
    )
  ) {
    return (response.data as { products: ApiProduct[] }).products;
  }

  return [];
}

export default function ProductPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");

  const addToCart = useStore((state) => state.addToCart);

  const [product, setProduct] = useState<ApiProduct | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariantId, setSelectedVariantId] =
    useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setSelectedVariantId("");
      setQuantity(1);

      try {
        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Products API returned ${response.status}`
          );
        }

        const payload: unknown = await response.json();
        const products = extractProducts(payload);

        const found = products.find(
          (item) =>
            String(item.slug ?? "") === slug ||
            String(item.id) === slug
        );

        if (cancelled) return;

        if (!found) {
          setError("Product not found.");
          return;
        }

        setProduct(found);

        const variants = Array.isArray(found.variants)
          ? found.variants
          : [];

        const firstAvailable = variants.find(
          (variant) => Number(variant.stock ?? 0) > 0
        );

        setSelectedVariantId(
          firstAvailable
            ? String(firstAvailable.id)
            : variants.length > 0
              ? String(variants[0].id)
              : ""
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load product."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const variants = useMemo(
    () =>
      product && Array.isArray(product.variants)
        ? product.variants
        : [],
    [product]
  );

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (variant) =>
          String(variant.id) === selectedVariantId
      ) ?? null,
    [variants, selectedVariantId]
  );

  const basePrice = product ? getBasePrice(product) : 0;

  const currentPrice = selectedVariant
    ? getVariantPrice(selectedVariant, basePrice)
    : basePrice;

  const stock = selectedVariant
    ? Number(selectedVariant.stock ?? 0)
    : 0;

  const isAvailable =
    Boolean(selectedVariant) && stock > 0;

  const title = product?.title || product?.name || "Product";
  const image = resolveImage(
    product?.image_url || product?.image
  );

  function handleAddToCart() {
    if (!product || !selectedVariant || !isAvailable) {
      return;
    }

    const size = String(selectedVariant.size ?? "");
    const color = String(selectedVariant.color ?? "");
    const gsm = String(selectedVariant.gsm ?? "");

    const item: CartItem = {
      id: crypto.randomUUID(),
      isCustom: false,
      productId: String(product.id),
      title,
      silhouetteName: product.category || "Product",
      price: currentPrice,
      quantity,
      size: size || "Standard",
      colorName: color || "Standard",
      colorHex: colorToHex(color),
      image,
      specsSummary: [
        size && `Size: ${size}`,
        color && `Color: ${color}`,
        gsm && `GSM: ${gsm}`,
        `Variant ID: ${selectedVariant.id}`,
      ]
        .filter(Boolean)
        .join(" | "),
    };

    addToCart(item);
    setAdded(true);

    // Reset the confirmation when another variant is selected.
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f9f9f7] p-10">
        <p className="text-gray-600">Loading product...</p>
      </main>
    );
  }

  if (!product || error) {
    return (
      <main className="min-h-screen bg-[#f9f9f7] p-10">
        <h1 className="mb-4 text-2xl font-bold">
          {error || "Product not found."}
        </h1>
        <Link href="/shop" className="underline">
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f9f7] px-5 py-8 md:px-16 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/shop"
          className="text-sm font-medium hover:text-[#ff5a36]"
        >
          ← Back to shop
        </Link>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-[#eeeeea]">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full max-h-[650px] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-gray-500">
                No product image
              </div>
            )}
          </div>

          <section className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff5a36]">
                {product.category || "Shabeena Studio"}
              </p>

              <h1 className="text-3xl font-bold text-[#1a1c1b] md:text-4xl">
                {title}
              </h1>
            </div>

            {product.description && (
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            <div>
              <p className="text-3xl font-bold">
                ₹{formatPrice(currentPrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Price for selected variant
              </p>
            </div>

            {variants.length > 0 ? (
              <div>
                <h2 className="mb-3 font-bold">
                  Choose your variant
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {variants.map((variant) => {
                    const available =
                      Number(variant.stock ?? 0) > 0;

                    const selected =
                      String(variant.id) ===
                      selectedVariantId;

                    return (
                      <button
                        key={String(variant.id)}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          setSelectedVariantId(
                            String(variant.id)
                          );
                          setQuantity(1);
                          setAdded(false);
                        }}
                        className={`rounded-lg border p-4 text-left transition ${
                          selected
                            ? "border-[#ff5a36] bg-orange-50"
                            : "border-gray-300 bg-white"
                        } ${
                          available
                            ? "hover:border-[#ff5a36]"
                            : "cursor-not-allowed opacity-45"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {variant.color && (
                            <span
                              className="h-4 w-4 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: colorToHex(
                                  String(variant.color)
                                ),
                              }}
                            />
                          )}

                          <span className="font-semibold">
                            {variant.color || "Standard"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm">
                          Size: {variant.size || "Standard"}
                        </p>

                        {variant.gsm && (
                          <p className="text-sm">
                            GSM: {variant.gsm}
                          </p>
                        )}

                        <p className="mt-2 font-bold">
                          ₹
                          {formatPrice(
                            getVariantPrice(
                              variant,
                              basePrice
                            )
                          )}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            available
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {available
                            ? `${variant.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-600">
                No purchasable variants are currently available.
              </p>
            )}

            {selectedVariant && (
              <div className="rounded-lg bg-white p-4 text-sm">
                <p className="font-semibold">
                  Selected configuration
                </p>

                <p className="mt-2 text-gray-600">
                  {selectedVariant.color || "Standard color"}
                  {" · "}
                  {selectedVariant.size || "Standard size"}
                  {selectedVariant.gsm
                    ? ` · ${selectedVariant.gsm} GSM`
                    : ""}
                </p>
              </div>
            )}

            <div>
              <h2 className="mb-2 text-sm font-bold">
                Quantity
              </h2>

              <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                  disabled={!isAvailable}
                  className="px-5 py-3 disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-10 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(stock, value + 1)
                    )
                  }
                  disabled={!isAvailable || quantity >= stock}
                  className="px-5 py-3 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="w-full rounded-lg bg-[#ff5a36] px-8 py-4 font-bold text-white transition hover:bg-[#e84c2b] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {!isAvailable
                ? "Out of stock"
                : `Add to cart — ₹${formatPrice(
                    currentPrice * quantity
                  )}`}
            </button>

            {added && (
              <p
                role="status"
                className="text-sm font-medium text-green-700"
              >
                Added to cart successfully.
              </p>
            )}

            <p className="text-sm">
              Want your own design?{" "}
              <Link
                href="/customize"
                className="font-bold text-[#ff5a36] hover:underline"
              >
                Customize your own →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

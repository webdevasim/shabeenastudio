
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_URL =
  "http://localhost/shabeena_work/php-api/public/api/products";

const categories: Record<string, {
  title: string;
  keywords: string[];
}> = {
  "t-shirts": {
    title: "Graphic T-Shirts",
    keywords: ["t-shirt", "tshirt", "tee"],
  },
  hoodies: {
    title: "Hoodies & Sweats",
    keywords: ["hoodie", "sweatshirt", "sweat"],
  },
  mugs: {
    title: "Custom Mugs",
    keywords: ["mug"],
  },
  caps: {
    title: "Printed Caps",
    keywords: ["cap", "hat"],
  },
};

type ApiProduct = {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  image_url: string | null;
  price_paise: number | string;
  variants?: {
    price_paise: number | string;
    stock: number | string;
  }[];
};

function imageUrl(path: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `http://localhost${path}`;

  return new URL(path, "http://localhost/shabeena_work/admin/").href;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const category = categories[slug];

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Unable to fetch products");

        const data = await response.json();
        const all: ApiProduct[] = Array.isArray(data)
          ? data
          : data.products ?? [];

        setProducts(
          all.filter((product) =>
            category.keywords.some((keyword) =>
              (product.category || "").toLowerCase().includes(keyword)
            )
          )
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Loading failed");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [slug]);

  if (!category) {
    return <main className="p-12">Category not found.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f9f9f7] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm hover:text-[#ff5a36]">
          ← Back to Home
        </Link>

        <h1 className="mt-8 mb-3 text-4xl font-bold text-[#1a1c1b]">
          {category.title}
        </h1>

        <p className="mb-10 text-sm text-[#5f5e5e]">
          Explore our {category.title.toLowerCase()} collection.
        </p>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p>No products in this category yet.</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const availablePrices = (product.variants ?? [])
              .filter((v) => Number(v.stock) > 0)
              .map((v) => Number(v.price_paise))
              .filter((p) => Number.isFinite(p) && p >= 0);

            const pricePaise = availablePrices.length
              ? Math.min(...availablePrices)
              : Number(product.price_paise);

            const price = pricePaise / 100;

            return (
              <Link
                key={product.id}
                href={`/shop/${product.slug || product.id}`}
                className="group overflow-hidden border border-[#e2e3e1] bg-white hover:border-[#1a1c1b]"
              >
                <div className="aspect-[3/4] bg-[#f4f4f2]">
                  {product.image_url && (
                    <img
                      src={imageUrl(product.image_url)}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-semibold text-[#1a1c1b]">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-lg font-bold">
                    ₹{price.toLocaleString("en-IN")}
                  </p>

                  <span className="mt-3 inline-block text-xs font-semibold text-[#ff5a36]">
                    View Product →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

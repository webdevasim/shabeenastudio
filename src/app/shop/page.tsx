
"use client";

import React from "react";
import Link from "next/link";
import { ProductGrid } from "../../components/ProductGrid";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1c1b] hover:text-[#ff5a36]"
        >
          <span className="material-symbols-outlined text-lg">
            arrow_back
          </span>
          Back to Home
        </Link>
      </div>

      <ProductGrid />
    </main>
  );
}

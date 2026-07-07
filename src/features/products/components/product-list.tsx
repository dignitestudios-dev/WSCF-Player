"use client";

import ProductCard from "@/features/products/components/product-card";
import { useProducts } from "@/features/products/hooks/use-products";

export default function ProductList() {
  const { products, isLoading, isError, total } = useProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-600">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-zinc-500">{total} products available</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

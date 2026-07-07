import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import ProductList from "@/features/products/components/product-list";

export const metadata: Metadata = createPageMetadata("products");

export default function ProductsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Products</h1>
      <p className="mb-8 text-zinc-600">Browse our product catalog.</p>
      <ProductList />
    </div>
  );
}

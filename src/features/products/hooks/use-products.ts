"use client";

import { useState } from "react";
import { useProductsQuery } from "@/features/products/api/products.queries";

export function useProducts() {
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isError } = useProductsQuery(limit);

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    limit,
    setLimit,
  };
}

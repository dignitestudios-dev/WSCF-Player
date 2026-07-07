import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api/products.service";

export function useProductsQuery(limit: number) {
  return useQuery({
    queryKey: ["products", limit],
    queryFn: () => getProducts(limit),
  });
}

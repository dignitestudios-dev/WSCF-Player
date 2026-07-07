import axiosInstance from "@/lib/axios";

export async function getProducts(limit: number): Promise<ProductsResponse> {
  const { data } = await axiosInstance.get<ProductsResponse>("/products", {
    params: { limit },
  });
  return data;
}

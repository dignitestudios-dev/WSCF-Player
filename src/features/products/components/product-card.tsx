"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square w-full bg-zinc-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-base">{product.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-brand">${product.price}</p>
        <p className="text-sm text-zinc-500">{product.brand}</p>
      </CardContent>
    </Card>
  );
}

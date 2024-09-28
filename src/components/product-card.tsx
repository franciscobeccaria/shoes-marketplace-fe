import type { Product } from "@/types/global-types";

import Image from "next/image";
import { Badge } from "@/components/ui/badge"

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[400px] transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
    >
      <div className="relative h-[360px]">
        <Image fill={true} src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {product.store}
        </Badge>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-gray-600 text-lg font-bold mb-1">$ {product.price.toLocaleString()}</p>
        <h2 className="text-base font-semibold line-clamp-2 h-12">{product.name}</h2>
      </div>
    </a>
  )
}
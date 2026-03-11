"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Sparkles, Crown, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Product, formatPrice, getDiscountPercentage, getBadgeLabel } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const discount = getDiscountPercentage(product.price, product.compareAtPrice);

  return (
    <article className="group relative bg-gradient-to-br from-white via-primary-light/20 to-secondary/10 rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(183,110,121,0.15)] transition-all duration-500 hover:-translate-y-1.5">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-primary-light/30 to-secondary/20">
        <Image
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={product.images[0]?.alt || product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 gap-1 font-semibold">
              <Zap className="h-3 w-3" />
              -{discount}%
            </Badge>
          )}
          {product.badges.map((badge) => (
            <Badge
              key={badge}
              className={
                badge === "bestseller"
                  ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20 gap-1 font-semibold"
                  : badge === "new"
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20 gap-1 font-semibold"
                    : "bg-gradient-to-r from-secondary to-orange-200 text-foreground shadow-md gap-1 font-semibold"
              }
            >
              {badge === "bestseller" && <Crown className="h-3 w-3" />}
              {badge === "new" && <Sparkles className="h-3 w-3" />}
              {badge === "sale" && <Flame className="h-3 w-3" />}
              {getBadgeLabel(badge)}
            </Badge>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white shadow-lg shadow-primary/10 transition-all duration-300"
            aria-label="Thêm vào yêu thích"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart - Desktop on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-primary/40 via-rose-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
          <Button
            className="w-full bg-white/95 backdrop-blur-sm text-primary hover:bg-primary hover:text-white rounded-full shadow-lg transition-all duration-300 font-medium"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Thêm vào giỏ
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.round(product.rating.average) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">({product.rating.count})</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Variants indicator */}
        {product.variants.length > 1 && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50" />
            {product.variants.length} lựa chọn
          </p>
        )}

        {/* Mobile Add to Cart */}
        <Button
          className="w-full mt-3 sm:hidden rounded-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white shadow-md shadow-primary/20"
          size="sm"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Thêm vào giỏ
        </Button>
      </div>
    </article>
  );
}

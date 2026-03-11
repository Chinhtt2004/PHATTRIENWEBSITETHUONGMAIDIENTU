"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedProductsProps {
  title: string;
  filter?: "bestseller" | "new" | "sale";
}

export function FeaturedProducts({ title, filter }: FeaturedProductsProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Filter products based on badges
  const filteredProducts = filter
    ? products.filter((product) => product.badges.includes(filter))
    : products;

  // Take first 8 products for more carousel content
  const displayProducts = filteredProducts.slice(0, 8);

  // If not enough products with the filter, fill with others
  const finalProducts = displayProducts.length < 4
    ? [...displayProducts, ...products.filter(p => !displayProducts.includes(p)).slice(0, 8 - displayProducts.length)]
    : displayProducts;

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-b from-secondary/10 via-muted/20 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="absolute -top-12 right-1/3 w-36 h-36 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 left-1/3 w-28 h-28 bg-secondary/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">
              Những sản phẩm được yêu thích nhất từ khách hàng của chúng tôi
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Sản phẩm trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Sản phẩm sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/products" className="flex items-center gap-2">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Products Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {finalProducts.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} priority={index < 2} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Chuyển đến nhóm sản phẩm ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

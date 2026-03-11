"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

export function CategoriesSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-b from-background via-secondary/10 to-primary-light/20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Khám phá các danh mục sản phẩm đa dạng, từ chăm sóc da đến trang điểm,
              giúp bạn tìm được sản phẩm phù hợp nhất.
            </p>
          </div>
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40"
              aria-label="Danh mục trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40"
              aria-label="Danh mục sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
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
            {categories.map((category, index) => (
              <CarouselItem
                key={category.id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted block"
                >
                  {/* Image */}
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={index < 3}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h3 className="font-medium text-white text-lg mb-1 group-hover:text-primary-light transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      {category.productCount} sản phẩm
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Chuyển đến nhóm ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/data";
import { fetchFlashSale } from "@/lib/api";
import { type Product, getDiscountPercentage } from "@/lib/data";

function getSoldLabel(sold: number, total: number) {
  const percent = (sold / total) * 100;
  if (percent >= 80) return `CHỈ CÒN ${Math.max(total - sold, 1)}`;
  if (sold >= 10) return `Đã bán ${sold}`;
  return "ĐANG BÁN CHẠY";
}

export function FlashSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [colonVisible, setColonVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchFlashSale(15);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load flash sale products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    function calcTimeLeft() {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }
    setTimeLeft(calcTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
      setColonVisible((v) => !v);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / Math.floor(el.clientWidth / 160);
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 3 : cardWidth * 3,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-500">
          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-500 via-primary to-primary-hover overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-1 left-[15%] text-white/20 text-3xl animate-bounce" style={{ animationDuration: '3s' }}>✿</span>
              <span className="absolute bottom-2 left-[40%] text-white/10 text-xl animate-pulse">♡</span>
              <span className="absolute top-3 right-[25%] text-white/20 text-2xl animate-spin-slow">✦</span>
              <span className="absolute bottom-1 right-[10%] text-white/10 text-3xl">❀</span>
              <div className="absolute -top-6 left-[65%] w-24 h-24 rounded-full bg-white/[0.08] blur-xl" />
              <div className="absolute -bottom-6 left-[20%] w-20 h-20 rounded-full bg-white/[0.08] blur-xl" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_2s_infinite]" />
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Flash Sale title */}
              <Link
                href="/sale"
                className="flex items-center gap-2 text-primary-foreground font-extrabold text-xl lg:text-2xl tracking-tighter uppercase group"
              >
                <div className="bg-white/20 p-1 rounded-lg backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 fill-yellow-300 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                </div>
                <span className="drop-shadow-md tracking-tight">Flash Sale</span>
              </Link>

              {/* Countdown - Revamped Card Style */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="relative group/time">
                      <div className="absolute -inset-1 bg-white/20 blur-sm rounded-lg opacity-0 group-hover/time:opacity-100 transition-opacity" />
                      <span className="relative inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-white/30 backdrop-blur-md text-primary-foreground text-sm lg:text-base font-black font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20">
                        {pad(timeLeft.hours)}
                      </span>
                    </div>
                    <span className={cn("text-white/80 font-bold text-lg animate-pulse", !colonVisible && "opacity-30")}>:</span>
                    <div className="relative group/time">
                      <div className="absolute -inset-1 bg-white/20 blur-sm rounded-lg opacity-0 group-hover/time:opacity-100 transition-opacity" />
                      <span className="relative inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-white/30 backdrop-blur-md text-primary-foreground text-sm lg:text-base font-black font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20">
                        {pad(timeLeft.minutes)}
                      </span>
                    </div>
                    <span className={cn("text-white/80 font-bold text-lg animate-pulse", !colonVisible && "opacity-30")}>:</span>
                    <div className="relative group/time">
                      <div className="absolute -inset-1 bg-white/20 blur-sm rounded-lg opacity-0 group-hover/time:opacity-100 transition-opacity" />
                      <span className="relative inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-white/30 backdrop-blur-md text-primary-foreground text-sm lg:text-base font-black font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20">
                        {pad(timeLeft.seconds)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">Kết thúc sau</span>
                </div>
              </div>
            </div>

            <Link
              href="/sale"
              className="relative hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-sm text-primary-foreground font-semibold transition-all duration-300 border border-white/10 group"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product carousel */}
          <div className="relative group/carousel bg-gradient-to-b from-card to-background">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {isLoading ? (
                // Skeleton placeholders
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] animate-pulse p-4 flex flex-col gap-3">
                    <div className="aspect-square bg-muted rounded-xl" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded-full w-full" />
                  </div>
                ))
              ) : products.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center w-full text-muted-foreground gap-3">
                  <div className="p-4 rounded-full bg-muted/50">
                    <Zap className="h-8 w-8 text-muted" />
                  </div>
                  <p className="text-base font-medium">Flash Sale sắp bắt đầu...</p>
                </div>
              ) : (
                products.map((product) => {
                  const discount = getDiscountPercentage(product.price, product.compareAtPrice) || 0;
                  const sold = product.totalSold || 0;
                  const stock = product.inventory?.quantity || 50;
                  const total = sold + stock;
                  const soldPercent = Math.min(Math.round((sold / total) * 100), 100);
                  const label = getSoldLabel(sold, total);
                  const isAlmostGone = soldPercent >= 80;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] mx-2 group/card"
                    >
                      <div className="relative flex flex-col h-full bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 group-hover/card:-translate-y-1">
                        {/* Image + discount badge */}
                        <div className="relative aspect-square overflow-hidden bg-muted/20">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder-product.png"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                          />
                          {/* Discount badge - Pulse effect */}
                          {discount > 0 && (
                            <div className="absolute top-2 right-2 flex flex-col items-center">
                              <div className="relative">
                                <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-25" />
                                <div className="relative bg-gradient-to-br from-rose-500 to-primary text-primary-foreground text-[10px] lg:text-xs font-black px-2 py-1 rounded-full shadow-lg border border-white/20">
                                  -{discount}%
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Hover Overlay Shimmer */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Info */}
                        <div className="p-3 flex flex-col flex-grow">
                          <div className="font-bold text-sm line-clamp-2 mb-2 group-hover/card:text-primary transition-colors min-h-[2.5rem]">
                            {product.name}
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-primary font-black text-base lg:text-lg">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <div className="text-muted-foreground text-xs line-through opacity-70 mb-3">
                                {formatPrice(product.compareAtPrice)}
                              </div>
                            )}

                            {/* Sold progress bar - Revamped with stripes and glow */}
                            <div className="relative h-6 rounded-full bg-muted overflow-hidden border border-border shadow-inner">
                              <div
                                className={cn(
                                  "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out flex items-center justify-center",
                                  isAlmostGone
                                    ? "bg-gradient-to-r from-rose-500 via-primary to-rose-600 animate-pulse"
                                    : "bg-gradient-to-r from-orange-400 to-rose-500"
                                )}
                                style={{ width: `${Math.max(soldPercent, 5)}%` }}
                              >
                                {/* Animated Stripes background */}
                                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-pulse_1s_linear_infinite]" />
                              </div>
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white mix-blend-difference drop-shadow-sm uppercase tracking-tight">
                                {isAlmostGone ? "⚡ SẮP HẾT " : ""}{label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Scroll arrows - Redesigned */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 backdrop-blur-md shadow-xl border border-border rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white hover:text-primary hover:scale-110"
                aria-label="Cuộn trái"
              >
                <ChevronLeft className="h-6 w-6 transition-transform" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 backdrop-blur-md shadow-xl border border-border rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white hover:text-primary hover:scale-110"
                aria-label="Cuộn phải"
              >
                <ChevronRight className="h-6 w-6 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
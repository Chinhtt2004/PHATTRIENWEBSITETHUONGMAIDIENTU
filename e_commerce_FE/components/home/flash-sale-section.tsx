"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/data";

interface FlashSaleItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  sold: number;
  total: number;
}

const flashSaleItems: FlashSaleItem[] = [
  {
    id: "fs1",
    name: "Serum Vitamin C 20%",
    slug: "serum-vitamin-c-20",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    price: 275000,
    originalPrice: 550000,
    discount: 50,
    sold: 87,
    total: 100,
  },
  {
    id: "fs2",
    name: "Kem Chống Nắng SPF50+",
    slug: "kem-chong-nang-spf50",
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop",
    price: 195000,
    originalPrice: 350000,
    discount: 44,
    sold: 65,
    total: 100,
  },
  {
    id: "fs3",
    name: "Mặt Nạ Collagen",
    slug: "mat-na-duong-am-collagen",
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
    price: 29000,
    originalPrice: 99000,
    discount: 71,
    sold: 234,
    total: 300,
  },
  {
    id: "fs4",
    name: "Toner Hoa Hồng",
    slug: "toner-hoa-hong",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    price: 120000,
    originalPrice: 280000,
    discount: 57,
    sold: 4,
    total: 50,
  },
  {
    id: "fs5",
    name: "Son Môi Lì Velvet",
    slug: "son-moi-li-velvet",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    price: 89000,
    originalPrice: 250000,
    discount: 64,
    sold: 156,
    total: 200,
  },
  {
    id: "fs6",
    name: "Kem Dưỡng Ẩm HA",
    slug: "kem-duong-am-hyaluronic-acid",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
    price: 199000,
    originalPrice: 380000,
    discount: 48,
    sold: 42,
    total: 80,
  },
  {
    id: "fs7",
    name: "Sữa Rửa Mặt Dịu Nhẹ",
    slug: "sua-rua-mat-diu-nhe",
    image:
      "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=400&h=400&fit=crop",
    price: 150000,
    originalPrice: 300000,
    discount: 50,
    sold: 3,
    total: 30,
  },
  {
    id: "fs8",
    name: "Nước Tẩy Trang",
    slug: "nuoc-tay-trang-micellar",
    image:
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop",
    price: 99000,
    originalPrice: 220000,
    discount: 55,
    sold: 178,
    total: 200,
  },
  {
    id: "fs9",
    name: "Tinh Chất Retinol",
    slug: "serum-vitamin-c-20",
    image:
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop",
    price: 320000,
    originalPrice: 650000,
    discount: 51,
    sold: 12,
    total: 50,
  },
  {
    id: "fs10",
    name: "Xịt Khoáng Cấp Ẩm",
    slug: "kem-chong-nang-spf50",
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
    price: 75000,
    originalPrice: 180000,
    discount: 58,
    sold: 290,
    total: 300,
  },
];

function getSoldLabel(sold: number, total: number) {
  const percent = (sold / total) * 100;
  if (percent >= 80) return `CHỈ CÒN ${total - sold}`;
  if (sold >= 10) return `Đã bán ${sold}`;
  return "ĐANG BÁN CHẠY";
}

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [colonVisible, setColonVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section className="py-6 lg:py-8">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
          {/* Header */}
          <div className="relative flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary via-rose-400 to-primary-hover overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-1 left-[20%] text-white/10 text-2xl">✿</span>
              <span className="absolute bottom-1 left-[35%] text-white/10 text-lg">♡</span>
              <span className="absolute top-0.5 right-[30%] text-white/10 text-xl">✦</span>
              <span className="absolute bottom-0 right-[15%] text-white/10 text-2xl">❀</span>
              <div className="absolute -top-4 left-[60%] w-16 h-16 rounded-full bg-white/[0.05] blur-lg" />
              <div className="absolute -bottom-4 left-[25%] w-12 h-12 rounded-full bg-white/[0.05] blur-lg" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
            </div>

            <div className="relative flex items-center gap-4">
              {/* Flash Sale title */}
              <Link
                href="/sale"
                className="flex items-center gap-1.5 text-primary-foreground font-bold text-lg tracking-wide uppercase"
              >
                <Zap className="h-5 w-5 fill-current drop-shadow-md" />
                <span className="drop-shadow-sm">Flash Sale</span>
                <span className="text-white/60 text-xs ml-0.5">✦</span>
              </Link>

              {/* Countdown */}
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/25 backdrop-blur-sm text-primary-foreground text-xs font-bold font-mono shadow-sm">
                  {pad(timeLeft.hours)}
                </span>
                <span
                  className={cn(
                    "text-primary-foreground font-bold text-sm transition-opacity",
                    colonVisible ? "opacity-100" : "opacity-30"
                  )}
                >
                  :
                </span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/25 backdrop-blur-sm text-primary-foreground text-xs font-bold font-mono shadow-sm">
                  {pad(timeLeft.minutes)}
                </span>
                <span
                  className={cn(
                    "text-primary-foreground font-bold text-sm transition-opacity",
                    colonVisible ? "opacity-100" : "opacity-30"
                  )}
                >
                  :
                </span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/25 backdrop-blur-sm text-primary-foreground text-xs font-bold font-mono shadow-sm">
                  {pad(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <Link
              href="/sale"
              className="relative flex items-center gap-1 text-sm text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product carousel */}
          <div className="relative group/carousel">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {flashSaleItems.map((item) => {
                const soldPercent = Math.round(
                  (item.sold / item.total) * 100
                );
                const label = getSoldLabel(item.sold, item.total);
                const isAlmostGone = soldPercent >= 80;

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className="flex-shrink-0 w-[140px] sm:w-[160px] lg:w-[180px] border-r border-border/30 last:border-r-0 hover:bg-accent/30 transition-colors bg-card group/card"
                  >
                    {/* Image + discount badge */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                      />
                      {/* Discount badge */}
                      <div className="absolute top-0 right-0 bg-gradient-to-b from-rose-400 to-primary text-primary-foreground text-[10px] font-bold px-1.5 py-1 rounded-bl-lg flex flex-col items-center leading-tight shadow-md">
                        <Zap className="h-2.5 w-2.5 fill-current mb-0.5" />
                        <span>-{item.discount}%</span>
                      </div>
                      {/* Hover sparkle */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    </div>

                    {/* Price */}
                    <div className="px-2 pt-2 pb-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-primary font-bold text-sm">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs line-through">
                        {formatPrice(item.originalPrice)}
                      </div>
                    </div>

                    {/* Sold progress bar */}
                    <div className="px-2 pb-3">
                      <div className="relative h-4 rounded-full bg-gradient-to-r from-primary-light to-rose-100 overflow-hidden">
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-full transition-all",
                            isAlmostGone
                              ? "bg-gradient-to-r from-rose-400 via-primary to-primary-hover animate-pulse"
                              : "bg-gradient-to-r from-rose-400 to-primary"
                          )}
                          style={{ width: `${Math.max(soldPercent, 5)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground drop-shadow-sm uppercase">
                          {isAlmostGone ? "🔥 " : ""}{label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Scroll arrows */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-14 bg-card/90 shadow-md border border-border rounded-r-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
                aria-label="Cuộn trái"
              >
                <ChevronLeft className="h-5 w-5 text-foreground/70" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-14 bg-card/90 shadow-md border border-border rounded-l-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
                aria-label="Cuộn phải"
              >
                <ChevronRight className="h-5 w-5 text-foreground/70" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
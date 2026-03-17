"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-light via-background to-secondary/30">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Bộ sưu tập Xuân Hè 2026</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
              Khám Phá
              <span className="text-primary block">Vẻ Đẹp Toàn Diện</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 text-pretty">
              Trải nghiệm các sản phẩm mỹ phẩm cao cấp, được tuyển chọn từ những thương hiệu hàng đầu thế giới. Chăm sóc làn da của bạn với những tinh chất tự nhiên nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/products">
                  Khám phá ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 bg-transparent">
                <Link href="/category/cham-soc-da">
                  Chăm sóc da
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Sản phẩm</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Khách hàng</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Đánh giá</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/40 rounded-[3rem] transform rotate-3"></div>
              
              {/* Main image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop"
                  alt="Mỹ phẩm cao cấp GlowSkin"
                  width={600}
                  height={750}
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <span className="text-success text-lg">100%</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Chính hãng</p>
                    <p className="text-xs text-muted-foreground">Cam kết chất lượng</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow hidden md:block" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-lg">Free</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Miễn phí ship</p>
                    <p className="text-xs text-muted-foreground">Đơn từ 500K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
    </section>
  );
}

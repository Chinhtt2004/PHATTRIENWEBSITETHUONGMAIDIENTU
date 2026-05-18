"use client";

import React, { useEffect, useState } from "react";
import { fetchPageBySlug, PageResponseDTO } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Import real storefront components
import { HeroSection } from "@/components/home/hero-section";
import { PromotionalSlide } from "@/components/home/promotional-slide";
import { CategoriesSection } from "@/components/home/categories-section";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { AdBanner } from "@/components/home/ad-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BenefitsSection } from "@/components/home/benefits-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

// Inline Brand Carousel component for high impact trust-building
function BrandCarousel() {
  const brands = [
    { name: "Lancôme", logo: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=60" },
    { name: "Estée Lauder", logo: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=60" },
    { name: "Shiseido", logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=60" },
    { name: "La Roche-Posay", logo: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&auto=format&fit=crop&q=60" },
    { name: "Kiehl's", logo: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=120&auto=format&fit=crop&q=60" },
    { name: "L'Oréal", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&auto=format&fit=crop&q=60" }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-card to-primary-light/5 border-y border-border">
      <div className="container mx-auto px-4">
        <h3 className="text-center font-serif text-xl font-semibold mb-8 text-muted-foreground">
          Thương hiệu Đối tác Đồng hành
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          {brands.map((brand, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200">
              <div className="h-16 w-16 rounded-full overflow-hidden border border-border shadow-sm bg-white p-1">
                <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover rounded-full" />
              </div>
              <span className="text-xs font-semibold tracking-wide text-foreground/80">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inline Recent Blog Posts component for SEO and value delivery
function RecentBlogPosts() {
  const posts = [
    {
      title: "Bí quyết sở hữu làn da căng bóng chuẩn Glass Skin",
      excerpt: "Tìm hiểu quy trình dưỡng da 7 bước siêu đơn giản giúp cấp ẩm sâu và mang lại vẻ ngoài rạng rỡ...",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600",
      date: "18 Tháng 5, 2026",
      readTime: "5 phút đọc"
    },
    {
      title: "Top 5 Kem Chống Nắng Tốt Nhất Mùa Hè 2026",
      excerpt: "Đánh giá chi tiết các dòng kem chống nắng kiềm dầu, nâng tông nhẹ nhàng cực kỳ phù hợp cho thời tiết oi bức...",
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600",
      date: "15 Tháng 5, 2026",
      readTime: "4 phút đọc"
    },
    {
      title: "Tác dụng thần kỳ của Niacinamide trong điều trị thâm mụn",
      excerpt: "Niacinamide (Vitamin B3) là hoạt chất vàng giúp thu nhỏ lỗ chân lông và làm đều màu da nhanh chóng...",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
      date: "10 Tháng 5, 2026",
      readTime: "6 phút đọc"
    }
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">Góc Làm Đẹp & Chia Sẻ</h2>
        <p className="text-muted-foreground mt-2">Cập nhật xu hướng làm đẹp và bí quyết chăm sóc da khoa học mới nhất từ các chuyên gia da liễu.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <div key={idx} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DynamicPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<PageResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        const data = await fetchPageBySlug(slug);
        setPage(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Không thể tải trang");
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <h1 className="text-3xl font-bold font-serif text-red-500">Trang Không Hoạt Động hoặc Không Tồn Tại</h1>
        <p className="text-muted-foreground">{error || "Trang bạn đang tìm kiếm không tồn tại."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {page.sections.map((section) => {
        switch (section.type) {
          case "HERO_SECTION":
            return <HeroSection key={section.id} />;
          case "PROMOTIONAL_SLIDE":
            return <PromotionalSlide key={section.id} />;
          case "CATEGORIES_SECTION":
            return <CategoriesSection key={section.id} />;
          case "FLASH_SALE":
            return <FlashSaleSection key={section.id} />;
          case "AD_BANNER_INLINE":
            return <AdBanner key={section.id} variant="inline" />;
          case "FEATURED_PRODUCTS":
            return (
              <FeaturedProducts
                key={section.id}
                title={section.title || "Sản phẩm"}
                filter={section.configJson?.filter || "new"}
              />
            );
          case "BENEFITS":
            return <BenefitsSection key={section.id} />;
          case "TESTIMONIALS":
            return <TestimonialsSection key={section.id} />;
          case "NEWSLETTER":
            return <NewsletterSection key={section.id} />;
          case "BRAND_CAROUSEL":
            return <BrandCarousel key={section.id} />;
          case "RECENT_BLOG_POSTS":
            return <RecentBlogPosts key={section.id} />;
          case "CUSTOM_HTML":
            return (
              <div
                key={section.id}
                className="w-full"
                dangerouslySetInnerHTML={{ __html: section.configJson?.html || "" }}
              />
            );
          default:
            return (
              <div key={section.id} className="container mx-auto py-6 px-4">
                <div className="p-4 bg-red-50 text-red-500 border border-red-200 rounded text-center font-mono">
                  Không tìm thấy handler cho loại Component: {section.type}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}

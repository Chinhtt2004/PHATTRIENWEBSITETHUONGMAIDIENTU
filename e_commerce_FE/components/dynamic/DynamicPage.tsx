"use client";

import React, { useEffect, useState } from "react";
import { fetchPageBySlug, PageResponseDTO } from "@/lib/api";
import { Loader2 } from "lucide-react";

import { HeroSection } from "@/components/home/hero-section";
import { PromotionalSlide } from "@/components/home/promotional-slide";
import { CategoriesSection } from "@/components/home/categories-section";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { AdBanner } from "@/components/home/ad-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BenefitsSection } from "@/components/home/benefits-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type BrandCarouselItem = {
  name: string;
  logo: string;
};

type BlogPostItem = {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  readTime?: string;
};

function BrandCarousel({
  title = "Thuong hieu doi tac dong hanh",
  brands,
}: {
  title?: string;
  brands?: BrandCarouselItem[];
}) {
  const defaultBrands: BrandCarouselItem[] = [
    { name: "Lancome", logo: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=60" },
    { name: "Estee Lauder", logo: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=60" },
    { name: "Shiseido", logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=60" },
    { name: "La Roche-Posay", logo: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&auto=format&fit=crop&q=60" },
    { name: "Kiehl's", logo: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=120&auto=format&fit=crop&q=60" },
    { name: "L'Oreal", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&auto=format&fit=crop&q=60" },
  ];
  const items = brands && brands.length > 0 ? brands : defaultBrands;

  return (
    <section className="py-12 bg-gradient-to-r from-card to-primary-light/5 border-y border-border">
      <div className="container mx-auto px-4">
        <h3 className="text-center font-serif text-xl font-semibold mb-8 text-muted-foreground">
          {title}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          {items.map((brand, idx) => (
            <div key={`${brand.name}-${idx}`} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200">
              <div className="h-16 w-16 rounded-full overflow-hidden border border-border shadow-sm bg-white p-1">
                <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="h-full w-full object-cover rounded-full" />
              </div>
              <span className="text-xs font-semibold tracking-wide text-foreground/80">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentBlogPosts({
  title = "Goc lam dep va chia se",
  description = "Cap nhat xu huong lam dep va bi quyet cham soc da moi nhat.",
  posts,
}: {
  title?: string;
  description?: string;
  posts?: BlogPostItem[];
}) {
  const defaultPosts: BlogPostItem[] = [
    {
      title: "Bi quyet so huu lan da cang bong",
      excerpt: "Tim hieu quy trinh duong da don gian giup cap am sau va cai thien ve ngoai rang ro.",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600",
      date: "18 Thang 5, 2026",
      readTime: "5 phut doc",
    },
    {
      title: "Top kem chong nang phu hop mua he",
      excerpt: "Danh gia cac dong kem chong nang nhe mat, de dung va phu hop voi thoi tiet nong am.",
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600",
      date: "15 Thang 5, 2026",
      readTime: "4 phut doc",
    },
    {
      title: "Niacinamide trong cham soc da",
      excerpt: "Hoat chat pho bien giup ho tro lam deu mau da va cai thien be mat da khi dung dung cach.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
      date: "10 Thang 5, 2026",
      readTime: "6 phut doc",
    },
  ];
  const items = posts && posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((post, idx) => (
          <div key={`${post.title}-${idx}`} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {post.date && <span>{post.date}</span>}
                {post.date && post.readTime && <span>|</span>}
                {post.readTime && <span>{post.readTime}</span>}
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

type DynamicPageProps = {
  slug: string;
  showHeader?: boolean;
  showFooter?: boolean;
};

export function DynamicPage({ slug, showHeader = true, showFooter = true }: DynamicPageProps) {
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
        setError(err.message || "Khong the tai trang");
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
        <h1 className="text-3xl font-bold font-serif text-red-500">Trang khong hoat dong hoac khong ton tai</h1>
        <p className="text-muted-foreground">{error || "Trang ban dang tim kiem khong ton tai."}</p>
      </div>
    );
  }

  const hasFooterSection = page.sections.some((section) => section.type === "FOOTER_SECTION");

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      {page.sections.map((section) => {
        switch (section.type) {
          case "HEADER_SECTION":
            return null;
          case "HERO_SECTION":
            return (
              <HeroSection
                key={section.id}
                badgeText={section.configJson?.badgeText}
                title={section.configJson?.title}
                subtitle={section.configJson?.subtitle}
                description={section.configJson?.description}
                primaryCtaLabel={section.configJson?.primaryCtaLabel}
                primaryCtaLink={section.configJson?.primaryCtaLink}
                secondaryCtaLabel={section.configJson?.secondaryCtaLabel}
                secondaryCtaLink={section.configJson?.secondaryCtaLink}
                stats={section.configJson?.stats}
                imageUrl={section.configJson?.image}
                imageAlt={section.configJson?.imageAlt}
                backgroundColor={section.configJson?.backgroundColor}
              />
            );
          case "PROMOTIONAL_SLIDE":
            return (
              <PromotionalSlide
                key={section.id}
                slides={section.configJson?.slides}
                sideBanners={section.configJson?.sideBanners}
                quickLinks={section.configJson?.quickLinks}
              />
            );
          case "CATEGORIES_SECTION":
            return (
              <CategoriesSection
                key={section.id}
                title={section.title || section.configJson?.title}
                description={section.configJson?.description}
                categoryIds={section.configJson?.categoryIds}
                limit={section.configJson?.limit}
                showProductCount={section.configJson?.showProductCount}
                showNavigation={section.configJson?.showNavigation}
                showDots={section.configJson?.showDots}
                autoplay={section.configJson?.autoplay}
                autoplayDelay={section.configJson?.autoplayDelay}
                onlyRootCategories={section.configJson?.onlyRootCategories}
              />
            );
          case "FLASH_SALE":
            return <FlashSaleSection key={section.id} />;
          case "AD_BANNER_INLINE":
            return (
              <AdBanner
                key={section.id}
                variant="inline"
                banners={section.configJson?.banners}
              />
            );
          case "IMAGE_BANNER":
            return (
              <AdBanner
                key={section.id}
                variant="inline"
                banners={section.configJson?.banners}
              />
            );
          case "FEATURED_PRODUCTS":
            return (
              <FeaturedProducts
                key={section.id}
                title={section.title || "San pham"}
                filter={section.configJson?.filter || "new"}
              />
            );
          case "BENEFITS":
            return <BenefitsSection key={section.id} />;
          case "TESTIMONIALS":
            return (
              <TestimonialsSection
                key={section.id}
                title={section.title || section.configJson?.title}
                description={section.configJson?.description}
                testimonials={section.configJson?.testimonials}
              />
            );
          case "NEWSLETTER":
            return (
              <NewsletterSection
                key={section.id}
                title={section.title || section.configJson?.title}
                description={section.configJson?.description}
                placeholder={section.configJson?.placeholder}
                buttonLabel={section.configJson?.buttonLabel}
                privacyNote={section.configJson?.privacyNote}
                successTitle={section.configJson?.successTitle}
                successDescription={section.configJson?.successDescription}
              />
            );
          case "FOOTER_SECTION":
            return showFooter ? <Footer key={section.id} config={section.configJson} /> : null;
          case "BRAND_CAROUSEL":
            return (
              <BrandCarousel
                key={section.id}
                title={section.title || section.configJson?.title}
                brands={section.configJson?.brands}
              />
            );
          case "RECENT_BLOG_POSTS":
            return (
              <RecentBlogPosts
                key={section.id}
                title={section.title || section.configJson?.title}
                description={section.configJson?.description}
                posts={section.configJson?.posts}
              />
            );
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
                  Khong tim thay handler cho loai Component: {section.type}
                </div>
              </div>
            );
        }
      })}
      {showFooter && !hasFooterSection && <Footer />}
    </div>
  );
}

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BenefitsSection } from "@/components/home/benefits-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { PromotionalSlide } from "@/components/home/promotional-slide";
import { AdBanner } from "@/components/home/ad-banner";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { FloatingBannerSection } from "@/components/home/floating-banner-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdBanner variant="top" />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PromotionalSlide />
        <CategoriesSection />
        <FlashSaleSection />
        <AdBanner variant="inline" />
        <FeaturedProducts title="Sản phẩm bán chạy" filter="bestseller" />
        <BenefitsSection />
        <FeaturedProducts title="Sản phẩm mới" filter="new" />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
      <FloatingBannerSection />
    </div>
  );
}

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdBanner } from "@/components/home/ad-banner";
import { FloatingBannerSection } from "@/components/home/floating-banner-section";
import { DynamicPage } from "@/components/dynamic/DynamicPage";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdBanner variant="top" />
      <Header />
      <main className="flex-1">
        {/* Render toàn bộ cấu trúc trang chủ động lưu trong Database */}
        <DynamicPage slug="home" />
      </main>
      <Footer />
      <FloatingBannerSection />
    </div>
  );
}

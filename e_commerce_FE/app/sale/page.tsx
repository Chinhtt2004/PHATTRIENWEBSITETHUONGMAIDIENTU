import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CountdownTimer } from "@/components/sale/countdown-timer";
import { products, formatPrice } from "@/lib/data";
import {
  Clock,
  Zap,
  Gift,
  Percent,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Khuyến Mãi | GlowSkin - Ưu Đãi Hấp Dẫn",
  description:
    "Khám phá các chương trình khuyến mãi, giảm giá độc quyền tại GlowSkin. Mua sắm mỹ phẩm chính hãng với giá tốt nhất.",
};

// Filter products with discount
const saleProducts = products.filter((p) => p.compareAtPrice !== null);
const allProducts = products;

const flashDeals = [
  {
    id: "flash_1",
    name: "Serum Vitamin C 20%",
    slug: "serum-vitamin-c-20",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    originalPrice: 550000,
    salePrice: 385000,
    discount: 30,
    soldCount: 145,
    totalCount: 200,
  },
  {
    id: "flash_2",
    name: "Kem Dưỡng Ẩm HA",
    slug: "kem-duong-am-hyaluronic-acid",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
    originalPrice: 450000,
    salePrice: 315000,
    discount: 30,
    soldCount: 89,
    totalCount: 100,
  },
  {
    id: "flash_3",
    name: "Son Lì Velvet",
    slug: "son-moi-li-velvet",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    originalPrice: 350000,
    salePrice: 245000,
    discount: 30,
    soldCount: 167,
    totalCount: 200,
  },
  {
    id: "flash_4",
    name: "Kem Chống Nắng SPF50+",
    slug: "kem-chong-nang-spf50",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    originalPrice: 380000,
    salePrice: 266000,
    discount: 30,
    soldCount: 78,
    totalCount: 150,
  },
];

const voucherCodes = [
  {
    code: "WELCOME10",
    discount: "10%",
    description: "Giảm 10% đơn hàng đầu tiên",
    minOrder: 300000,
    expiry: "31/03/2026",
  },
  {
    code: "SUMMER20",
    discount: "20%",
    description: "Giảm 20% danh mục Chăm sóc da",
    minOrder: 500000,
    expiry: "28/02/2026",
  },
  {
    code: "FREESHIP",
    discount: "Free Ship",
    description: "Miễn phí vận chuyển toàn quốc",
    minOrder: 200000,
    expiry: "28/02/2026",
  },
];

export default function SalePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-primary via-rose-400/90 to-primary-hover overflow-hidden py-10 lg:py-14">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjEiIGN4PSIyMCIgY3k9IjIwIiByPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                <span>Sale Event</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                MEGA SALE
              </h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Giảm đến 50% hàng nghìn sản phẩm
              </p>
              <CountdownTimer />
            </div>
          </div>
          
          {/* Decorative */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Flash Sale Section */}
        <section className="py-10 lg:py-16 bg-gradient-to-b from-secondary/12 via-primary-light/8 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-6 w-6 text-primary fill-primary" />
                  <h2 className="font-serif text-3xl md:text-4xl font-bold">Flash Sale</h2>
                </div>
                <p className="text-muted-foreground">
                  Sản phẩm giảm giá sốc - Số lượng có hạn!
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Kết thúc sau: </span>
                <CountdownTimer />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {flashDeals.map((deal) => (
                <Link key={deal.id} href={`/product/${deal.slug}`} className="group">
                  <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={deal.image || "/placeholder.svg"}
                        alt={deal.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                        -{deal.discount}%
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">{deal.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary font-bold">{formatPrice(deal.salePrice)}</span>
                        <span className="text-muted-foreground text-sm line-through">{formatPrice(deal.originalPrice)}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(deal.soldCount / deal.totalCount) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Đã bán {deal.soldCount}/{deal.totalCount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Voucher Section */}
        <section className="py-10 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Mã Giảm Giá
              </h2>
              <p className="text-muted-foreground">
                Áp dụng ngay để nhận ưu đãi hấp dẫn
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {voucherCodes.map((voucher) => (
                <Card key={voucher.code} className="overflow-hidden border-dashed border-2 border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {voucher.discount.includes("%") ? (
                          <Percent className="h-6 w-6 text-primary" />
                        ) : (
                          <Gift className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <Badge variant="secondary">{voucher.discount}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-primary mb-1">{voucher.code}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{voucher.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Đơn tối thiểu: {formatPrice(voucher.minOrder)}</span>
                      <span>HSD: {voucher.expiry}</span>
                    </div>
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      <Tag className="mr-2 h-4 w-4" />
                      Sao chép mã
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banners */}
        <section className="py-10 lg:py-16 bg-gradient-to-b from-background via-secondary/10 to-primary-light/12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Banner 1 */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-10 min-h-[300px] flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    Skincare
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">
                    Bộ Skincare
                    <br />
                    <span className="text-primary">Giảm 30%</span>
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Trọn bộ chăm sóc da 5 bước với giá ưu đãi.
                  </p>
                </div>
                <Button asChild className="self-start mt-4">
                  <Link href="/products?category=skincare">
                    Mua ngay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Banner 2 */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 p-8 md:p-10 min-h-[300px] flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 bg-secondary-foreground/10 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Gift className="h-4 w-4" />
                    Makeup
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-secondary-foreground mb-2">
                    Mua 2 Tặng 1
                    <br />
                    Son & Phấn
                  </h3>
                  <p className="text-secondary-foreground/80 max-w-sm">
                    Áp dụng cho tất cả sản phẩm trang điểm.
                  </p>
                </div>
                <Button asChild variant="secondary" className="self-start mt-4 bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90">
                  <Link href="/products?category=makeup">
                    Khám phá
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Sale Products */}
        <section className="py-10 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                  Sản Phẩm Giảm Giá
                </h2>
                <p className="text-muted-foreground">
                  Tất cả sản phẩm đang giảm giá tại GlowSkin
                </p>
              </div>
              <Button asChild variant="outline" className="self-start sm:self-auto bg-transparent">
                <Link href="/products?sale=true" className="flex items-center gap-2">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {allProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="relative py-10 lg:py-16 bg-gradient-to-br from-primary via-rose-400/90 to-primary-hover text-primary-foreground overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-300/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Đăng Ký Nhận Ưu Đãi
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Đăng ký email để nhận thông tin về các chương trình khuyến mãi độc quyền và mã giảm giá hấp dẫn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button variant="secondary" size="lg">
                Đăng ký
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

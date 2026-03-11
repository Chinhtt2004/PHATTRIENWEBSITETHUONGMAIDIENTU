import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { products, formatPrice } from "@/lib/data";
import { CopyButton } from "@/components/promotions/copy-button";
import {
  Gift,
  Percent,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  Clock,
  ShoppingBag,
  Star,
  Copy,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Khuyến Mãi | GlowSkin - Ưu Đãi & Mã Giảm Giá",
  description:
    "Tổng hợp các chương trình khuyến mãi, mã giảm giá và ưu đãi hấp dẫn tại GlowSkin. Tiết kiệm hơn khi mua sắm mỹ phẩm chính hãng.",
};

const saleProducts = products.filter((p) => p.compareAtPrice !== null);

const promotionsList = [
  {
    id: "promo_1",
    title: "Giảm 20% Đơn Hàng Mùa Hè",
    code: "SUMMER20",
    type: "percentage" as const,
    value: 20,
    description:
      "Áp dụng cho tất cả đơn hàng từ 500.000đ. Giảm tối đa 200.000đ.",
    minOrder: 500000,
    maxDiscount: 200000,
    expiry: "31/03/2026",
    isActive: true,
    icon: Percent,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "promo_2",
    title: "Miễn Phí Vận Chuyển",
    code: "FREESHIP",
    type: "shipping" as const,
    value: 0,
    description:
      "Miễn phí giao hàng toàn quốc cho đơn hàng từ 300.000đ.",
    minOrder: 300000,
    maxDiscount: null,
    expiry: "31/12/2026",
    isActive: true,
    icon: Truck,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "promo_3",
    title: "Giảm 50K Cho Khách Mới",
    code: "NEWUSER50",
    type: "fixed" as const,
    value: 50000,
    description:
      "Dành riêng cho khách hàng đăng ký tài khoản mới. Áp dụng cho đơn từ 200.000đ.",
    minOrder: 200000,
    maxDiscount: null,
    expiry: "31/12/2026",
    isActive: true,
    icon: Gift,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    id: "promo_4",
    title: "Giảm 15% Chăm Sóc Da",
    code: "SKINCARE15",
    type: "percentage" as const,
    value: 15,
    description:
      "Áp dụng cho toàn bộ danh mục Chăm sóc da. Giảm tối đa 150.000đ.",
    minOrder: 300000,
    maxDiscount: 150000,
    expiry: "30/06/2026",
    isActive: true,
    icon: Sparkles,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: "promo_5",
    title: "VIP - Giảm 30%",
    code: "VIP30",
    type: "percentage" as const,
    value: 30,
    description:
      "Ưu đãi đặc biệt dành cho khách hàng VIP. Đơn tối thiểu 1.000.000đ.",
    minOrder: 1000000,
    maxDiscount: 500000,
    expiry: "15/01/2026",
    isActive: false,
    icon: Star,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];

const comboDeals = [
  {
    id: "combo_1",
    title: "Bộ Skincare Cơ Bản",
    description: "Sữa rửa mặt + Toner + Serum Vitamin C",
    originalPrice: 990000,
    comboPrice: 790000,
    saving: 200000,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
  },
  {
    id: "combo_2",
    title: "Bộ Chống Nắng Hoàn Hảo",
    description: "Kem chống nắng + Serum + Kem dưỡng ẩm",
    originalPrice: 1150000,
    comboPrice: 890000,
    saving: 260000,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=400&fit=crop",
  },
  {
    id: "combo_3",
    title: "Bộ Makeup Hoàn Chỉnh",
    description: "Son lì + Phấn phủ + Kem lót",
    originalPrice: 880000,
    comboPrice: 680000,
    saving: 200000,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=400&fit=crop",
  },
];

export default function PromotionsPage() {
  const activePromotions = promotionsList.filter((p) => p.isActive);
  const expiredPromotions = promotionsList.filter((p) => !p.isActive);

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
                <Tag className="h-4 w-4" />
                <span>Ưu đãi đặc biệt</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Chương Trình Khuyến Mãi
              </h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Tổng hợp mã giảm giá và ưu đãi hấp dẫn dành riêng cho bạn
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-lg">
                  <Tag className="h-5 w-5" />
                  <span className="font-medium">{activePromotions.length} mã đang hoạt động</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-lg">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-medium">{comboDeals.length} combo tiết kiệm</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-lg">
                  <Percent className="h-5 w-5" />
                  <span className="font-medium">Giảm đến 30%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Active Voucher Codes */}
        <section className="py-10 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Mã Khuyến Mãi Đang Hoạt Động
              </h2>
              <p className="text-muted-foreground">
                Sao chép mã và áp dụng khi thanh toán để nhận ưu đãi
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {activePromotions.map((promo) => {
                const IconComponent = promo.icon;
                return (
                  <Card
                    key={promo.id}
                    className="overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${promo.bgColor} flex items-center justify-center`}
                        >
                          <IconComponent className={`h-6 w-6 ${promo.color}`} />
                        </div>
                        <Badge variant="default" className="bg-success text-white">
                          Đang hoạt động
                        </Badge>
                      </div>

                      <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {promo.description}
                      </p>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                        <code className="flex-1 text-lg font-bold text-primary tracking-wider">
                          {promo.code}
                        </code>
                        <CopyButton code={promo.code} />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Đơn tối thiểu: {formatPrice(promo.minOrder)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          HSD: {promo.expiry}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Combo Deals */}
        <section className="py-10 lg:py-16 bg-gradient-to-b from-secondary/12 via-primary-light/8 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Combo Ưu Đãi
              </h2>
              <p className="text-muted-foreground">
                Mua theo combo để tiết kiệm hơn so với mua lẻ
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comboDeals.map((combo) => (
                <Card
                  key={combo.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={combo.image || "/placeholder.svg"}
                      alt={combo.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-destructive text-white">
                      Tiết kiệm {formatPrice(combo.saving)}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1">{combo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {combo.description}
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(combo.comboPrice)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(combo.originalPrice)}
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/products">
                        Mua ngay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <section className="py-10 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                    Sản Phẩm Khuyến Mãi
                  </h2>
                  <p className="text-muted-foreground">
                    Các sản phẩm đang được giảm giá tại GlowSkin
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="self-start sm:self-auto bg-transparent"
                >
                  <Link
                    href="/products?sale=true"
                    className="flex items-center gap-2"
                  >
                    Xem tất cả
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {saleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to use voucher */}
        <section className="py-10 lg:py-16 bg-gradient-to-b from-background via-primary-light/10 to-secondary/12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Cách Sử Dụng Mã Giảm Giá
              </h2>
              <p className="text-muted-foreground">
                Chỉ với 3 bước đơn giản để áp dụng mã khuyến mãi
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Copy className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Bước 1</h3>
                <p className="text-sm text-muted-foreground">
                  Sao chép mã khuyến mãi bạn muốn sử dụng
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Bước 2</h3>
                <p className="text-sm text-muted-foreground">
                  Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Bước 3</h3>
                <p className="text-sm text-muted-foreground">
                  Nhập mã vào ô khuyến mãi và nhận ưu đãi ngay
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expired promotions */}
        {expiredPromotions.length > 0 && (
          <section className="py-10 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-muted-foreground">
                  Khuyến Mãi Đã Kết Thúc
                </h2>
                <p className="text-muted-foreground text-sm">
                  Các chương trình đã hết hạn - Hãy theo dõi để không bỏ lỡ ưu đãi tiếp theo
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto opacity-60">
                {expiredPromotions.map((promo) => {
                  const IconComponent = promo.icon;
                  return (
                    <Card key={promo.id} className="overflow-hidden border-dashed">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Badge variant="secondary">Đã kết thúc</Badge>
                        </div>
                        <h3 className="font-bold mb-1">{promo.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {promo.description}
                        </p>
                        <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                          <code className="font-bold text-muted-foreground line-through">
                            {promo.code}
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative py-10 lg:py-16 bg-gradient-to-br from-primary via-rose-400/90 to-primary-hover text-primary-foreground overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-300/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Đừng Bỏ Lỡ Ưu Đãi
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Đăng ký email để nhận thông báo về chương trình khuyến mãi mới nhất và mã giảm giá độc quyền.
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

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { products, formatPrice } from "@/lib/data";
import { fetchPublicPromotions, collectPromotion, type Promotion } from "@/lib/api";
import { toast } from "sonner";
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
  Loader2,
} from "lucide-react";

// Mock combo deals for now as they are not in backend yet
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

const saleProducts = products.filter((p) => p.compareAtPrice !== null);

const getPromotionIcon = (type: string) => {
  switch (type) {
    case "PERCENTAGE":
      return { icon: Percent, color: "text-primary", bgColor: "bg-primary/10" };
    case "SHIPPING":
      return { icon: Truck, color: "text-success", bgColor: "bg-success/10" };
    case "FIXED":
    default:
      return { icon: Gift, color: "text-info", bgColor: "bg-info/10" };
  }
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectingId, setCollectingId] = useState<number | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await fetchPublicPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (id: number) => {
    setCollectingId(id);
    try {
      await collectPromotion(id);
      toast.success("Thu thập thành công!", {
        description: "Mã giảm giá đã được thêm vào tài khoản của bạn.",
      });
      // Refresh to update collected state
      const data = await fetchPublicPromotions();
      setPromotions(data);
    } catch (error: any) {
      console.error("Failed to collect promotion:", error);
      toast.error(error.message || "Không thể thu thập mã lúc này.");
    } finally {
      setCollectingId(null);
    }
  };

  const activePromotions = promotions.filter((p) => p.isActive);
  const expiredPromotions = promotions.filter((p) => !p.isActive);

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
                  <span className="font-medium">Giảm ưu đãi lớn</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Voucher Codes */}
        <section className="py-10 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Mã Khuyến Mãi Đang Hoạt Động
              </h2>
              <p className="text-muted-foreground">
                Thu thập mã ngay để áp dụng khi thanh toán
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {activePromotions.map((promo) => {
                  const theme = getPromotionIcon(promo.type);
                  const IconComponent = theme.icon;
                  return (
                    <Card
                      key={promo.id}
                      className="overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${theme.bgColor} flex items-center justify-center`}
                          >
                            <IconComponent className={`h-6 w-6 ${theme.color}`} />
                          </div>
                          <Badge variant="default" className="bg-success text-white">
                            Đang hoạt động
                          </Badge>
                        </div>

                        <h3 className="font-bold text-lg mb-1">
                          {promo.type === "PERCENTAGE"
                            ? `Giảm ${promo.value}%`
                            : promo.type === "FIXED"
                              ? `Giảm ${formatPrice(promo.value)}`
                              : "Miễn phí vận chuyển"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {promo.description}
                        </p>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                          <code className="flex-1 text-lg font-bold text-primary tracking-wider">
                            {promo.code}
                          </code>
                          <Button
                            size="sm"
                            disabled={promo.isCollected || collectingId === promo.id}
                            onClick={() => handleCollect(promo.id)}
                            className={promo.isCollected ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary-hover"}
                          >
                            {collectingId === promo.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : promo.isCollected ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Đã thu thập
                              </>
                            ) : (
                              "Thu thập"
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Đơn tối thiểu: {formatPrice(promo.minOrderAmount || 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            HSD: {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Combo Deals Section */}
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
                  <Tag className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Bước 1</h3>
                <p className="text-sm text-muted-foreground">
                  Nhấn "Thu thập" voucher bạn muốn sử dụng
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
                  Chọn voucher đã thu thập tại bước thanh toán để nhận ưu đãi
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

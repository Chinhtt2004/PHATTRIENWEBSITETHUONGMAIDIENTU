"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  Check,
  ThumbsUp,
  BadgeCheck,
  FlaskConical,
  Zap,
  Crown,
  Sparkles,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/product-card";
import { addToCart } from "@/lib/api";
import {
  type Product,
  type Review,
  formatPrice,
  getDiscountPercentage,
  getBadgeLabel,
  categories,
} from "@/lib/data";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = getDiscountPercentage(
    selectedVariant.price,
    product.compareAtPrice
  );

  const category = categories.find((c) => c.id === product.categoryId);

  const handleAddToCart = async () => {
    try {
      await addToCart(Number(product.id), quantity);
      toast.success("Đã thêm vào giỏ hàng!", {
        description: `${product.name} - ${selectedVariant.name} x ${quantity}`,
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng";
      if (message.includes("403") || message.includes("401") || /token/i.test(message)) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
        router.push("/account/login");
        return false;
      }
      toast.error(message);
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart();
    if (success) {
      router.push("/checkout");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết sản phẩm");
  };

  return (
    <div className="bg-gradient-to-b from-background via-primary-light/8 to-secondary/8">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/category/${category.slug}`}>
                      {category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.images[selectedImage]?.url || "/placeholder.jpg"}
                alt={product.images[selectedImage]?.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount && (
                  <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 gap-1 font-semibold">
                    <Zap className="h-3 w-3" />
                    -{discount}%
                  </Badge>
                )}
                {product.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className={
                      badge === "bestseller"
                        ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20 gap-1 font-semibold"
                        : badge === "new"
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20 gap-1 font-semibold"
                          : "bg-gradient-to-r from-secondary to-orange-200 text-foreground shadow-md gap-1 font-semibold"
                    }
                  >
                    {badge === "bestseller" && <Crown className="h-3 w-3" />}
                    {badge === "new" && <Sparkles className="h-3 w-3" />}
                    {badge === "sale" && <Flame className="h-3 w-3" />}
                    {getBadgeLabel(badge)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating.average)
                          ? "fill-warning text-warning"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">{product.rating.average}</span>
                  <span className="text-muted-foreground">
                    ({product.rating.count} đánh giá)
                  </span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(selectedVariant.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  {discount && (
                    <Badge variant="destructive">Tiết kiệm {discount}%</Badge>
                  )}
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Lựa chọn:{" "}
                  <span className="text-primary">{selectedVariant.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isOutOfStock = variant.inventory <= 0;
                    const hasColor = variant.attributes.colorHex;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                        disabled={isOutOfStock}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedVariant.id === variant.id
                            ? "border-primary bg-primary/5"
                            : isOutOfStock
                              ? "border-muted text-muted-foreground cursor-not-allowed opacity-50"
                              : "border-border hover:border-primary/50"
                        }`}
                      >
                        {hasColor && (
                          <span
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: variant.attributes.colorHex }}
                          />
                        )}
                        <span>{variant.name}</span>
                        {selectedVariant.id === variant.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                        {isOutOfStock && (
                          <span className="absolute -top-2 -right-2 text-xs bg-muted px-1.5 rounded">
                            Hết hàng
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.inventory, quantity + 1))
                  }
                  disabled={quantity >= selectedVariant.inventory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart */}
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={selectedVariant.inventory <= 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Thêm vào giỏ hàng
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 bg-transparent"
                onClick={handleWishlist}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-primary text-primary" : ""
                  }`}
                />
              </Button>

              {/* Share */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 bg-transparent"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Buy Now */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleBuyNow}
              disabled={selectedVariant.inventory <= 0}
            >
              Mua ngay
            </Button>

            {/* Stock Status */}
            <div className="text-sm">
              {selectedVariant.inventory > 0 ? (
                <span className="text-success flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Còn hàng ({selectedVariant.inventory} sản phẩm)
                </span>
              ) : (
                <span className="text-destructive">Hết hàng</span>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Miễn phí ship</p>
                  <p className="text-muted-foreground text-xs">Đơn từ 500K</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Đổi trả 30 ngày</p>
                  <p className="text-muted-foreground text-xs">Không cần lý do</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Chính hãng 100%</p>
                  <p className="text-muted-foreground text-xs">Cam kết chất lượng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Thành phần
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Đánh giá ({product.rating.count})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>
            <TabsContent value="ingredients" className="mt-6">
              {product.ingredients && product.ingredients.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FlaskConical className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Thành phần chính</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground">
                          {ingredient}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    * Danh sách thành phần có thể thay đổi. Vui lòng kiểm tra bao bì sản phẩm để biết thông tin chính xác nhất.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Thông tin thành phần chi tiết sẽ được cập nhật.
                </p>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex flex-col items-center justify-center sm:min-w-[140px]">
                      <span className="text-4xl font-bold text-primary">
                        {product.rating.average}
                      </span>
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating.average)
                                ? "fill-warning text-warning"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground mt-1">
                        {product.rating.count} đánh giá
                      </span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = product.reviews.filter(
                          (r) => r.rating === star
                        ).length;
                        const percent =
                          product.reviews.length > 0
                            ? (count / product.reviews.length) * 100
                            : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-4 text-muted-foreground">
                              {star}
                            </span>
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                              <div
                                className="h-full rounded-full bg-warning transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="divide-y divide-border">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="py-5 first:pt-0">
                        <div className="flex items-start gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={review.avatar}
                              alt={review.userName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <span className="inline-flex items-center gap-1 text-xs text-primary">
                                  <BadgeCheck className="h-3.5 w-3.5" />
                                  Đã mua hàng
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < review.rating
                                        ? "fill-warning text-warning"
                                        : "text-muted-foreground/30"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            {review.skinType && (
                              <span className="inline-block mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {review.skinType}
                              </span>
                            )}
                            <h4 className="font-medium text-sm mt-2">
                              {review.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {review.content}
                            </p>
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {review.images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-border"
                                  >
                                    <Image
                                      src={img}
                                      alt={`Review image ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              Hữu ích ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                  <Button>Viết đánh giá đầu tiên</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

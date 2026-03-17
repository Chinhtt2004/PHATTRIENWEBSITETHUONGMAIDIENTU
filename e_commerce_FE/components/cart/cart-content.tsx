"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/lib/data";
import { fetchCartItems, fetchProducts, removeCartItem, addToCart } from "@/lib/api";

interface DisplayCartItem {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variant: string;
  image: string;
  price: number;
  quantity: number;
}

export function CartContent() {
  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const [items, products] = await Promise.all([fetchCartItems(), fetchProducts()]);
      const productMap = new Map<number, Product>(products.map((product) => [Number(product.id), product]));

      setCartItems(
        items.map((item) => {
          const product = productMap.get(item.productId);
          return {
            id: String(item.id),
            productId: String(item.productId),
            variantId: product?.variants[0]?.id || `var-${item.productId}`,
            slug: product?.slug || "",
            name: item.productName,
            variant: product?.variants[0]?.name || "Mặc định",
            image: product?.images[0]?.url || "/placeholder.svg",
            price: product?.price || 0,
            quantity: item.quantity,
          };
        })
      );
      setAuthRequired(false);
    } catch (error) {
      const status = typeof error === "object" && error && "status" in error ? Number(error.status) : undefined;
      if (status === 401 || status === 403) {
        setAuthRequired(true);
        setCartItems([]);
      } else {
        toast.error(error instanceof Error ? error.message : "Không thể tải giỏ hàng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    try {
      await addToCart(Number(item.productId), newQuantity);
      setCartItems((items) =>
        items.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật số lượng");
    }
  };

  const removeItem = async (itemId: string) => {
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    try {
      await removeCartItem(Number(item.productId));
      setCartItems((items) => items.filter((cartItem) => cartItem.id !== itemId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
    }
  };

  const applyVoucher = () => {
    if (!voucherCode) return;
    // Mock voucher validation
    if (voucherCode.toUpperCase() === "SUMMER20") {
      setAppliedVoucher({ code: "SUMMER20", discount: 0.1 });
      toast.success("Đã áp dụng mã giảm giá SUMMER20");
    } else {
      toast.error("Mã giảm giá không hợp lệ");
    }
    setVoucherCode("");
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    toast.success("Đã xóa mã giảm giá");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedVoucher ? subtotal * appliedVoucher.discount : 0;
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (authRequired) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold mb-4">Vui lòng đăng nhập để xem giỏ hàng</h1>
          <p className="text-muted-foreground mb-8">Giỏ hàng được đồng bộ theo tài khoản của bạn trên hệ thống.</p>
          <Button asChild size="lg">
            <Link href="/account/login">Đăng nhập ngay</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold mb-4">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-muted-foreground mb-8">
            Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              Tiếp tục mua sắm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
                <BreadcrumbPage>Giỏ hàng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">Giỏ Hàng Của Bạn</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={item.slug ? `/product/${item.slug}` : "/products"}
                      className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={item.slug ? `/product/${item.slug}` : "/products"}
                        className="font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.variant}
                      </p>
                      <p className="text-primary font-semibold mt-2">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Quantity */}
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voucher */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mã giảm giá
                  </label>
                  {appliedVoucher ? (
                    <div className="flex items-center justify-between bg-success-light p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">
                          {appliedVoucher.code}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeVoucher}
                        className="h-auto p-0 text-muted-foreground hover:text-destructive"
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyVoucher}>
                        Áp dụng
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between text-success">
                      <span>Giảm giá ({appliedVoucher.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-success">Miễn phí</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Miễn phí vận chuyển cho đơn hàng từ {formatPrice(500000)}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    Tiến hành thanh toán
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Bằng việc thanh toán, bạn đồng ý với{" "}
                  <Link href="/terms" className="underline">
                    Điều khoản sử dụng
                  </Link>{" "}
                  của chúng tôi.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  MapPin,
  Truck,
  ChevronRight,
  ChevronLeft,
  Lock,
  ShieldCheck,
  Gift,
  Sparkles,
  Heart,
  Wallet,
  Banknote,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/lib/data";
import { fetchCartItems, fetchProducts, fetchUserProfile } from "@/lib/api";
import { useEffect } from "react";

const steps = [
  { id: 1, name: "Thông tin", icon: MapPin },
  { id: 2, name: "Vận chuyển", icon: Truck },
  { id: 3, name: "Thanh toán", icon: CreditCard },
];

const shippingMethods = [
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    description: "3-5 ngày làm việc",
    price: 30000,
    icon: Truck,
  },
  {
    id: "express",
    name: "Giao hàng nhanh",
    description: "1-2 ngày làm việc",
    price: 50000,
    icon: Sparkles,
  },
  {
    id: "free",
    name: "Miễn phí vận chuyển",
    description: "3-5 ngày làm việc (Đơn từ 500K)",
    price: 0,
    minOrder: 500000,
    icon: Gift,
  },
];

const paymentMethods = [
  {
    id: "momo",
    name: "Ví MoMo",
    icon: Wallet,
    description: "Thanh toán qua ví điện tử MoMo",
  },
  {
    id: "vnpay",
    name: "VNPay",
    icon: CreditCard,
    description: "Thanh toán qua cổng VNPay",
  },
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    icon: Banknote,
    description: "Trả tiền mặt khi nhận hàng",
  },
];

export function CheckoutContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsResult, productsResult, profileResult] = await Promise.allSettled([
          fetchCartItems(),
          fetchProducts(),
          fetchUserProfile()
        ]);

        if (itemsResult.status === 'fulfilled' && productsResult.status === 'fulfilled') {
          const productMap = new Map<number, Product>(
            productsResult.value.map((p: any) => [Number(p.id), p])
          );

          setCartItems(
            itemsResult.value.map((item: any) => {
              const product = productMap.get(item.productId);
              return {
                id: String(item.id),
                productId: String(item.productId),
                name: item.productName,
                variant: product?.variants[0]?.name || "Mặc định",
                image: product?.images[0]?.url || "/placeholder.svg",
                price: product?.price || 0,
                quantity: item.quantity,
              };
            })
          );
        }

        if (profileResult.status === 'fulfilled') {
          const u = profileResult.value;
          setFormData(prev => ({
            ...prev,
            email: u.email || "",
            firstName: u.name || "",
          }));
        }
      } catch (error) {
        console.error("Failed to load checkout data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedShipping = shippingMethods.find(
    (m) => m.id === shippingMethod
  );
  const shipping =
    subtotal >= 500000 && selectedShipping?.id === "standard"
      ? 0
      : selectedShipping?.price || 0;
  const total = subtotal + shipping;

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        formData.email &&
        formData.phone &&
        formData.firstName &&
        formData.address &&
        formData.district &&
        formData.city
      );
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call for now since Order endpoint is empty
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Đặt hàng thành công!", {
        description: "Cảm ơn bạn đã mua hàng tại GlowSkin",
      });

      router.push("/checkout/success");
    } catch (error) {
      toast.error("Đặt hàng thất bại, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.info("Mã giảm giá không hợp lệ", {
        description: "Vui lòng kiểm tra lại mã giảm giá",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
          Thanh toán ✿
        </h1>
        <p className="text-muted-foreground">
          Hoàn tất đơn hàng chỉ với vài bước đơn giản
        </p>
      </div>

      {/* Steps Progress */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted mx-16 sm:mx-20">
            <div
              className="h-full bg-gradient-to-r from-primary to-rose-400 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStep > step.id
                    ? "bg-gradient-to-br from-primary to-rose-400 text-white shadow-lg shadow-primary/30"
                    : currentStep === step.id
                      ? "bg-white text-primary border-2 border-primary shadow-lg shadow-primary/20"
                      : "bg-muted/60 text-muted-foreground border border-border"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  currentStep >= step.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Customer Info */}
          {currentStep === 1 && (
            <Card className="border-primary/10 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-light/40 to-secondary/20 border-b border-primary/10 py-5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Họ và tên <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Nguyễn Văn A"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Tên đệm
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Van"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0901234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Số nhà, tên đường"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ward" className="text-sm font-medium">
                      Phường/Xã
                    </Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="Phường Bến Nghé"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium">
                      Quận/Huyện <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Quận 1"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      Tỉnh/Thành phố <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="TP. Hồ Chí Minh"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Ghi chú đơn hàng
                  </Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Ghi chú cho người giao hàng (tuỳ chọn)"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="rounded-lg border-primary/15 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping */}
          {currentStep === 2 && (
            <Card className="border-primary/10 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-light/40 to-secondary/20 border-b border-primary/10 py-5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-4 w-4" />
                  </div>
                  Phương thức vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                  className="space-y-3"
                >
                  {shippingMethods.map((method) => {
                    const isDisabled =
                      !!method.minOrder && subtotal < method.minOrder;
                    const isSelected = shippingMethod === method.id;
                    const IconComp = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-primary bg-gradient-to-r from-primary-light/30 to-secondary/15 shadow-sm"
                            : "border-border hover:border-primary/30 hover:bg-primary-light/10"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            disabled={isDisabled}
                          />
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          {method.price === 0 ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold">
                              Miễn phí
                            </span>
                          ) : (
                            formatPrice(method.price)
                          )}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>

                {/* Shipping info note */}
                <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-light/20 to-transparent border border-primary/10">
                  <Gift className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Miễn phí vận chuyển</span> cho đơn hàng từ{" "}
                    <span className="font-semibold text-primary">500.000₫</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <Card className="border-primary/10 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-light/40 to-secondary/20 border-b border-primary/10 py-5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    const IconComp = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-primary bg-gradient-to-r from-primary-light/30 to-secondary/15 shadow-sm"
                            : "border-border hover:border-primary/30 hover:bg-primary-light/10"
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </label>
                    );
                  })}
                </RadioGroup>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50">
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-medium">
                      Thông tin thanh toán được bảo mật bằng mã hóa SSL 256-bit
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Review Summary for Step 3 */}
          {currentStep === 3 && (
            <Card className="border-primary/10 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-light/40 to-secondary/20 border-b border-primary/10 py-5">
                <CardTitle className="flex items-center gap-2 text-primary text-base">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  Xác nhận thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Người nhận</p>
                    <p className="text-sm font-medium">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.phone}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Địa chỉ</p>
                    <p className="text-sm font-medium">
                      {formData.address}
                      {formData.ward && `, ${formData.ward}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.district}, {formData.city}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">Vận chuyển</p>
                  <p className="text-sm font-medium">
                    {selectedShipping?.name} —{" "}
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-full px-6 border-primary/20 hover:bg-primary-light/20 hover:border-primary/40"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-full px-6 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md shadow-primary/20"
              >
                Tiếp tục
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-full px-8 bg-gradient-to-r from-primary to-rose-500 hover:from-rose-500 hover:to-primary shadow-lg shadow-primary/25 text-white font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">✿</span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Đặt hàng — {formatPrice(total)}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="border-primary/10 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-light/40 to-secondary/20 border-b border-primary/10 py-5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-primary" />
                  Đơn hàng của bạn
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {cartItems.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary-light/30 to-secondary/20 flex-shrink-0 border border-primary/10">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variant}
                        </p>
                        <p className="text-sm font-semibold bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-primary/10" />

                {/* Coupon Code */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Mã giảm giá"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-9 rounded-lg border-primary/15 text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="rounded-lg border-primary/20 hover:bg-primary hover:text-white text-sm px-4"
                  >
                    Áp dụng
                  </Button>
                </div>

                <Separator className="bg-primary/10" />

                {/* Totals */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vận chuyển</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold">
                          Miễn phí
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base">Tổng cộng</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                    {formatPrice(total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-xs font-medium">Bảo mật SSL</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-primary/10">
                <Truck className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-xs font-medium">Giao hàng nhanh</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-primary/10">
                <Gift className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-xs font-medium">Quà tặng kèm</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-primary/10">
                <Heart className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-xs font-medium">Chính hãng 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

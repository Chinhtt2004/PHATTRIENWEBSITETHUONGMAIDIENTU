"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Download,
  Truck,
  XCircle,
  CheckCircle,
  Clock,
  Package,
  CreditCard,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  adminFetchOrderById,
  adminUpdateOrderStatus,
  type OrderResponse,
  slugify,
} from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ElementType }
> = {
  PENDING: { label: "Chờ xử lý", variant: "outline", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", variant: "secondary", icon: CheckCircle },
  PROCESSING: { label: "Đang xử lý", variant: "secondary", icon: Package },
  SHIPPED: { label: "Đang giao", variant: "default", icon: Truck },
  DELIVERED: { label: "Đã giao", variant: "default", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", variant: "destructive", icon: XCircle },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await adminFetchOrderById(id);
        setOrder(data);
      } catch (error) {
        toast.error("Không thể tải thông tin đơn hàng");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const updated = await adminUpdateOrderStatus(Number(id), newStatus);
      setOrder(updated);
      toast.success(`Đã cập nhật trạng thái đơn hàng thành ${statusMap[newStatus].label}`);
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-medium">Không tìm thấy đơn hàng</h2>
        <Button asChild>
          <Link href="/admin/orders">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const currentStatus = order.orderStatus || "PENDING";
  const StatusIcon = statusMap[currentStatus]?.icon || Clock;

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Đơn hàng #{order.id}
              </h1>
              <Badge variant={statusMap[currentStatus]?.variant || "outline"}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusMap[currentStatus]?.label || "N/A"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Đặt lúc {order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy HH:mm") : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            In hóa đơn
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${slugify(item.productName)}-${item.productId}`}
                    className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      <Image
                        src={item.imageUrl || "https://placehold.co/100x100/F5E6E8/B76E79?text=Product"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.productName}</p>
                      {/* Hiển thị thuộc tính variant dưới dạng badges */}
                      {item.attributeValues && item.attributeValues.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.attributeValues.map((attr, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/20 px-2 py-0.5 text-xs text-primary font-medium"
                            >
                              <span className="text-muted-foreground font-normal">{attr.name}:</span>
                              {attr.value}
                            </span>
                          ))}
                          <span className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {item.variantName} - SKU: {item.sku}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="w-24 text-right font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </Link>

                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency((order.totalPrice || 0) + (order.discountAmount || 0))}</span>
                </div>
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ""}
                    </span>
                    <span className="text-green-600 font-medium">
                      -{formatCurrency(order.discountAmount)}
                    </span>
                  </div>
                )}
                <Separator className="bg-primary/10" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-2xl">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History Stepper */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Trình trạng đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-10">
              <div className="relative flex justify-between">
                {/* Progress Bar Background */}
                <div className="absolute top-[18px] left-[10%] right-[10%] h-1 bg-muted rounded-full" />
                
                {/* Active Progress Bar */}
                <div 
                  className="absolute top-[18px] left-[10%] h-1 bg-primary transition-all duration-500 rounded-full"
                  style={{ 
                    width: currentStatus === "PENDING" ? "0%" : 
                           (currentStatus === "PROCESSING" || currentStatus === "CONFIRMED") ? "33.33%" : 
                           currentStatus === "SHIPPED" ? "66.66%" : 
                           currentStatus === "DELIVERED" ? "80%" : "0%"
                  }}
                />

                {[
                  { key: "PENDING", label: "Đã đặt", icon: Clock },
                  { key: "PROCESSING", label: "Đang xử lý", icon: Package },
                  { key: "SHIPPED", label: "Đang giao", icon: Truck },
                  { key: "DELIVERED", label: "Đã nhận", icon: CheckCircle },
                ].map((step, idx, arr) => {
                  const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
                  const effectiveStatus = currentStatus === "CONFIRMED" ? "PROCESSING" : currentStatus;
                  const currentIndex = statusOrder.indexOf(effectiveStatus);
                  const stepIndex = idx;
                  const isCompleted = currentIndex > stepIndex || effectiveStatus === "DELIVERED";
                  const isActive = currentIndex === stepIndex && effectiveStatus !== "DELIVERED";
                  const isLast = idx === arr.length - 1;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-4 w-20">
                       <div className={`
                         flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all duration-300
                         ${isCompleted ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                           isActive ? "bg-background border-primary text-primary scale-125 shadow-xl shadow-primary/10 ring-4 ring-primary/10" : 
                           "bg-background border-muted text-muted-foreground"}
                       `}>
                         {isCompleted ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                       </div>
                       <div className="text-center space-y-1">
                          <p className={`text-xs font-bold whitespace-nowrap transition-colors duration-300 ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          {(isActive || isCompleted) && order.orderDate && (
                             <p className="text-[10px] text-muted-foreground">
                               {idx === 0 ? format(new Date(order.orderDate), "HH:mm dd/MM") : ""}
                             </p>
                          )}
                       </div>
                    </div>
                  );
                })}

                {currentStatus === "CANCELLED" && (
                   <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-20">
                      <Badge variant="destructive" className="px-6 py-2 text-sm gap-2 shadow-lg animate-in zoom-in">
                        <XCircle className="h-4 w-4" />
                        ĐƠN HÀNG ĐÃ HỦY
                      </Badge>
                      {order.cancelReason && (
                        <p className="text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-1 animate-in slide-in-from-bottom-2">
                          Lý do: {order.cancelReason}
                        </p>
                      )}
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(currentStatus === "PENDING" || currentStatus === "PROCESSING" || currentStatus === "CONFIRMED") && (
                <>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleUpdateStatus("SHIPPED")}
                    disabled={isUpdating}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Bắt đầu giao hàng
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/10"
                    onClick={() => handleUpdateStatus("CANCELLED")}
                    disabled={isUpdating}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy đơn hàng
                  </Button>
                </>
              )}
              {currentStatus === "SHIPPED" && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleUpdateStatus("DELIVERED")}
                  disabled={isUpdating}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Xác nhận đã giao
                </Button>
              )}
              {(currentStatus === "DELIVERED" || currentStatus === "CANCELLED") && (
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    Đơn hàng đã {currentStatus === "DELIVERED" ? "hoàn thành" : "bị hủy"}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer & Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin nhận hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-primary" />
                <div className="text-sm space-y-1">
                  <p className="font-bold">{order.receiverName}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{order.phone}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-1">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{order.paymentMethod || "N/A"}</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    order.paymentStatus === "PAID"
                      ? "border-green-500 text-green-600 bg-green-50"
                      : "border-amber-500 text-amber-600 bg-amber-50"
                  }
                >
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

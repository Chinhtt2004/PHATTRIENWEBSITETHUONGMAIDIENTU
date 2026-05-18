"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronLeft,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  MapPin,
  CreditCard,
  ShoppingBag,
  History,
  Star,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/data";
import { fetchMyOrderDetail, cancelMyOrder, type OrderResponse, slugify } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { ReviewModal } from "@/components/reviews/review-modal";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const orderId = Number(resolvedParams.id);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
    image: string;
    variant?: string;
  } | null>(null);

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMyOrderDetail(orderId);
      setOrder(data);
    } catch (error) {
      toast.error("Không thể tải thông tin đơn hàng");
      router.push("/account/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    setIsCancelling(true);
    try {
      await cancelMyOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công");
      loadOrderDetail();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Hủy đơn hàng thất bại");
    } finally {
      setIsCancelling(false);
    }
  };

  const openReviewModal = (item: any) => {
    setSelectedItem({
      id: item.id,
      name: item.productName,
      image: item.imageUrl,
      variant: item.variantName,
    });
    setReviewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) return null;

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return { label: "Chờ xử lý", color: "bg-warning/10 text-warning border-warning/20", icon: <Clock className="h-4 w-4" /> };
      case "CONFIRMED":
        return { label: "Đã xác nhận", color: "bg-info/10 text-info border-info/20", icon: <CheckCircle2 className="h-4 w-4" /> };
      case "SHIPPED":
        return { label: "Đã giao hàng", color: "bg-info/10 text-info border-info/20", icon: <CheckCircle2 className="h-4 w-4" /> };
      case "SHIPPING":
        return { label: "Đang giao hàng", color: "bg-primary/10 text-primary border-primary/20", icon: <Truck className="h-4 w-4" /> };
      case "DELIVERED":
        return { label: "Đã giao hàng thành công", color: "bg-success/10 text-success border-success/20", icon: <CheckCircle2 className="h-4 w-4" /> };
      case "CANCELLED":
        return { label: "Đã hủy", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <XCircle className="h-4 w-4" /> };
      default:
        return { label: status, color: "bg-muted text-muted-foreground", icon: <AlertCircle className="h-4 w-4" /> };
    }
  };

  const status = getStatusInfo(order.orderStatus);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="rounded-full h-10 w-10 border-border/50 bg-white">
            <Link href="/account/orders">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
              <Badge variant="outline" className={`rounded-full px-3 py-1 font-bold flex items-center gap-1.5 ${status.color}`}>
                {status.icon}
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {order.orderStatus.toUpperCase() === "PENDING" && (
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full px-6 shadow-lg shadow-destructive/10"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
            Hủy đơn hàng
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Products List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Sản phẩm đã đặt ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.items?.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/product/${slugify(item.productName)}-${item.productId}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/10 transition-colors group"
                  >
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/50 shadow-sm group-hover:scale-105 transition-transform">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {item.productName}
                      </h4>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary-light"></span>
                          Phân loại: {item.variantName}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                          <p className="text-xs text-muted-foreground">Số lượng: x{item.quantity}</p>
                        </div>
                        <p className="font-bold text-base">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>

                    {order.orderStatus.toUpperCase() === "DELIVERED" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full gap-2 px-4 border border-primary/20 hover:bg-primary hover:text-white transition-all sm:self-center"
                        onClick={() => openReviewModal(item)}
                      >
                        <Star className="h-4 w-4" />
                        Đánh giá
                      </Button>
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline / Status History Block */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2 text-info">
                <History className="h-5 w-5" />
                Lịch sử đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                <div className="relative">
                  <div className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ring-4 ring-primary-light ${order.orderStatus.toUpperCase() !== 'CANCELLED' ? 'bg-primary' : 'bg-muted'}`}></div>
                  <p className="text-sm font-bold">Đặt hàng thành công</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleString("vi-VN")}</p>
                </div>
                {order.orderStatus.toUpperCase() === "CANCELLED" ? (
                  <div className="relative">
                    <div className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ring-4 ring-destructive/20 bg-destructive"></div>
                    <p className="text-sm font-bold text-destructive">Đơn hàng đã hủy</p>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <div className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ring-4 ${['DELIVERED', 'SHIPPING', 'SHIPPED', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus.toUpperCase()) ? 'ring-primary-light bg-primary' : 'ring-muted bg-muted/50'}`}></div>
                      <p className={`text-sm font-bold ${['DELIVERED', 'SHIPPING', 'SHIPPED', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus.toUpperCase()) ? '' : 'text-muted-foreground'}`}>Người bán đã xác nhận đơn hàng</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ring-4 ${['DELIVERED', 'SHIPPING', 'SHIPPED'].includes(order.orderStatus.toUpperCase()) ? 'ring-primary-light bg-primary' : 'ring-muted bg-muted/50'}`}></div>
                      <p className={`text-sm font-bold ${['DELIVERED', 'SHIPPING', 'SHIPPED'].includes(order.orderStatus.toUpperCase()) ? '' : 'text-muted-foreground'}`}>Đơn hàng đang trên đường vận chuyển</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ring-4 ${order.orderStatus.toUpperCase() === 'DELIVERED' ? 'ring-success-light bg-success' : 'ring-muted bg-muted/50'}`}></div>
                      <p className={`text-sm font-bold ${order.orderStatus.toUpperCase() === 'DELIVERED' ? 'text-success' : 'text-muted-foreground'}`}>Giao hàng thành công</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Address & Payment & Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card className="border-border/50 shadow-sm bg-gradient-to-br from-white to-muted/20">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Địa chỉ nhận hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-bold text-sm uppercase tracking-tight">{order.receiverName}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{order.phone}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {order.shippingAddress}
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="font-medium">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán trực tuyến (VNPay)'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge variant="outline" className={order.paymentStatus.toUpperCase() === 'PAID' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                  {order.paymentStatus.toUpperCase() === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-border/50 shadow-sm bg-white border-2 border-primary/10">
            <CardHeader className="py-4">
              <CardTitle className="text-base">Tổng kết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span className="font-medium">{formatPrice(order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span className="font-medium text-success">Miễn phí</span>
              </div>
              {order.voucherCode && (
                <div className="flex justify-between text-sm text-destructive font-medium">
                  <span className="flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Khuyến mãi ({order.voucherCode}):
                  </span>
                  <span>-{formatPrice(order.discountAmount || 0)}</span>
                </div>
              )}
              <Separator className="my-2 bg-primary/10" />
              <div className="flex justify-between items-end">
                <span className="font-bold">Tổng thanh toán:</span>
                <span className="text-2xl font-bold text-primary tracking-tight">{formatPrice(order.totalPrice)}</span>
              </div>
            </CardContent>
            {order.paymentUrl && order.paymentStatus.toUpperCase() !== 'PAID' && order.orderStatus.toUpperCase() !== 'CANCELLED' && (
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-info hover:bg-info-hover rounded-full shadow-lg shadow-info/20 font-bold" asChild>
                  <a href={order.paymentUrl}>Thanh toán ngay</a>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          orderItemId={selectedItem.id}
          productName={selectedItem.name}
          productImage={selectedItem.image}
          variantName={selectedItem.variant}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/data";
import { fetchMyOrders, type OrderResponse } from "@/lib/api";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return { label: "Chờ xử lý", color: "bg-warning/10 text-warning" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", color: "bg-info/10 text-info" };
      case "SHIPPING":
        return { label: "Đang giao", color: "bg-primary/10 text-primary" };
      case "DELIVERED":
        return { label: "Đã giao", color: "bg-success/10 text-success" };
      case "CANCELLED":
        return { label: "Đã hủy", color: "bg-destructive/10 text-destructive" };
      default:
        return { label: status, color: "bg-muted text-muted-foreground" };
    }
  };

  const filterOrders = (status?: string) => {
    if (!status || status === "all") return orders;
    return orders.filter((order) => order.orderStatus.toUpperCase() === status.toUpperCase());
  };

  const OrderList = ({ filteredOrders }: { filteredOrders: OrderResponse[] }) => (
    <div className="space-y-4">
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Không có đơn hàng nào</p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const status = getStatusInfo(order.orderStatus);
          return (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">#{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={status.color}>{status.label}</Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items?.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.productName} {item.variantName ? `(${item.variantName})` : ""} x{item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    {(order.items?.length || 0) > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{(order.items?.length || 0) - 2} sản phẩm khác
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                    <span className="text-muted-foreground">Tổng cộng:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Đơn Hàng Của Tôi</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý tất cả đơn hàng của bạn
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Chờ xử lý ({filterOrders("pending").length})
            </TabsTrigger>
            <TabsTrigger value="shipping">
              Đang giao ({filterOrders("shipping").length})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Đã giao ({filterOrders("delivered").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Đã hủy ({filterOrders("cancelled").length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <OrderList filteredOrders={filterOrders("all")} />
          </TabsContent>
          <TabsContent value="pending" className="mt-6">
            <OrderList filteredOrders={filterOrders("pending")} />
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <OrderList filteredOrders={filterOrders("shipping")} />
          </TabsContent>
          <TabsContent value="delivered" className="mt-6">
            <OrderList filteredOrders={filterOrders("delivered")} />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <OrderList filteredOrders={filterOrders("cancelled")} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

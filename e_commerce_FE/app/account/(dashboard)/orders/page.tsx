import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/data";

export const metadata = {
  title: "Đơn hàng của tôi | GlowSkin",
  description: "Xem và theo dõi đơn hàng của bạn",
};

// Mock orders data
const orders = [
  {
    id: "VN260125001",
    date: "25/01/2026",
    status: "shipping",
    statusLabel: "Đang giao",
    statusColor: "bg-info/10 text-info",
    total: 1220000,
    items: [
      { name: "Serum Vitamin C 20%", variant: "30ml", quantity: 2, price: 450000 },
      { name: "Kem Chống Nắng SPF50+", variant: "50ml", quantity: 1, price: 320000 },
    ],
  },
  {
    id: "VN260120002",
    date: "20/01/2026",
    status: "delivered",
    statusLabel: "Đã giao",
    statusColor: "bg-success/10 text-success",
    total: 850000,
    items: [
      { name: "Kem Dưỡng Ẩm Hyaluronic Acid", variant: "50ml", quantity: 1, price: 380000 },
      { name: "Toner Cân Bằng Da", variant: "200ml", quantity: 1, price: 290000 },
    ],
  },
  {
    id: "VN260115003",
    date: "15/01/2026",
    status: "delivered",
    statusLabel: "Đã giao",
    statusColor: "bg-success/10 text-success",
    total: 1500000,
    items: [
      { name: "Mặt Nạ Dưỡng Ẩm Collagen", variant: "Hộp 10 miếng", quantity: 2, price: 300000 },
      { name: "Kem Dưỡng Mắt Chống Lão Hóa", variant: "15ml", quantity: 1, price: 520000 },
    ],
  },
  {
    id: "VN260110004",
    date: "10/01/2026",
    status: "cancelled",
    statusLabel: "Đã hủy",
    statusColor: "bg-destructive/10 text-destructive",
    total: 280000,
    items: [
      { name: "Son Môi Lì Velvet", variant: "Đỏ Cherry", quantity: 1, price: 280000 },
    ],
  },
];

export default function OrdersPage() {
  const filterOrders = (status?: string) => {
    if (!status || status === "all") return orders;
    return orders.filter((order) => order.status === status);
  };

  const OrderList = ({ filteredOrders }: { filteredOrders: typeof orders }) => (
    <div className="space-y-4">
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Không có đơn hàng nào</p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <Link key={order.id} href={`/account/orders/${order.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={order.statusColor}>{order.statusLabel}</Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} ({item.variant}) x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="text-muted-foreground">Tổng cộng:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
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
    </div>
  );
}

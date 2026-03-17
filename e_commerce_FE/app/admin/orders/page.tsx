"use client";

import Link from "next/link"

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  XCircle,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orders = [
  {
    id: "VN260128001",
    customer: "Nguyen Thi Lan",
    email: "lan@example.com",
    items: 3,
    total: 1250000,
    status: "processing",
    paymentStatus: "paid",
    date: "28/01/2026 14:30",
  },
  {
    id: "VN260128002",
    customer: "Tran Van Minh",
    email: "minh@example.com",
    items: 2,
    total: 850000,
    status: "shipped",
    paymentStatus: "paid",
    date: "28/01/2026 11:15",
  },
  {
    id: "VN260127003",
    customer: "Le Thi Huong",
    email: "huong@example.com",
    items: 5,
    total: 2100000,
    status: "delivered",
    paymentStatus: "paid",
    date: "27/01/2026 16:45",
  },
  {
    id: "VN260127004",
    customer: "Pham Van Duc",
    email: "duc@example.com",
    items: 1,
    total: 450000,
    status: "pending",
    paymentStatus: "pending",
    date: "27/01/2026 09:20",
  },
  {
    id: "VN260126005",
    customer: "Hoang Thi Mai",
    email: "mai@example.com",
    items: 4,
    total: 1800000,
    status: "delivered",
    paymentStatus: "paid",
    date: "26/01/2026 20:10",
  },
  {
    id: "VN260125006",
    customer: "Vo Van Nam",
    email: "nam@example.com",
    items: 2,
    total: 680000,
    status: "cancelled",
    paymentStatus: "refunded",
    date: "25/01/2026 13:00",
  },
];

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pending: { label: "Chờ xử lý", variant: "outline" },
  processing: { label: "Đang xử lý", variant: "secondary" },
  shipped: { label: "Đang giao", variant: "default" },
  delivered: { label: "Đã giao", variant: "default" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ thanh toán", color: "text-warning" },
  paid: { label: "Đã thanh toán", color: "text-success" },
  refunded: { label: "Đã hoàn tiền", color: "text-muted-foreground" },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý và xử lý đơn hàng của khách
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">Tất cả ({orderCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">
            Chờ xử lý ({orderCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Đang xử lý ({orderCounts.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Đang giao ({orderCounts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Đã giao ({orderCounts.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy ({orderCounts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{order.items} sản phẩm</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[order.status].variant}>
                        {statusMap[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${paymentStatusMap[order.paymentStatus].color}`}
                      >
                        {paymentStatusMap[order.paymentStatus].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          {order.status === "processing" && (
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Đánh dấu đã giao
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Hủy đơn hàng
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy đơn hàng nào
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Hiển thị {filteredOrders.length} đơn hàng</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm" disabled>
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

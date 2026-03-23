"use client";

import React from "react"

import { use } from "react";
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
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const order = {
  id: "VN260128001",
  status: "processing",
  paymentStatus: "paid",
  paymentMethod: "MoMo",
  createdAt: "28/01/2026 14:30",
  updatedAt: "28/01/2026 15:00",
  customer: {
    name: "Nguyễn Thị Lan",
    email: "lan.nguyen@example.com",
    phone: "0901234567",
    totalOrders: 5,
    memberTier: "Gold",
  },
  shippingAddress: {
    fullName: "Nguyễn Thị Lan",
    phone: "0901234567",
    street: "123 Nguyễn Huệ",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
  },
  shippingMethod: {
    name: "Giao hàng nhanh",
    price: 50000,
    estimatedDays: "1-2 ngày",
  },
  items: [
    {
      id: "1",
      name: "Serum Vitamin C 20%",
      variant: "30ml",
      sku: "SERUM-VC-001-30ML",
      price: 450000,
      quantity: 2,
      image: "https://placehold.co/100x100/F5E6E8/B76E79?text=Serum",
    },
    {
      id: "2",
      name: "Kem Chống Nắng SPF50+",
      variant: "50ml",
      sku: "SUNSCREEN-004-50ML",
      price: 320000,
      quantity: 1,
      image: "https://placehold.co/100x100/F5F3F1/1A1A1A?text=Sun",
    },
  ],
  subtotal: 1220000,
  discount: {
    code: "SUMMER20",
    amount: 122000,
  },
  shipping: 50000,
  total: 1148000,
  timeline: [
    {
      status: "created",
      label: "Đơn hàng được tạo",
      time: "28/01/2026 14:30",
      description: "Khách hàng đặt đơn qua website",
    },
    {
      status: "paid",
      label: "Thanh toán thành công",
      time: "28/01/2026 14:32",
      description: "Thanh toán qua MoMo - Mã GD: MOMO123456",
    },
    {
      status: "processing",
      label: "Đang xử lý",
      time: "28/01/2026 15:00",
      description: "Đơn hàng đang được chuẩn bị",
    },
  ],
  notes: "Giao giờ hành chính, gọi trước khi giao.",
};

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ElementType }
> = {
  pending: { label: "Chờ xử lý", variant: "outline", icon: Clock },
  processing: { label: "Đang xử lý", variant: "secondary", icon: Package },
  shipped: { label: "Đang giao", variant: "default", icon: Truck },
  delivered: { label: "Đã giao", variant: "default", icon: CheckCircle },
  cancelled: { label: "Đã hủy", variant: "destructive", icon: XCircle },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const StatusIcon = statusMap[order.status].icon;

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
              <Badge variant={statusMap[order.status].variant}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusMap[order.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground">Đặt lúc {order.createdAt}</p>
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
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.variant} - SKU: {item.sku}
                      </p>
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
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Giảm giá ({order.discount.code})
                    </span>
                    <span className="text-success">
                      -{formatCurrency(order.discount.amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch sử đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-border">
                {order.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-6 top-1 h-4 w-4 rounded-full border-2 ${
                        index === order.timeline.length - 1
                          ? "border-primary bg-primary"
                          : "border-border bg-background"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.label}</p>
                        <span className="text-sm text-muted-foreground">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ghi chú</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.notes && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Ghi chú từ khách hàng:</p>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">Thêm ghi chú nội bộ:</p>
                <Textarea placeholder="Ghi chú chỉ hiển thị cho nhân viên..." />
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Lưu ghi chú
                </Button>
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
              {order.status === "processing" && (
                <>
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Truck className="mr-2 h-4 w-4" />
                    Xác nhận giao hàng
                  </Button>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive bg-transparent">
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy đơn hàng
                  </Button>
                </>
              )}
              {order.status === "shipped" && (
                <Button className="w-full bg-success hover:bg-success/90 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Xác nhận đã giao
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.totalOrders} đơn hàng
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-warning text-warning"
                >
                  {order.customer.memberTier}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href={`/admin/customers/${order.customer.email}`}>
                  Xem hồ sơ khách hàng
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.street}, {order.shippingAddress.ward}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.district},{" "}
                    {order.shippingAddress.city}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{order.shippingMethod.name}</p>
                  <p className="text-muted-foreground">
                    {order.shippingMethod.estimatedDays} -{" "}
                    {formatCurrency(order.shippingMethod.price)}
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
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.paymentMethod}</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    order.paymentStatus === "paid"
                      ? "border-success text-success"
                      : "border-warning text-warning"
                  }
                >
                  {order.paymentStatus === "paid"
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

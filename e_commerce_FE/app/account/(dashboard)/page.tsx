<<<<<<< HEAD
import Link from "next/link";
import { Package, MapPin, Heart, Tag, ArrowRight } from "lucide-react";
=======
"use client";

import Link from "next/link";
import { Package, MapPin, Heart, Tag, ArrowRight, Loader2 } from "lucide-react";
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/data";
<<<<<<< HEAD

export const metadata = {
  title: "Tài khoản của tôi | GlowSkin",
  description: "Quản lý tài khoản và đơn hàng của bạn",
};

// Mock data
const stats = [
  { label: "Tổng đơn hàng", value: 12 },
  { label: "Đang giao", value: 2 },
  { label: "Điểm tích lũy", value: 2500 },
  { label: "Voucher", value: 3 },
];

const recentOrders = [
  {
    id: "VN260125001",
    date: "25/01/2026",
    status: "Đang giao",
    statusColor: "bg-info/10 text-info",
    total: 1220000,
    items: 3,
  },
  {
    id: "VN260120002",
    date: "20/01/2026",
    status: "Đã giao",
    statusColor: "bg-success/10 text-success",
    total: 850000,
    items: 2,
  },
  {
    id: "VN260115003",
    date: "15/01/2026",
    status: "Đã giao",
    statusColor: "bg-success/10 text-success",
    total: 1500000,
    items: 4,
  },
=======
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/api";

// Mock data (since Order API is not yet available)
const stats = [
  { label: "Tổng đơn hàng", value: 0 },
  { label: "Đang giao", value: 0 },
  { label: "Điểm tích lũy", value: 0 },
  { label: "Voucher", value: 0 },
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
];

const quickActions = [
  { name: "Đơn hàng", href: "/account/orders", icon: Package },
  { name: "Địa chỉ", href: "/account/addresses", icon: MapPin },
  { name: "Yêu thích", href: "/account/wishlist", icon: Heart },
  { name: "Voucher", href: "/account/vouchers", icon: Tag },
];

export default function AccountPage() {
<<<<<<< HEAD
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Xin chào, Lan!</h1>
=======
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user?.name || "bạn";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Xin chào, {displayName}!</h1>
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
        <p className="text-muted-foreground">
          Quản lý tài khoản và theo dõi đơn hàng của bạn tại đây.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium">{action.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

<<<<<<< HEAD
      {/* Recent Orders */}
=======
      {/* Recent Orders - Simplified for now as fallback */}
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/orders">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.date} | {order.items} sản phẩm
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatPrice(order.total)}
                  </p>
                  <Badge className={order.statusColor}>{order.status}</Badge>
                </div>
              </Link>
            ))}
=======
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Bạn chưa có đơn hàng nào.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/products">Mua sắm ngay</Link>
            </Button>
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

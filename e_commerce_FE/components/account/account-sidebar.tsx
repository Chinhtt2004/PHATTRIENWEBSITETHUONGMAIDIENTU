"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Heart,
  Tag,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { name: "Tổng quan", href: "/account", icon: User },
  { name: "Đơn hàng của tôi", href: "/account/orders", icon: Package },
  { name: "Sổ địa chỉ", href: "/account/addresses", icon: MapPin },
  { name: "Yêu thích", href: "/account/wishlist", icon: Heart },
  { name: "Voucher của tôi", href: "/account/vouchers", icon: Tag },
  { name: "Đánh giá của tôi", href: "/account/reviews", icon: Star },
  { name: "Cài đặt", href: "/account/settings", icon: Settings },
];

// Mock user data
const user = {
  name: "Nguyễn Thị Lan",
  email: "lan.nguyen@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  memberTier: "Gold",
  loyaltyPoints: 2500,
};

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        {/* User Profile */}
        <div className="text-center mb-6 pb-6 border-b border-border">
          <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-muted">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge className="bg-warning/10 text-warning border-warning/20">
              {user.memberTier}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user.loyaltyPoints.toLocaleString()} điểm
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-6 pt-6 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5 mr-3" />
            Đăng xuất
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

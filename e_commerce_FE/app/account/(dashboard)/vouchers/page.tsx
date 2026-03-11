"use client";

import { useState } from "react";
import { Ticket, Copy, Check, Clock, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const vouchers = [
  {
    id: "v1",
    code: "SUMMER20",
    discount: "20%",
    description: "Giảm 20% cho đơn hàng từ 500.000đ",
    minOrder: 500000,
    maxDiscount: 200000,
    expiryDate: "2026-02-28",
    status: "active",
  },
  {
    id: "v2",
    code: "FREESHIP",
    discount: "Free Ship",
    description: "Miễn phí vận chuyển cho đơn từ 300.000đ",
    minOrder: 300000,
    maxDiscount: 50000,
    expiryDate: "2026-03-15",
    status: "active",
  },
  {
    id: "v3",
    code: "NEWUSER50",
    discount: "50.000d",
    description: "Giảm 50.000đ cho khách hàng mới",
    minOrder: 200000,
    maxDiscount: 50000,
    expiryDate: "2026-01-15",
    status: "expired",
  },
  {
    id: "v4",
    code: "LOYALTY100",
    discount: "100.000d",
    description: "Giảm 100.000đ - Ưu đãi thành viên Gold",
    minOrder: 800000,
    maxDiscount: 100000,
    expiryDate: "2026-04-30",
    status: "active",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function VoucherCard({
  voucher,
}: {
  voucher: (typeof vouchers)[0];
}) {
  const [copied, setCopied] = useState(false);
  const isExpired = voucher.status === "expired";

  const copyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={isExpired ? "opacity-60" : ""}>
      <CardContent className="p-0">
        <div className="flex">
          <div
            className={`flex flex-col items-center justify-center p-6 ${isExpired ? "bg-muted" : "bg-primary-light"} min-w-[120px]`}
          >
            <Ticket
              className={`h-8 w-8 mb-2 ${isExpired ? "text-muted-foreground" : "text-primary"}`}
            />
            <span
              className={`font-bold text-lg ${isExpired ? "text-muted-foreground" : "text-primary"}`}
            >
              {voucher.discount}
            </span>
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-lg">
                    {voucher.code}
                  </span>
                  {isExpired ? (
                    <Badge variant="secondary">Hết hạn</Badge>
                  ) : (
                    <Badge className="bg-success text-white">Còn hiệu lực</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  {voucher.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Đơn tối thiểu: {formatCurrency(voucher.minOrder)}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    HSD: {formatDate(voucher.expiryDate)}
                  </span>
                </div>
              </div>
              {!isExpired && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="shrink-0 bg-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="mr-1 h-4 w-4 text-success" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" />
                      Sao chép
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VouchersPage() {
  const activeVouchers = vouchers.filter((v) => v.status === "active");
  const expiredVouchers = vouchers.filter((v) => v.status === "expired");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Voucher Của Tôi
        </h1>
        <p className="text-muted-foreground">
          Quản lý và sử dụng voucher giảm giá
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary to-primary-hover text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <Gift className="h-7 w-7" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Tổng voucher khả dụng</p>
                <p className="text-3xl font-bold">{activeVouchers.length}</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Nhập mã voucher
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Còn hiệu lực ({activeVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Đã hết hạn ({expiredVouchers.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4 space-y-4">
          {activeVouchers.length > 0 ? (
            activeVouchers.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  Chưa có voucher nào
                </h3>
                <p className="text-muted-foreground">
                  Hãy mua sắm để nhận voucher ưu đãi
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="expired" className="mt-4 space-y-4">
          {expiredVouchers.length > 0 ? (
            expiredVouchers.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  Khong co voucher het han
                </h3>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

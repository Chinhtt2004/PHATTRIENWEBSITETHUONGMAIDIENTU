"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const promotions = [
  {
    id: "promo_001",
    code: "SUMMER20",
    type: "percentage",
    value: 20,
    description: "Giảm 20% đơn hàng mùa hè",
    minOrder: 500000,
    maxDiscount: 200000,
    usageLimit: 100,
    usageCount: 45,
    startDate: "01/01/2026",
    endDate: "31/03/2026",
    isActive: true,
  },
  {
    id: "promo_002",
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    description: "Miễn phí vận chuyển",
    minOrder: 300000,
    maxDiscount: null,
    usageLimit: null,
    usageCount: 230,
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    isActive: true,
  },
  {
    id: "promo_003",
    code: "NEWUSER50",
    type: "fixed",
    value: 50000,
    description: "Giảm 50K cho khách hàng mới",
    minOrder: 200000,
    maxDiscount: null,
    usageLimit: 500,
    usageCount: 312,
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    isActive: true,
  },
  {
    id: "promo_004",
    code: "VIP30",
    type: "percentage",
    value: 30,
    description: "Giảm 30% cho khách VIP",
    minOrder: 1000000,
    maxDiscount: 500000,
    usageLimit: 50,
    usageCount: 50,
    startDate: "01/12/2025",
    endDate: "15/01/2026",
    isActive: false,
  },
];

const stats = [
  {
    title: "Tổng mã khuyến mãi",
    value: promotions.length,
    icon: Tag,
    color: "text-primary",
    bgColor: "bg-primary-light",
  },
  {
    title: "Đang hoạt động",
    value: promotions.filter((p) => p.isActive).length,
    icon: Percent,
    color: "text-success",
    bgColor: "bg-success-light",
  },
  {
    title: "Lượt sử dụng",
    value: promotions.reduce((acc, p) => acc + p.usageCount, 0),
    icon: Copy,
    color: "text-info",
    bgColor: "bg-info-light",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

function formatValue(type: string, value: number) {
  switch (type) {
    case "percentage":
      return `${value}%`;
    case "fixed":
      return formatCurrency(value);
    case "shipping":
      return "Miễn phí ship";
    default:
      return value;
  }
}

export default function AdminPromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = promo.code
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && promo.isActive) ||
      (statusFilter === "inactive" && !promo.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Khuyến mãi
          </h1>
          <p className="text-muted-foreground">
            Quản lý mã giảm giá và chương trình khuyến mãi
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Tạo mã mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">Tạo mã khuyến mãi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã khuyến mãi *</Label>
                  <Input id="code" placeholder="VD: SUMMER20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại giảm giá *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định</SelectItem>
                      <SelectItem value="shipping">Miễn phí ship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="value">Giá trị giảm *</Label>
                  <Input id="value" type="number" placeholder="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Đơn tối thiểu (VND)</Label>
                  <Input id="minOrder" type="number" placeholder="500000" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Giảm tối đa (VND)</Label>
                  <Input id="maxDiscount" type="number" placeholder="200000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                  <Input id="usageLimit" type="number" placeholder="100" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc *</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  placeholder="Mô tả ngắn về chương trình khuyến mãi"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Tạo mã
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">Tất cả ({promotions.length})</TabsTrigger>
          <TabsTrigger value="active">
            Đang hoạt động ({promotions.filter((p) => p.isActive).length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Hết hạn ({promotions.filter((p) => !p.isActive).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm mã khuyến mãi..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Điều kiện</TableHead>
                  <TableHead>Sử dụng</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono font-bold text-primary">
                          {promo.code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {promo.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {formatValue(promo.type, promo.value)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Đơn tối thiểu: {formatCurrency(promo.minOrder)}</p>
                        {promo.maxDiscount && (
                          <p className="text-muted-foreground">
                            Giảm tối đa: {formatCurrency(promo.maxDiscount)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {promo.usageCount}
                          {promo.usageLimit && `/${promo.usageLimit}`}
                        </p>
                        {promo.usageLimit && (
                          <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(promo.usageCount / promo.usageLimit) * 100}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {promo.startDate} - {promo.endDate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={promo.isActive ? "default" : "secondary"}
                        className={
                          promo.isActive ? "bg-success text-white" : ""
                        }
                      >
                        {promo.isActive ? "Hoạt động" : "Hết hạn"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép mã
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPromotions.length === 0 && (
            <div className="py-12 text-center">
              <Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Không tìm thấy mã khuyến mãi nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

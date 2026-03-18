"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Percent,
  Tag,
  Loader2,
  Gift,
  Truck,
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
import { adminFetchPromotions, adminCreatePromotion, adminUpdatePromotion, adminDeletePromotion, type Promotion, type PromotionRequest } from "@/lib/api";
import { formatPrice } from "@/lib/data";
import { toast } from "sonner";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "d";
}

function formatValue(type: string, value: number) {
  switch (type) {
    case "PERCENTAGE":
      return `${value}%`;
    case "FIXED":
      return formatCurrency(value);
    case "SHIPPING":
      return "Miễn phí ship";
    default:
      return value;
  }
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<PromotionRequest>({
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usageLimit: 100,
    isActive: true,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await adminFetchPromotions();
      setPromotions(data);
    } catch (error) {
      toast.error("Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (promo: Promotion | null = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        code: promo.code,
        description: promo.description || "",
        type: promo.type,
        value: promo.value,
        minOrderAmount: promo.minOrderAmount || 0,
        maxDiscountAmount: promo.maxDiscountAmount || 0,
        startDate: (promo.startDate || "").split("T")[0] || new Date().toISOString().split("T")[0],
        endDate: (promo.endDate || "").split("T")[0] || new Date().toISOString().split("T")[0],
        usageLimit: promo.usageLimit || 0,
        isActive: promo.isActive ?? true,
      });
    } else {
      setEditingPromo(null);
      setFormData({
        code: "",
        description: "",
        type: "PERCENTAGE",
        value: 0,
        minOrderAmount: 0,
        maxDiscountAmount: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        usageLimit: 100,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Ensure dates are in ISO LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
      const submissionData = {
        ...formData,
        startDate: formData.startDate.includes("T") ? formData.startDate : `${formData.startDate}T00:00:00`,
        endDate: formData.endDate.includes("T") ? formData.endDate : `${formData.endDate}T23:59:59`,
      };

      if (editingPromo) {
        await adminUpdatePromotion(editingPromo.id, submissionData);
        toast.success("Cập nhật thành công");
      } else {
        await adminCreatePromotion(submissionData);
        toast.success("Tạo mã mới thành công");
      }
      setIsDialogOpen(false);
      loadPromotions();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã này?")) return;
    try {
      await adminDeletePromotion(id);
      toast.success("Đã xóa mã khuyến mãi");
      loadPromotions();
    } catch (error) {
      toast.error("Không thể xóa mã");
    }
  };

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

  const statsList = [
    {
      title: "Tổng mã",
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
      title: "Tổng lượt dùng",
      value: promotions.reduce((acc, p) => acc + (p.usageCount || 0), 0),
      icon: Loader2,
      color: "text-info",
      bgColor: "bg-info-light",
    },
  ];

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
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo mã mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statsList.map((stat) => (
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
            Ngừng hoạt động ({promotions.filter((p) => !p.isActive).length})
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
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredPromotions.map((promo) => (
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
                        <p>Đơn tối thiểu: {formatCurrency(promo.minOrderAmount || 0)}</p>
                        {promo.maxDiscountAmount && (
                          <p className="text-muted-foreground">
                            Giảm tối đa: {formatCurrency(promo.maxDiscountAmount)}
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={promo.isActive ? "default" : "secondary"}
                        className={
                          promo.isActive ? "bg-success text-white" : ""
                        }
                      >
                        {promo.isActive ? "Hoạt động" : "Ngừng"}
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(promo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(promo.id)}
                            className="text-destructive"
                          >
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
        </CardContent>
      </Card>

      {/* Promotion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingPromo ? "Chỉnh sửa mã" : "Tạo mã khuyến mãi"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Mã khuyến mãi *</Label>
                <Input 
                  id="code" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="VD: SUMMER20" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại giảm giá *</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(val) => setFormData({...formData, type: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                    <SelectItem value="FIXED">Số tiền cố định</SelectItem>
                    <SelectItem value="SHIPPING">Miễn phí ship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="value">Giá trị giảm *</Label>
                <Input 
                  id="value" 
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  placeholder="20" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Đơn tối thiểu (VND)</Label>
                <Input 
                  id="minOrder" 
                  type="number" 
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                  placeholder="500000" 
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Giảm tối đa (VND)</Label>
                <Input 
                  id="maxDiscount" 
                  type="number" 
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({...formData, maxDiscountAmount: Number(e.target.value)})}
                  placeholder="200000" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                <Input 
                  id="usageLimit" 
                  type="number" 
                  value={formData.usageLimit || 0}
                  onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                  placeholder="100" 
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Mô tả ngắn về chương trình khuyến mãi"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={(val) => setFormData({...formData, isActive: val})}
              />
              <Label htmlFor="isActive">Đang hoạt động</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                {editingPromo ? "Cập nhật" : "Tạo mã"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

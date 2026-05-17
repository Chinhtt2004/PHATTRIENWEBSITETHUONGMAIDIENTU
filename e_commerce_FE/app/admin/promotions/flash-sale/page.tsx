"use client";

import { useState, useEffect } from "react";
import { fetchActiveFlashSales, createFlashSale, disableFlashSale, FlashSaleResponse } from "@/lib/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { Plus, Power, Settings, Clock, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function FlashSaleAdminPage() {
  const [flashSales, setFlashSales] = useState<FlashSaleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchActiveFlashSales();
      setFlashSales(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách Flash Sale",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    try {
      if (!formData.name || !formData.startTime || !formData.endTime) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin",
        });
        return;
      }

      // Format to YYYY-MM-DDTHH:mm:ss (no Z)
      const formatLocal = (dateString: string) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, -1);
        return localISOTime.split('.')[0];
      };

      await createFlashSale({
        name: formData.name,
        startTime: formatLocal(formData.startTime),
        endTime: formatLocal(formData.endTime),
      });

      toast({
        title: "Thành công",
        description: "Đã tạo đợt Flash Sale mới",
      });
      setIsCreateOpen(false);
      setFormData({ name: "", startTime: "", endTime: "" });
      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tạo",
      });
    }
  };

  const handleDisable = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn kết thúc đợt Flash Sale này sớm không?")) return;
    
    try {
      await disableFlashSale(id);
      toast({
        title: "Thành công",
        description: "Đã kết thúc đợt Flash Sale",
      });
      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Flash Sale</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tạo đợt Sale mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo Flash Sale mới</DialogTitle>
              <DialogDescription>
                Thiết lập thời gian và tên gọi cho chương trình khuyến mãi chớp nhoáng.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tên chương trình</Label>
                <Input
                  placeholder="VD: Siêu Sale 9/9"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Thời gian bắt đầu</Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Thời gian kết thúc</Label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
              <Button onClick={handleCreate}>Tạo mới</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Chương Trình</TableHead>
              <TableHead>Thời Gian Bắt Đầu</TableHead>
              <TableHead>Thời Gian Kết Thúc</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : flashSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không có chương trình Flash Sale nào đang hoạt động.
                </TableCell>
              </TableRow>
            ) : (
              flashSales.map((sale) => {
                const now = new Date();
                const start = new Date(sale.startTime);
                const end = new Date(sale.endTime);
                
                let statusInfo = { label: "Sắp diễn ra", color: "bg-blue-500" };
                if (!sale.isActive) statusInfo = { label: "Đã tắt", color: "bg-gray-500" };
                else if (now >= start && now <= end) statusInfo = { label: "Đang diễn ra", color: "bg-red-500 animate-pulse" };
                else if (now > end) statusInfo = { label: "Đã kết thúc", color: "bg-gray-500" };

                return (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(start, "dd/MM/yyyy HH:mm", { locale: vi })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(end, "dd/MM/yyyy HH:mm", { locale: vi })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Tag className="mr-1 h-3 w-3" />
                        {sale.products?.length || 0} SP
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/promotions/flash-sale/${sale.id}`}>
                            <Settings className="mr-2 h-4 w-4" /> Cài đặt
                          </Link>
                        </Button>
                        {sale.isActive && (
                          <Button variant="destructive" size="sm" onClick={() => handleDisable(sale.id)}>
                            <Power className="mr-2 h-4 w-4" /> Dừng
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

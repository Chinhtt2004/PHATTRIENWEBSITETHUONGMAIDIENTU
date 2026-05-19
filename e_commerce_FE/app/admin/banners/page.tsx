"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminCreateBanner, adminDeleteBanner, adminToggleBannerActive, adminUpdateBanner, fetchBanners, type Banner } from "@/lib/api";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBanners();
      setBanners(data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách banner");
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setName(banner.name);
    } else {
      setEditingBanner(null);
      setName("");
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Vui lòng nhập tên banner");
      return;
    }

    setIsSaving(true);
    try {
      if (editingBanner) {
        await adminUpdateBanner(editingBanner.id, { name });
        toast.success("Cập nhật banner thành công");
      } else {
        await adminCreateBanner({ name });
        toast.success("Tạo banner mới thành công");
      }
      closeDialog();
      loadBanners();
    } catch (error) {
      toast.error("Lưu banner thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Bạn có chắc chắn xóa banner "${banner.name}" không?`)) {
      return;
    }

    try {
      await adminDeleteBanner(banner.id);
      toast.success("Xóa banner thành công");
      setBanners((prev) => prev.filter((item) => item.id !== banner.id));
    } catch (error) {
      toast.error("Xóa banner thất bại");
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const updated = await adminToggleBannerActive(banner.id);
      setBanners((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái banner");
    }
  };

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Quản lý banner</h1>
          <p className="text-muted-foreground">Tạo và chỉnh sửa các banner để hiển thị trên trang chính.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground" onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo banner
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Danh sách banner</h2>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên banner</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        Chưa có banner nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    banners.map((banner) => (
                      <TableRow key={banner.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>{banner.name}</TableCell>
                        <TableCell>
                          <Badge variant={banner.active ? "secondary" : "outline"}>
                            {banner.active ? "Đang kích hoạt" : "Tắt"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/banners/${banner.id}`}>Items</Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleActive(banner)}>
                              {banner.active ? "Tắt" : "Bật"}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDialog(banner)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(banner)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Chỉnh sửa banner" : "Tạo banner mới"}</DialogTitle>
            <DialogDescription>Nhập tên banner để gợi ý nội dung hiển thị.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="banner-name">Tên banner</Label>
              <Input id="banner-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeDialog}>Hủy</Button>
            <Button onClick={handleSave} disabled={isSaving}>{editingBanner ? "Cập nhật" : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

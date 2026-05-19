"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminCreateBannerItem, adminDeleteBannerItem, adminUpdateBannerItem, fetchBanners, fetchBannerItemsByBanner, type Banner, type BannerItem } from "@/lib/api";

export default function AdminBannerItemsPage() {
  const params = useParams();
  const bannerId = Number(params?.id ?? "0");

  const [banner, setBanner] = useState<Banner | null>(null);
  const [items, setItems] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);
  const [position, setPosition] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!bannerId) return;
    loadItems();
  }, [bannerId]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const [allBanners, bannerItems] = await Promise.all([
        fetchBanners(),
        fetchBannerItemsByBanner(bannerId),
      ]);

      setBanner(allBanners.find((item) => item.id === bannerId) ?? null);
      setItems(bannerItems || []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu banner");
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (item?: BannerItem) => {
    if (item) {
      setEditingItem(item);
      setPosition(item.position);
      setImageFile(null);
    } else {
      setEditingItem(null);
      setPosition(1);
      setImageFile(null);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      setImageFile(null);
      return;
    }
    setImageFile(event.target.files[0]);
  };

  const handleSave = async () => {
    if (!bannerId) {
      toast.error("ID banner không hợp lệ");
      return;
    }
    if (!editingItem && !imageFile) {
      toast.error("Vui lòng chọn ảnh cho banner item");
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await adminUpdateBannerItem(editingItem.id, bannerId, position, imageFile ?? undefined);
        toast.success("Cập nhật banner item thành công");
      } else {
        await adminCreateBannerItem(bannerId, position, imageFile as File);
        toast.success("Tạo banner item thành công");
      }
      closeDialog();
      loadItems();
    } catch (error) {
      toast.error("Lưu banner item thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: BannerItem) => {
    if (!confirm("Bạn có chắc chắn muốn xóa item này?")) {
      return;
    }
    try {
      await adminDeleteBannerItem(item.id);
      toast.success("Xóa item thành công");
      setItems((prev) => prev.filter((current) => current.id !== item.id));
    } catch (error) {
      toast.error("Xóa item thất bại");
    }
  };

  if (!bannerId) {
    return (
      <div className="space-y-6 pt-16 lg:pt-0">
        <p className="text-muted-foreground">ID banner không hợp lệ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Banner: {banner?.name || "..."}
          </h1>
          <p className="text-muted-foreground">Quản lý các ảnh/điểm hiển thị thuộc banner này.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground" onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo item mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Danh sách banner item</h2>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ảnh</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Chưa có item nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <img src={item.imageUrl} alt={`item-${item.id}`} className="h-16 w-24 rounded object-cover" />
                        </TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.active ? "Hoạt động" : "Tắt"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa item" : "Tạo item mới"}</DialogTitle>
            <DialogDescription>
              Upload ảnh banner và thiết lập vị trí hiển thị.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="banner-item-position">Vị trí</Label>
              <Input
                id="banner-item-position"
                type="number"
                min={1}
                value={position}
                onChange={(event) => setPosition(Number(event.target.value) || 1)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="banner-item-image">Ảnh</Label>
              <Input id="banner-item-image" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            {editingItem && !imageFile ? (
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Giữ nguyên ảnh hiện tại nếu không chọn file mới.</p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeDialog}>Hủy</Button>
            <Button onClick={handleSave} disabled={isSaving}>{editingItem ? "Cập nhật" : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminCreatePage, adminDeletePage, adminUpdatePage, fetchPages, type PageItem, type PageRequest } from "@/lib/api";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [formData, setFormData] = useState<PageRequest>({ name: "", slug: "" });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPages();
      setPages(data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách trang");
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (page?: PageItem) => {
    if (page) {
      setEditingPage(page);
      setFormData({ name: page.name, slug: page.slug });
    } else {
      setEditingPage(null);
      setFormData({ name: "", slug: "" });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPage(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Vui lòng điền tên và slug");
      return;
    }

    setIsSaving(true);
    try {
      if (editingPage) {
        await adminUpdatePage(Number(editingPage.id), formData);
        toast.success("Cập nhật trang thành công");
      } else {
        await adminCreatePage(formData);
        toast.success("Tạo trang mới thành công");
      }
      closeDialog();
      await loadPages();
    } catch (error) {
      toast.error("Lưu trang thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (page: PageItem) => {
    const confirmed = confirm(`Bạn có chắc muốn xóa trang "${page.name}" không?`);
    if (!confirmed) return;

    try {
      await adminDeletePage(Number(page.id));
      toast.success("Xóa trang thành công");
      setPages((prev) => prev.filter((item) => item.id !== page.id));
    } catch (error) {
      toast.error("Xóa trang thất bại");
    }
  };

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Quản lý trang</h1>
          <p className="text-muted-foreground">
            Quản lý các trang động và cấu hình các phần hiển thị theo trang.
          </p>
        </div>
        <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Tạo trang mới
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={""} placeholder="Tìm kiếm..." className="pl-9" disabled />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Tên trang</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        Chưa có trang nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pages.map((page) => (
                      <TableRow key={page.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>{page.name}</TableCell>
                        <TableCell>{page.slug}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/pages/${page.id}`}>
                              <Button variant="outline" size="sm">
                                Chi tiết
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => openDialog(page)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(page)}>
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
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Chỉnh sửa trang" : "Tạo trang mới"}</DialogTitle>
            <DialogDescription>
              Điền thông tin trang để quản lý nội dung động.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="page-name">Tên trang</Label>
              <Input
                id="page-name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="page-slug">Slug</Label>
              <Input
                id="page-slug"
                value={formData.slug}
                onChange={(event) => setFormData({ ...formData, slug: event.target.value })}
                placeholder="ví dụ: home"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeDialog}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {editingPage ? "Cập nhật" : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

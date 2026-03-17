"use client";

import { useState, use, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  GripVertical,
  Upload,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  fetchProductById, 
  fetchCategories, 
  adminCreateProduct, 
  adminUpdateProduct, 
  adminDeleteProduct,
  type ProductRequest 
} from "@/lib/api";
import { toast } from "sonner";
import type { Category, Product } from "@/lib/data";

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<ProductRequest>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
  });

  const [sku, setSku] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        if (!isNew) {
          const prod = await fetchProductById(Number(id));
          setProduct(prod);
          setFormData({
            name: prod.name,
            description: prod.shortDescription,
            price: prod.price,
            stockQuantity: prod.inventory.quantity,
            categoryId: Number(prod.categoryId),
          });
          setSku(prod.sku);
          if (prod.images && prod.images.length > 0) {
            setPreviewUrl(prod.images[0].url);
          }
        }
      } catch (error) {
        toast.error("Không thể tải thông tin sản phẩm");
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, isNew, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId || formData.price < 0) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        await adminCreateProduct(formData, imageFile || undefined);
        toast.success("Đã tạo sản phẩm thành công");
      } else {
        await adminUpdateProduct(Number(id), formData, imageFile || undefined);
        toast.success("Đã cập nhật sản phẩm thành công");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(isNew ? "Tạo sản phẩm thất bại" : "Cập nhật sản phẩm thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await adminDeleteProduct(Number(id));
        toast.success("Đã xóa sản phẩm thành công");
        router.push("/admin/products");
      } catch (error) {
        toast.error("Xóa sản phẩm thất bại");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {isNew ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Tạo sản phẩm mới cho cửa hàng"
                : `Chỉnh sửa: ${product?.name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button variant="outline" asChild>
              <Link href={`/product/${product?.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Xem trang
              </Link>
            </Button>
          )}
          <Button 
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isNew ? "Tạo sản phẩm" : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm *</Label>
                    <Input
                      id="name"
                      placeholder="VD: Serum Vitamin C 20%"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku">Mã SKU (Tự động từ Backend)</Label>
                      <Input
                        id="sku"
                        placeholder="VD: SERUM-VC-001"
                        value={sku}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục *</Label>
                      <Select
                        value={String(formData.categoryId)}
                        onValueChange={(value) =>
                          setFormData({ ...formData, categoryId: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sản phẩm *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả về sản phẩm..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Giá bán & Tồn kho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Giá bán *</Label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          placeholder="0"
                          className="pr-12"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: Number(e.target.value) })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          VND
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inventory">Số lượng tồn kho *</Label>
                      <Input
                        id="inventory"
                        type="number"
                        placeholder="0"
                        value={formData.stockQuantity}
                        onChange={(e) =>
                          setFormData({ ...formData, stockQuantity: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hình ảnh sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {previewUrl && (
                      <div className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setPreviewUrl(null);
                              setImageFile(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {!previewUrl && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Tải hình lên
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Định dạng: JPG, PNG, WebP. Tối đa 5MB.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sẵn sàng bán</p>
                  <p className="text-sm text-muted-foreground">
                    Dựa trên số lượng tồn kho
                  </p>
                </div>
                <Badge
                  variant={formData.stockQuantity > 0 ? "default" : "secondary"}
                  className={
                    formData.stockQuantity > 0 ? "bg-success text-white" : ""
                  }
                >
                  {formData.stockQuantity > 0 ? "Đang bán" : "Hết hàng"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {!isNew && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  Vùng nguy hiểm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Xóa sản phẩm này vĩnh viễn. Hành động này không thể hoàn tác.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa sản phẩm
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

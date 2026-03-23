"use client";

<<<<<<< HEAD
import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
=======
import { useState, use, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  GripVertical,
  Upload,
  Eye,
<<<<<<< HEAD
=======
  Loader2,
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
import { products } from "@/lib/data";
=======
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
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
<<<<<<< HEAD
  const { id } = use(params);
  const isNew = id === "new";
  const product = isNew ? null : products.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    description: product?.shortDescription || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    categoryId: product?.categoryId || "",
    brandId: product?.brandId || "",
    inventory: product?.inventory?.quantity?.toString() || "0",
    isActive: product?.inventory?.available ?? true,
  });

  const [variants, setVariants] = useState(
    product?.variants || [
      { id: "var_new_1", name: "Mặc định", sku: "", price: "", inventory: "0" },
    ]
  );

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var_new_${Date.now()}`,
        name: "",
        sku: "",
        price: "",
        inventory: "0",
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

=======
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

>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
=======
          <Button 
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
              <TabsTrigger value="variants">Biến thể</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
=======
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
                      <Label htmlFor="sku">Mã SKU *</Label>
                      <Input
                        id="sku"
                        placeholder="VD: SERUM-VC-001"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
=======
                      <Label htmlFor="sku">Mã SKU (Tự động từ Backend)</Label>
                      <Input
                        id="sku"
                        placeholder="VD: SERUM-VC-001"
                        value={sku}
                        disabled
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục *</Label>
                      <Select
<<<<<<< HEAD
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, categoryId: value })
=======
                        value={String(formData.categoryId)}
                        onValueChange={(value) =>
                          setFormData({ ...formData, categoryId: Number(value) })
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
<<<<<<< HEAD
                          <SelectItem value="cat_skincare">
                            Chăm sóc da
                          </SelectItem>
                          <SelectItem value="cat_cleanser">Làm sạch</SelectItem>
                          <SelectItem value="cat_suncare">Chống nắng</SelectItem>
                          <SelectItem value="cat_makeup">Trang điểm</SelectItem>
=======
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
<<<<<<< HEAD
                    <Label htmlFor="description">Mô tả ngắn</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả ngắn gọn về sản phẩm..."
                      rows={3}
=======
                    <Label htmlFor="description">Mô tả sản phẩm *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả về sản phẩm..."
                      rows={5}
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
<<<<<<< HEAD

                  <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Select
                      value={formData.brandId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, brandId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand_glowskin">GlowSkin</SelectItem>
                        <SelectItem value="brand_purebeauty">
                          Pure Beauty
                        </SelectItem>
                        <SelectItem value="brand_luxelips">Luxe Lips</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
=======
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
<<<<<<< HEAD
                  <CardTitle className="text-lg">Giá bán</CardTitle>
=======
                  <CardTitle className="text-lg">Giá bán & Tồn kho</CardTitle>
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
                            setFormData({ ...formData, price: e.target.value })
=======
                            setFormData({ ...formData, price: Number(e.target.value) })
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          VND
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
<<<<<<< HEAD
                      <Label htmlFor="comparePrice">Giá gốc (nếu giảm giá)</Label>
                      <div className="relative">
                        <Input
                          id="comparePrice"
                          type="number"
                          placeholder="0"
                          className="pr-12"
                          value={formData.compareAtPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              compareAtPrice: e.target.value,
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          VND
                        </span>
                      </div>
                    </div>
                  </div>
                  {formData.compareAtPrice && formData.price && (
                    <div className="mt-3 flex items-center gap-2">
                      <Badge className="bg-destructive text-white">
                        Giảm{" "}
                        {Math.round(
                          ((Number(formData.compareAtPrice) -
                            Number(formData.price)) /
                            Number(formData.compareAtPrice)) *
                            100
                        )}
                        %
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Tiết kiệm{" "}
                        {new Intl.NumberFormat("vi-VN").format(
                          Number(formData.compareAtPrice) - Number(formData.price)
                        )}
                        d
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tồn kho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Số lượng tồn kho</Label>
                    <Input
                      id="inventory"
                      type="number"
                      placeholder="0"
                      className="max-w-[200px]"
                      value={formData.inventory}
                      onChange={(e) =>
                        setFormData({ ...formData, inventory: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Quản lý biến thể</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleAddVariant}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm biến thể
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="flex items-start gap-4 rounded-lg border p-4"
                      >
                        <div className="cursor-move pt-2 text-muted-foreground">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="grid flex-1 gap-4 sm:grid-cols-4">
                          <div className="space-y-2">
                            <Label>Tên biến thể</Label>
                            <Input
                              placeholder="VD: 30ml"
                              defaultValue={variant.name}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input
                              placeholder="VD: SERUM-VC-30ML"
                              defaultValue={variant.sku}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Giá (VND)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              defaultValue={variant.price}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tồn kho</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              defaultValue={variant.inventory}
                            />
                          </div>
                        </div>
                        {variants.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
=======
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
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hình ảnh sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Existing images */}
                    {product?.images?.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                      >
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
=======
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {previewUrl && (
                      <div className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={previewUrl}
                          alt="Preview"
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
<<<<<<< HEAD
=======
                            onClick={() => {
                              setPreviewUrl(null);
                              setImageFile(null);
                            }}
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
<<<<<<< HEAD
                        {index === 0 && (
                          <Badge className="absolute left-2 top-2 bg-primary text-white">
                            Chính
                          </Badge>
                        )}
                      </div>
                    ))}

                    {/* Upload area */}
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Tải hình lên
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Kéo thả để sắp xếp thứ tự. Hình đầu tiên sẽ là hình chính.
                    Định dạng: JPG, PNG, WebP. Tối đa 5MB mỗi ảnh.
=======
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
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
<<<<<<< HEAD

            <TabsContent value="seo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tối ưu SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Tiêu đề SEO</Label>
                    <Input
                      id="metaTitle"
                      placeholder="Tiêu đề hiển thị trên Google"
                      defaultValue={product?.name}
                    />
                    <p className="text-sm text-muted-foreground">
                      Nên giữ dưới 60 ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDesc">Mô tả SEO</Label>
                    <Textarea
                      id="metaDesc"
                      placeholder="Mô tả hiển thị trên Google"
                      rows={3}
                      defaultValue={product?.shortDescription}
                    />
                    <p className="text-sm text-muted-foreground">
                      Nên giữ dưới 160 ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        /product/
                      </span>
                      <Input
                        id="slug"
                        placeholder="serum-vitamin-c-20"
                        defaultValue={product?.slug}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="rounded-lg border p-4">
                    <p className="mb-1 text-sm font-medium text-info">
                      Xem trước trên Google
                    </p>
                    <p className="text-lg text-[#1a0dab]">
                      {formData.name || "Tên sản phẩm"} | GlowSkin
                    </p>
                    <p className="text-sm text-[#006621]">
                      https://glowskin.vn/product/
                      {product?.slug || "url-san-pham"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.description ||
                        "Mô tả sản phẩm sẽ hiển thị ở đây..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
=======
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
                  <p className="font-medium">Hiển thị sản phẩm</p>
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm sẽ hiển thị trên cửa hàng
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Trạng thái:</p>
                <Badge
                  variant={formData.isActive ? "default" : "secondary"}
                  className={
                    formData.isActive ? "bg-success text-white" : ""
                  }
                >
                  {formData.isActive ? "Đang bán" : "Ẩn"}
=======
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
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
                </Badge>
              </div>
            </CardContent>
          </Card>

<<<<<<< HEAD
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thẻ và nhãn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">bestseller</Badge>
                <Badge variant="outline">new</Badge>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Plus className="mr-1 h-3 w-3" />
                  Thêm thẻ
                </Button>
              </div>
            </CardContent>
          </Card>

=======
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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
<<<<<<< HEAD
=======
                  onClick={handleDelete}
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
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

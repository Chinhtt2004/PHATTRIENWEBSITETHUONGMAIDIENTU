"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { adminCreateSection, adminDeleteSection, adminUpdateSection, fetchBanners, fetchCategories, fetchPageSections, fetchPages, type Banner, type PageItem, type PageSection, type PageSectionRequest } from "@/lib/api";
import type { Category } from "@/lib/data";

const SECTION_TYPES = [
  { value: "BANNER", label: "Banner" },
  { value: "FLASH_SALE", label: "Flash Sale" },
  { value: "PRODUCT_GRID", label: "Lưới sản phẩm" },
  { value: "BEST_SELLER", label: "Bán chạy" },
  { value: "HERO", label: "Hero" },
  { value: "PROMOTIONAL_SLIDE", label: "Slide khuyến mãi" },
  { value: "BENEFITS", label: "Lợi ích" },
  { value: "TESTIMONIALS", label: "Khách hàng nói" },
  { value: "SHOP_LOCATIONS", label: "Cửa hàng" },
  { value: "FLOATING_BANNER", label: "Banner nổi" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "AD_BANNER", label: "Quảng cáo banner" },
];

export default function AdminPageSections() {
  const params = useParams();
  const pageId = Number(params?.id ?? "0");

  const [page, setPage] = useState<PageItem | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);

  const [type, setType] = useState("BANNER");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(1);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [limit, setLimit] = useState(6);
  const [flashSaleId, setFlashSaleId] = useState<number | null>(null);
  const [adBannerVariant, setAdBannerVariant] = useState("inline");
  const [floatingBannerHref, setFloatingBannerHref] = useState("");
  const [floatingBannerImage, setFloatingBannerImage] = useState("");
  const [floatingBannerAlt, setFloatingBannerAlt] = useState("");
  const [floatingBannerEndDate, setFloatingBannerEndDate] = useState("");
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const [newsletterDescription, setNewsletterDescription] = useState("");
  const [newsletterPlaceholder, setNewsletterPlaceholder] = useState("");
  const [newsletterButtonText, setNewsletterButtonText] = useState("");
  const [newsletterPrivacyNote, setNewsletterPrivacyNote] = useState("");
  const [rawConfig, setRawConfig] = useState("");
  const [hasCustomConfigEdit, setHasCustomConfigEdit] = useState(false);

  useEffect(() => {
    if (!pageId) return;
    loadData();
  }, [pageId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allPages, sectionData, bannerData, categoryData] = await Promise.all([
        fetchPages(),
        fetchPageSections(pageId),
        fetchBanners(),
        fetchCategories(),
      ]);
      setPage(allPages.find((item) => item.id === pageId) ?? null);
      setSections(sectionData || []);
      setBanners(bannerData || []);
      setCategories(categoryData || []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu trang");
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (section?: PageSection) => {
    if (section) {
      setEditingSection(section);
      setType(section.type);
      setTitle(section.title);
      setPosition(section.position || 1);

      try {
        const config = JSON.parse(section.configJson || "{}");
        setSelectedBannerId(config.bannerId ?? null);
        setSelectedCategoryId(config.categoryId ?? null);
        setLimit(config.limit ?? 6);
        setFlashSaleId(config.flashSaleId ?? null);
        setAdBannerVariant(config.variant ?? "inline");
        setFloatingBannerHref(config.href ?? "");
        setFloatingBannerImage(config.image ?? "");
        setFloatingBannerAlt(config.alt ?? "");
        setFloatingBannerEndDate(config.endDate ?? "");
        setNewsletterTitle(config.title ?? "");
        setNewsletterDescription(config.description ?? "");
        setNewsletterPlaceholder(config.placeholder ?? "");
        setNewsletterButtonText(config.buttonText ?? "");
        setNewsletterPrivacyNote(config.privacyNote ?? "");
        setRawConfig(section.configJson || "{}");
        setHasCustomConfigEdit(!["BANNER", "FLASH_SALE", "PRODUCT_GRID", "BEST_SELLER", "AD_BANNER", "FLOATING_BANNER", "NEWSLETTER"].includes(section.type));
      } catch {
        setSelectedBannerId(null);
        setSelectedCategoryId(null);
        setLimit(6);
        setFlashSaleId(null);
        setAdBannerVariant("inline");
        setFloatingBannerHref("");
        setFloatingBannerImage("");
        setFloatingBannerAlt("");
        setFloatingBannerEndDate("");
        setNewsletterTitle("");
        setNewsletterDescription("");
        setNewsletterPlaceholder("");
        setNewsletterButtonText("");
        setNewsletterPrivacyNote("");
        setRawConfig("{}");
        setHasCustomConfigEdit(true);
      }
    } else {
      setEditingSection(null);
      setType("BANNER");
      setTitle("");
      setPosition(1);
      setSelectedBannerId(null);
      setSelectedCategoryId(null);
      setLimit(6);
      setFlashSaleId(null);
      setAdBannerVariant("inline");
      setFloatingBannerHref("");
      setFloatingBannerImage("");
      setFloatingBannerAlt("");
      setFloatingBannerEndDate("");
      setNewsletterTitle("");
      setNewsletterDescription("");
      setNewsletterPlaceholder("");
      setNewsletterButtonText("");
      setNewsletterPrivacyNote("");
      setRawConfig(buildConfig());
      setHasCustomConfigEdit(false);
    }

    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSection(null);
  };

  const buildConfig = () => {
    const config: Record<string, unknown> = {};

    if (type === "BANNER") {
      if (selectedBannerId) {
        config.bannerId = selectedBannerId;
      }
    }

    if (type === "FLASH_SALE") {
      if (flashSaleId) {
        config.flashSaleId = flashSaleId;
      }
    }

    if (type === "PRODUCT_GRID") {
      if (selectedCategoryId) {
        config.categoryId = selectedCategoryId;
      }
      config.limit = limit;
    }

    if (type === "BEST_SELLER") {
      config.limit = limit;
    }

    if (type === "AD_BANNER") {
      config.variant = adBannerVariant;
    }

    if (type === "FLOATING_BANNER") {
      config.href = floatingBannerHref;
      config.image = floatingBannerImage;
      config.alt = floatingBannerAlt;
      config.endDate = floatingBannerEndDate;
    }

    if (type === "NEWSLETTER") {
      config.title = newsletterTitle;
      config.description = newsletterDescription;
      config.placeholder = newsletterPlaceholder;
      config.buttonText = newsletterButtonText;
      config.privacyNote = newsletterPrivacyNote;
    }

    if (["HERO", "PROMOTIONAL_SLIDE", "BENEFITS", "TESTIMONIALS", "SHOP_LOCATIONS"].includes(type)) {
      if (!hasCustomConfigEdit) {
        config.note = `Cấu hình ${type} bằng JSON hoặc thêm trường thủ công.`;
      }
    }

    return JSON.stringify(config, null, 2);
  };

  useEffect(() => {
    if (!isDialogOpen || hasCustomConfigEdit) return;
    setRawConfig(buildConfig());
  }, [
    isDialogOpen,
    hasCustomConfigEdit,
    type,
    selectedBannerId,
    selectedCategoryId,
    limit,
    flashSaleId,
    adBannerVariant,
    floatingBannerHref,
    floatingBannerImage,
    floatingBannerAlt,
    floatingBannerEndDate,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterButtonText,
    newsletterPrivacyNote,
  ]);

  const handleSaveSection = async () => {
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề section");
      return;
    }

    if (!pageId) {
      toast.error("ID trang không hợp lệ");
      return;
    }

    if (type === "BANNER" && !selectedBannerId) {
      toast.error("Vui lòng chọn banner");
      return;
    }

    if (type === "PRODUCT_GRID" && !selectedCategoryId) {
      toast.error("Vui lòng chọn danh mục cho lưới sản phẩm");
      return;
    }

    setIsSaving(true);
    try {
      const request: PageSectionRequest = {
        pageId,
        type,
        title,
        position,
        configJson: rawConfig.trim() ? rawConfig : buildConfig(),
      };

      if (editingSection) {
        await adminUpdateSection(editingSection.id, request);
        toast.success("Cập nhật section thành công");
      } else {
        await adminCreateSection(request);
        toast.success("Tạo section mới thành công");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      toast.error("Lưu section thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async (section: PageSection) => {
    if (!confirm(`Xóa section "${section.title}"?`)) {
      return;
    }

    try {
      await adminDeleteSection(section.id);
      toast.success("Xóa section thành công");
      setSections((prev) => prev.filter((item) => item.id !== section.id));
    } catch (error) {
      toast.error("Xóa section thất bại");
    }
  };

  const sectionConfigSummary = (section: PageSection) => {
    try {
      const config = JSON.parse(section.configJson || "{}");
      if (section.type === "BANNER") {
        const banner = banners.find((item) => item.id === config.bannerId);
        return banner ? `Banner: ${banner.name}` : "Banner không xác định";
      }
      if (section.type === "PRODUCT_GRID") {
        const category = categories.find((item) => item.id === config.categoryId);
        return `Danh mục: ${category?.name || "Không xác định"}, Số lượng: ${config.limit ?? 0}`;
      }
      if (section.type === "FLASH_SALE") {
        return `Flash sale ID: ${config.flashSaleId ?? "chưa xác định"}`;
      }
      if (section.type === "BEST_SELLER") {
        return `Top ${config.limit ?? 0}`;
      }
      if (section.type === "FLOATING_BANNER") {
        return `Link: ${config.href ?? "chưa đặt"}, Hết hạn: ${config.endDate ?? "chưa đặt"}`;
      }
      if (section.type === "NEWSLETTER") {
        return `Newsletter: ${config.title ?? "chưa đặt"}`;
      }
      if (section.type === "AD_BANNER") {
        return `Variant: ${config.variant ?? "inline"}`;
      }
      return section.type;
    } catch {
      return "Cấu hình không hợp lệ";
    }
  };

  const configFields = useMemo(() => {
    if (type === "BANNER") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="banner-select">Banner</Label>
            <Select value={selectedBannerId?.toString() ?? ""} onValueChange={(value) => setSelectedBannerId(value ? Number(value) : null)}>
              <SelectTrigger id="banner-select">
                <SelectValue placeholder="Chọn banner" />
              </SelectTrigger>
              <SelectContent>
                {banners.map((banner) => (
                  <SelectItem key={banner.id} value={banner.id.toString()}>
                    {banner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (type === "PRODUCT_GRID") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category-select">Danh mục</Label>
            <Select value={selectedCategoryId?.toString() ?? ""} onValueChange={(value) => setSelectedCategoryId(value ? Number(value) : null)}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product-grid-limit">Số lượng</Label>
            <Input
              id="product-grid-limit"
              type="number"
              min={1}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value) || 1)}
            />
          </div>
        </div>
      );
    }

    if (type === "BEST_SELLER") {
      return (
        <div className="grid gap-2">
          <Label htmlFor="best-seller-limit">Số lượng</Label>
          <Input
            id="best-seller-limit"
            type="number"
            min={1}
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value) || 1)}
          />
        </div>
      );
    }

    if (type === "FLASH_SALE") {
      return (
        <div className="grid gap-2">
          <Label htmlFor="flash-sale-id">ID Flash Sale</Label>
          <Input
            id="flash-sale-id"
            type="number"
            min={1}
            value={flashSaleId ?? ""}
            onChange={(event) => setFlashSaleId(event.target.value ? Number(event.target.value) : null)}
            placeholder="Nhập ID flash sale"
          />
        </div>
      );
    }

    if (type === "AD_BANNER") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ad-banner-variant">Kiểu banner</Label>
            <Select value={adBannerVariant} onValueChange={(value) => setAdBannerVariant(value)}>
              <SelectTrigger id="ad-banner-variant">
                <SelectValue placeholder="Chọn biến thể" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="top">Top</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border border-dashed border-muted p-4 bg-muted/10 text-sm text-muted-foreground">
            Banner này dùng để cấu hình quảng cáo dạng slide hoặc row thương hiệu. Bạn có thể chỉnh sửa JSON bên dưới để thêm chi tiết.
          </div>
        </div>
      );
    }

    if (type === "FLOATING_BANNER") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="floating-banner-href">Link</Label>
            <Input
              id="floating-banner-href"
              value={floatingBannerHref}
              onChange={(event) => setFloatingBannerHref(event.target.value)}
              placeholder="Nhập đường dẫn" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="floating-banner-image">Ảnh</Label>
            <Input
              id="floating-banner-image"
              value={floatingBannerImage}
              onChange={(event) => setFloatingBannerImage(event.target.value)}
              placeholder="URL ảnh" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="floating-banner-alt">Alt text</Label>
            <Input
              id="floating-banner-alt"
              value={floatingBannerAlt}
              onChange={(event) => setFloatingBannerAlt(event.target.value)}
              placeholder="Mô tả ảnh" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="floating-banner-end-date">Ngày kết thúc</Label>
            <Input
              id="floating-banner-end-date"
              type="date"
              value={floatingBannerEndDate}
              onChange={(event) => setFloatingBannerEndDate(event.target.value)}
            />
          </div>
        </div>
      );
    }

    if (type === "NEWSLETTER") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="newsletter-title">Tiêu đề</Label>
            <Input
              id="newsletter-title"
              value={newsletterTitle}
              onChange={(event) => setNewsletterTitle(event.target.value)}
              placeholder="Tiêu đề newsletter"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newsletter-description">Mô tả</Label>
            <Textarea
              id="newsletter-description"
              value={newsletterDescription}
              onChange={(event) => setNewsletterDescription(event.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newsletter-placeholder">Placeholder email</Label>
            <Input
              id="newsletter-placeholder"
              value={newsletterPlaceholder}
              onChange={(event) => setNewsletterPlaceholder(event.target.value)}
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newsletter-button-text">Nút gửi</Label>
            <Input
              id="newsletter-button-text"
              value={newsletterButtonText}
              onChange={(event) => setNewsletterButtonText(event.target.value)}
              placeholder="Đăng ký"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newsletter-privacy-note">Dòng ghi chú</Label>
            <Textarea
              id="newsletter-privacy-note"
              value={newsletterPrivacyNote}
              onChange={(event) => setNewsletterPrivacyNote(event.target.value)}
              rows={2}
            />
          </div>
        </div>
      );
    }

    return null;
  }, [
    type,
    banners,
    categories,
    limit,
    flashSaleId,
    selectedBannerId,
    selectedCategoryId,
    adBannerVariant,
    floatingBannerHref,
    floatingBannerImage,
    floatingBannerAlt,
    floatingBannerEndDate,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterButtonText,
    newsletterPrivacyNote,
  ]);

  if (!pageId) {
    return (
      <div className="space-y-6 pt-16 lg:pt-0">
        <p className="text-muted-foreground">ID trang không hợp lệ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Quản lý section cho trang: {page?.name || "..."}
          </h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa section hiển thị trên trang này.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground" onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo section mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Danh sách section</h2>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Cấu hình</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Chưa có section nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sections.map((section) => (
                      <TableRow key={section.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>{section.type}</TableCell>
                        <TableCell>{section.title}</TableCell>
                        <TableCell>{sectionConfigSummary(section)}</TableCell>
                        <TableCell>{section.position}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openDialog(section)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section)}>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSection ? "Chỉnh sửa section" : "Tạo section mới"}</DialogTitle>
            <DialogDescription>Điền cấu hình section để hiển thị trên trang.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="section-type">Loại section</Label>
              <Select value={type} onValueChange={(value) => { setType(value); setSelectedBannerId(null); setSelectedCategoryId(null); setLimit(6); setFlashSaleId(null); setAdBannerVariant("inline"); setFloatingBannerHref(""); setFloatingBannerImage(""); setFloatingBannerAlt(""); setFloatingBannerEndDate(""); setNewsletterTitle(""); setNewsletterDescription(""); setNewsletterPlaceholder(""); setNewsletterButtonText(""); setNewsletterPrivacyNote(""); setHasCustomConfigEdit(false); }}>
                <SelectTrigger id="section-type">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="section-title">Tiêu đề section</Label>
              <Input id="section-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="section-position">Vị trí</Label>
              <Input id="section-position" type="number" min={1} value={position} onChange={(event) => setPosition(Number(event.target.value) || 1)} />
            </div>

            {configFields}

            <div className="grid gap-2">
              <Label htmlFor="section-config">Cấu hình JSON</Label>
              <Textarea
                id="section-config"
                value={rawConfig}
                onChange={(event) => {
                  setRawConfig(event.target.value);
                  setHasCustomConfigEdit(true);
                }}
                rows={10}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeDialog}>Hủy</Button>
            <Button onClick={handleSaveSection} disabled={isSaving}>{editingSection ? "Cập nhật" : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

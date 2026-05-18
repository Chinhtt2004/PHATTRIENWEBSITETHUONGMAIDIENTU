"use client";

import React, { useEffect, useState } from "react";
import { 
  adminFetchPageSections, 
  adminCreatePageSection, 
  adminUpdatePageSection, 
  adminDeletePageSection,
  adminReorderPageSections,
  SectionResponseDTO,
  CreatePageSectionRequest
} from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, ArrowLeft, GripVertical } from "lucide-react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Dnd Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Component con để render TableRow kéo thả được
function SortableTableRow({ 
  section, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: { 
  section: SectionResponseDTO, 
  onEdit: (s: SectionResponseDTO) => void, 
  onDelete: (id: number) => void,
  onToggleActive: (id: number, active: boolean) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  // Hàm render giao diện ConfigJson thông minh
  const renderConfigJson = (json: any) => {
    if (!json || Object.keys(json).length === 0) {
      return <span className="text-muted-foreground italic">Mặc định</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {json.filter && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Lọc: {json.filter}
          </Badge>
        )}
        {json.backgroundColor && (
          <div className="flex items-center gap-1 border rounded px-2 py-0.5 text-xs bg-white">
            Nền: <div className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: json.backgroundColor }} />
          </div>
        )}
        {json.html && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Có chứa HTML
          </Badge>
        )}
        {(!json.filter && !json.backgroundColor && !json.html) && (
          <span className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
            {JSON.stringify(json)}
          </span>
        )}
      </div>
    );
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className={`group ${isDragging ? 'bg-muted/50 shadow-md relative' : ''} ${!section.active ? 'opacity-50 grayscale' : ''}`}
    >
      <TableCell className="w-[50px] p-0 text-center">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-primary flex justify-center py-4 text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </div>
      </TableCell>
      <TableCell className="font-bold text-center bg-muted/20 w-[60px]">{section.position}</TableCell>
      <TableCell className="font-medium">
        <Badge variant="secondary" className="font-mono text-[11px]">{section.type}</Badge>
      </TableCell>
      <TableCell>{section.title || <span className="text-muted-foreground italic">Không có</span>}</TableCell>
      <TableCell>{renderConfigJson(section.configJson)}</TableCell>
      <TableCell className="text-center w-[100px]">
        <Switch 
          checked={section.active} 
          onCheckedChange={(checked) => onToggleActive(section.id, checked)}
        />
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(section)}>
          <Edit className="h-4 w-4 mr-1" /> Sửa
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(section.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}


export default function PageSectionManager() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const idStr = typeof params?.id === "string" ? params.id : "";
  const pageId = idStr ? parseInt(idStr) : NaN;
  const pageName = searchParams.get("name") || `Page #${idStr}`;
  
  const [sections, setSections] = useState<SectionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionResponseDTO | null>(null);
  
  const [formData, setFormData] = useState({
    type: "HERO_SECTION",
    title: "",
    position: "1",
    configJsonStr: "{}",
    active: true
  });
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Setup cho DndKit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isNaN(pageId)) {
      loadSections();
    } else {
      setLoading(false);
    }
  }, [pageId]);

  async function loadSections() {
    if (isNaN(pageId)) return;
    try {
      setLoading(true);
      const data = await adminFetchPageSections(pageId);
      // Sắp xếp theo vị trí
      data.sort((a, b) => a.position - b.position);
      setSections(data);
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  // Xử lý sự kiện sau khi thả kéo
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Cập nhật lại trường position của từng phần tử theo Index
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          position: index + 1
        }));

        // Gửi API lưu thứ tự mới (Chạy ngầm không block UI)
        const reorderPayload = updatedItems.map(item => ({ id: item.id, position: item.position }));
        adminReorderPageSections(pageId, reorderPayload).then(() => {
          toast.success("Đã cập nhật thứ tự thành công!");
        }).catch(() => {
          toast.error("Lỗi khi cập nhật thứ tự, vui lòng tải lại trang.");
        });

        return updatedItems;
      });
    }
  };

  async function handleToggleActive(id: number, active: boolean) {
    // Cập nhật UI ngay lập tức
    setSections(items => items.map(item => item.id === id ? { ...item, active } : item));
    
    // Gửi yêu cầu API
    try {
      const section = sections.find(s => s.id === id);
      if (!section) return;
      
      const payload: CreatePageSectionRequest = {
        pageId: pageId,
        type: section.type,
        title: section.title,
        position: section.position,
        configJson: section.configJson,
        active: active
      };
      
      await adminUpdatePageSection(id, payload);
      toast.success(`Đã ${active ? "hiện" : "ẩn"} section thành công.`);
    } catch (err: any) {
      toast.error("Không thể thay đổi trạng thái!");
      // Revert lại nếu lỗi
      setSections(items => items.map(item => item.id === id ? { ...item, active: !active } : item));
    }
  }

  function handleOpenDialog(section?: SectionResponseDTO) {
    if (section) {
      setEditingSection(section);
      setFormData({
        type: section.type,
        title: section.title || "",
        position: section.position.toString(),
        configJsonStr: JSON.stringify(section.configJson, null, 2),
        active: section.active
      });
    } else {
      setEditingSection(null);
      setFormData({
        type: "HERO_SECTION",
        title: "",
        position: (sections.length + 1).toString(),
        configJsonStr: "{\n  \n}",
        active: true
      });
    }
    setJsonError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJsonError(null);

    let parsedConfig = {};
    try {
      parsedConfig = JSON.parse(formData.configJsonStr);
    } catch (err: any) {
      setJsonError("Lỗi cú pháp JSON: " + err.message);
      return;
    }

    const payload: CreatePageSectionRequest = {
      pageId: pageId,
      type: formData.type,
      title: formData.title,
      position: parseInt(formData.position) || 1,
      configJson: parsedConfig,
      active: formData.active
    };

    try {
      setSaving(true);
      if (editingSection) {
        await adminUpdatePageSection(editingSection.id, payload);
        toast.success("Cập nhật section thành công.");
      } else {
        await adminCreatePageSection(payload);
        toast.success("Thêm section thành công.");
      }
      setDialogOpen(false);
      loadSections();
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa section này? Hành động này không thể hoàn tác.")) return;
    try {
      await adminDeletePageSection(id);
      toast.success("Xóa thành công.");
      loadSections();
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra khi xóa.");
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cấu trúc: {pageName}</h1>
          <p className="text-muted-foreground mt-1">
            Kéo thả biểu tượng 6 chấm (Grip) để sắp xếp vị trí các khối nội dung.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()} className="shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Thêm Section
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-md border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[60px] text-center">Vị trí</TableHead>
                <TableHead>Loại (Type)</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Đặc trưng / JSON</TableHead>
                <TableHead className="text-center">Hiển thị</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Trang này chưa có section nào.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext 
                  items={sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section) => (
                    <SortableTableRow 
                      key={section.id} 
                      section={section} 
                      onEdit={handleOpenDialog} 
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </div>
      </DndContext>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{editingSection ? "Chỉnh sửa Section" : "Thêm Section mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại Component (Type)</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HERO_SECTION">Hero Section</SelectItem>
                    <SelectItem value="PROMOTIONAL_SLIDE">Promotional Slide</SelectItem>
                    <SelectItem value="CATEGORIES_SECTION">Categories Section</SelectItem>
                    <SelectItem value="FLASH_SALE">Flash Sale Section</SelectItem>
                    <SelectItem value="AD_BANNER_INLINE">Ad Banner Inline</SelectItem>
                    <SelectItem value="FEATURED_PRODUCTS">Featured Products (Product Grid)</SelectItem>
                    <SelectItem value="BENEFITS">Benefits Section</SelectItem>
                    <SelectItem value="TESTIMONIALS">Testimonials Section</SelectItem>
                    <SelectItem value="NEWSLETTER">Newsletter Section</SelectItem>
                    <SelectItem value="BRAND_CAROUSEL">Brand Carousel</SelectItem>
                    <SelectItem value="RECENT_BLOG_POSTS">Recent Blog Posts</SelectItem>
                    <SelectItem value="CUSTOM_HTML">Custom HTML / Iframe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Thứ tự xuất hiện (Position)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={formData.position} 
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị (Không bắt buộc)</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="VD: Sản phẩm nổi bật"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Cấu hình JSON (configJson)</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="active-toggle" className="text-xs text-muted-foreground font-normal">Trạng thái bật/tắt</Label>
                  <Switch 
                    id="active-toggle"
                    checked={formData.active} 
                    onCheckedChange={(c) => setFormData({...formData, active: c})} 
                  />
                </div>
              </div>
              <Textarea 
                className="font-mono text-sm h-[200px]"
                value={formData.configJsonStr}
                onChange={(e) => {
                  setFormData({ ...formData, configJsonStr: e.target.value });
                  setJsonError(null);
                }}
                required
              />
              <p className="text-xs text-muted-foreground">Ví dụ: {`{"filter": "bestseller", "backgroundColor": "#f87171"}`}</p>
              {jsonError && (
                <p className="text-sm text-red-500 font-medium mt-1">{jsonError}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Hủy
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu cấu hình
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

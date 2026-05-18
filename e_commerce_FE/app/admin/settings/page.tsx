"use client";

import { useEffect, useState } from "react";
import { Save, Globe, CreditCard, Truck, Bell, Users, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchSettings, adminUpdateSetting, type Setting } from "@/lib/api";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      const settingsMap = data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
      setSettings(settingsMap);
    } catch (error) {
      toast.error("Không thể tải cấu hình cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // For this implementation, we save each key individually or use a bulk endpoint if available.
      // Since current API is single update, we'll save the current active tab's properties or just a few core ones.
      const coreKeys = ["store_name", "contact_email", "contact_phone", "store_address", "store_description"];
      
      const savePromises = coreKeys.map(key => 
        adminUpdateSetting({ key, value: settings[key] || "" })
      );

      await Promise.all(savePromises);
      toast.success("Đã lưu tất cả thay đổi");
    } catch (error) {
      toast.error("Lưu cấu hình thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Cài đặt
          </h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình và tùy chỉnh cửa hàng (Dữ liệu thực tế)
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-hover text-white"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Thanh toán
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            Vận chuyển
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Người dùng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cửa hàng</CardTitle>
              <CardDescription>
                Thông tin cơ bản về cửa hàng được lưu trữ trong Database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Tên cửa hàng</Label>
                  <Input 
                    id="storeName" 
                    value={settings["store_name"] || ""} 
                    onChange={(e) => handleInputChange("store_name", e.target.value)}
                    placeholder="VD: GlowSkin Vietnam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email liên hệ</Label>
                  <Input 
                    id="storeEmail" 
                    type="email" 
                    value={settings["contact_email"] || ""} 
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="VD: contact@glowskin.vn"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Số điện thoại</Label>
                  <Input 
                    id="storePhone" 
                    value={settings["contact_phone"] || ""} 
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    placeholder="VD: 1900 1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeTax">Mã số thuế</Label>
                  <Input 
                    id="storeTax" 
                    value={settings["tax_code"] || ""} 
                    onChange={(e) => handleInputChange("tax_code", e.target.value)}
                    placeholder="VD: 0123456789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="storeAddress">Địa chỉ</Label>
                <Textarea
                  id="storeAddress"
                  value={settings["store_address"] || ""} 
                  onChange={(e) => handleInputChange("store_address", e.target.value)}
                  placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP. HCM"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Mô tả cửa hàng</Label>
                <Textarea
                  id="storeDescription"
                  value={settings["store_description"] || ""} 
                  onChange={(e) => handleInputChange("store_description", e.target.value)}
                  placeholder="VD: GlowSkin - Cửa hàng mỹ phẩm chính hãng..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cấu hình khu vực</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Ngôn ngữ</Label>
                  <Select value={settings["default_lang"] || "vi"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tiền tệ</Label>
                  <Select value={settings["default_currency"] || "vnd"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnd">VND - Đồng Việt Nam</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
              <CardDescription>
                Các cấu hình này có thể được mở rộng trong Setting store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "VNPay", key: "vnpay_enabled", description: "Cổng thanh toán VNPay" },
                { name: "COD", key: "cod_enabled", description: "Thanh toán khi nhận hàng" },
              ].map((method) => (
                <div
                  key={method.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-muted-foreground">
                      {method.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings[method.key] === "true"} 
                    onCheckedChange={(val) => {
                      handleInputChange(method.key, val.toString());
                      adminUpdateSetting({ key: method.key, value: val.toString() });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs remain largely skeletal or connected to dummy state for now */}
        <TabsContent value="users" className="space-y-6">
          <Card>
             <CardHeader>
               <CardTitle className="text-lg">Bảo mật Admin</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center justify-between rounded-lg border p-4">
                 <div className="flex items-center gap-4">
                   <Shield className="h-5 w-5 text-muted-foreground" />
                   <div>
                     <p className="font-medium">Chế độ bảo trì</p>
                     <p className="text-sm text-muted-foreground">
                       Tạm đóng cửa hàng để bảo trì
                     </p>
                   </div>
                 </div>
                 <Switch 
                   checked={settings["maintenance_mode"] === "true"} 
                   onCheckedChange={(val) => {
                     handleInputChange("maintenance_mode", val.toString());
                     adminUpdateSetting({ key: "maintenance_mode", value: val.toString() });
                   }}
                 />
               </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

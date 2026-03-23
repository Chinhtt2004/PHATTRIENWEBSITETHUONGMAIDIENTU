"use client";

import { useState } from "react";
import { Save, Upload, Globe, CreditCard, Truck, Bell, Users, Shield } from "lucide-react";
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

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Cài đặt
          </h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình và tùy chỉnh cửa hàng
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
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
                Thông tin cơ bản về cửa hàng của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Logo cửa hàng</Label>
                  <p className="text-sm text-muted-foreground">
                    Tải lên logo cửa hàng (PNG, JPG, tối đa 2MB)
                  </p>
                  <Button variant="outline" size="sm">
                    Chọn file
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Tên cửa hàng</Label>
                  <Input id="storeName" defaultValue="GlowSkin Vietnam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email liên hệ</Label>
                  <Input id="storeEmail" type="email" defaultValue="contact@glowskin.vn" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Số điện thoại</Label>
                  <Input id="storePhone" defaultValue="1900 1234" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeTax">Mã số thuế</Label>
                  <Input id="storeTax" defaultValue="0123456789" />
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="storeAddress">Địa chỉ</Label>
                <Textarea
                  id="storeAddress"
                  defaultValue="123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Mô tả cửa hàng</Label>
                <Textarea
                  id="storeDescription"
                  defaultValue="GlowSkin - Cửa hàng mỹ phẩm chính hãng hàng đầu Việt Nam"
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
                  <Select defaultValue="vi">
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
                  <Select defaultValue="vnd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnd">VND - Đồng Việt Nam</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Múi giờ</Label>
                  <Select defaultValue="asia_hcm">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia_hcm">Asia/Ho_Chi_Minh (UTC+7)</SelectItem>
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
                Cấu hình các phương thức thanh toán cho cửa hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "MoMo", description: "Ví điện tử MoMo", enabled: true },
                { name: "VNPay", description: "Cổng thanh toán VNPay", enabled: true },
                { name: "Stripe", description: "Thẻ quốc tế Visa/Mastercard", enabled: false },
                { name: "COD", description: "Thanh toán khi nhận hàng", enabled: true },
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
                  <div className="flex items-center gap-4">
                    {method.enabled ? (
                      <Badge variant="outline" className="border-success text-success">
                        Đã kết nối
                      </Badge>
                    ) : (
                      <Badge variant="outline">Chưa kết nối</Badge>
                    )}
                    <Switch defaultChecked={method.enabled} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phương thức vận chuyển</CardTitle>
              <CardDescription>
                Cấu hình phí vận chuyển và đối tác giao hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Giao hàng tiêu chuẩn</p>
                    <p className="text-sm text-muted-foreground">3-5 ngày làm việc</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      defaultValue="30000"
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">VND</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Giao hàng nhanh</p>
                    <p className="text-sm text-muted-foreground">1-2 ngày làm việc</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      defaultValue="50000"
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">VND</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Miễn phí vận chuyển</p>
                    <p className="text-sm text-muted-foreground">
                      Tự động áp dụng khi đơn hàng đạt giá trị tối thiểu
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center gap-4">
                  <Label>Đơn tối thiểu:</Label>
                  <Input
                    type="number"
                    defaultValue="500000"
                    className="w-40"
                  />
                  <span className="text-sm text-muted-foreground">VND</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông báo email</CardTitle>
              <CardDescription>
                Cấu hình email tự động gửi cho khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Xác nhận đơn hàng", description: "Gửi khi khách đặt hàng thành công", enabled: true },
                { name: "Cập nhật trạng thái", description: "Gửi khi đơn hàng chuyển trạng thái", enabled: true },
                { name: "Hoàn thành đơn hàng", description: "Gửi khi đơn hàng đã giao", enabled: true },
                { name: "Nhắc nhở giỏ hàng", description: "Gửi khi khách bỏ quên giỏ hàng", enabled: false },
                { name: "Đánh giá sản phẩm", description: "Gửi để yêu cầu khách đánh giá", enabled: true },
              ].map((notif) => (
                <div
                  key={notif.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{notif.name}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                  </div>
                  <Switch defaultChecked={notif.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông báo admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Đơn hàng mới</p>
                  <p className="text-sm text-muted-foreground">
                    Thông báo khi có đơn hàng mới
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Sản phẩm sắp hết hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Cảnh báo khi tồn kho thấp
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Quản trị viên</CardTitle>
                <CardDescription>
                  Quản lý tài khoản có quyền truy cập admin
                </CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Thêm người dùng
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Admin", email: "admin@glowskin.vn", role: "Super Admin", status: "active" },
                  { name: "Nguyen Van A", email: "nva@glowskin.vn", role: "Product Manager", status: "active" },
                  { name: "Tran Thi B", email: "ttb@glowskin.vn", role: "Order Fulfillment", status: "active" },
                  { name: "Le Van C", email: "lvc@glowskin.vn", role: "Customer Service", status: "inactive" },
                ].map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light font-medium text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={user.status === "active" ? "bg-success text-white" : ""}
                      >
                        {user.status === "active" ? "Hoạt động" : "Vô hiệu"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bảo mật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Xác thực hai yếu tố (2FA)</p>
                    <p className="text-sm text-muted-foreground">
                      Yêu cầu 2FA cho tất cả admin
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Tự động đăng xuất</p>
                    <p className="text-sm text-muted-foreground">
                      Đăng xuất sau 30 phút không hoạt động
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

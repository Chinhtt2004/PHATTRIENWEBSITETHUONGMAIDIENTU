"use client";

import { useEffect, useState } from "react";
import { Save, Globe, CreditCard, Truck, Bell, Users, Shield, Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
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
import { fetchSettings, adminUpdateSetting } from "@/lib/api";
import { toast } from "sonner";

const fallbackBannersData = [
  {
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=500&fit=crop",
    title: "Mỹ phẩm chính hãng",
    subtitle: "Giảm đến 50% toàn bộ thương hiệu",
    href: "/sale",
  },
  {
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=500&fit=crop",
    title: "Skincare Hàn Quốc",
    subtitle: "Mua 1 tặng 1 hàng ngàn sản phẩm",
    href: "/products?category=skincare",
  },
  {
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=500&fit=crop",
    title: "Chống nắng mùa hè",
    subtitle: "Ưu đãi đặc biệt từ Anessa & Skin Aqua",
    href: "/products?category=sunscreen",
  },
  {
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&h=500&fit=crop",
    title: "Dưỡng da cao cấp",
    subtitle: "Lấy voucher ngay - Freeship đơn từ 300K",
    href: "/vouchers",
  },
];

const fallbackBrandsData = [
  {
    name: "La Roche-Posay",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
    promo: "Ưu đãi đến 50%",
    href: "/products?brand=laroche",
  },
  {
    name: "CeraVe",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=400&fit=crop",
    promo: "Mua 1 tặng 1",
    href: "/products?brand=cerave",
  },
  {
    name: "The Ordinary",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    promo: "Giảm đến 40%",
    href: "/products?brand=theordinary",
  },
  {
    name: "Innisfree",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    promo: "Mua là có quà",
    href: "/products?brand=innisfree",
  },
  {
    name: "Bioderma",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
    promo: "Mua 2 giảm 30%",
    href: "/products?brand=bioderma",
  },
  {
    name: "Cocoon",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    promo: "Mua 1 được 2",
    href: "/products?brand=cocoon",
  },
  {
    name: "Klairs",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop",
    promo: "Giảm đến 35%",
    href: "/products?brand=klairs",
  },
  {
    name: "Laneige",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    promo: "Mua 1 tặng 1",
    href: "/products?brand=laneige",
  },
  {
    name: "Anessa",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
    promo: "Ưu đãi đến 45%",
    href: "/products?brand=anessa",
  },
  {
    name: "Senka",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    promo: "Mua là có quà",
    href: "/products?brand=senka",
  },
  {
    name: "AHC",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    promo: "Mua 1 tặng 4",
    href: "/products?brand=ahc",
  },
  {
    name: "Garnier",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    promo: "Mua là có quà",
    href: "/products?brand=garnier",
  },
];

type HeaderNavigationItem = {
  name: string;
  href: string;
  highlight: boolean;
};

type FooterLinkItem = {
  name: string;
  href: string;
};

type FooterColumnConfig = {
  title: string;
  links: FooterLinkItem[];
};

type FooterFeatureItem = {
  iconName: string;
  title: string;
  description: string;
};

const fallbackHeaderNavigation: HeaderNavigationItem[] = [
  { name: "Trang chu", href: "/", highlight: false },
  { name: "San pham", href: "/products", highlight: false },
  { name: "Sale", href: "/sale", highlight: true },
  { name: "Voucher", href: "/vouchers", highlight: false },
  { name: "Ve chung toi", href: "/about", highlight: false },
  { name: "Lien he", href: "/contact", highlight: false },
];

const fallbackFooterLinks: Record<string, FooterColumnConfig> = {
  shop: {
    title: "Mua sam",
    links: [
      { name: "Tat ca san pham", href: "/products" },
      { name: "Cham soc da", href: "/category/cham-soc-da" },
      { name: "Trang diem", href: "/category/trang-diem" },
      { name: "San pham moi", href: "/products?filter=new" },
    ],
  },
  support: {
    title: "Ho tro",
    links: [
      { name: "Huong dan mua hang", href: "/help/how-to-buy" },
      { name: "Van chuyen", href: "/help/shipping" },
      { name: "Doi tra va hoan tien", href: "/help/returns" },
      { name: "Lien he", href: "/contact" },
    ],
  },
  company: {
    title: "Ve chung toi",
    links: [
      { name: "Gioi thieu", href: "/about" },
      { name: "Dieu khoan su dung", href: "/terms" },
      { name: "Chinh sach bao mat", href: "/privacy" },
    ],
  },
};

const fallbackFooterFeatures: FooterFeatureItem[] = [
  { iconName: "Truck", title: "Mien phi van chuyen", description: "Don hang tu 500.000d" },
  { iconName: "RotateCcw", title: "Doi tra 30 ngay", description: "Khong can ly do" },
  { iconName: "Shield", title: "Chinh hang 100%", description: "Cam ket chat luong" },
  { iconName: "CreditCard", title: "Thanh toan an toan", description: "Bao mat tuyet doi" },
];

const footerFeatureIconOptions = ["Truck", "RotateCcw", "Shield", "CreditCard"];

function parseSettingJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toSettingJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function normalizeHeaderNavigation(value: unknown): HeaderNavigationItem[] {
  if (!Array.isArray(value)) return fallbackHeaderNavigation;

  const items = value
    .map((item: any) => ({
      name: typeof item?.name === "string" ? item.name : "",
      href: typeof item?.href === "string" ? item.href : "/",
      highlight: Boolean(item?.highlight),
    }))
    .filter((item) => item.name && item.href);

  return items.length ? items : fallbackHeaderNavigation;
}

function normalizeFooterLinks(value: unknown): Record<string, FooterColumnConfig> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallbackFooterLinks;

  const entries = Object.entries(value as Record<string, any>)
    .map(([key, column]) => {
      const links = Array.isArray(column?.links)
        ? column.links
            .map((link: any) => ({
              name: typeof link?.name === "string" ? link.name : "",
              href: typeof link?.href === "string" ? link.href : "/",
            }))
            .filter((link: FooterLinkItem) => link.name && link.href)
        : [];

      return [
        key,
        {
          title: typeof column?.title === "string" ? column.title : key,
          links,
        },
      ] as const;
    })
    .filter(([, column]) => column.title);

  return entries.length ? Object.fromEntries(entries) : fallbackFooterLinks;
}

function normalizeFooterFeatures(value: unknown): FooterFeatureItem[] {
  if (!Array.isArray(value)) return fallbackFooterFeatures;

  const features = value
    .map((feature: any) => ({
      iconName: typeof feature?.iconName === "string" ? feature.iconName : "Truck",
      title: typeof feature?.title === "string" ? feature.title : "",
      description: typeof feature?.description === "string" ? feature.description : "",
    }))
    .filter((feature) => feature.title || feature.description);

  return features.length ? features : fallbackFooterFeatures;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [promoBannersList, setPromoBannersList] = useState<any[]>([]);

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

      // Set defaults for banner/brand settings if they don't exist
      if (!settingsMap["header_logo_text"]) settingsMap["header_logo_text"] = settingsMap["store_name"] || "GlowSkin";
      if (settingsMap["header_show_top_bar"] === undefined) settingsMap["header_show_top_bar"] = "true";
      if (!settingsMap["header_top_bar_text"]) settingsMap["header_top_bar_text"] = "Mien phi van chuyen cho don hang tu 500.000d | Doi tra trong 30 ngay";
      if (!settingsMap["header_navigation_json"]) settingsMap["header_navigation_json"] = JSON.stringify(fallbackHeaderNavigation, null, 2);
      if (settingsMap["footer_show_newsletter"] === undefined) settingsMap["footer_show_newsletter"] = "true";
      if (!settingsMap["footer_newsletter_title"]) settingsMap["footer_newsletter_title"] = "Dang ky nhan tin";
      if (!settingsMap["footer_newsletter_description"]) settingsMap["footer_newsletter_description"] = "Nhan uu dai doc quyen va cap nhat xu huong lam dep moi nhat.";
      if (!settingsMap["footer_newsletter_placeholder"]) settingsMap["footer_newsletter_placeholder"] = "Email cua ban";
      if (!settingsMap["footer_newsletter_button"]) settingsMap["footer_newsletter_button"] = "Dang ky";
      if (!settingsMap["social_facebook_url"]) settingsMap["social_facebook_url"] = "https://facebook.com";
      if (!settingsMap["social_instagram_url"]) settingsMap["social_instagram_url"] = "https://instagram.com";
      if (!settingsMap["social_youtube_url"]) settingsMap["social_youtube_url"] = "https://youtube.com";
      if (!settingsMap["footer_payment_methods"]) settingsMap["footer_payment_methods"] = "VISA,MC,MoMo,VNP";
      if (!settingsMap["footer_links_json"]) settingsMap["footer_links_json"] = JSON.stringify(fallbackFooterLinks, null, 2);
      if (!settingsMap["footer_features_json"]) settingsMap["footer_features_json"] = JSON.stringify(fallbackFooterFeatures, null, 2);

      let brandsParsed = fallbackBrandsData;
      if (settingsMap["brands_list_json"]) {
        try {
          brandsParsed = JSON.parse(settingsMap["brands_list_json"]);
        } catch (e) {
          console.error("Failed to parse brand list json setting", e);
        }
      }
      setBrandsList(brandsParsed);

      let bannersParsed = fallbackBannersData;
      if (settingsMap["promo_banners_json"]) {
        try {
          bannersParsed = JSON.parse(settingsMap["promo_banners_json"]);
        } catch (e) {
          console.error("Failed to parse promo banners json setting", e);
        }
      }
      setPromoBannersList(bannersParsed);

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

  const headerNavigation = normalizeHeaderNavigation(
    parseSettingJson<unknown>(settings["header_navigation_json"], fallbackHeaderNavigation)
  );
  const footerLinks = normalizeFooterLinks(
    parseSettingJson<unknown>(settings["footer_links_json"], fallbackFooterLinks)
  );
  const footerFeatures = normalizeFooterFeatures(
    parseSettingJson<unknown>(settings["footer_features_json"], fallbackFooterFeatures)
  );

  const updateHeaderNavigation = (items: HeaderNavigationItem[]) => {
    handleInputChange("header_navigation_json", toSettingJson(items));
  };

  const updateFooterLinks = (links: Record<string, FooterColumnConfig>) => {
    handleInputChange("footer_links_json", toSettingJson(links));
  };

  const updateFooterFeatures = (features: FooterFeatureItem[]) => {
    handleInputChange("footer_features_json", toSettingJson(features));
  };

  const moveHeaderItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= headerNavigation.length) return;

    const next = [...headerNavigation];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    updateHeaderNavigation(next);
  };

  const moveFooterFeature = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= footerFeatures.length) return;

    const next = [...footerFeatures];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    updateFooterFeatures(next);
  };

  const addFooterColumn = () => {
    let index = Object.keys(footerLinks).length + 1;
    let key = `custom_${index}`;
    while (footerLinks[key]) {
      index += 1;
      key = `custom_${index}`;
    }

    updateFooterLinks({
      ...footerLinks,
      [key]: {
        title: "Cot moi",
        links: [{ name: "Lien ket moi", href: "/" }],
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      JSON.parse(settings["header_navigation_json"] || "[]");
      JSON.parse(settings["footer_links_json"] || "{}");
      JSON.parse(settings["footer_features_json"] || "[]");

      const updatedSettings: Record<string, string> = {
        ...settings,
        brands_list_json: JSON.stringify(brandsList),
        promo_banners_json: JSON.stringify(promoBannersList),
      };

      const coreKeys: string[] = [
        "store_name",
        "contact_email",
        "contact_phone",
        "tax_code",
        "store_address",
        "store_description",
        "default_lang",
        "default_currency",
        "header_logo_text",
        "header_show_top_bar",
        "header_top_bar_text",
        "header_navigation_json",
        "footer_show_newsletter",
        "footer_newsletter_title",
        "footer_newsletter_description",
        "footer_newsletter_placeholder",
        "footer_newsletter_button",
        "social_facebook_url",
        "social_instagram_url",
        "social_youtube_url",
        "footer_payment_methods",
        "footer_links_json",
        "footer_features_json",
        "brands_list_json",
        "promo_banners_json",
        "vnpay_enabled",
        "cod_enabled",
        "maintenance_mode"
      ];
      
      const savePromises = coreKeys.map(key => 
        adminUpdateSetting({ key, value: updatedSettings[key] || "" })
      );

      await Promise.all(savePromises);
      toast.success("Đã lưu tất cả thay đổi");
    } catch (error) {
      toast.error(error instanceof SyntaxError ? "JSON header/footer khong hop le" : "Lưu cấu hình thất bại");
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
          <TabsTrigger value="header" className="gap-2">
            <Globe className="h-4 w-4" />
            Header
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Truck className="h-4 w-4" />
            Footer
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
                  <Select
                    value={settings["default_lang"] || "vi"}
                    onValueChange={(value) => handleInputChange("default_lang", value)}
                  >
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
                  <Select
                    value={settings["default_currency"] || "vnd"}
                    onValueChange={(value) => handleInputChange("default_currency", value)}
                  >
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

        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cau hinh Header</CardTitle>
              <CardDescription>
                Dieu khien logo, thanh thong bao va menu hien thi tren storefront.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="headerLogoText">Ten logo</Label>
                  <Input
                    id="headerLogoText"
                    value={settings["header_logo_text"] || ""}
                    onChange={(e) => handleInputChange("header_logo_text", e.target.value)}
                    placeholder="GlowSkin"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Hien thi top bar</Label>
                    <p className="text-sm text-muted-foreground">
                      Bat/tat dong thong bao tren cung cua Header.
                    </p>
                  </div>
                  <Switch
                    checked={settings["header_show_top_bar"] !== "false"}
                    onCheckedChange={(value) => handleInputChange("header_show_top_bar", value.toString())}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headerTopBarText">Noi dung top bar</Label>
                <Input
                  id="headerTopBarText"
                  value={settings["header_top_bar_text"] || ""}
                  onChange={(e) => handleInputChange("header_top_bar_text", e.target.value)}
                  placeholder="Mien phi van chuyen cho don hang tu 500.000d"
                  disabled={settings["header_show_top_bar"] === "false"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Menu dieu huong</CardTitle>
                <CardDescription>
                  Sap xep, them bot va danh dau menu noi bat tren Header.
                </CardDescription>
              </div>
              <Badge variant="secondary">{headerNavigation.length} menu</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {headerNavigation.map((item, index) => (
                <div key={`${item.name}-${item.href}-${index}`} className="grid gap-3 rounded-lg border bg-muted/10 p-3 lg:grid-cols-[1fr_1fr_auto_auto]">
                  <div className="space-y-2">
                    <Label className="text-xs">Ten menu</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const next = [...headerNavigation];
                        next[index] = { ...item, name: e.target.value };
                        updateHeaderNavigation(next);
                      }}
                      placeholder="San pham"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Duong dan</Label>
                    <Input
                      value={item.href}
                      onChange={(e) => {
                        const next = [...headerNavigation];
                        next[index] = { ...item, href: e.target.value };
                        updateHeaderNavigation(next);
                      }}
                      placeholder="/products"
                    />
                  </div>
                  <div className="flex items-end gap-2 pb-2">
                    <Switch
                      checked={item.highlight}
                      onCheckedChange={(value) => {
                        const next = [...headerNavigation];
                        next[index] = { ...item, highlight: value };
                        updateHeaderNavigation(next);
                      }}
                    />
                    <span className="text-xs text-muted-foreground">Noi bat</span>
                  </div>
                  <div className="flex items-end justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveHeaderItem(index, -1)}
                      disabled={index === 0}
                      aria-label="Dua menu len"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveHeaderItem(index, 1)}
                      disabled={index === headerNavigation.length - 1}
                      aria-label="Dua menu xuong"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => updateHeaderNavigation(headerNavigation.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Xoa menu"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => updateHeaderNavigation([...headerNavigation, { name: "Menu moi", href: "/", highlight: false }])}
              >
                <Plus className="mr-2 h-4 w-4" />
                Them menu
              </Button>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="headerNavigationJson">JSON menu nang cao</Label>
                <Textarea
                  id="headerNavigationJson"
                  className="h-40 font-mono text-xs"
                  value={settings["header_navigation_json"] || ""}
                  onChange={(e) => handleInputChange("header_navigation_json", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thong tin Footer</CardTitle>
              <CardDescription>
                Cac thong tin nay duoc Footer storefront doc truc tiep tu settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="footerStoreName">Ten cua hang</Label>
                  <Input
                    id="footerStoreName"
                    value={settings["store_name"] || ""}
                    onChange={(e) => handleInputChange("store_name", e.target.value)}
                    placeholder="GlowSkin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerPaymentMethods">Phuong thuc thanh toan</Label>
                  <Input
                    id="footerPaymentMethods"
                    value={settings["footer_payment_methods"] || ""}
                    onChange={(e) => handleInputChange("footer_payment_methods", e.target.value)}
                    placeholder="VISA,MC,MoMo,VNP"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="footerContactEmail">Email lien he</Label>
                  <Input
                    id="footerContactEmail"
                    type="email"
                    value={settings["contact_email"] || ""}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="support@glowskin.vn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerContactPhone">So dien thoai</Label>
                  <Input
                    id="footerContactPhone"
                    value={settings["contact_phone"] || ""}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    placeholder="1900 1234"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerStoreAddress">Dia chi</Label>
                <Textarea
                  id="footerStoreAddress"
                  value={settings["store_address"] || ""}
                  onChange={(e) => handleInputChange("store_address", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerStoreDescription">Mo ta cua hang</Label>
                <Textarea
                  id="footerStoreDescription"
                  value={settings["store_description"] || ""}
                  onChange={(e) => handleInputChange("store_description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Newsletter va mang xa hoi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Hien thi newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Bat/tat form dang ky email trong Footer.
                  </p>
                </div>
                <Switch
                  checked={settings["footer_show_newsletter"] !== "false"}
                  onCheckedChange={(value) => handleInputChange("footer_show_newsletter", value.toString())}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="footerNewsletterTitle">Tieu de newsletter</Label>
                  <Input
                    id="footerNewsletterTitle"
                    value={settings["footer_newsletter_title"] || ""}
                    onChange={(e) => handleInputChange("footer_newsletter_title", e.target.value)}
                    disabled={settings["footer_show_newsletter"] === "false"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerNewsletterButton">Nut dang ky</Label>
                  <Input
                    id="footerNewsletterButton"
                    value={settings["footer_newsletter_button"] || ""}
                    onChange={(e) => handleInputChange("footer_newsletter_button", e.target.value)}
                    disabled={settings["footer_show_newsletter"] === "false"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerNewsletterDescription">Mo ta newsletter</Label>
                <Textarea
                  id="footerNewsletterDescription"
                  value={settings["footer_newsletter_description"] || ""}
                  onChange={(e) => handleInputChange("footer_newsletter_description", e.target.value)}
                  disabled={settings["footer_show_newsletter"] === "false"}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerNewsletterPlaceholder">Placeholder email</Label>
                <Input
                  id="footerNewsletterPlaceholder"
                  value={settings["footer_newsletter_placeholder"] || ""}
                  onChange={(e) => handleInputChange("footer_newsletter_placeholder", e.target.value)}
                  disabled={settings["footer_show_newsletter"] === "false"}
                />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="socialFacebookUrl">Facebook</Label>
                  <Input
                    id="socialFacebookUrl"
                    value={settings["social_facebook_url"] || ""}
                    onChange={(e) => handleInputChange("social_facebook_url", e.target.value)}
                    placeholder="https://facebook.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialInstagramUrl">Instagram</Label>
                  <Input
                    id="socialInstagramUrl"
                    value={settings["social_instagram_url"] || ""}
                    onChange={(e) => handleInputChange("social_instagram_url", e.target.value)}
                    placeholder="https://instagram.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialYoutubeUrl">Youtube</Label>
                  <Input
                    id="socialYoutubeUrl"
                    value={settings["social_youtube_url"] || ""}
                    onChange={(e) => handleInputChange("social_youtube_url", e.target.value)}
                    placeholder="https://youtube.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Cot link Footer</CardTitle>
                <CardDescription>
                  Quan ly cac nhom link hien thi o ben phai Footer.
                </CardDescription>
              </div>
              <Badge variant="secondary">{Object.keys(footerLinks).length} cot</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(footerLinks).map(([columnKey, column]) => (
                <div key={columnKey} className="rounded-lg border bg-muted/10 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tieu de cot</Label>
                      <Input
                        value={column.title}
                        onChange={(e) => {
                          updateFooterLinks({
                            ...footerLinks,
                            [columnKey]: { ...column, title: e.target.value },
                          });
                        }}
                        placeholder="Ho tro"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-5 text-destructive hover:text-destructive"
                      onClick={() => {
                        const next = { ...footerLinks };
                        delete next[columnKey];
                        updateFooterLinks(next);
                      }}
                      aria-label="Xoa cot footer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <div key={`${link.name}-${link.href}-${linkIndex}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <Input
                          value={link.name}
                          onChange={(e) => {
                            const nextLinks = column.links.map((item, itemIndex) =>
                              itemIndex === linkIndex ? { ...item, name: e.target.value } : item
                            );
                            updateFooterLinks({
                              ...footerLinks,
                              [columnKey]: { ...column, links: nextLinks },
                            });
                          }}
                          placeholder="Ten link"
                        />
                        <Input
                          value={link.href}
                          onChange={(e) => {
                            const nextLinks = column.links.map((item, itemIndex) =>
                              itemIndex === linkIndex ? { ...item, href: e.target.value } : item
                            );
                            updateFooterLinks({
                              ...footerLinks,
                              [columnKey]: { ...column, links: nextLinks },
                            });
                          }}
                          placeholder="/contact"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            updateFooterLinks({
                              ...footerLinks,
                              [columnKey]: {
                                ...column,
                                links: column.links.filter((_, itemIndex) => itemIndex !== linkIndex),
                              },
                            });
                          }}
                          aria-label="Xoa link footer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      updateFooterLinks({
                        ...footerLinks,
                        [columnKey]: {
                          ...column,
                          links: [...column.links, { name: "Lien ket moi", href: "/" }],
                        },
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Them link
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" className="w-full" onClick={addFooterColumn}>
                <Plus className="mr-2 h-4 w-4" />
                Them cot link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Thanh loi ich Footer</CardTitle>
                <CardDescription>
                  Cac cam ket dich vu hien thi o hang dau cua Footer.
                </CardDescription>
              </div>
              <Badge variant="secondary">{footerFeatures.length} muc</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {footerFeatures.map((feature, index) => (
                <div key={`${feature.title}-${index}`} className="grid gap-3 rounded-lg border bg-muted/10 p-3 lg:grid-cols-[160px_1fr_1fr_auto]">
                  <Select
                    value={feature.iconName}
                    onValueChange={(value) => {
                      const next = [...footerFeatures];
                      next[index] = { ...feature, iconName: value };
                      updateFooterFeatures(next);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {footerFeatureIconOptions.map((iconName) => (
                        <SelectItem key={iconName} value={iconName}>
                          {iconName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={feature.title}
                    onChange={(e) => {
                      const next = [...footerFeatures];
                      next[index] = { ...feature, title: e.target.value };
                      updateFooterFeatures(next);
                    }}
                    placeholder="Mien phi van chuyen"
                  />
                  <Input
                    value={feature.description}
                    onChange={(e) => {
                      const next = [...footerFeatures];
                      next[index] = { ...feature, description: e.target.value };
                      updateFooterFeatures(next);
                    }}
                    placeholder="Don hang tu 500.000d"
                  />
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFooterFeature(index, -1)}
                      disabled={index === 0}
                      aria-label="Dua muc len"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFooterFeature(index, 1)}
                      disabled={index === footerFeatures.length - 1}
                      aria-label="Dua muc xuong"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => updateFooterFeatures(footerFeatures.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Xoa muc loi ich"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => updateFooterFeatures([...footerFeatures, { iconName: "Truck", title: "Loi ich moi", description: "Mo ta ngan" }])}
              >
                <Plus className="mr-2 h-4 w-4" />
                Them loi ich
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">JSON nang cao</CardTitle>
              <CardDescription>
                Dung khi can copy/paste cau hinh Footer tu nguon khac.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="footerLinksJson">Footer links JSON</Label>
                <Textarea
                  id="footerLinksJson"
                  className="h-52 font-mono text-xs"
                  value={settings["footer_links_json"] || ""}
                  onChange={(e) => handleInputChange("footer_links_json", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerFeaturesJson">Footer features JSON</Label>
                <Textarea
                  id="footerFeaturesJson"
                  className="h-52 font-mono text-xs"
                  value={settings["footer_features_json"] || ""}
                  onChange={(e) => handleInputChange("footer_features_json", e.target.value)}
                />
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

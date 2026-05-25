"use client";

import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/api";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, CreditCard, Truck, Shield, RotateCcw } from "lucide-react";

export type FooterLink = {
  name: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterFeature = {
  iconName: string;
  title: string;
  description: string;
};

export type FooterConfig = {
  storeName?: string;
  storeDescription?: string;
  storeAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButton?: string;
  socialFacebookUrl?: string;
  socialInstagramUrl?: string;
  socialYoutubeUrl?: string;
  paymentMethods?: string[];
  links?: Record<string, FooterColumn>;
  features?: FooterFeature[];
};

const defaultFooterLinks: Record<string, FooterColumn> = {
  shop: {
    title: "Mua sam",
    links: [
      { name: "Tat ca san pham", href: "/products" },
      { name: "Cham soc da", href: "/category/cham-soc-da" },
      { name: "Trang diem", href: "/category/trang-diem" },
      { name: "Chong nang", href: "/category/chong-nang" },
      { name: "San pham moi", href: "/products?filter=new" },
      { name: "Ban chay", href: "/products?filter=bestseller" },
    ],
  },
  support: {
    title: "Ho tro",
    links: [
      { name: "Huong dan mua hang", href: "/help/how-to-buy" },
      { name: "Phuong thuc thanh toan", href: "/help/payment" },
      { name: "Van chuyen", href: "/help/shipping" },
      { name: "Doi tra va hoan tien", href: "/help/returns" },
      { name: "Cau hoi thuong gap", href: "/help/faq" },
      { name: "Lien he", href: "/contact" },
    ],
  },
  company: {
    title: "Ve chung toi",
    links: [
      { name: "Gioi thieu", href: "/about" },
      { name: "Tuyen dung", href: "/careers" },
      { name: "Blog lam dep", href: "/blog" },
      { name: "Dieu khoan su dung", href: "/terms" },
      { name: "Chinh sach bao mat", href: "/privacy" },
    ],
  },
};

const defaultFeatures: FooterFeature[] = [
  {
    iconName: "Truck",
    title: "Mien phi van chuyen",
    description: "Don hang tu 500.000d",
  },
  {
    iconName: "RotateCcw",
    title: "Doi tra 30 ngay",
    description: "Khong can ly do",
  },
  {
    iconName: "Shield",
    title: "Chinh hang 100%",
    description: "Cam ket chat luong",
  },
  {
    iconName: "CreditCard",
    title: "Thanh toan an toan",
    description: "Bao mat tuyet doi",
  },
];

const featureIcons = {
  Truck,
  RotateCcw,
  Shield,
  CreditCard,
};

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function Footer({ config }: { config?: FooterConfig }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        const settingsMap = data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>);
        setSettings(settingsMap);
      } catch (err) {
        console.error("Failed to load storefront footer settings:", err);
      }
    }
    loadSettings();
  }, []);

  const footerLinks = config?.links || parseJsonSetting(settings["footer_links_json"], defaultFooterLinks);
  const features = config?.features || parseJsonSetting(settings["footer_features_json"], defaultFeatures);
  const paymentMethods = config?.paymentMethods || (settings["footer_payment_methods"] || "VISA,MC,MoMo,VNP")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const showNewsletter = config?.showNewsletter ?? settings["footer_show_newsletter"] !== "false";
  const storeName = config?.storeName || settings["store_name"] || "GlowSkin";
  const storeDescription = config?.storeDescription || settings["store_description"] || "Kham pha ve dep toan dien voi cac san pham my pham cao cap, chinh hang tu cac thuong hieu hang dau the gioi.";
  const storeAddress = config?.storeAddress || settings["store_address"] || "123 Nguyen Hue, Quan 1, TP.HCM";
  const contactPhone = config?.contactPhone || settings["contact_phone"] || "1900 1234 56";
  const contactEmail = config?.contactEmail || settings["contact_email"] || "support@glowskin.vn";

  return (
    <footer className="bg-gradient-to-b from-secondary/15 via-muted/40 to-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-8 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = featureIcons[feature.iconName as keyof typeof featureIcons] || Truck;

            return (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-primary">{storeName}</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {storeDescription}
            </p>

            {showNewsletter && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">{config?.newsletterTitle || settings["footer_newsletter_title"] || "Dang ky nhan tin"}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {config?.newsletterDescription || settings["footer_newsletter_description"] || "Nhan uu dai doc quyen va cap nhat xu huong lam dep moi nhat."}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={config?.newsletterPlaceholder || settings["footer_newsletter_placeholder"] || "Email cua ban"}
                    className="flex-1 bg-background"
                  />
                  <Button>{config?.newsletterButton || settings["footer_newsletter_button"] || "Dang ky"}</Button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <a
                href={config?.socialFacebookUrl || settings["social_facebook_url"] || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={config?.socialInstagramUrl || settings["social_instagram_url"] || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={config?.socialYoutubeUrl || settings["social_youtube_url"] || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={`${link.name}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 border-t border-border">
        <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{storeAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{contactPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span>{contactEmail}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {storeName}. Tat ca quyen duoc bao luu.</p>
          <div className="flex items-center gap-4">
            <span>Thanh toan:</span>
            <div className="flex gap-2">
              {paymentMethods.map((method) => (
                <div key={method} className="min-w-10 h-6 px-2 bg-background border border-border rounded flex items-center justify-center text-xs font-medium">
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

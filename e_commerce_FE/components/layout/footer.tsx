import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, CreditCard, Truck, Shield, RotateCcw } from "lucide-react";

const footerLinks = {
  shop: {
    title: "Mua sắm",
    links: [
      { name: "Tất cả sản phẩm", href: "/products" },
      { name: "Chăm sóc da", href: "/category/cham-soc-da" },
      { name: "Trang điểm", href: "/category/trang-diem" },
      { name: "Chống nắng", href: "/category/chong-nang" },
      { name: "Sản phẩm mới", href: "/products?filter=new" },
      { name: "Bán chạy", href: "/products?filter=bestseller" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { name: "Hướng dẫn mua hàng", href: "/help/how-to-buy" },
      { name: "Phương thức thanh toán", href: "/help/payment" },
      { name: "Vận chuyển", href: "/help/shipping" },
      { name: "Đổi trả & Hoàn tiền", href: "/help/returns" },
      { name: "Câu hỏi thường gặp", href: "/help/faq" },
      { name: "Liên hệ", href: "/contact" },
    ],
  },
  company: {
    title: "Về chúng tôi",
    links: [
      { name: "Giới thiệu", href: "/about" },
      { name: "Tuyển dụng", href: "/careers" },
      { name: "Blog làm đẹp", href: "/blog" },
      { name: "Điều khoản sử dụng", href: "/terms" },
      { name: "Chính sách bảo mật", href: "/privacy" },
    ],
  },
};

const features = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    description: "Đơn hàng từ 500.000đ",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    description: "Không cần lý do",
  },
  {
    icon: Shield,
    title: "Chính hãng 100%",
    description: "Cam kết chất lượng",
  },
  {
    icon: CreditCard,
    title: "Thanh toán an toàn",
    description: "Bảo mật tuyệt đối",
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-secondary/15 via-muted/40 to-muted/50 border-t border-border">
      {/* Features */}
      <div className="container mx-auto px-4 py-8 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-primary">GlowSkin</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Khám phá vẻ đẹp toàn diện với các sản phẩm mỹ phẩm cao cấp, chính hãng từ các thương hiệu hàng đầu thế giới.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Đăng ký nhận tin</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Nhận ưu đãi độc quyền và cập nhật xu hướng làm đẹp mới nhất.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 bg-background"
                />
                <Button>Đăng ký</Button>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
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

      {/* Contact Info */}
      <div className="container mx-auto px-4 py-6 border-t border-border">
        <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>1900 1234 56</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span>support@glowskin.vn</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 py-4 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>2026 GlowSkin. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Thanh toán:</span>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-xs font-medium">VISA</div>
              <div className="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-xs font-medium">MC</div>
              <div className="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-xs font-medium">MoMo</div>
              <div className="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-xs font-medium">VNP</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

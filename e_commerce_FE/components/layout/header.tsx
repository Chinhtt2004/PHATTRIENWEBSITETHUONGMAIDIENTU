"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X, Heart, Zap, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Category, formatPrice } from "@/lib/data";
import { fetchCategories, fetchUserProfile, logoutUser, type UserProfileResponse } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

const navigation = [
  { name: "Trang chủ", href: "/", highlight: false },
  { name: "Sản phẩm", href: "/products", highlight: false },
  { name: "Sale", href: "/sale", highlight: true },
  { name: "Khuyến mãi", href: "/promotions", highlight: false },
  { name: "Về chúng tôi", href: "/about", highlight: false },
  { name: "Liên hệ", href: "/contact", highlight: false },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const { cartItems, isLoading: isLoadingCart, loadCart, removeItem, updateQuantity } = useCart();
  const cartItemCount = cartItems.length;

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch(() => undefined);
    
    // Check session
    fetchUserProfile()
      .then((profile) => { if (!cancelled) setUser(profile); })
      .catch(() => { if (!cancelled) setUser(null); });

    return () => { cancelled = true; };
  }, [pathname]);

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (open) {
      loadCart();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Đã đăng xuất thành công");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar - promotional message */}
      <div className="bg-gradient-to-r from-primary via-rose-400/90 to-primary-hover text-primary-foreground text-center py-2 text-sm">
        <p>Miễn phí vận chuyển cho đơn hàng từ 500.000đ | Đổi trả trong 30 ngày</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-primary">GlowSkin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.highlight
                    ? "text-destructive font-bold relative flex items-center gap-1"
                    : "text-foreground/80"
                }`}
              >
                {item.highlight && (
                  <Zap className="h-3.5 w-3.5 fill-destructive" />
                )}
                {item.name}
                {item.highlight && (
                  <span className="absolute -top-2 -right-4 text-[10px] bg-destructive text-destructive-foreground px-1 rounded-sm leading-tight animate-pulse">
                    HOT
                  </span>
                )}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground/80 hover:text-primary">
                  Danh mục
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/category/${category.slug}`} className="cursor-pointer">
                      {category.name}
                      <span className="ml-auto text-muted-foreground text-xs">
                        ({category.productCount})
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 bg-muted border-0 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Yêu thích">
              <Heart className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Tài khoản">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="w-[150px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">Hồ sơ của tôi</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="cursor-pointer">Đơn hàng</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account/login" className="cursor-pointer">Đăng nhập</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/register" className="cursor-pointer">Đăng ký</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Giỏ hàng">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-gradient-to-b from-background to-secondary/5">
                <SheetHeader className="border-b border-border/50">
                  <SheetTitle className="font-serif text-xl">Giỏ hàng ({cartItemCount})</SheetTitle>
                </SheetHeader>
                
                {isLoadingCart ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="animate-spin">
                      <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">Đang tải giỏ hàng...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-2">Giỏ hàng trống</h3>
                    <p className="text-xs text-muted-foreground mb-6">Hãy khám phá và thêm sản phẩm vào giỏ hàng</p>
                    <Button asChild size="sm" onClick={() => setSheetOpen(false)} className="w-full sm:w-auto">
                      <Link href="/products">Bắt đầu mua sắm</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-3 p-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="group relative rounded-lg border border-border/50 bg-card p-3 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                            <div className="flex gap-3">
                              <Link
                                href={item.slug ? `/product/${item.slug}` : "/products"}
                                className="relative h-14 w-14 flex-shrink-0 rounded-md overflow-hidden bg-muted/50 hover:bg-muted transition-colors"
                              >
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </Link>
                              
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <Link
                                  href={item.slug ? `/product/${item.slug}` : "/products"}
                                  className="font-medium text-xs hover:text-primary transition-colors line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                <div className="flex items-center justify-between">
                                  <p className="text-primary font-semibold text-xs">
                                    {formatPrice(item.price)}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveItem(item.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                              <span className="text-xs text-muted-foreground flex-1">Số lượng:</span>
                              <div className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/30">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-2.5 w-2.5" />
                                </Button>
                                <span className="w-6 text-center text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-2.5 w-2.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/50 bg-gradient-to-t from-background to-transparent p-4 space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tạm tính</span>
                          <span>{formatPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                        </div>
                        <div className="h-px bg-border/30" />
                        <div className="flex justify-between font-semibold">
                          <span>Tổng</span>
                          <span className="text-primary">{formatPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                        </div>
                      </div>
                      <Button asChild className="w-full bg-primary hover:bg-primary-hover" onClick={() => setSheetOpen(false)}>
                        <Link href="/cart" className="text-sm font-medium">Xem giỏ hàng & thanh toán</Link>
                      </Button>
                      <Button variant="outline" className="w-full text-sm" onClick={() => setSheetOpen(false)}>
                        Tiếp tục mua sắm
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 bg-muted border-0"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="font-serif text-primary">GlowSkin</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  item.highlight
                    ? "text-destructive font-bold flex items-center gap-2"
                    : "text-foreground/80"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.highlight && (
                  <Zap className="h-4 w-4 fill-destructive" />
                )}
                {item.name}
                {item.highlight && (
                  <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-sm animate-pulse">
                    HOT
                  </span>
                )}
              </Link>
            ))}
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Tài khoản</p>
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-3 bg-muted/50 rounded-lg mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate w-40">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    className="block py-2 text-foreground/80 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hồ sơ của tôi
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block py-2 text-foreground/80 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đơn hàng
                  </Link>
                  <button
                    className="block w-full text-left py-2 text-destructive hover:text-destructive/80"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/account/login"
                    className="block py-2 text-foreground/80 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/account/register"
                    className="block py-2 text-foreground/80 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Danh mục</p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block py-2 text-foreground/80 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

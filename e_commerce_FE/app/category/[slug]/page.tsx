import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { categories, products } from "@/lib/data";
=======
import { fetchStorefrontData } from "@/lib/api";
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
<<<<<<< HEAD
=======
  const { categories } = await fetchStorefrontData();
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "Không tìm thấy danh mục" };
  }

  return {
    title: `${category.name} | GlowSkin - Mỹ Phẩm Chính Hãng`,
    description: category.description,
  };
}

<<<<<<< HEAD
export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
=======
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { categories, products } = await fetchStorefrontData();
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter products by category
  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  // Get related categories (excluding current)
  const relatedCategories = categories.filter((c) => c.id !== category.id).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-background via-primary-light/10 to-secondary/10 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                Sản phẩm
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/50 to-secondary/30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {category.productCount} sản phẩm
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                  {category.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  {category.description}. Khám phá các sản phẩm chất lượng từ các thương hiệu hàng đầu thế giới.
                </p>
              </div>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl hidden lg:block">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sub-categories / Related */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/category/${category.slug}`}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                Tất cả
              </Link>
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-muted-foreground">
                Hiển thị <span className="font-medium text-foreground">{categoryProducts.length > 0 ? categoryProducts.length : products.length}</span> sản phẩm
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Bộ lọc
                </Button>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Button variant="ghost" size="icon" className="rounded-none h-9 w-9 bg-muted">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-none h-9 w-9">
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categoryProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            ) : (
              <>
                <div className="text-center py-12 mb-12 bg-gradient-to-b from-primary-light/10 to-secondary/10 rounded-xl">
                  <p className="text-muted-foreground mb-4">Chưa có sản phẩm trong danh mục này</p>
                  <Button asChild>
                    <Link href="/products">Xem tất cả sản phẩm</Link>
                  </Button>
                </div>
                
                {/* Show all products as suggestion */}
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-6">Sản phẩm gợi ý</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.slice(0, 8).map((product, index) => (
                      <ProductCard key={product.id} product={product} priority={index < 4} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Category Description */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-secondary/12 via-primary-light/8 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                Về Danh Mục {category.name}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground">
                  Tại GlowSkin, chúng tôi tự hào mang đến cho bạn bộ sưu tập {category.name.toLowerCase()} đa dạng và chất lượng cao từ các thương hiệu hàng đầu thế giới. Mọi sản phẩm đều được tuyển chọn kỹ lưỡng, đảm bảo an toàn và phù hợp với mọi loại da.
                </p>
                <p className="text-muted-foreground mt-4">
                  Dù bạn đang tìm kiếm sản phẩm {category.name.toLowerCase()} cho da dầu, da khô hay da nhạy cảm, chúng tôi đều có những lựa chọn phù hợp. Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm được sản phẩm lý tưởng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Categories */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
              Danh Mục Khác
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                    <p className="text-sm text-white/80">{cat.productCount} sản phẩm</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductDetail } from "@/components/product/product-detail";
<<<<<<< HEAD
import { products } from "@/lib/data";
=======
import { fetchProductById, fetchProductsByCategoryId } from "@/lib/api";
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

<<<<<<< HEAD
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
=======
// Helper to extract ID from slug (slug-format-123)
function getIdFromSlug(slug: string): number {
  const parts = slug.split("-");
  return parseInt(parts[parts.length - 1], 10);
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  
  try {
    const product = await fetchProductById(id);
    return {
      title: `${product.name} | GlowSkin`,
      description: product.shortDescription,
      openGraph: {
        title: product.name,
        description: product.shortDescription,
        images: [product.images[0]?.url],
      },
    };
  } catch (error) {
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
    return {
      title: "Sản phẩm không tồn tại | GlowSkin",
    };
  }
<<<<<<< HEAD

  return {
    title: `${product.name} | GlowSkin`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]?.url],
    },
  };
=======
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
<<<<<<< HEAD
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
=======
  const id = getIdFromSlug(slug);

  try {
    const product = await fetchProductById(id);
    if (!product) notFound();

    // Get related products from same category
    const relatedProducts = await fetchProductsByCategoryId(Number(product.categoryId));
    const filteredRelated = relatedProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 4);

    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <ProductDetail product={product} relatedProducts={filteredRelated} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
}

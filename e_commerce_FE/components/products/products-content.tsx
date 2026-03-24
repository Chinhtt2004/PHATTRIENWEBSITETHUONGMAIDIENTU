"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { type Category, type Product, formatPrice } from "@/lib/data";
import { fetchProductsPage, fetchCategories } from "@/lib/api";
import { toast } from "sonner";

const skinTypes = [
  { id: "all", label: "Tất cả loại da" },
  { id: "oily", label: "Da dầu" },
  { id: "dry", label: "Da khô" },
  { id: "combination", label: "Da hỗn hợp" },
  { id: "normal", label: "Da thường" },
  { id: "sensitive", label: "Da nhạy cảm" },
];

const sortOptions = [
  { value: "id-desc", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
];

interface ProductsContentProps {
  initialCategoryId?: string;
  showBreadcrumb?: boolean;
}

export function ProductsContent({ initialCategoryId, showBreadcrumb = true }: ProductsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state
  const page = parseInt(searchParams.get("page") || "1") - 1;
  const sortBy = searchParams.get("sort") || "id-desc";
  const categoryId = searchParams.get("category") || initialCategoryId;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const keyword = searchParams.get("q") || undefined;

  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000000]);

  // Sync price slider with URL periodically or on commitment
  useEffect(() => {
    if (minPrice !== undefined || maxPrice !== undefined) {
      setLocalPriceRange([minPrice || 0, maxPrice || 1000000]);
    }
  }, [minPrice, maxPrice]);

  const updateFilters = useCallback((newParams: Record<string, string | number | undefined>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    // Reset page on filter change
    if (!newParams.page) {
      current.delete("page");
    }

    router.push(`${pathname}?${current.toString()}`);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [pageData, categoriesData] = await Promise.all([
          fetchProductsPage({
            page,
            size: 12,
            sortBy: sortBy.split("-")[0],
            sortDir: sortBy.split("-")[1],
            categoryId: categoryId ? Number(categoryId) : undefined,
            minPrice,
            maxPrice,
            keyword,
          }),
          fetchCategories(),
        ]);

        setProducts(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [page, sortBy, categoryId, minPrice, maxPrice, keyword]);

  const activeFiltersCount = 
    (categoryId && categoryId !== initialCategoryId ? 1 : 0) + 
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0);

  const clearAllFilters = () => {
    updateFilters({
      category: initialCategoryId,
      minPrice: undefined,
      maxPrice: undefined,
      page: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      {!initialCategoryId && (
        <div>
          <h3 className="font-semibold mb-3">Danh mục</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 py-1">
                <Checkbox
                  id={category.id}
                  checked={categoryId === category.id}
                  onCheckedChange={(checked) => {
                    updateFilters({ category: checked ? category.id : undefined });
                  }}
                />
                <Label htmlFor={category.id} className="cursor-pointer text-sm flex-1">
                  {category.name}
                  <span className="text-muted-foreground ml-1 text-xs">
                    ({category.productCount})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Khoảng giá</h3>
        <div className="px-2">
          <Slider
            value={localPriceRange}
            onValueChange={(value) => setLocalPriceRange(value as [number, number])}
            onValueCommit={(value) => {
              updateFilters({ 
                minPrice: value[0] === 0 ? undefined : value[0], 
                maxPrice: value[1] === 1000000 ? undefined : value[1] 
              });
            }}
            max={1000000}
            step={50000}
            className="mb-4"
          />
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground flex-1 text-center bg-muted/30 py-1.5 rounded">
              {formatPrice(localPriceRange[0])}
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="text-xs text-muted-foreground flex-1 text-center bg-muted/30 py-1.5 rounded">
              {formatPrice(localPriceRange[1])}
            </div>
          </div>
        </div>
      </div>

      {/* Skin Type (Placeholder for now as backend doesn't support) */}
      <div>
        <h3 className="font-semibold mb-3">Loại da</h3>
        <div className="space-y-1">
          {skinTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2 py-1 opacity-50 cursor-not-allowed">
              <Checkbox id={type.id} disabled />
              <Label htmlFor={type.id} className="text-sm">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full bg-transparent mt-4"
          onClick={clearAllFilters}
        >
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-background via-primary-light/8 to-secondary/8 min-h-screen pb-16">
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tất cả sản phẩm</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        {!initialCategoryId && (
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Tất Cả Sản Phẩm
            </h1>
            <p className="text-muted-foreground">
              Khám phá bộ sưu tập mỹ phẩm chính hãng chất lượng cao
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2 text-lg">
                  <Filter className="h-4 w-4 text-primary" />
                  Bộ lọc
                </h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden bg-white/50 backdrop-blur-sm rounded-xl">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="text-left font-serif text-2xl">Bộ lọc</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 px-1">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  Đang hiển thị <span className="font-bold text-foreground">{totalElements}</span> sản phẩm
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(val) => updateFilters({ sort: val })}>
                  <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm rounded-xl border-border/50">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Grid Toggle - Desktop Only */}
                <div className="hidden md:flex bg-white/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden p-0.5">
                  <Button
                    variant={gridCols === 3 ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-lg h-8 w-8 transition-all"
                    onClick={() => setGridCols(3)}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={gridCols === 4 ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-lg h-8 w-8 transition-all"
                    onClick={() => setGridCols(4)}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-muted/40 rounded-2xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-2 gap-4 md:gap-6 ${
                    gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl bg-white/50 border-border/50 hover:bg-primary hover:text-white transition-all"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {/* Always show first page */}
                        <Button
                          variant={page === 0 ? "default" : "outline"}
                          size="icon"
                          className={`w-10 h-10 rounded-xl text-sm transition-all border-border/50 ${page === 0 ? "shadow-lg shadow-primary/25" : "bg-white/50"}`}
                          onClick={() => handlePageChange(0)}
                        >
                          1
                        </Button>

                        {page > 2 && <span className="text-muted-foreground px-1">...</span>}

                        {/* Pages around current */}
                        {[...Array(totalPages)].map((_, i) => {
                          if (i === 0 || i === totalPages - 1) return null;
                          if (i < page - 1 || i > page + 1) return null;
                          return (
                            <Button
                              key={i}
                              variant={page === i ? "default" : "outline"}
                              size="icon"
                              className={`w-10 h-10 rounded-xl text-sm transition-all border-border/50 ${page === i ? "shadow-lg shadow-primary/25" : "bg-white/50"}`}
                              onClick={() => handlePageChange(i)}
                            >
                              {i + 1}
                            </Button>
                          );
                        })}

                        {page < totalPages - 3 && <span className="text-muted-foreground px-1">...</span>}

                        {/* Always show last page */}
                        {totalPages > 1 && (
                          <Button
                            variant={page === totalPages - 1 ? "default" : "outline"}
                            size="icon"
                            className={`w-10 h-10 rounded-xl text-sm transition-all border-border/50 ${page === totalPages - 1 ? "shadow-lg shadow-primary/25" : "bg-white/50"}`}
                            onClick={() => handlePageChange(totalPages - 1)}
                          >
                            {totalPages}
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl bg-white/50 border-border/50 hover:bg-primary hover:text-white transition-all"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trang {page + 1} trên {totalPages}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-border mt-8">
                <div className="bg-muted/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại của bạn.
                </p>
                <Button onClick={clearAllFilters} className="rounded-full px-8 h-12">
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

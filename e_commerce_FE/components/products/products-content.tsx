"use client";

import { useState, useMemo } from "react";
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
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
import { products, categories, formatPrice } from "@/lib/data";

const skinTypes = [
  { id: "all", label: "Tất cả loại da" },
  { id: "oily", label: "Da dầu" },
  { id: "dry", label: "Da khô" },
  { id: "combination", label: "Da hỗn hợp" },
  { id: "normal", label: "Da thường" },
  { id: "sensitive", label: "Da nhạy cảm" },
];

const sortOptions = [
  { value: "featured", label: "Nổi bật" },
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
];

export function ProductsContent() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoryId));
    }

    // Filter by skin type
    if (selectedSkinTypes.length > 0 && !selectedSkinTypes.includes("all")) {
      result = result.filter((p) =>
        p.attributes.skin_type?.some((st) => selectedSkinTypes.includes(st))
      );
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating.average - a.rating.average);
        break;
    }

    return result;
  }, [selectedCategories, selectedSkinTypes, priceRange, sortBy]);

  const activeFiltersCount =
    selectedCategories.length +
    (selectedSkinTypes.length > 0 && !selectedSkinTypes.includes("all") ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
    setPriceRange([0, 1000000]);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.id]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category.id)
                    );
                  }
                }}
              />
              <Label htmlFor={category.id} className="cursor-pointer text-sm">
                {category.name}
                <span className="text-muted-foreground ml-1">
                  ({category.productCount})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Skin Type */}
      <div>
        <h3 className="font-semibold mb-3">Loại da</h3>
        <div className="space-y-2">
          {skinTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <Checkbox
                id={type.id}
                checked={selectedSkinTypes.includes(type.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSkinTypes([...selectedSkinTypes, type.id]);
                  } else {
                    setSelectedSkinTypes(
                      selectedSkinTypes.filter((t) => t !== type.id)
                    );
                  }
                }}
              />
              <Label htmlFor={type.id} className="cursor-pointer text-sm">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Khoảng giá</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={1000000}
            step={50000}
            className="mb-4"
          />
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={formatPrice(priceRange[0])}
              readOnly
              className="text-center text-sm h-9"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="text"
              value={formatPrice(priceRange[1])}
              readOnly
              className="text-center text-sm h-9"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={clearAllFilters}
        >
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-background via-primary-light/8 to-secondary/8">
      {/* Breadcrumb */}
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Tất Cả Sản Phẩm
          </h1>
          <p className="text-muted-foreground">
            Khám phá {products.length} sản phẩm mỹ phẩm chính hãng
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden bg-transparent">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  Hiển thị{" "}
                  <span className="font-medium text-foreground">
                    {filteredProducts.length}
                  </span>{" "}
                  sản phẩm
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Grid Toggle - Desktop Only */}
                <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={gridCols === 3 ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setGridCols(3)}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={gridCols === 4 ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setGridCols(4)}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Bộ lọc:</span>
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return cat ? (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() =>
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== catId)
                        )
                      }
                    >
                      {cat.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ) : null;
                })}
                {selectedSkinTypes.length > 0 && !selectedSkinTypes.includes("all") && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setSelectedSkinTypes([])}
                  >
                    Loại da
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setPriceRange([0, 1000000])}
                  >
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={clearAllFilters}
                >
                  Xóa tất cả
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 gap-4 md:gap-6 ${
                  gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thử thay đổi bộ lọc để tìm sản phẩm phù hợp
                </p>
                <Button onClick={clearAllFilters}>Xóa bộ lọc</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

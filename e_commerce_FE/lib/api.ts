import type { Category, Product, User } from "@/lib/data";
import { cache } from "react";

// API base URL được lấy từ biến môi trường, mặc định là localhost
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

type ApiError = Error & { status?: number };

// --- Interfaces & DTOs ---

export interface BackendCategory {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  children?: BackendCategory[];
}

export interface BackendProductCategory {
  id: number;
  name: string;
  description?: string | null;
}

export interface BackendProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  stockQuantity: number;
  imageUrl?: string | null;
  category?: BackendProductCategory | null;
  createdAt?: string;
}

export interface BackendProductPage {
  content: BackendProduct[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface BackendCartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
}

export interface LoginResponse {
  message: string;
  email: string;
  role: string;
}

export interface UserProfileResponse {
  name: string;
  email: string;
}

export interface Promotion {
  id: number;
  code: string;
  description: string;
  type: "PERCENTAGE" | "FIXED" | "SHIPPING";
  value: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  isCollected?: boolean;
  isUsed?: boolean;
}

export interface PromotionRequest {
  code: string;
  description: string;
  type: string;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  isActive: boolean;
}

// Request Types
export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const categoryImages = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
];

// --- Helpers ---

function createApiError(message: string, status?: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

async function ensureOk(res: Response) {
  const data = await parseResponse(res);
  if (!res.ok) {
    const message = typeof data === "string" ? data : data?.message || `Request failed with status ${res.status}`;
    throw createApiError(message, res.status);
  }
  return data;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function summarize(text: string, maxLength = 110) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

// --- Mappers ---

export function mapBackendProduct(product: BackendProduct): Product {
  const description = stripHtml(product.description || "");
  const price = Number(product.price || 0);
  const compareAtPrice = product.stockQuantity > 20 ? Math.round(price * 1.15) : null;
  const categoryId = String(product.category?.id ?? "0");
  const slug = `${slugify(product.name)}-${product.id}`;
  const imageUrl = product.imageUrl || "/placeholder.svg";
  const badge = product.stockQuantity > 20 ? "bestseller" : product.stockQuantity <= 5 ? "sale" : "new";

  return {
    id: String(product.id),
    sku: `SKU-${product.id}`,
    name: product.name,
    slug,
    shortDescription: summarize(description || product.name),
    description: product.description || `<p>${product.name}</p>`,
    price,
    compareAtPrice,
    currency: "VND",
    categoryId,
    brandId: "brand_glowskin",
    images: [
      {
        id: `img-${product.id}`,
        url: imageUrl,
        alt: product.name,
      },
    ],
    variants: [
      {
        id: `var-${product.id}`,
        sku: `SKU-${product.id}-DEFAULT`,
        name: "Mặc định",
        price,
        inventory: product.stockQuantity,
        attributes: { size: "Mặc định" },
      },
    ],
    attributes: { skin_type: ["all"], concerns: [] },
    rating: { average: 4.8, count: 0 },
    badges: [badge],
    inventory: { available: product.stockQuantity > 0, quantity: product.stockQuantity },
    ingredients: [],
    reviews: [],
  };
}

export function mapBackendCategory(category: BackendCategory, productCount: number, index: number): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: slugify(category.name),
    description: category.description || `Khám phá các sản phẩm ${category.name.toLowerCase()}`,
    image: categoryImages[index % categoryImages.length],
    productCount,
  };
}

// --- API Functions ---

// Authentication & Profile
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/author/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return ensureOk(res);
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/author/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "USER" }),
  });
  return ensureOk(res);
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE_URL}/api/author/logout`, {
    method: "POST",
    credentials: "include",
  });
  return ensureOk(res);
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/user/me`, {
    credentials: "include",
    cache: "no-store",
  });
  return ensureOk(res);
}

export async function updateUserProfile(userData: Partial<UserProfileResponse>): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/user/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return ensureOk(res);
}

export async function changePassword(data: ChangePasswordRequest) {
  const res = await fetch(`${API_BASE_URL}/api/user/changepassword`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return ensureOk(res);
}

// Products
export async function fetchProducts(options: {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
} = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (options.keyword) params.append("keyword", options.keyword);
  if (options.minPrice !== undefined) params.append("minPrice", String(options.minPrice));
  if (options.maxPrice !== undefined) params.append("maxPrice", String(options.maxPrice));
  if (options.categoryId) params.append("categoryId", String(options.categoryId));
  params.append("page", String(options.page || 0));
  params.append("size", String(options.size || 100));
  params.append("sortBy", options.sortBy || "id");
  params.append("sortDir", options.sortDir || "desc");

  const res = await fetch(`${API_BASE_URL}/api/public/products?${params.toString()}`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendProductPage;
  return (data.content || []).map(mapBackendProduct);
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/public/product/${id}`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendProduct;
  return mapBackendProduct(data);
}

export async function fetchProductsByCategoryId(categoryId: number): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/product/category/${categoryId}`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendProduct[];
  return data.map(mapBackendProduct);
}

export async function fetchBestSellers(limit = 10): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/products/best-sellers?limit=${limit}`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendProduct[];
  return data.map(mapBackendProduct);
}

export async function fetchNewProducts(limit = 10): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/products/new?limit=${limit}`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendProduct[];
  return data.map(mapBackendProduct);
}

// Admin Products
export async function adminCreateProduct(product: ProductRequest, imageFile?: File) {
  const formData = new FormData();
  formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return ensureOk(res);
}

export async function adminUpdateProduct(id: number, product: ProductRequest, imageFile?: File) {
  const formData = new FormData();
  formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return ensureOk(res);
}

export async function adminDeleteProduct(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return ensureOk(res);
}

// Categories
export async function fetchCategories(providedProducts?: Product[]): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/categories`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendCategory[];

  let products = providedProducts;
  if (!products) {
    try {
      products = await fetchProducts({ size: 1000 });
    } catch (e) {
      products = [];
    }
  }

  const productCountMap = new Map<string, number>();
  for (const product of products) {
    productCountMap.set(product.categoryId, (productCountMap.get(product.categoryId) || 0) + 1);
  }

  const flatCategories: Category[] = [];

  // Recursive function to calculate total count for a category and its descendants
  const getCategoryCount = (backendCat: BackendCategory): number => {
    let count = productCountMap.get(String(backendCat.id)) || 0;
    if (backendCat.children) {
      backendCat.children.forEach(child => {
        count += getCategoryCount(child);
      });
    }
    return count;
  };

  // Recursive function to flatten categories top-down
  const flattenCategories = (backendCat: BackendCategory, index: number) => {
    const totalCount = getCategoryCount(backendCat);
    const mapped = mapBackendCategory(backendCat, totalCount, index);
    flatCategories.push(mapped);

    if (backendCat.children) {
      backendCat.children.forEach((child, childIndex) => {
        flattenCategories(child, childIndex);
      });
    }
  };

  data.forEach((cat, index) => {
    flattenCategories(cat, index);
  });

  return flatCategories;
}

// Admin Categories
export async function adminCreateCategory(category: CategoryRequest) {
  const res = await fetch(`${API_BASE_URL}/api/admin/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(category),
  });
  return ensureOk(res);
}

export async function adminUpdateCategory(id: number, category: CategoryRequest) {
  const res = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(category),
  });
  return ensureOk(res);
}

export async function adminDeleteCategory(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return ensureOk(res);
}

// Cart
export async function addToCart(productId: number, quantity: number) {
  const params = new URLSearchParams({ productId: String(productId), quantity: String(quantity) });
  const res = await fetch(`${API_BASE_URL}/api/user/cart?${params.toString()}`, {
    method: "POST",
    credentials: "include",
  });
  return ensureOk(res);
}

export async function fetchCartItems(): Promise<BackendCartItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/user/cart`, {
    credentials: "include",
    cache: "no-store",
  });
  return ensureOk(res) as Promise<BackendCartItem[]>;
}

export async function removeCartItem(productId: number) {
  const res = await fetch(`${API_BASE_URL}/api/user/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return ensureOk(res);
}

// Product with Category Hierarchy
export async function fetchProductsByCategoryRecursive(categoryId: number): Promise<Product[]> {
  const products = await fetchProducts(); // Fetch all (simplified for now)
  const categoriesRes = await fetch(`${API_BASE_URL}/api/public/categories`, { cache: "no-store" });
  const categories = (await ensureOk(categoriesRes)) as BackendCategory[];

  function findCategory(cats: BackendCategory[], id: number): BackendCategory | null {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategory(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function getDescendantIds(cat: BackendCategory): number[] {
    let ids = [cat.id];
    if (cat.children) {
      cat.children.forEach(child => {
        ids = [...ids, ...getDescendantIds(child)];
      });
    }
    return ids;
  }

  const targetCategory = findCategory(categories, categoryId);
  if (!targetCategory) return [];

  const allIds = getDescendantIds(targetCategory).map(String);
  return products.filter(p => allIds.includes(p.categoryId));
}

export async function testCategoryFetching() {
  const products = await fetchProducts();
  const categories = await fetchCategories(products);

  console.log("=== Test Category Fetching ===");
  console.log(`Total Products: ${products.length}`);
  console.log(`Total Flattened Categories: ${categories.length}`);
  categories.forEach(cat => {
    console.log(`- ${cat.name} (ID: ${cat.id}): ${cat.productCount} products`);
  });

  return { products, categories };
}

// Mixed Data
export const fetchStorefrontData = cache(async () => {
  const products = await fetchProducts();
  const categories = await fetchCategories(products);
  return { products, categories };
});
// Promotions
export async function fetchPublicPromotions(): Promise<Promotion[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/promotions`, {
    credentials: "include",
    cache: "no-store",
  });
  return (await ensureOk(res)) as Promotion[];
}

export async function collectPromotion(id: number): Promise<Promotion> {
  const res = await fetch(`${API_BASE_URL}/api/user/promotions/collect/${id}`, {
    method: "POST",
    credentials: "include",
  });
  return (await ensureOk(res)) as Promotion;
}

export async function fetchMyPromotions(): Promise<Promotion[]> {
  const res = await fetch(`${API_BASE_URL}/api/user/my-promotions`, {
    credentials: "include",
    cache: "no-store",
  });
  return (await ensureOk(res)) as Promotion[];
}

// Admin Promotions
export async function adminFetchPromotions(): Promise<Promotion[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/promotions`, {
    credentials: "include",
    cache: "no-store",
  });
  return (await ensureOk(res)) as Promotion[];
}

export async function adminCreatePromotion(data: PromotionRequest): Promise<Promotion> {
  const res = await fetch(`${API_BASE_URL}/api/admin/promotions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return (await ensureOk(res)) as Promotion;
}

export async function adminUpdatePromotion(id: number, data: PromotionRequest): Promise<Promotion> {
  const res = await fetch(`${API_BASE_URL}/api/admin/promotions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return (await ensureOk(res)) as Promotion;
}

export async function adminDeletePromotion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/promotions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await ensureOk(res);
}

export async function createVNPayPayment(orderId: number): Promise<{ data: string }> {
  const res = await fetch(`${API_BASE_URL}/api/payment/create-vnpay-payment/${orderId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return (await ensureOk(res)) as { data: string };
}

export async function checkout(data: {
  receiverName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/user/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return ensureOk(res);
}

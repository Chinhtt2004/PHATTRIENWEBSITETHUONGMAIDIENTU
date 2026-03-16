import type { Category, Product } from "@/lib/data";
import { cache } from "react";

// API base URL được lấy từ biến môi trường, mặc định là localhost
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

type ApiError = Error & { status?: number };

interface BackendCategory {
  id: number;
  name: string;
  description?: string | null;
}

interface BackendProductCategory {
  id: number;
  name: string;
  description?: string | null;
}

interface BackendProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  stockQuantity: number;
  imageUrl?: string | null;
  category?: BackendProductCategory | null;
  createdAt?: string;
}

interface BackendProductPage {
  content: BackendProduct[];
}

export interface BackendCartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
}

const categoryImages = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
];

/**
 * Tạo một đối tượng lỗi API với thông báo và mã trạng thái
 */
function createApiError(message: string, status?: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

/**
 * Phân tích phản hồi từ server dựa trên loại nội dung (JSON hoặc text)
 */
async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

/**
 * Kiểm tra phản hồi có thành công và ném lỗi nếu không
 */
async function ensureOk(res: Response) {
  const data = await parseResponse(res);
  if (!res.ok) {
    const message = typeof data === "string" ? data : data?.message || `Request failed with status ${res.status}`;
    throw createApiError(message, res.status);
  }
  return data;
}

/**
 * Chuyển đổi chuỗi thành định dạng URL-friendly (slug)
 */
function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Loại bỏ thẻ HTML từ chuỗi và xử lý khoảng trắng
 */
function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Rút gọn văn bản nếu vượt quá độ dài tối đa
 */
function summarize(text: string, maxLength = 110) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Chuyển đổi dữ liệu sản phẩm từ backend sang frontend
 */
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

/**
 * Chuyển đổi dữ liệu danh mục từ backend sang frontend
 */
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

/**
 * Lấy danh sách tất cả sản phẩm từ backend
 */
export async function fetchProducts(): Promise<Product[]> {
  const params = new URLSearchParams({ page: "0", size: "100", sortBy: "id", sortDir: "desc" });
  const res = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendProductPage;
  return (data.content || []).map(mapBackendProduct);
}

/**
 * Lấy danh sách danh mục sản phẩm với số lượng sản phẩm
 */
export async function fetchCategories(products?: Product[]): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/categories`, { cache: "no-store" });
  const data = (await ensureOk(res)) as BackendCategory[];
  const counts = new Map<string, number>();

  for (const product of products || []) {
    counts.set(product.categoryId, (counts.get(product.categoryId) || 0) + 1);
  }

  return data.map((category, index) => mapBackendCategory(category, counts.get(String(category.id)) || 0, index));
}

/**
 * Lấy đầy đủ dữ liệu cửa hàng (sản phẩm và danh mục), có cache trong cùng một request
 */
export const fetchStorefrontData = cache(async () => {
  const products = await fetchProducts();
  const categories = await fetchCategories(products);
  return { products, categories };
});

/**
 * Đăng nhập người dùng với email và mật khẩu
 */
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/author/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return ensureOk(res);
}

/**
 * Đăng ký tài khoản người dùng mới
 */
export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/author/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "USER" }),
  });

  return ensureOk(res);
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export async function addToCart(productId: number, quantity: number) {
  const params = new URLSearchParams({ productId: String(productId), quantity: String(quantity) });
  const res = await fetch(`${API_BASE_URL}/api/user/cart?${params.toString()}`, {
    method: "POST",
    credentials: "include",
  });

  return ensureOk(res);
}

/**
 * Lấy danh sách các sản phẩm trong giỏ hàng
 */
export async function fetchCartItems(): Promise<BackendCartItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/user/cart`, {
    credentials: "include",
    cache: "no-store",
  });

  return ensureOk(res) as Promise<BackendCartItem[]>;
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
export async function removeCartItem(productId: number) {
  const res = await fetch(`${API_BASE_URL}/api/user/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return ensureOk(res);
}
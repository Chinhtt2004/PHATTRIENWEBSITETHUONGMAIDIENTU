"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ThumbsUp, BadgeCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { fetchReviewsByProduct, type ReviewResponse, type ReviewListResponse } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviewsData, setReviewsData] = useState<ReviewListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      try {
        const data = await fetchReviewsByProduct(productId, page, 5);
        setReviewsData(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [productId, page]);

  if (isLoading && !reviewsData) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-2xl">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review List */}
      <div className="divide-y divide-border">
        {reviewsData.reviews.map((review) => (
          <div key={review.id} className="py-6 first:pt-0">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {review.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{review.username}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    <BadgeCheck className="h-3 w-3" />
                    Đã mua hàng
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= review.rating ? "fill-warning text-warning" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(review.createdAt), "dd/MM/yyyy", { locale: vi })}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground mb-3 bg-muted/50 p-2 rounded inline-block">
                  Phân loại: {review.variant.attributeValues && review.variant.attributeValues.length > 0 
                    ? review.variant.attributeValues.map(av => av.value).join(" / ")
                    : review.variant.sku}
                </div>

                <p className="text-sm text-foreground leading-relaxed mb-4">
                  {review.comment}
                </p>

                {review.variant.imageUrl && (
                   <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border mb-4">
                      <Image
                        src={review.variant.imageUrl}
                        alt="Review image"
                        fill
                        className="object-cover"
                      />
                   </div>
                )}

                <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Hữu ích
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {reviewsData.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 0) setPage(page - 1);
                }}
                className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: reviewsData.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={page === i}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i);
                  }}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={(e) => {
                  e.preventDefault();
                  if (page < reviewsData.totalPages - 1) setPage(page + 1);
                }}
                className={page === reviewsData.totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

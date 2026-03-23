package com.tuongchinh.Entity;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> filter(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Long categoryId,
            Long brandId,
            Boolean inStock) {

        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            // Tìm theo tên
            if (keyword != null && !keyword.isBlank()) {
                predicate = cb.and(predicate,
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + keyword.toLowerCase() + "%"
                        )
                );
            }

            // Lọc theo danh mục
            if (categoryId != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("category").get("id"), categoryId)
                );
            }

            // Lọc theo thương hiệu
            if (brandId != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("brand").get("id"), brandId)
                );
            }

            // Lọc theo giá min — dùng subquery MIN(price) từ ProductVariant
            if (minPrice != null) {
                Subquery<BigDecimal> minPriceQuery = query.subquery(BigDecimal.class);
                Root<ProductVariant> variantRoot = minPriceQuery.from(ProductVariant.class);
                minPriceQuery
                        .select(cb.min(variantRoot.get("price")))
                        .where(
                                cb.equal(variantRoot.get("product"), root),
                                cb.isTrue(variantRoot.get("isActive"))
                        );
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(minPriceQuery, BigDecimal.valueOf(minPrice))
                );
            }

            // Lọc theo giá max
            if (maxPrice != null) {
                Subquery<BigDecimal> maxPriceQuery = query.subquery(BigDecimal.class);
                Root<ProductVariant> variantRoot = maxPriceQuery.from(ProductVariant.class);
                maxPriceQuery
                        .select(cb.min(variantRoot.get("price")))
                        .where(
                                cb.equal(variantRoot.get("product"), root),
                                cb.isTrue(variantRoot.get("isActive"))
                        );
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(maxPriceQuery, BigDecimal.valueOf(maxPrice))
                );
            }

            // Lọc chỉ còn hàng
            if (Boolean.TRUE.equals(inStock)) {
                Subquery<Integer> stockQuery = query.subquery(Integer.class);
                Root<ProductVariant> variantRoot = stockQuery.from(ProductVariant.class);
                stockQuery
                        .select(cb.sum(variantRoot.get("stock")))
                        .where(
                                cb.equal(variantRoot.get("product"), root),
                                cb.isTrue(variantRoot.get("isActive"))
                        );
                predicate = cb.and(predicate,
                        cb.greaterThan(stockQuery, 0)
                );
            }

            // Tránh duplicate khi JOIN
            query.distinct(true);

            return predicate;
        };
    }
}
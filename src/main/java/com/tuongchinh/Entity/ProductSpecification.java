package com.tuongchinh.Entity;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> filter(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Long categoryId) {

        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();
            if (keyword != null && !keyword.isEmpty()) {
                predicate = cb.and(predicate,
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + keyword.toLowerCase() + "%"
                        ));
            }

            if (minPrice != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("price"),
                                minPrice
                        ));
            }

            if (maxPrice != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(
                                root.get("price"),
                                maxPrice
                        ));
            }

            if (categoryId != null) {
                predicate = cb.and(predicate,
                        cb.equal(
                                root.get("category").get("id"),
                                categoryId
                        ));
            }

            return predicate;
        };
    }
}

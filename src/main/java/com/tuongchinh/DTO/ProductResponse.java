package com.tuongchinh.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;
    private String thumbnail;
    private List<String> images;
    private BigDecimal priceMin;
    private List<VariantResponse> variants;

    @Data
    public static class VariantResponse {
        private Long id;
        private String sku;
        private BigDecimal price;
        private Integer stock;
        private String imageUrl;
        private Boolean isActive;
        private BigDecimal discountPrice;   // ← thêm
        private BigDecimal effectivePrice;  // ← thêm
        private Integer discountPercent;    // ← thêm
    }
}

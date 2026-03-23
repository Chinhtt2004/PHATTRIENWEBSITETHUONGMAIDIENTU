package com.tuongchinh.Entity;

import lombok.Data;

import java.math.BigDecimal;

// Public — không có costPrice, profit, warning
@Data
public class SalePublicResponse {
    private Long variantId;
    private String sku;
    private String imageUrl;
    private Long productId;
    private String productName;
    private String brandName;
    private String thumbnail;
    private BigDecimal originalPrice;
    private BigDecimal discountPrice;
    private BigDecimal effectivePrice;
    private Integer discountPercent;
}


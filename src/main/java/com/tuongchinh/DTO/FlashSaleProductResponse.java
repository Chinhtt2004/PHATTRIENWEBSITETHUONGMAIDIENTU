package com.tuongchinh.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FlashSaleProductResponse {

    private Long id;
    private Long variantId;
    private String productName;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer quantity;

    private Integer soldQuantity;

    private Integer maxPerUser;

    private String image;
}
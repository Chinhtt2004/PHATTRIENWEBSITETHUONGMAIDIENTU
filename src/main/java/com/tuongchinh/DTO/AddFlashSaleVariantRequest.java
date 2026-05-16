package com.tuongchinh.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddFlashSaleVariantRequest {

    private Long variantId;
    private BigDecimal salePrice;
    private Integer quantity;
    private Integer maxPerUser;
}
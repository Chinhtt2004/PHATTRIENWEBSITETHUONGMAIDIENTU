package com.tuongchinh.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private Long brandId;
    private List<VariantRequest> variants;
    @Data
    public static class VariantRequest {
        private String sku;
        private BigDecimal price;
        private Integer stock;
    }
}
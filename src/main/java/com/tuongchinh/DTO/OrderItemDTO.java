package com.tuongchinh.DTO;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private Long variantId;
    private String sku;
    private String productName;
    private String variantName;
    private String imageUrl;
}

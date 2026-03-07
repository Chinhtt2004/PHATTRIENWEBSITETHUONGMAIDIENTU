package com.tuongchinh.DTO;

import lombok.Getter;
import lombok.Setter;

// CartItemDTO.java
@Getter
@Setter
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
}
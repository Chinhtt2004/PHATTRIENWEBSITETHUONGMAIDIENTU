package com.tuongchinh.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;

public class FlashSaleProduct {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    private FlashSale flashSale;
    @ManyToOne
    private ProductVariant variant;
    private BigDecimal salePrice;
    private Integer quantity;
    private Integer soldQuantity = 0;
}
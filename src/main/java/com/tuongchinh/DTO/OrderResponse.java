package com.tuongchinh.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Tạo OrderResponse DTO
@Data
public class OrderResponse {
    private Long id;
    private String orderStatus;
    private String paymentStatus;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private String receiverName;
    private String phone;
    private String paymentMethod;
    private LocalDateTime orderDate;
}

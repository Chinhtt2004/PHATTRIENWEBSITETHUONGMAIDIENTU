package com.tuongchinh.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime orderDate;
    @Column(name = "total_amount")
    private Double totalPrice;
    private String status;
    private String address;
    private String receiverName;
    private String phone;
    private String paymentMethod;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
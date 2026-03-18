package com.tuongchinh.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    private String type; // PERCENT hoặc FIXED

    private BigDecimal value;

    private BigDecimal minOrderValue;

    private BigDecimal maxDiscount;
}

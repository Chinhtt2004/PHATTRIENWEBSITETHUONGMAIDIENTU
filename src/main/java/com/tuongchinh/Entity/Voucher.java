package com.tuongchinh.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher")
@Data
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private BigDecimal value;

    @Column(nullable = false)
    private BigDecimal minOrderValue;

    private BigDecimal maxDiscount;

    private LocalDateTime expiryDate;

    private Integer usageLimit;

    private Integer usedCount = 0;

    private Boolean isActive = true;
}
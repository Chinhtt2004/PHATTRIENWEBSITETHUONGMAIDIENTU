package com.tuongchinh.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class FlashSale {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // UPCOMING, ACTIVE, EXPIRED
}
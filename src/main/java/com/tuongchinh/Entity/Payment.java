package com.tuongchinh.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    private Order order;

    private String method;
    private String status;
    private String transactionId;
}

package com.tuongchinh.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User user;

    private String receiverName;
    private String phone;
    private String address;
}

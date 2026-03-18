package com.tuongchinh.DTO;

import jakarta.persistence.Entity;

import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {
    private List<Long> cartItemIds;
    private String voucherCode;
    private String address;
    private String receiverName;
    private String phone;
    private String paymentMethod;
}

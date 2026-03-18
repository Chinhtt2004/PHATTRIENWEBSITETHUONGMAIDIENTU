package com.tuongchinh.Service;

import com.tuongchinh.DTO.AddToCartRequest;
import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.User;

public interface CartService {
    void addToCart(Long userId, Long productId, int quantity);
    Cart findCartByUserId(Long userId);
    void removeFromCart(Long userID, Long producID);
}

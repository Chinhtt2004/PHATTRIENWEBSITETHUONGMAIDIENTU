package com.tuongchinh.Repository;

import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.CartItem;
import com.tuongchinh.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndVariantId(Long cartId, Long variantId);
    void deleteByCartId(Long cartId);
    List<CartItem> findByCartId(Long cartID);
}

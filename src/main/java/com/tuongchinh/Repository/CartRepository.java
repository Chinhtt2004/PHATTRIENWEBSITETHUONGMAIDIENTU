package com.tuongchinh.Repository;

import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(Long userId);
}

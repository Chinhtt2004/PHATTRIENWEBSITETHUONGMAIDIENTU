package com.tuongchinh.Repository;

import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);

    // JOIN FETCH items và product của mỗi item trong 1 query → fix N+1 khi lấy giỏ hàng
    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Cart> findByUserId(Long userId);
}

package com.tuongchinh.Repository;

import com.tuongchinh.Entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = { "items", "address" })
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @EntityGraph(attributePaths = {
            "items",
            "address",
            "user",
            "user.cart",
            "items.variant",
            "items.variant.product"
    })
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.user.id = :userId")
    java.math.BigDecimal sumTotalAmountByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    List<Order> findAllByOrderByOrderDateDesc();
}

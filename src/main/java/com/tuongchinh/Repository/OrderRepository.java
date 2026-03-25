package com.tuongchinh.Repository;

import com.tuongchinh.Entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = {"items", "address"})
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @EntityGraph(attributePaths = {
            "items", 
            "address", 
            "user", 
            "items.variant", 
            "items.variant.product"
    })
    List<Order> findAllByOrderByOrderDateDesc();
}

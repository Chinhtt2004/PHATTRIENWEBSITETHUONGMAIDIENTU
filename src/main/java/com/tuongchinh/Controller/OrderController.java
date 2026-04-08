package com.tuongchinh.Controller;

import com.tuongchinh.DTO.CheckoutRequest;
import com.tuongchinh.DTO.OrderResponse;
import com.tuongchinh.DTO.OrderUptateStatusRequest;
import com.tuongchinh.Service.JwtService;
import com.tuongchinh.Service.OrderService;
import com.tuongchinh.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final JwtService jwtService;

    // POST /api/orders/checkout
    @PostMapping("user/orders/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @RequestBody CheckoutRequest req,
            HttpServletRequest request) {
        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);
        OrderResponse response = orderService.checkout(userId, req, request);
        return ResponseEntity.ok(response);
    }

    // GET /api/user/orders
    @GetMapping("user/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            HttpServletRequest request) {
        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // GET /api/user/orders/{id}
    @GetMapping("user/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderDetail(
            HttpServletRequest request,
            @PathVariable Long id) {
        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);
        return ResponseEntity.ok(orderService.getOrderDetail(userId, id));
    }

    // PUT /api/user/orders/{id}/cancel
    @PutMapping("/user/orders/cancel/{id}")
    public ResponseEntity<OrderResponse> cancelOrder(
            HttpServletRequest request,
            @PathVariable Long id) {
        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);
        return ResponseEntity.ok(orderService.cancelOrder(userId, id));
    }

    // =====================
    // ADMIN ENDPOINTS
    // =====================

    @GetMapping("/admin/orders/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/admin/orders/user/{userId}")
    public ResponseEntity<List<OrderResponse>> adminGetOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/admin/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/admin/orders/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @RequestBody OrderUptateStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(request));
    }
}
package com.tuongchinh.Controller;

import com.tuongchinh.DTO.LoginRequest;
import com.tuongchinh.Entity.Order;
import com.tuongchinh.Service.JwtService;
import com.tuongchinh.Service.OrderService;
import com.tuongchinh.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody LoginRequest.CheckoutRequest request,
            HttpServletRequest servletRequest) {
        Long userId = getCurrentUserId(servletRequest);
        Order order = orderService.checkout(userId, request);
        return ResponseEntity.ok(order);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = userService.extractToken(request);
        if (token == null)
            throw new RuntimeException("Unauthorized");
        return jwtService.extractUserId(token);
    }
}

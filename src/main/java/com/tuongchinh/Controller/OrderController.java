package com.tuongchinh.Controller;

import com.tuongchinh.DTO.CheckoutRequest;
import com.tuongchinh.DTO.OrderResponse;
import com.tuongchinh.Service.JwtService;
import com.tuongchinh.Service.OrderService;
import com.tuongchinh.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final JwtService jwtService;

    // POST /api/orders/checkout
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @RequestBody CheckoutRequest req,
            HttpServletRequest request
    ) {
        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);
        OrderResponse response = orderService.checkout(userId, req);
        return ResponseEntity.ok(response);
    }

    // GET /api/orders
//    @GetMapping
//    public ResponseEntity<List<OrderResponse>> getMyOrders(
//            @AuthenticationPrincipal UserDetails userDetails
//    ) {
//        Long userId = userService.findByEmail(userDetails.getUsername()).getId();
//        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
//    }

    // GET /api/orders/{id}
//    @GetMapping("/{id}")
//    public ResponseEntity<OrderResponse> getOrderDetail(
//            @AuthenticationPrincipal UserDetails userDetails,
//            @PathVariable Long id
//    ) {
//        Long userId = userService.findByEmail(userDetails.getUsername()).getId();
//        return ResponseEntity.ok(orderService.getOrderDetail(userId, id));
//    }

    // PUT /api/orders/{id}/cancel
//    @PutMapping("/{id}/cancel")
//    public ResponseEntity<OrderResponse> cancelOrder(
//            @AuthenticationPrincipal UserDetails userDetails,
//            @PathVariable Long id
//    ) {
//        Long userId = userService.findByEmail(userDetails.getUsername()).getId();
//        return ResponseEntity.ok(orderService.cancelOrder(userId, id));
//    }
}
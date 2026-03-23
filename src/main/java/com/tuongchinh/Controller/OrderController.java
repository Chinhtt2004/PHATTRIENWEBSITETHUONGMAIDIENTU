//package com.tuongchinh.Controller;
//
//import com.tuongchinh.DTO.CheckoutRequest;
//import com.tuongchinh.DTO.LoginRequest;
//import com.tuongchinh.DTO.OrderResponse;
//import com.tuongchinh.Entity.Order;
//import com.tuongchinh.Service.JwtService;
//import com.tuongchinh.Service.OrderService;
//import com.tuongchinh.Service.UserService;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//@CrossOrigin
//public class OrderController {
//    private final OrderService orderService;
//    private final UserService userService;
//    private final JwtService jwtService;
//    @PostMapping("user/oders/checkout")
//    public ResponseEntity<?> checkout(HttpServletRequest request, @RequestBody CheckoutRequest req) {
//        try {
//            String token = userService.extractToken(request);
//            Long userId = jwtService.extractUserId(token);
//            return ResponseEntity.ok(orderService.checkout(userId, req));
//        } catch (Exception e) {
//            e.printStackTrace(); // ✅ in lỗi thật ra console
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//}
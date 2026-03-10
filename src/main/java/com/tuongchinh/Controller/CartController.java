package com.tuongchinh.Controller;
import com.tuongchinh.DTO.CartItemDTO;
import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Service.JwtService;
import com.tuongchinh.Service.CartService;
import com.tuongchinh.Service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final JwtService jwtService;
    private final UserService userService;
    @PostMapping
    public ResponseEntity<?> addToCart(
            @RequestParam Long productId,
            @RequestParam int quantity,
            HttpServletRequest request
    ) {

        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);

        cartService.addToCart(userId, productId, quantity);

        return ResponseEntity.ok("Thêm vào giỏ hàng thành công");
    }

    // Controller
    @GetMapping
    public ResponseEntity<?> getMyCart(HttpServletRequest request) {
        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);
        Cart cart = cartService.findCartByUserId(userId);

        List<CartItemDTO> result = cart.getItems().stream()
                .map(item -> {
                    CartItemDTO dto = new CartItemDTO();
                    dto.setId(item.getId());
                    dto.setProductId(item.getProduct().getId());
                    dto.setProductName(item.getProduct().getName());
                    dto.setQuantity(item.getQuantity());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long productId,
            HttpServletRequest request
    ) {

        String token = userService.extractToken(request);
        Long userId = jwtService.extractUserId(token);

        cartService.moveFromCart(userId, productId);

        return ResponseEntity.ok("Removed successfully");
    }

}
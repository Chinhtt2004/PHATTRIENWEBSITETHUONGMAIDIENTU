package com.tuongchinh.Service;

import com.tuongchinh.DTO.LoginRequest;
import com.tuongchinh.Entity.*;
import com.tuongchinh.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserService userService;

    @Transactional
    public Order checkout(Long userId, LoginRequest.CheckoutRequest request) {
        User user = userService.findById(userId);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống");
        }

        Order order = new Order();
        order.setUser(user);
        order.setReceiverName(request.getReceiverName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            BigDecimal itemPrice = cartItem.getProduct().getPrice().multiply(new BigDecimal(cartItem.getQuantity()));
            totalPrice = totalPrice.add(itemPrice);
        }
        order.setTotalPrice(totalPrice.doubleValue());
        orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice().doubleValue());
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByCartId(cart.getId());
        return order;
    }
}
//package com.tuongchinh.Service;
//
//import com.tuongchinh.DTO.LoginRequest;
//import com.tuongchinh.Entity.*;
//import com.tuongchinh.Repository.*;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class OrderService {
//    private final CartItemRepository cartItemRepository;
//    private final CartRepository cartRepository;
//    private final OrderRepository orderRepository;
//    private final OrderItemRepository orderItemRepository;
//    private final ProductRepository productRepository;
//    private final UserService userService;
//
//    @Transactional
//    public Order checkout(Long userId, LoginRequest.CheckoutRequest request) {
//        User user=userService.findById(userId);
//        Cart cart=cartRepository.findByUserId(userId).orElseThrow(()->new RuntimeException("Không tìm thấy"));
//        List<CartItem> cartItems = cartItemRepository.findByCarId(cart.getId());
//        if(cartItems.isEmpty()){
//            throw new RuntimeException("Cart is empty");
//        }
//        Order order= new Order();
//        order.setUser(user);
//        order.setReceiverName(request.getReceiverName());
//        order.setPhone(request.getPhone());
//        order.setAddress(request.getShippingAddress());
//        order.setPaymentMethod(request.getPaymentMethod());
//        orderRepository.save(order);
//        for(CartItem cartItem : cartItems){
//            Product product = productRepository.findById(cartItem.getProductId())
//                    .orElseThrow();
//            OrderItem orderItem = new OrderItem();
//            orderItem.setOrder(order);
//            orderItem.setProduct(product);
//            orderItem.setQuantity(cartItem.getQuantity());
//            orderItem.setPrice(product.getPrice());
//            orderItemRepository.save(orderItem);
//        }
//        cartItemRepository.deleteAll(cartItems);
//        return order;
//    }
//}
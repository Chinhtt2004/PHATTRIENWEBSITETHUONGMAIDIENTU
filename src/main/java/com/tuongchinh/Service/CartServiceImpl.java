//package com.tuongchinh.Service;
//
//import com.tuongchinh.DTO.AddToCartRequest;
//import com.tuongchinh.Entity.Cart;
//import com.tuongchinh.Entity.CartItem;
//import com.tuongchinh.Entity.Product;
//import com.tuongchinh.Repository.CartItemRepository;
//import com.tuongchinh.Repository.CartRepository;
//import com.tuongchinh.Repository.ProductRepository;
//import com.tuongchinh.Repository.UserRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import com.tuongchinh.Entity.User;
//
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class CartServiceImpl implements CartService {
//
//    private final UserService userService;
////    private final ProductService productService;
//    private final CartRepository cartRepository;
//    private final CartItemRepository cartItemRepository;
//
//    @Override
//    public void addToCart(Long userId, Long productId, int quantity) {
//
//        // 1️⃣ Lấy user
//        User user = userService.findById(userId);
//
//        // 2️⃣ Lấy cart của user (hoặc tạo mới nếu chưa có)
//        Cart cart = cartRepository.findByUser(user)
//                .orElseGet(() -> {
//                    Cart newCart = new Cart();
//                    newCart.setUser(user);
//                    return cartRepository.save(newCart);
//                });
//
//        // 3️⃣ Lấy product
//        Product product = productService.findById(productId);
//
//        // 4️⃣ Kiểm tra CartItem đã tồn tại chưa
//        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
//
//        if (existingItem.isPresent()) {
//            // Nếu đã có → tăng số lượng
//            CartItem item = existingItem.get();
//            item.setQuantity(item.getQuantity() + quantity);
//            cartItemRepository.save(item);
//        } else {
//            // Nếu chưa có → tạo mới
//            CartItem item = new CartItem();
//            item.setCart(cart);
//            item.setProduct(product);
//            item.setQuantity(quantity);
//            cartItemRepository.save(item);
//        }
//    }
//    @Override
//    public Cart findCartByUserId(Long userId) {
//        return cartRepository.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy cart của user: " + userId));
//    }
//
//}

package com.tuongchinh.Service;

import com.tuongchinh.DTO.AddToCartRequest;
import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.CartItem;
import com.tuongchinh.Entity.Product;
import com.tuongchinh.Repository.CartItemRepository;
import com.tuongchinh.Repository.CartRepository;
import com.tuongchinh.Repository.ProductRepository;
import com.tuongchinh.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.tuongchinh.Entity.User;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final UserService userService;
    private final ProductService productService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public void addToCart(Long userId, Long productId, int quantity) {
        User user = userService.findById(userId);
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        Product product = productService.findById(productId);
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }
    @Override
    public Cart findCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cart của user: " + userId));
    }
    @Override
    public void moveFromCart(Long userid, Long productid){
        Cart cart=cartRepository.findByUserId(userid).orElseThrow(()->new RuntimeException("Cart not found"));
        Product product=productService.findById(productid);
        CartItem cartItem=cartItemRepository.findByCartAndProduct(cart,product).orElseThrow(()->new RuntimeException("cart not found"));
        cartItemRepository.delete(cartItem);

    }

}

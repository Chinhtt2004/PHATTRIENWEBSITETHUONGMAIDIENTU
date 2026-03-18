package com.tuongchinh.Service;

import com.tuongchinh.DTO.CheckoutRequest;
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
    private final ProductRepository productRepository;
    private final UserService userService;
    private final VoucherRepository voucherRepository;


    @Transactional
    public Order checkout(Long userId, CheckoutRequest req) {

        // 1. Lấy cart items theo id
        List<CartItem> cartItems = cartItemRepository.findAllById(req.getCartItemIds());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items selected");
        }

        // 2. Check quyền + tồn kho
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {

            // check user
            if (!item.getCart().getUser().getId().equals(userId)) {
                throw new RuntimeException("Invalid cart item");
            }

            Product product = item.getProduct();

            // check stock
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Product " + product.getName() + " out of stock");
            }

            // trừ kho
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());

            // tính tiền
            BigDecimal price = product.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());

            total = total.add(price.multiply(quantity));
        }

        // 3. Áp voucher (nếu có)
        BigDecimal discount = BigDecimal.ZERO;

        if (req.getVoucherCode() != null && !req.getVoucherCode().isEmpty()) {

            Voucher voucher = voucherRepository.findByCode(req.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            // check điều kiện
            if (total.compareTo(voucher.getMinOrderValue()) < 0) {
                throw new RuntimeException("Not enough to apply voucher");
            }

            // tính giảm
            if (voucher.getType().equals("PERCENT")) {
                discount = total.multiply(voucher.getValue())
                        .divide(BigDecimal.valueOf(100));
            } else {
                discount = voucher.getValue();
            }

            // max discount
            if (voucher.getMaxDiscount() != null &&
                    discount.compareTo(voucher.getMaxDiscount()) > 0) {
                discount = voucher.getMaxDiscount();
            }

            total = total.subtract(discount);
        }

        // 4. Tạo Order
        Order order = new Order();
        order.setUser(userService.findById(userId));
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setAddress(req.getAddress());
        order.setReceiverName(req.getReceiverName());
        order.setPhone(req.getPhone());
        order.setPaymentMethod(req.getPaymentMethod());
        order.setTotalPrice(total);

        orderRepository.save(order);

        // 5. Tạo OrderItem
        for (CartItem item : cartItems) {

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());

            orderItemRepository.save(orderItem);
        }
        // 6. Xóa cart item đã mua
        cartItemRepository.deleteAll(cartItems);
        return order;
    }
}
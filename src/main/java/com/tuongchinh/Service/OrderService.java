package com.tuongchinh.Service;

import com.tuongchinh.DTO.CheckoutRequest;
import com.tuongchinh.DTO.OrderResponse;
import com.tuongchinh.Entity.*;
import com.tuongchinh.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public OrderResponse checkout(Long userId, CheckoutRequest req) {

        // 1. Lấy cart items
        List<CartItem> cartItems = cartItemRepository.findAllById(req.getCartItemIds());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items selected");
        }

        BigDecimal total = BigDecimal.ZERO;

        // 2. Kiểm tra và tính tiền
        for (CartItem item : cartItems) {

            if (!item.getCart().getUser().getId().equals(userId)) {
                throw new RuntimeException("Invalid cart item");
            }

            Product product = item.getProduct();

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Product " + product.getName() + " out of stock");
            }

            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal price = product.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());
            total = total.add(price.multiply(quantity));
        }

        // 3. Áp voucher (nếu có)
        if (req.getVoucherCode() != null && !req.getVoucherCode().isEmpty()) {

            Voucher voucher = voucherRepository.findByCode(req.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            if (voucher.getExpiryDate() != null &&
                    voucher.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher expired");
            }

            if (total.compareTo(voucher.getMinOrderValue()) < 0) {
                throw new RuntimeException("Order value not enough to apply voucher");
            }

            BigDecimal discount;
            if (voucher.getType().equals("PERCENT")) {
                discount = total
                        .multiply(voucher.getValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else {
                discount = voucher.getValue();
            }

            if (voucher.getMaxDiscount() != null &&
                    discount.compareTo(voucher.getMaxDiscount()) > 0) {
                discount = voucher.getMaxDiscount();
            }

            total = total.subtract(discount);
        }

        // 4. Tạo Order
        Order order = new Order();
        order.setUser(userService.findById(userId));
        order.setTotalPrice(total);
        order.setOrderStatus("PENDING");
        order.setPaymentStatus("UNPAID");
        order.setShippingAddress(req.getAddress());
        order.setReceiverName(req.getReceiverName());
        order.setPhone(req.getPhone());
        order.setPaymentMethod(req.getPaymentMethod());

        orderRepository.save(order);

        // 5. Tạo OrderItems
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());
            orderItems.add(orderItem);
        }
        orderItemRepository.saveAll(orderItems);

        // 6. Xóa cart items đã mua
        cartItemRepository.deleteAll(cartItems);

        // 7. Map sang DTO và trả về
        return mapToOrderResponse(order);
    }

    // ✅ Hàm map Order -> OrderResponse
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderStatus(order.getOrderStatus());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setTotalPrice(order.getTotalPrice());
        res.setShippingAddress(order.getShippingAddress());
        res.setReceiverName(order.getReceiverName());
        res.setPhone(order.getPhone());
        res.setOrderDate(order.getOrderDate());
        return res;
    }
}
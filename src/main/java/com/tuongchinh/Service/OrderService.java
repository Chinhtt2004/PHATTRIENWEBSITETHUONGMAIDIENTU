package com.tuongchinh.Service;

import com.tuongchinh.DTO.CheckoutRequest;
import com.tuongchinh.DTO.OrderResponse;
import com.tuongchinh.Entity.*;
import com.tuongchinh.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserService userService;
    private final VoucherRepository voucherRepository;
    private final VoucherUsageRepository voucherUsageRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest req) {
        validateCheckoutRequest(req);
        List<CartItem> cartItems = cartItemRepository.findAllById(req.getCartItemIds());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items selected");
        }
        Address address;
        if (req.getAddressId() != null) {
           address = addressRepository.findById(req.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            if (!address.getUser().getId().equals(userId)) {
                throw new RuntimeException("Address does not belong to user");
            }

        } else {
            address = addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .orElseThrow(() -> new RuntimeException("No default address found"));
        }

        BigDecimal total = BigDecimal.ZERO;

        // 3. Kiểm tra variant và tính tiền
        for (CartItem item : cartItems) {
            if (!item.getCart().getUser().getId().equals(userId)) {
                throw new RuntimeException("Invalid cart item");
            }
            ProductVariant variant = item.getVariant();
            if (variant == null) {
                throw new RuntimeException("Cart item missing product variant");
            }
            if (!Boolean.TRUE.equals(variant.getIsActive())) {
                throw new RuntimeException("Variant " + variant.getSku() + " is no longer available");
            }

            // stock dùng đúng tên field "stock" theo entity
            if (variant.getStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Product " + variant.getProduct().getName()
                                + " (SKU: " + variant.getSku() + ") out of stock"
                );
            }

            variant.setStock(variant.getStock() - item.getQuantity());
            productVariantRepository.save(variant);

            // Dùng getEffectivePrice() → ưu tiên discountPrice nếu có
            BigDecimal price = variant.getEffectivePrice();
            total = total.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // 4. Áp voucher (nếu có)
        Voucher appliedVoucher = null;
        if (req.getVoucherCode() != null && !req.getVoucherCode().isBlank()) {

            Voucher voucher = voucherRepository.findByCode(req.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            // Dùng isValid() có sẵn trong entity
            if (!voucher.isValid()) {
                throw new RuntimeException("Voucher is invalid or expired");
            }

            // Kiểm tra user đã dùng chưa
            if (voucherUsageRepository.existsByVoucherIdAndUserId(voucher.getId(), userId)) {
                throw new RuntimeException("You have already used this voucher");
            }

            // Kiểm tra giá trị đơn tối thiểu
            if (total.compareTo(voucher.getMinOrderValue()) < 0) {
                throw new RuntimeException(
                        "Minimum order value is " + voucher.getMinOrderValue() + " to apply this voucher"
                );
            }

            BigDecimal discount;
            switch (voucher.getType()) {
                case "PERCENT" -> {
                    discount = total.multiply(voucher.getValue())
                            .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                }
                case "FIXED" -> {
                    discount = voucher.getValue();
                }
                case "SHIPPING" -> {
                    // Phí ship xử lý riêng — tạm thời bỏ qua hoặc trừ thẳng
                    discount = voucher.getValue();
                }
                default -> throw new RuntimeException("Unknown voucher type: " + voucher.getType());
            }

            // Giới hạn maxDiscount
            if (voucher.getMaxDiscount() != null &&
                    discount.compareTo(voucher.getMaxDiscount()) > 0) {
                discount = voucher.getMaxDiscount();
            }

            total = total.subtract(discount).max(BigDecimal.ZERO); // không để total âm

            // Cập nhật usedCount
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);

            appliedVoucher = voucher;
        }

        // 5. Tạo Order
        Order order = new Order();
        order.setUser(userService.findById(userId));
        order.setTotalAmount(total);
        order.setOrderStatus("PENDING");
        order.setStatus("UNPAID");
        order.setAddress(address);
        order.setPaymentMethod(req.getPaymentMethod());
        orderRepository.save(order);

        // 6. Tạo OrderItems
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            ProductVariant variant = item.getVariant();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setVariant(item.getVariant());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(variant.getEffectivePrice()); // snapshot giá tại thời điểm mua
            orderItems.add(orderItem);
        }
        orderItemRepository.saveAll(orderItems);

        // 7. Lưu lịch sử dùng voucher
        if (appliedVoucher != null) {
            VoucherUsage usage = new VoucherUsage();
            usage.setVoucher(appliedVoucher);
            usage.setUserId(userId);
            usage.setUsedAt(LocalDateTime.now());
            voucherUsageRepository.save(usage);
        }

        // 8. Xóa cart items đã mua
        cartItemRepository.deleteAll(cartItems);

        return mapToOrderResponse(order);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderStatus(order.getOrderStatus());
        res.setPaymentStatus(order.getStatus());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setTotalPrice(order.getTotalAmount());
        res.setOrderDate(order.getOrderDate());
        // Lấy từ Address entity
        res.setShippingAddress(order.getAddress().getAddress());
        res.setReceiverName(order.getAddress().getReceiverName());
        res.setPhone(order.getAddress().getPhone());
        return res;
    }
    private void validateCheckoutRequest(CheckoutRequest req) {
        if (req.getPaymentMethod() == null || req.getPaymentMethod().isBlank()) {
            throw new RuntimeException("Payment method is required");
        }
        List<String> allowedMethods = List.of("COD", "VNPAY", "MOMO");
        if (!allowedMethods.contains(req.getPaymentMethod().toUpperCase())) {
            throw new RuntimeException("Invalid payment method: " + req.getPaymentMethod());
        }
    }
}
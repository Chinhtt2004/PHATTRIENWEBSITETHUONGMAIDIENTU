package com.tuongchinh.Service;

import com.tuongchinh.DTO.CheckoutRequest;
import com.tuongchinh.DTO.OrderItemDTO;
import com.tuongchinh.DTO.OrderResponse;
import com.tuongchinh.DTO.OrderUptateStatusRequest;
import com.tuongchinh.Entity.*;
import com.tuongchinh.Repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

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
    private final PaymentService paymentService;
    private final ProductRepository productRepository;
    private final FlashSaleProductRepository flashSaleProductRepository;

    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest req, HttpServletRequest request) {
        validateCheckoutRequest(req);
        List<CartItem> cartItems = cartItemRepository.findAllByIdIn(req.getCartItemIds());
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
                                + " (SKU: " + variant.getSku() + ") out of stock");
            }

            variant.setStock(variant.getStock() - item.getQuantity());
            productVariantRepository.save(variant);

            // Dùng getEffectivePrice() → ưu tiên discountPrice nếu có
            BigDecimal price = variant.getEffectivePrice();
            total = total.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));

            // Tăng soldQuantity cho Flash Sale nếu có
            java.util.Optional<FlashSaleProduct> activeFlashSale = flashSaleProductRepository.findActiveByVariantId(variant.getId());
            if (activeFlashSale.isPresent()) {
                FlashSaleProduct fsp = activeFlashSale.get();
                fsp.setSoldQuantity(fsp.getSoldQuantity() + item.getQuantity());
                flashSaleProductRepository.save(fsp);
            }
        }

        // 4. Áp voucher (nếu có)
        Voucher appliedVoucher = null;
        if (req.getVoucherCode() != null && !req.getVoucherCode().trim().isEmpty()) {

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
                        "Minimum order value is " + voucher.getMinOrderValue() + " to apply this voucher");
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
        cartItemRepository.deleteAll(cartItems);

        String paymentResult;
        try {
            paymentResult = paymentService.processPayment(
                    order,
                    req.getPaymentMethod(),
                    request // ⚠️ cần truyền HttpServletRequest
            );
        } catch (Exception e) {
            throw new RuntimeException("Payment error: " + e.getMessage());
        }

        // 10. Trả về response
        OrderResponse response = mapToOrderResponse(order);
        if ("VNPAY".equals(req.getPaymentMethod())) {
            response.setPaymentUrl(paymentResult);
        }
        return response;
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(OrderUptateStatusRequest request) {
        Order order = orderRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(request.getStatus());
        if (request.getStatus().equals("DELIVERED")) {
            order.setStatus("PAID");
            updateSoldCount(order);
        }
        return mapToOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public void updateSoldCount(Order order) {
        if (order.getIsSoldCountUpdated() != null && order.getIsSoldCountUpdated()) {
            return; // Already updated
        }

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                ProductVariant variant = item.getVariant();
                Product product = variant.getProduct();
                int quantity = item.getQuantity();

                // update variant
                int vSold = (variant.getTotalSold() == null) ? 0 : variant.getTotalSold();
                variant.setTotalSold(vSold + quantity);
                variant.setStock(variant.getStock()-item.getQuantity());
                productVariantRepository.save(variant);

                // update product
                int pSold = (product.getTotalSold() == null) ? 0 : product.getTotalSold();
                product.setTotalSold(pSold + quantity);
                productRepository.save(product);
            }
        }
        order.setIsSoldCountUpdated(true);
        orderRepository.save(order);
    }

    public OrderResponse getOrderDetail(Long userId, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to order");
        }
        return mapToOrderResponse(order);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long userId, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to order");
        }
        if (!"PENDING".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }
        order.setOrderStatus("CANCELLED");
        return mapToOrderResponse(orderRepository.save(order));
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderStatus(order.getOrderStatus());
        res.setPaymentStatus(order.getStatus());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setTotalPrice(order.getTotalAmount());
        res.setOrderDate(order.getOrderDate());
        res.setDiscountAmount(order.getDiscountAmount());
        if (order.getVoucher() != null) {
            res.setVoucherCode(order.getVoucher().getCode());
        }
        // Lấy từ Address entity
        if (order.getAddress() != null) {
            res.setShippingAddress(order.getAddress().getAddress());
            res.setReceiverName(order.getAddress().getReceiverName());
            res.setPhone(order.getAddress().getPhone());
        }
        if (order.getItems() != null) {
            res.setItems(order.getItems().stream().map(item -> {
                OrderItemDTO dto = new OrderItemDTO();
                dto.setId(item.getId());
                dto.setQuantity(item.getQuantity());
                dto.setPrice(item.getPrice());
                if (item.getVariant() != null) {
                    ProductVariant v = item.getVariant();
                    dto.setVariantId(v.getId());
                    dto.setSku(v.getSku());
                    if (v.getProduct() != null) {
                        dto.setProductId(v.getProduct().getId());
                        dto.setProductName(v.getProduct().getName());
                    }
                    // For variant name, we can use attribute values if available
                    // For now, let's keep it simple or join attribute names
                    dto.setVariantName(v.getSku()); // Fallback to SKU
                    dto.setImageUrl(v.getImageUrl());
                }
                return dto;
            }).collect(Collectors.toList()));
        }
        return res;
    }

    private void validateCheckoutRequest(CheckoutRequest req) {
        if (req.getPaymentMethod() == null || req.getPaymentMethod().trim().isEmpty()) {
            throw new RuntimeException("Payment method is required");
        }
        List<String> allowedMethods = Arrays.asList("COD", "VNPAY", "MOMO");
        if (!allowedMethods.contains(req.getPaymentMethod().toUpperCase())) {
            throw new RuntimeException("Invalid payment method: " + req.getPaymentMethod());
        }
    }
}
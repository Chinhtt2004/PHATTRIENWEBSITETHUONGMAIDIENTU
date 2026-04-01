package com.tuongchinh.Service;
import com.tuongchinh.Entity.Order;
import com.tuongchinh.Entity.Payment;
import com.tuongchinh.Enum.PaymentStatus;
import com.tuongchinh.Repository.OrderRepository;
import com.tuongchinh.Repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final VNPayService vnPayService;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, VNPayService vnPayService, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.vnPayService = vnPayService;
        this.orderRepository=orderRepository;
    }
    public String processPayment(Order order, String method, HttpServletRequest request) throws Exception {

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setMethod(method);
        payment.setStatus("PENDING");

        paymentRepository.save(payment);

        if ("VNPAY".equals(method)) {
            return vnPayService.createPaymentUrl(
                    order.getId(),
                    order.getTotalAmount(),
                    request
            );
        }

        if ("COD".equals(method)) {
            payment.setStatus("SUCCESS");
            order.setOrderStatus("PAID");
            return "COD_SUCCESS";
        }

        throw new RuntimeException("Unsupported payment");
    }
    public String handleVNPayCallback(Map<String, String> params) throws Exception {

        boolean isValid = vnPayService.verifySignature(params);

        if (!isValid) {
            throw new RuntimeException("Invalid signature");
        }
        String responseCode = params.get("vnp_ResponseCode");
        Long orderId = Long.valueOf(params.get("vnp_TxnRef"));

        Order order = orderRepository.findById(orderId).orElseThrow();

        // tránh update lại nhiều lần
        if ("PAID".equals(order.getStatus())) {
            return "SUCCESS";
        }

        if ("00".equals(responseCode)) {
            order.setStatus("PAID");
            order.setOrderStatus("CONFIRMED");
//            order.setPaymentTransactionId(params.get("vnp_TransactionNo"));
            orderRepository.save(order);
            return "SUCCESS";
        } else {
//            order.setPaymentStatus("FAILED");
            order.setOrderStatus("PENDING");

            orderRepository.save(order);
            return "FAILED";
        }
    }
}

package com.tuongchinh.Service;
import com.tuongchinh.Entity.Order;
import com.tuongchinh.Enum.PaymentStatus;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    public PaymentStatus initialStatus(String method) {
        if (method.equalsIgnoreCase("COD")) {
            return PaymentStatus.UNPAID;
        }
        return PaymentStatus.PENDING;
    }

    public void handlePaymentSuccess(Order order) {
        order.setStatus(String.valueOf(PaymentStatus.PAID));
    }

    public void handlePaymentFailed(Order order) {
        order.setStatus(String.valueOf(PaymentStatus.FAILED));
    }
}

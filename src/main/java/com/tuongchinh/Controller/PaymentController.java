package com.tuongchinh.Controller;

import com.tuongchinh.Entity.Order;
import com.tuongchinh.Repository.OrderRepository;
import com.tuongchinh.config.VNPAYConfig;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPAYConfig vnpayConfig;
    private final OrderRepository orderRepository;

    @GetMapping("/create-vnpay-payment/{orderId}")
    public ResponseEntity<?> createPayment(HttpServletRequest req, @PathVariable("orderId") Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = (long) (order.getTotalPrice() * 100);
        String bankCode = req.getParameter("bankCode");

        String vnp_TxnRef = vnpayConfig.getRandomNumber(8);
        String vnp_IpAddr = vnpayConfig.getIpAddress(req);

        String vnp_TmnCode = vnpayConfig.getTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = req.getParameter("language");
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }
        vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data (Align with sample)
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = vnpayConfig.hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnpayConfig.getPayUrl() + "?" + queryUrl;

        return ResponseEntity.ok(Map.of("status", "OK", "message", "Successfully", "data", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> callback(@RequestParam Map<String, String> queryParams) {
        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        queryParams.remove("vnp_SecureHashType");
        queryParams.remove("vnp_SecureHash");

        // Sort parameters
        List<String> fieldNames = new ArrayList<>(queryParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = queryParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                // VERY IMPORTANT: Encode the value before hashing for callback too
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String checkSum = vnpayConfig.hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
        if (checkSum.equalsIgnoreCase(vnp_SecureHash)) {
            String orderInfo = queryParams.get("vnp_OrderInfo");
            // Parsing "Thanh toan don hang [orderId]" or "Thanh toan don hang :[orderId]"
            String[] parts = orderInfo.split(" ");
            String lastPart = parts[parts.length - 1].replaceAll("[^0-9]", "");
            Long orderId = Long.parseLong(lastPart);

            Order order = orderRepository.findById(orderId).orElse(null);
            if (order != null && "00".equals(queryParams.get("vnp_ResponseCode"))) {
                order.setStatus("PAID");
                orderRepository.save(order);
                return ResponseEntity.ok(Map.of("status", "OK", "message", "Payment successful"));
            } else {
                return ResponseEntity.ok(Map.of("status", "FAILED", "message", "Payment failed or order not found"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", "Invalid checksum"));
        }
    }
}

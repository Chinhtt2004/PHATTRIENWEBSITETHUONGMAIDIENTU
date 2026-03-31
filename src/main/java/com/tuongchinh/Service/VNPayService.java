package com.tuongchinh.Service;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.hashSecret}")
    private String hashSecret;

    @Value("${vnpay.payUrl}")
    private String payUrl;

    @Value("${vnpay.returnUrl}")
    private String returnUrl;

    // 🔥 Tạo URL thanh toán
    public String createPaymentUrl(Long orderId, BigDecimal amount, HttpServletRequest request) throws Exception {

        String vnp_TxnRef = String.valueOf(orderId);
        String vnp_OrderInfo = "Thanh toan don hang " + orderId;
        String vnp_Amount = amount.multiply(new BigDecimal(100)).toString();

        String vnp_IpAddr = request.getRemoteAddr();

        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss")
                .format(new Date());

        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", vnp_Amount);
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", vnp_TxnRef);
        params.put("vnp_OrderInfo", vnp_OrderInfo);
        params.put("vnp_OrderType", "other");

        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", vnp_IpAddr);

        params.put("vnp_CreateDate", vnp_CreateDate);

        // 🔥 sort param
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String value = params.get(fieldName);

            if (value != null && !value.isEmpty()) {

                hashData.append(fieldName)
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        // 🔐 tạo chữ ký
        String secureHash = hmacSHA512(hashSecret, hashData.toString());

        query.append("&vnp_SecureHash=").append(secureHash);

        return payUrl + "?" + query;
    }

    // 🔐 verify callback
    public boolean verifySignature(Map<String, String> params) throws Exception {

        String vnp_SecureHash = params.get("vnp_SecureHash");

        // remove hash khỏi params
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String value = params.get(fieldName);

            if (value != null && !value.isEmpty()) {
                hashData.append(fieldName)
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                }
            }
        }

        String calculatedHash = hmacSHA512(hashSecret, hashData.toString());

        return calculatedHash.equals(vnp_SecureHash);
    }

    // 🔐 HMAC SHA512
    private String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
        hmac512.init(secretKey);

        byte[] bytes = hmac512.doFinal(data.getBytes());

        StringBuilder hash = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hash.append('0');
            hash.append(hex);
        }
        return hash.toString();
    }
}

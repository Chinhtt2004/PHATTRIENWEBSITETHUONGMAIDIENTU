package com.tuongchinh.Service;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.math.RoundingMode;
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

    public String createPaymentUrl(Long orderId, BigDecimal amount, HttpServletRequest request) throws Exception {
        // === 1. Chuẩn bị thông tin thanh toán ===
        String vnp_TxnRef = String.valueOf(orderId); // mã tham chiếu đơn hàng, duy nhất
        String vnp_OrderInfo ="Thanh toan don hang"+orderId;
        // VNPay yêu cầu số nguyên, nhân 100
        String vnp_Amount = amount.multiply(new BigDecimal(100))
                .setScale(0, RoundingMode.DOWN)
                .toPlainString();

        String vnp_IpAddr = request.getRemoteAddr();
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        // === 2. Tạo map param ===
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

        // === 3. Sắp xếp param theo key ===
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        // === 4. Tạo hashData & queryString ===
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String value = params.get(fieldName);

            if (value != null && !value.isEmpty()) {
                // hashData: chỉ encode value (UTF-8)
                hashData.append(fieldName)
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                // query: encode name + value
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        // === 5. Tạo chữ ký HMAC SHA512 ===
        String vnp_SecureHash = hmacSHA512(hashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        // === 6. Tạo URL hoàn chỉnh ===
        return payUrl + "?" + query.toString();
    }

    // Hàm HMAC SHA512
    private String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac512.init(secretKey);

        byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hash = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hash.append('0');
            hash.append(hex);
        }
        return hash.toString();
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

}

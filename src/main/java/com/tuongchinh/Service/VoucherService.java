package com.tuongchinh.Service;

import com.tuongchinh.DTO.*;
import com.tuongchinh.Entity.Voucher;
import com.tuongchinh.Repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {
    private final VoucherRepository voucherRepository;

    public List<VoucherResponse> getActiveVouchers() {
        return voucherRepository
                .findByIsActiveTrueAndExpiryDateAfter(LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VoucherApplyResponse applyVoucher(VoucherApplyRequest request) {
        Voucher voucher = voucherRepository.findByCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        if (!voucher.isValid()) {
            throw new RuntimeException("Voucher đã hết hạn hoặc không còn hiệu lực");
        }
        if (request.getOrderAmount().compareTo(voucher.getMinOrderValue()) < 0) {
            throw new RuntimeException(
                    "Đơn hàng tối thiểu " + voucher.getMinOrderValue() + "đ để dùng voucher này");
        }
        BigDecimal discountAmount = calculateDiscount(voucher, request.getOrderAmount());
        BigDecimal finalAmount = request.getOrderAmount().subtract(discountAmount);
        VoucherApplyResponse res = new VoucherApplyResponse();
        res.setCode(voucher.getCode());
        res.setType(voucher.getType());
        res.setDiscountAmount(discountAmount);
        res.setFinalAmount(finalAmount);
        res.setMessage("Áp dụng voucher thành công, giảm " + discountAmount + "đ");
        return res;
    }

    public VoucherResponse create(VoucherRequest request) {

        if (voucherRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Mã voucher đã tồn tại");
        }
        Voucher voucher = new Voucher();
        voucher.setCode(request.getCode().trim().toUpperCase());
        voucher.setType(request.getType().toUpperCase());
        voucher.setValue(request.getValue());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setMaxDiscount(request.getMaxDiscount());
        voucher.setExpiryDate(request.getExpiryDate());
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setIsActive(
                request.getIsActive() != null ? request.getIsActive() : true);
        return mapToResponse(voucherRepository.save(voucher));
    }

    public VoucherResponse update(Long id, VoucherRequest request) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

        mapToEntity(voucher, request);
        return mapToResponse(voucherRepository.save(voucher));
    }

    public void delete(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));
        voucherRepository.delete(voucher);
    }

    public BigDecimal calculateDiscount(Voucher voucher, BigDecimal orderAmount) {
        BigDecimal discount;
        if ("PERCENT".equals(voucher.getType())) {
            discount = orderAmount
                    .multiply(voucher.getValue())
                    .divide(BigDecimal.valueOf(100));
            if (voucher.getMaxDiscount() != null
                    && discount.compareTo(voucher.getMaxDiscount()) > 0) {
                discount = voucher.getMaxDiscount();
            }
        } else if ("FIXED".equals(voucher.getType())) {
            discount = voucher.getValue();
        } else if ("SHIPPING".equals(voucher.getType())) {
            discount = voucher.getValue();
        } else {
            discount = BigDecimal.ZERO;
        }
        return discount;
    }

    public Voucher validateAndUse(String code, BigDecimal orderAmount) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        if (!voucher.isValid()) {
            throw new RuntimeException("Voucher đã hết hạn hoặc không còn hiệu lực");
        }

        if (orderAmount.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new RuntimeException(
                    "Đơn hàng tối thiểu " + voucher.getMinOrderValue() + "đ");
        }
        voucher.setUsedCount(voucher.getUsedCount() + 1);
        voucherRepository.save(voucher);

        return voucher;
    }

    private void mapToEntity(Voucher voucher, VoucherRequest request) {
        voucher.setCode(request.getCode());
        voucher.setType(request.getType());
        voucher.setValue(request.getValue());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setMaxDiscount(request.getMaxDiscount());
        voucher.setExpiryDate(request.getExpiryDate());
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setIsActive(request.getIsActive());
    }

    private VoucherResponse mapToResponse(Voucher v) {
        VoucherResponse res = new VoucherResponse();
        res.setId(v.getId());
        res.setCode(v.getCode());
        res.setType(v.getType());
        res.setValue(v.getValue());
        res.setMinOrderValue(v.getMinOrderValue());
        res.setMaxDiscount(v.getMaxDiscount());
        res.setExpiryDate(v.getExpiryDate());
        res.setUsageLimit(v.getUsageLimit());
        res.setUsedCount(v.getUsedCount());
        res.setIsActive(v.getIsActive());
        return res;
    }
}
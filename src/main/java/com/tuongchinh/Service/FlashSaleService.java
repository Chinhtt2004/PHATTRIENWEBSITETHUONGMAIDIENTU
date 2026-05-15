package com.tuongchinh.Service;

import com.tuongchinh.Entity.FlashSale;
import com.tuongchinh.Entity.FlashSaleProduct;
import com.tuongchinh.Repository.FlashSaleProductRepository;
import com.tuongchinh.Repository.FlashSaleRepository;
import com.tuongchinh.Repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlashSaleService {

    @Autowired
    private FlashSaleRepository flashSaleRepository;

    @Autowired
    private FlashSaleProductRepository flashSaleProductRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    // Lấy danh sách Flash Sale đang ACTIVE
    public List<FlashSale> getActiveFlashSales() {
        LocalDateTime now = LocalDateTime.now();
        return flashSaleRepository.findByStartTimeBeforeAndEndTimeAfter(now, now);
    }

    // Thêm sản phẩm vào Flash Sale
    @Transactional
    public FlashSaleProduct addProductToFlashSale(Long flashSaleId, Long variantId, BigDecimal salePrice, int quantity) {
        FlashSale flashSale = flashSaleRepository.findById(flashSaleId)
                .orElseThrow(() -> new RuntimeException("FlashSale not found"));
        var variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("ProductVariant not found"));

        FlashSaleProduct fsp = new FlashSaleProduct();
        fsp.setFlashSale(flashSale);
        fsp.setVariant(variant);
        fsp.setSalePrice(salePrice);
        fsp.setQuantity(quantity);
        fsp.setSoldQuantity(0);

        return flashSaleProductRepository.save(fsp);
    }

    // Đặt mua sản phẩm trong Flash Sale
    @Transactional
    public boolean purchaseFlashSaleProduct(Long flashSaleProductId, int buyQuantity) {
        FlashSaleProduct fsp = flashSaleProductRepository.findById(flashSaleProductId)
                .orElseThrow(() -> new RuntimeException("FlashSaleProduct not found"));

        if (fsp.getSoldQuantity() + buyQuantity > fsp.getQuantity()) {
            return false; // không đủ số lượng
        }

        fsp.setSoldQuantity(fsp.getSoldQuantity() + buyQuantity);
        flashSaleProductRepository.save(fsp);
        return true;
    }
}
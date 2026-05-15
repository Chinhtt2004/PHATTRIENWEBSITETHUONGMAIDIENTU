package com.tuongchinh.Repository;

import com.tuongchinh.Entity.FlashSaleProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashSaleProductRepository extends JpaRepository<FlashSaleProduct, Long> {
    List<FlashSaleProduct> findByFlashSaleId(Long flashSaleId);
    List<FlashSaleProduct> findByVariantId(Long variantId);
    List<FlashSaleProduct> findByFlashSaleIdAndSoldQuantityLessThan(Long flashSaleId, Integer quantity);
    boolean existsByFlashSaleIdAndVariantId(
            Long flashSaleId,
            Long variantId
    );
}
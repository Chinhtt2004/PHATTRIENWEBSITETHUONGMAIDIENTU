package com.tuongchinh.Service;

import com.tuongchinh.DTO.CreateFlashSaleRequest;
import com.tuongchinh.DTO.AddFlashSaleVariantRequest;
import com.tuongchinh.Entity.FlashSale;
import com.tuongchinh.Entity.FlashSaleProduct;
import com.tuongchinh.Entity.ProductVariant;
import com.tuongchinh.Repository.FlashSaleProductRepository;
import com.tuongchinh.Repository.FlashSaleRepository;
import com.tuongchinh.Repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;

    private final FlashSaleProductRepository flashSaleProductRepository;

    private final ProductVariantRepository productVariantRepository;

    // =========================
    // create flash sale
    // =========================
    @Transactional
    public FlashSale createFlashSale(
            CreateFlashSaleRequest request
    ) {

        FlashSale flashSale = new FlashSale();

        flashSale.setName(
                request.getName()
        );

        flashSale.setStartTime(
                request.getStartTime()
        );

        flashSale.setEndTime(
                request.getEndTime()
        );

        flashSale.setIsActive(Boolean.TRUE
        );

        return flashSaleRepository.save(
                flashSale
        );
    }

    // =========================
    // add variant vào flash sale
    // =========================
    @Transactional
    public FlashSaleProduct addFlashSaleVariant(
            Long flashSaleId,
            AddFlashSaleVariantRequest request
    ) {

        FlashSale flashSale =
                flashSaleRepository.findById(
                        flashSaleId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Flash sale not found"
                        ));

        ProductVariant variant =
                productVariantRepository.findById(
                        request.getVariantId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Variant not found"
                        ));

        // validate
        if (
                request.getSalePrice()
                        .compareTo(
                                variant.getPrice()
                        ) >= 0
        ) {

            throw new RuntimeException(
                    "Sale price must be smaller than original price"
            );
        }

        boolean exists =
                flashSaleProductRepository
                        .existsByFlashSaleIdAndVariantId(
                                flashSaleId,
                                variant.getId()
                        );

        if (exists) {
            throw new RuntimeException(
                    "Variant already exists in flash sale"
            );
        }

        // create flash sale product
        FlashSaleProduct flashSaleProduct =
                new FlashSaleProduct();

        flashSaleProduct.setFlashSale(
                flashSale
        );
        variant.setDiscountPrice(request.getSalePrice());
        flashSaleProduct.setVariant(
                variant
        );

        flashSaleProduct.setSalePrice(
                request.getSalePrice()
        );

        flashSaleProduct.setQuantity(
                request.getQuantity()
        );

        flashSaleProduct.setSoldQuantity(0);

        flashSaleProduct.setMaxUser(
                request.getMaxPerUser()
        );

        // update variant
        variant.setDiscountPrice(
                request.getSalePrice()
        );

        variant.setIsFlashSale(true);

        productVariantRepository.save(
                variant
        );
        return flashSaleProductRepository.save(
                flashSaleProduct
        );
    }
}
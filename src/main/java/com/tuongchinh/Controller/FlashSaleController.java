package com.tuongchinh.Controller;

import com.tuongchinh.DTO.AddFlashSaleVariantRequest;
import com.tuongchinh.DTO.CreateFlashSaleRequest;
import com.tuongchinh.Entity.FlashSale;
import com.tuongchinh.Entity.FlashSaleProduct;
import com.tuongchinh.Service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flash_sale")
@RequiredArgsConstructor
public class FlashSaleController {
    private final FlashSaleService flashSaleService;
    @PostMapping("create")
    public FlashSale createFlashSale(
            @RequestBody
            CreateFlashSaleRequest request
    ) {

        return flashSaleService
                .createFlashSale(request);
    }

    @PostMapping("/addproduct_variant/{flashSaleId}")
    public FlashSaleProduct addFlashSaleVariant(
            @PathVariable Long flashSaleId,
            @RequestBody
            AddFlashSaleVariantRequest request
    ) {

        return flashSaleService
                .addFlashSaleVariant(
                        flashSaleId,
                        request
                );
    }
}

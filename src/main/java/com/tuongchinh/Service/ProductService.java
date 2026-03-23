package com.tuongchinh.Service;

import com.tuongchinh.DTO.*;
import com.tuongchinh.Entity.*;
import com.tuongchinh.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository productImageRepository;
    private final CloudinaryService cloudinaryService;

    public Page<ProductResponse> searchProducts(
            String keyword, Double minPrice, Double maxPrice,
            Long categoryId, Long brandId, Boolean inStock,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Page<Product> products = productRepository.findAll(
                ProductSpecification.filter(keyword, minPrice, maxPrice, categoryId, brandId, inStock),
                PageRequest.of(page, size, sort)
        );

        // Convert Page<Product> → Page<ProductResponse>
        return products.map(product -> {
            List<ProductVariant> variants = variantRepository.findByProductIdAndIsActiveTrue(product.getId());
            List<String> images = productImageRepository.findUrlsByProductId(product.getId());
            return mapToResponse(product, variants, images);
        });
    }

    public ProductResponse getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + id));

        List<ProductVariant> variants = variantRepository.findByProductIdAndIsActiveTrue(id);
        List<String> images = productImageRepository.findUrlsByProductId(id);

        return mapToResponse(product, variants, images);
    }

    public ProductResponse create(ProductRequest request, List<MultipartFile> images) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + request.getCategoryId()));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu: " + request.getBrandId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        productRepository.save(product);

        if (images != null) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    ProductImage img = new ProductImage();
                    img.setProduct(product);
                    img.setUrl(cloudinaryService.uploadImage(file));
                    productImageRepository.save(img);
                }
            }
        }

        if (request.getVariants() != null) {
            for (ProductRequest.VariantRequest vr : request.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                variant.setSku(vr.getSku());
                variant.setPrice(vr.getPrice());
                variant.setStock(vr.getStock());
                variant.setIsActive(true);
                variantRepository.save(variant);
            }
        }

        return mapToResponse(product,
                variantRepository.findByProductIdAndIsActiveTrue(product.getId()),
                productImageRepository.findUrlsByProductId(product.getId()));
    }

    public ProductResponse update(Long id, ProductRequest request, List<MultipartFile> images) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + request.getCategoryId()));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu: " + request.getBrandId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        productRepository.save(product);

        if (images != null) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    ProductImage img = new ProductImage();
                    img.setProduct(product);
                    img.setUrl(cloudinaryService.uploadImage(file));
                    productImageRepository.save(img);
                }
            }
        }

        return mapToResponse(product,
                variantRepository.findByProductIdAndIsActiveTrue(id),
                productImageRepository.findUrlsByProductId(id));
    }

    public void delete(Long id) {
        List<ProductVariant> variants = variantRepository.findByProductId(id);
        variants.forEach(v -> v.setIsActive(false));
        variantRepository.saveAll(variants);
    }

    public List<ProductResponse> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(product -> {
                    List<ProductVariant> variants = variantRepository.findByProductIdAndIsActiveTrue(product.getId());
                    List<String> images = productImageRepository.findUrlsByProductId(product.getId());
                    return mapToResponse(product, variants, images);
                })
                .toList();
    }

    public List<ProductResponse> getNewProducts(int limit) {
        return productRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(product -> {
                    List<ProductVariant> variants = variantRepository.findByProductIdAndIsActiveTrue(product.getId());
                    List<String> images = productImageRepository.findUrlsByProductId(product.getId());
                    return mapToResponse(product, variants, images);
                })
                .toList();
    }

    private ProductResponse mapToResponse(Product product, List<ProductVariant> variants, List<String> images) {
        BigDecimal priceMin = variants.stream()
                .map(ProductVariant::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setDescription(product.getDescription());
        res.setCategoryId(product.getCategory().getId());
        res.setCategoryName(product.getCategory().getName());
        res.setBrandId(product.getBrand() != null ? product.getBrand().getId() : null);
        res.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        res.setThumbnail(images.isEmpty() ? null : images.get(0));
        res.setImages(images);
        res.setPriceMin(priceMin);
        res.setVariants(variants.stream().map(this::mapVariant).toList());
        return res;
    }

    private ProductResponse.VariantResponse mapVariant(ProductVariant v) {
        ProductResponse.VariantResponse vr = new ProductResponse.VariantResponse();
        vr.setId(v.getId());
        vr.setSku(v.getSku());
        vr.setPrice(v.getPrice());
        vr.setStock(v.getStock());
        vr.setImageUrl(v.getImageUrl());
        vr.setDiscountPrice(v.getDiscountPrice());       // ← thêm
        vr.setEffectivePrice(v.getEffectivePrice());     // ← thêm
        vr.setDiscountPercent(v.getDiscountPercent());   // ← thêm
        vr.setStock(v.getStock());
        vr.setIsActive(v.getIsActive());
        return vr;
    }
    public ProductVariant setSalePrice(SaleRequest request) {
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy variant: " + request.getVariantId()));
        // Validate giá sale phải thấp hơn giá gốc
        if (request.getDiscountPrice() != null
                && request.getDiscountPrice().compareTo(variant.getPrice()) >= 0) {
            throw new RuntimeException("Giá sale phải thấp hơn giá gốc: " + variant.getPrice());
        }
        variant.setDiscountPrice(request.getDiscountPrice());
        return variantRepository.save(variant);
    }

    // Admin bỏ sale
    public ProductVariant removeSale(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy variant: " + variantId));
        variant.setDiscountPrice(null);
        return variantRepository.save(variant);
    }

    public Page<ProductResponse> getSaleProducts(int page, int size) {
        return productRepository.findSaleProducts(PageRequest.of(page, size))
                .map(product -> {
                    List<ProductVariant> variants = variantRepository
                            .findByProductIdAndIsActiveTrue(product.getId());
                    List<String> images = productImageRepository
                            .findUrlsByProductId(product.getId());
                    return mapToResponse(product, variants, images);
                });
    }
    public SaleResponse buildSaleResponse(ProductVariant variant) {
        SaleResponse res = new SaleResponse();
        res.setVariantId(variant.getId());
        res.setSku(variant.getSku());
        res.setProductName(variant.getProduct().getName());
        res.setDiscountPercent(variant.getDiscountPercent());

        if (variant.getCostPrice() != null) {
            res.setProfit(variant.getProfit());
            res.setProfitPercent(variant.getProfitPercent());

            if (variant.isLoss()) {
                res.setWarningLevel("DANGER");
                res.setWarningMessage(String.format(
                        "ĐANG LỖ! Bán %.0fđ nhưng nhập %.0fđ, lỗ %.0fđ/sp",
                        variant.getEffectivePrice().doubleValue(),
                        variant.getCostPrice().doubleValue(),
                        variant.getProfit().abs().doubleValue()
                ));
            } else if (variant.getProfitPercent().compareTo(BigDecimal.valueOf(5)) < 0) {
                res.setWarningLevel("WARNING");
                res.setWarningMessage(String.format(
                        "Lợi nhuận rất thấp: %.2f%%", variant.getProfitPercent().doubleValue()
                ));
            } else {
                res.setWarningLevel("OK");
                res.setWarningMessage(String.format(
                        "Lợi nhuận: %.2f%%", variant.getProfitPercent().doubleValue()
                ));
            }
        }

        return res;
    }

}
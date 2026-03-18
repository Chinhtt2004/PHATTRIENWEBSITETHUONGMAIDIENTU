package com.tuongchinh.Controller;

import com.tuongchinh.DTO.ProductRequest;
import com.tuongchinh.DTO.ProductResponse;
import com.tuongchinh.Entity.Product;
import com.tuongchinh.Entity.User;
import com.tuongchinh.Service.JwtService;
import com.tuongchinh.Service.ProductService;
import com.tuongchinh.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;
    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("public/products")
    public Page<Product> searchProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {

        return productService.searchProducts(
                keyword,
                minPrice,
                maxPrice,
                categoryId,
                page,
                size,
                sortBy,
                sortDir);
    }

    @PostMapping(value = "/admin/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse create(
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest httpRequest) {
        return productService.create(request, image);
    }

    @PutMapping(value = "/admin/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> update(
            @PathVariable("id") Long id,
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        ProductResponse response = productService.update(request, image, id);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("admin/products/{id}")
    public void delete(@PathVariable("id") Long id) {
        productService.delete(id);
    }

    @GetMapping("public/product/{id}")
    public Product getProductDetail(@PathVariable("id") Long id) {
        return productService.getProductDetail(id);
    }

    @GetMapping("public/product/category/{id}")
    public List<Product> getProductByCategoryid(@PathVariable("id") Long id) {
        return productService.getProductsByCategoryId(id);
    }

    @GetMapping("public/products/best-sellers")
    public ResponseEntity<?> getBestSellingProducts(
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        return ResponseEntity.ok(productService.getBestSellingProducts(limit));
    }

    @GetMapping("/public/products/new")
    public ResponseEntity<?> getNewProducts(
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        return ResponseEntity.ok(productService.getNewProducts(limit));
    }

}
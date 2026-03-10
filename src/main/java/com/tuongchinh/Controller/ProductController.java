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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;
    private final UserService userService;
    private final JwtService jwtService;
    @GetMapping("/products")
    public Page<Product> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {

        return productService.searchProducts(
                keyword,
                minPrice,
                maxPrice,
                categoryId,
                page,
                size,
                sortBy,
                sortDir
        );
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping(value = "/admin/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse create(
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest httpRequest
    ) {
        return productService.create(request, image);
    }
    @PutMapping(value = "/admin/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {

        ProductResponse response = productService.update(request, image, id);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("admin/products/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

}
package com.tuongchinh.Service;

import com.tuongchinh.DTO.ProductRequest;
import com.tuongchinh.DTO.ProductResponse;
import com.tuongchinh.Entity.Product;
import com.tuongchinh.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    Page<Product> searchProducts(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Long categoryId,
            int page,
            int size,
            String sortBy,
            String sortDir
    );
    Product getById(Long id);
    ProductResponse create(ProductRequest request, MultipartFile image);
    void delete(Long id);
    Product findById(Long id);
}

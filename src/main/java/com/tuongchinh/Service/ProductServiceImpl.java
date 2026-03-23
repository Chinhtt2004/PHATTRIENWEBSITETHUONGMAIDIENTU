package com.tuongchinh.Service;

import com.tuongchinh.DTO.BestSellingProductDTO;
import com.tuongchinh.DTO.ProductRequest;
import com.tuongchinh.DTO.ProductResponse;
import com.tuongchinh.Entity.Category;
import com.tuongchinh.Entity.Product;
import com.tuongchinh.Entity.ProductSpecification;
import com.tuongchinh.Repository.CategoryRepository;
import com.tuongchinh.Repository.OrderItemRepository;
import com.tuongchinh.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final OrderItemRepository orderItemRepository;
    private final ChatService chatService;
    @Override
    public Page<Product> searchProducts(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Long categoryId,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(
                ProductSpecification.filter(keyword, minPrice, maxPrice, categoryId),
                pageable
        );
    }

    @Override
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
        chatService.deleteProduct(id);
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public ProductResponse create(ProductRequest request, MultipartFile image) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + request.getCategoryId()));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        productRepository.save(product);
        chatService.syncProduct(product.getId(), product.getName(), product.getDescription());
        return mapToResponse(product);
    }
    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setImageUrl(product.getImageUrl());
        response.setCategoryName(product.getCategory().getName());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
    @Override
    public ProductResponse update(ProductRequest request, MultipartFile image, Long id){
        Product product=findById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + request.getCategoryId()));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        productRepository.save(product);
        chatService.syncProduct(product.getId(), product.getName(), product.getDescription());
        return mapToResponse(product);
    }
    @Override
    public Product getProductDetail(Long id){
        return productRepository.findById(id).orElseThrow(()->new RuntimeException("Product not found"));
    }
    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    @Override
    public List<BestSellingProductDTO> getBestSellingProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return orderItemRepository.findBestSellingProducts(pageable);
    }
    @Override
    public List<Product> getNewProducts(int limit) {
        return productRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(0, limit)
        );
    }
}
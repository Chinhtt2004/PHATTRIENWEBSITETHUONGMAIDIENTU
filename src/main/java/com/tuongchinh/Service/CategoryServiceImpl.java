package com.tuongchinh.Service;

import com.tuongchinh.DTO.CategoryRequest;
import com.tuongchinh.DTO.CategoryResponse;
import com.tuongchinh.Entity.Category;
import com.tuongchinh.Repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAll() {
        List<Category> all = categoryRepository.findAll();
        Map<Long, List<Category>> groupByParent = all.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));
        return all.stream()
                .filter(c -> c.getParent() == null)
                .map(c -> mapToResponse(c, groupByParent))
                .toList();
    }

//    @Override
//    public CategoryResponse getById(Long id) {
//        Category category = categoryRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
//        return mapToResponse(category);
//    }
//
@Override
public String create(CategoryRequest request) {
    try {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục cha: " + request.getParentId()));
            category.setParent(parent);
        }
        categoryRepository.save(category);
        return "Tạo danh mục thành công";
    } catch (Exception e) {
        return "Lỗi: " + e.getMessage();
    }
}
@Override
public void delete(Long id) {
    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
    categoryRepository.delete(category);
}
//    @Override
//    public CategoryResponse update(Long id, CategoryRequest request) {
//        Category category = categoryRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
//
//        category.setName(request.getName());
//        category.setDescription(request.getDescription());
//
//        if (request.getParentId() != null) {
//            Category parent = categoryRepository.findById(request.getParentId())
//                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục cha: " + request.getParentId()));
//            category.setParent(parent);
//        } else {
//            category.setParent(null); // đổi thành danh mục cha
//        }
//
//        return mapToResponse(categoryRepository.save(category));
//    }
//
//    @Override
//    public void delete(Long id) {
//        Category category = categoryRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
//        categoryRepository.delete(category);
//    }

    // Map entity sang response
    public CategoryResponse mapToResponse(Category category, Map<Long, List<Category>> groupByParent) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setParentId(category.getParent() != null ? category.getParent().getId() : null);
        // Dùng groupByParent đã build sẵn thay vì gọi getChildren() (tránh N+1 lazy load)
        List<Category> children = groupByParent.getOrDefault(category.getId(), List.of());
        response.setChildren(children.stream()
                .map(c -> mapToResponse(c, groupByParent))
                .toList());

        return response;
    }
    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục cha: " + request.getParentId()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return mapToResponse(categoryRepository.save(category), new HashMap<>());
    }

}
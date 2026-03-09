package com.tuongchinh.Controller;

import com.tuongchinh.DTO.CategoryRequest;
import com.tuongchinh.DTO.CategoryResponse;
import com.tuongchinh.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin
public class CategoryController {

    private final CategoryService categoryService;
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

@PostMapping
public ResponseEntity<String> create(@RequestBody CategoryRequest request) {
    return ResponseEntity.ok(categoryService.create(request));
}

@DeleteMapping("/{id}")
public ResponseEntity<String> delete(@PathVariable Long id) {
    categoryService.delete(id);
    return ResponseEntity.ok("Xóa danh mục thành công");
}

@PutMapping("/{id}")
public ResponseEntity<CategoryResponse> update(
        @PathVariable Long id,
        @RequestBody CategoryRequest request
) {
    return ResponseEntity.ok(categoryService.update(id, request));
}
}
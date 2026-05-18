package com.tuongchinh.Controller;

import com.tuongchinh.DTO.CreatePageSectionRequest;
import com.tuongchinh.DTO.ReorderSectionRequest;
import com.tuongchinh.Service.PageSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class PageSectionController {

    private final PageSectionService pageSectionService;

    // =========================================
    // CREATE
    // =========================================

    @PostMapping("/section")
    public ResponseEntity<?> create(
            @RequestBody CreatePageSectionRequest req
    ) {

        return ResponseEntity.ok(
                pageSectionService.create(req)
        );
    }

    // =========================================
    // GET BY PAGE
    // =========================================

    @GetMapping("/page/{pageId}")
    public ResponseEntity<?> getByPage(
            @PathVariable Long pageId
    ) {

        return ResponseEntity.ok(
                pageSectionService.getByPage(pageId)
        );
    }

    // =========================================
    // DETAIL
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetail(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                pageSectionService.getDetail(id)
        );
    }

    // =========================================
    // UPDATE
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody CreatePageSectionRequest req
    ) {

        return ResponseEntity.ok(
                pageSectionService.update(id, req)
        );
    }

    // =========================================
    // REORDER
    // =========================================

    @PutMapping("/page/{pageId}/reorder")
    public ResponseEntity<?> reorder(
            @PathVariable Long pageId,
            @RequestBody List<ReorderSectionRequest> requests
    ) {
        pageSectionService.reorderSections(pageId, requests);
        return ResponseEntity.ok("Reordered successfully");
    }

    // =========================================
    // DELETE
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id
    ) {

        pageSectionService.delete(id);

        return ResponseEntity.ok(
                "Deleted successfully"
        );
    }
}
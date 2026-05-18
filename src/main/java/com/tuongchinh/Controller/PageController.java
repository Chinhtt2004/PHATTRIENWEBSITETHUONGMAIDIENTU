package com.tuongchinh.Controller;

import com.tuongchinh.DTO.CreatePageRequest;
import com.tuongchinh.Service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class PageController {

    private final PageService pageService;

    // =========================
    // CREATE
    // =========================

    @PostMapping("admin/page")
    public ResponseEntity<?> create(
            @RequestBody CreatePageRequest req
    ) {

        return ResponseEntity.ok(
                pageService.create(req)
        );
    }

    @GetMapping("public/page")
    public ResponseEntity<?> getAll() {

        return ResponseEntity.ok(
                pageService.getAll()
        );
    }

    // =========================
    // GET DETAIL
    // =========================

    @GetMapping("public/page/{slug}")
    public ResponseEntity<?> getPage(
            @PathVariable String slug
    ) {

        return ResponseEntity.ok(
                pageService.getPage(slug)
        );
    }

    // =========================
    // UPDATE
    // =========================

//    @PutMapping("/{id}")
//    public ResponseEntity<?> update(
//            @PathVariable Long id,
//            @RequestBody CreatePageRequest req
//    ) {
//
//        return ResponseEntity.ok(
//                pageService.update(id, req)
//        );
//    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("admin/page/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id
    ) {

        pageService.delete(id);

        return ResponseEntity.ok("Deleted");
    }
    @GetMapping("pubic/{slug}")
    public ResponseEntity<?> getdetailPage(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(
                pageService.getPageBySlug(slug)
        );
    }
}
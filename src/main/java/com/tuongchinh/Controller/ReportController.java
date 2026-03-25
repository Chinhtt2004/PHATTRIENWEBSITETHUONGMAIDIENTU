package com.tuongchinh.Controller;

import com.tuongchinh.DTO.ReportResponse;
import com.tuongchinh.Service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@CrossOrigin
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportResponse> getSummary() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }
}

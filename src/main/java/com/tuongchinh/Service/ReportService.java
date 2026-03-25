package com.tuongchinh.Service;

import com.tuongchinh.DTO.ReportResponse;
import com.tuongchinh.Entity.Order;
import com.tuongchinh.Entity.OrderItem;
import com.tuongchinh.Repository.OrderRepository;
import com.tuongchinh.Repository.ProductRepository;
import com.tuongchinh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ReportResponse getSummaryReport() {
        List<Order> orders = orderRepository.findAll();
        
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getOrderStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long totalOrders = orders.size();
        long totalCustomers = userRepository.count();
        long totalProducts = productRepository.count();

        // Simulate daily revenue for chart
        List<ReportResponse.DailyRevenue> revenueChart = calculateDailyRevenue(orders);
        
        // Mocking some chart data for now as a real implementation would be more complex
        List<ReportResponse.CategorySales> categoryChart = Arrays.asList(
                new ReportResponse.CategorySales("Chăm sóc da", 45, "#B76E79"),
                new ReportResponse.CategorySales("Trang điểm", 30, "#E8D5C4"),
                new ReportResponse.CategorySales("Dưỡng thể", 15, "#4CAF50"),
                new ReportResponse.CategorySales("Nước hoa", 10, "#2196F3")
        );

        List<ReportResponse.TopProduct> topProducts = calculateTopProducts(orders);

        return ReportResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .revenueChart(revenueChart)
                .categoryChart(categoryChart)
                .topProducts(topProducts)
                .build();
    }

    private List<ReportResponse.DailyRevenue> calculateDailyRevenue(List<Order> orders) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        Map<String, BigDecimal> dailyRev = new LinkedHashMap<>();
        Map<String, Long> dailyOrders = new LinkedHashMap<>();

        // Group by date
        orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getOrderStatus()))
                .forEach(o -> {
                    String date = o.getOrderDate().format(formatter);
                    dailyRev.put(date, dailyRev.getOrDefault(date, BigDecimal.ZERO).add(o.getTotalAmount()));
                    dailyOrders.put(date, dailyOrders.getOrDefault(date, 0L) + 1);
                });

        return dailyRev.entrySet().stream()
                .map(e -> new ReportResponse.DailyRevenue(e.getKey(), e.getValue(), dailyOrders.get(e.getKey())))
                .collect(Collectors.toList());
    }

    private List<ReportResponse.TopProduct> calculateTopProducts(List<Order> orders) {
        Map<String, Long> productSales = new HashMap<>();
        Map<String, BigDecimal> productRevenue = new HashMap<>();

        for (Order order : orders) {
            if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) continue;
            for (OrderItem item : order.getItems()) {
                String name = item.getVariant().getProduct().getName();
                productSales.put(name, productSales.getOrDefault(name, 0L) + item.getQuantity());
                productRevenue.put(name, productRevenue.getOrDefault(name, BigDecimal.ZERO)
                        .add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))));
            }
        }

        return productSales.entrySet().stream()
                .map(e -> new ReportResponse.TopProduct(e.getKey(), e.getValue(), productRevenue.get(e.getKey()), 0.0))
                .sorted(Comparator.comparing(ReportResponse.TopProduct::getSales).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }
}

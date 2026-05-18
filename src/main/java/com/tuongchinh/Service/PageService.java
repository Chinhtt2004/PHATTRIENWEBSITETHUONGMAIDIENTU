package com.tuongchinh.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuongchinh.DTO.AddFlashSaleVariantRequest;
import com.tuongchinh.DTO.CreatePageRequest;
import com.tuongchinh.DTO.PageResponse;
import com.tuongchinh.DTO.SectionResponse;
import com.tuongchinh.Entity.Banner;
import com.tuongchinh.Entity.BannerItem;
import com.tuongchinh.Entity.Page;
import com.tuongchinh.Entity.PageSection;
import com.tuongchinh.Repository.BannerItemRepository;
import com.tuongchinh.Repository.BannerRepository;
import com.tuongchinh.Repository.PageRepository;
import com.tuongchinh.Repository.PageSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PageService {

    private final PageRepository pageRepository;

    private final PageSectionRepository pageSectionRepository;
    private final ProductService productService;
    private final BannerRepository bannerRepository;
    private final BannerService bannerService;

    private final BannerItemRepository bannerItemRepository;

    private final ObjectMapper objectMapper;

    // =====================================================
    // CREATE PAGE
    // =====================================================

    public Page create(CreatePageRequest req) {

        Page page = new Page();

        page.setName(req.getName());

        page.setSlug(req.getSlug());

        page.setActive(true);

        return pageRepository.save(page);
    }

    // =====================================================
    // GET ALL PAGE
    // =====================================================

    public List<Page> getAll() {

        return pageRepository.findAll();
    }

    // =====================================================
    // GET PAGE DETAIL
    // =====================================================

    public Page getDetail(Long id) {

        return pageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Page not found"));
    }

    // =====================================================
    // UPDATE PAGE
    // =====================================================

    public Page update(Long id,
                       CreatePageRequest req) {

        Page page = pageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Page not found"));

        page.setName(req.getName());

        page.setSlug(req.getSlug());

        return pageRepository.save(page);
    }

    // =====================================================
    // DELETE PAGE
    // =====================================================

    public void delete(Long id) {

        Page page = pageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Page not found"));

        pageRepository.delete(page);
    }

    // =====================================================
    // PUBLIC API
    // BUILD PAGE DYNAMIC
    // =====================================================

    public AddFlashSaleVariantRequest.PageResponse getPage(String slug) {

        Page page = pageRepository
                .findBySlugAndActiveTrue(slug)
                .orElseThrow(() ->
                        new RuntimeException("Page not found"));

        List<PageSection> sections =
                pageSectionRepository
                        .findByPageAndActiveTrueOrderByPositionAsc(page);

        List<SectionResponse> sectionResponses =
                new ArrayList<>();

        for (PageSection section : sections) {

            Object data = null;

            switch (section.getType()) {

                // =====================================
                // BANNER
                // =====================================

                case "BANNER":

                    data = getBannerData(section);

                    break;

                // =====================================
                // FLASH SALE
                // =====================================

                case "FLASH_SALE":

                    data = getFlashSaleData(section);

                    break;

                // =====================================
                // PRODUCT GRID
                // =====================================

                case "PRODUCT_GRID":

                    data = getProductGridData(section);

                    break;

                default:

                    data = null;
            }

            SectionResponse response =
                    new SectionResponse();

            response.setType(section.getType());

            response.setTitle(section.getTitle());

            response.setPosition(section.getPosition());

            response.setData(data);

            sectionResponses.add(response);
        }

        AddFlashSaleVariantRequest.PageResponse response =
                new AddFlashSaleVariantRequest.PageResponse();

        response.setSlug(page.getSlug());

        response.setSections(sectionResponses);

        return response;
    }

    // =====================================================
    // BANNER DATA
    // =====================================================

    private Object getBannerData(
            PageSection section
    ) {

        try {

            JsonNode config =
                    objectMapper.readTree(
                            section.getConfigJson()
                    );

            Long bannerId =
                    config.get("bannerId").asLong();

            Banner banner =
                    bannerRepository.findById(bannerId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Banner not found"
                                    ));

            List<BannerItem> items =
                    bannerItemRepository
                            .findByBannerAndActiveTrueOrderByPositionAsc(
                                    banner
                            );

            return items;

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    // =====================================================
    // FLASH SALE DATA
    // =====================================================

    private Object getFlashSaleData(
            PageSection section
    ) {

        try {

            JsonNode config =
                    objectMapper.readTree(
                            section.getConfigJson()
                    );

            Long flashSaleId =
                    config.get("flashSaleId").asLong();

            // TODO:
            // query database lấy sản phẩm flash sale

            return List.of();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    // =====================================================
    // PRODUCT GRID DATA
    // =====================================================

    private Object getProductGridData(
            PageSection section
    ) {

        try {

            JsonNode config =
                    objectMapper.readTree(
                            section.getConfigJson()
                    );

            Long categoryId =
                    config.get("categoryId").asLong();

            Integer limit =
                    config.get("limit").asInt();

            // TODO:
            // query product theo category

            return List.of();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
    public PageResponse getPageBySlug(
            String slug
    ) {

        Page page = pageRepository
                .findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Page not found"
                        ));

        List<PageSection> sections =
                pageSectionRepository
                        .findByPageAndActiveTrueOrderByPositionAsc(
                                page
                        );

        List<SectionResponse> sectionResponses =
                sections.stream()
                        .map(this::mapSection)
                        .toList();

        PageResponse response =
                new PageResponse();

        response.setId(page.getId());

        response.setName(page.getName());

        response.setSlug(page.getSlug());

        response.setSections(sectionResponses);

        return response;
    }
    private SectionResponse mapSection(
            PageSection section
    ) {

        SectionResponse response =
                new SectionResponse();

        response.setId(section.getId());

        response.setType(section.getType());

        response.setTitle(section.getTitle());

        response.setPosition(
                section.getPosition()
        );

        Object data = null;

        switch (section.getType()) {

            case "BANNER":

                data = getBannerData(section);

                break;

            case "FLASH_SALE":

                data = getFlashSaleData(section);

                break;

            case "BEST_SELLER":

                data = getBestSellerData(section);

                break;
        }

        response.setData(data);

        return response;
    }
    private Object getBestSellerData(
            PageSection section
    ) {

        try {

            JsonNode config =
                    objectMapper.readTree(
                            section.getConfigJson()
                    );

            Integer limit =
                    config.get("limit")
                            .asInt();

            Pageable pageable =
                    PageRequest.of(0, limit);

            return productService.getBestSelling(limit);

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

}
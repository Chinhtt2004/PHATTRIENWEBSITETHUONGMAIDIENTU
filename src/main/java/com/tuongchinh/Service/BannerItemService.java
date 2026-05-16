package com.tuongchinh.Service;

import com.tuongchinh.DTO.CreateBannerItemRequest;
import com.tuongchinh.Entity.Banner;
import com.tuongchinh.Entity.BannerItem;
import com.tuongchinh.Repository.BannerItemRepository;
import com.tuongchinh.Repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerItemService {

    private final BannerRepository bannerRepository;

    private final BannerItemRepository bannerItemRepository;

    // =========================================
    // CREATE
    // =========================================

    public BannerItem create(
            CreateBannerItemRequest req
    ) {

        Banner banner = bannerRepository.findById(
                        req.getBannerId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Banner not found"));

        BannerItem item = new BannerItem();

        item.setBanner(banner);

        item.setImageUrl(req.getImageUrl());

        item.setMobileImageUrl(req.getMobileImageUrl());

        item.setRedirectUrl(req.getRedirectUrl());

//        item.setTitle(req.getTitle());
//
//        item.setSubtitle(req.getSubtitle());
//
//        item.setButtonText(req.getButtonText());

        item.setPosition(req.getPosition());

        item.setActive(true);

        return bannerItemRepository.save(item);
    }

    // =========================================
    // GET BY BANNER
    // =========================================

    public List<BannerItem> getByBanner(
            Long bannerId
    ) {

        Banner banner = bannerRepository.findById(
                        bannerId
                )
                .orElseThrow(() ->
                        new RuntimeException("Banner not found"));

        return bannerItemRepository
                .findByBannerAndActiveTrueOrderByPositionAsc(
                        banner
                );
    }

    // =========================================
    // GET DETAIL
    // =========================================

    public BannerItem getDetail(Long id) {

        return bannerItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Banner item not found"
                        ));
    }

    // =========================================
    // UPDATE
    // =========================================

    public BannerItem update(
            Long id,
            CreateBannerItemRequest req
    ) {

        BannerItem item =
                bannerItemRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Banner item not found"
                                ));

        Banner banner = bannerRepository.findById(
                        req.getBannerId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Banner not found"));

        item.setBanner(banner);

        item.setImageUrl(req.getImageUrl());

        item.setMobileImageUrl(req.getMobileImageUrl());

        item.setRedirectUrl(req.getRedirectUrl());

//        item.setTitle(req.getTitle());
//
//        item.setSubtitle(req.getSubtitle());
//
//        item.setButtonText(req.getButtonText());

        item.setPosition(req.getPosition());

        return bannerItemRepository.save(item);
    }

    // =========================================
    // DELETE
    // =========================================

    public void delete(Long id) {

        BannerItem item =
                bannerItemRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Banner item not found"
                                ));

        bannerItemRepository.delete(item);
    }
}

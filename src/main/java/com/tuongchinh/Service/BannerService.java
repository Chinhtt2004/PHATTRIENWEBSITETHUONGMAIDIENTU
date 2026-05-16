package com.tuongchinh.Service;

import com.tuongchinh.DTO.CreateBannerRequest;
import com.tuongchinh.Entity.Banner;
import com.tuongchinh.Repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    // =========================================
    // CREATE
    // =========================================

    public Banner create(CreateBannerRequest req) {

        Banner banner = new Banner();

        banner.setName(req.getName());

        banner.setActive(true);

        return bannerRepository.save(banner);
    }

    // =========================================
    // GET ALL
    // =========================================

    public List<Banner> getAll() {

        return bannerRepository.findAll();
    }

    // =========================================
    // GET DETAIL
    // =========================================

    public Banner getDetail(Long id) {

        return bannerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner not found"));
    }

    // =========================================
    // UPDATE
    // =========================================

    public Banner update(Long id,
                         CreateBannerRequest req) {

        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner not found"));

        banner.setName(req.getName());

        return bannerRepository.save(banner);
    }

    // =========================================
    // DELETE
    // =========================================

    public void delete(Long id) {

        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner not found"));

        bannerRepository.delete(banner);
    }
}

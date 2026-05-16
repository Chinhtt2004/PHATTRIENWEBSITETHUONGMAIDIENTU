package com.tuongchinh.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBannerItemRequest {
    private Long bannerId;
    private String imageUrl;
    private String mobileImageUrl;
    private String redirectUrl;
    private String title;
    private String subtitle;
    private String buttonText;
    private Integer position;
}
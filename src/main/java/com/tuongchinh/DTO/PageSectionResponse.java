package com.tuongchinh.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageSectionResponse {

    private Long id;

    private Long pageId;

    private String type;

    private String title;

    private Integer position;

    private String configJson;

    private Boolean active;
}
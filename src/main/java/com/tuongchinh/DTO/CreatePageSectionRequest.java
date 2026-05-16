package com.tuongchinh.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePageSectionRequest {

    private Long pageId;

    private String type;

    private String title;

    private Integer position;

    private String configJson;
}

package com.tuongchinh.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionResponse {

    private String type;

    private String title;

    private Integer position;

    private Object data;
}

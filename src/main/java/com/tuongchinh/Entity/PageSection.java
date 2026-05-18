package com.tuongchinh.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "page_sections")
@Getter
@Setter
public class PageSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "page_id")
    private Page page;
    // BANNER, FLASH_SALE, PRODUCT_GRID
    private String type;
    private String title;
    private Integer position;
    @Column(columnDefinition = "TEXT")
    private String configJson;
    private Boolean active = true;
}

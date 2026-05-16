package com.tuongchinh.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tuongchinh.Entity.Page;

import java.util.Optional;

@Repository
public interface PageRepository
        extends JpaRepository<Page, Long> {

    Optional<Page> findBySlugAndActiveTrue(String slug);
}

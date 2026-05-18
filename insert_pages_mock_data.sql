-- Script khởi tạo cấu trúc cây phân cấp Pages & Sections đồng bộ hoàn toàn với Storefront và database

-- 1. XÓA DỮ LIỆU CŨ ĐỂ KHỞI TẠO MỚI (TRÁNH TRÙNG LẶP VỊ TRÍ)
DELETE FROM page_sections;
DELETE FROM pages;

-- 2. KHỞI TẠO BẢNG DANH SÁCH TRANG (PAGES)
INSERT INTO pages (id, name, slug, active, created_at, updated_at) 
VALUES 
(1, 'Trang Chủ', 'home', true, NOW(), NOW()),
(2, 'Về Chúng Tôi', 'about', true, NOW(), NOW()),
(3, 'Liên Hệ', 'contact', true, NOW(), NOW()),
(4, 'Mã Giảm Giá (Vouchers)', 'vouchers', true, NOW(), NOW()),
(5, 'Sự Kiện Mùng 8 Tháng 3', 'mung-8-3', true, NOW(), NOW()),
(6, 'Trang Khuyến Mãi (Sale)', 'sale', true, NOW(), NOW());

-- ==========================================
-- 3. CÁC SECTION CHO TRANG CHỦ (ID = 1, SLUG: 'home')
-- ==========================================
-- Sắp xếp vị trí tăng dần từ 1 đến 13
INSERT INTO page_sections (page_id, type, title, position, config_json, active, created_at, updated_at) VALUES
(1, 'HERO_SECTION', 'Slide Banner Chính', 1, '{}', true, NOW(), NOW()),
(1, 'PROMOTIONAL_SLIDE', 'Khuyến Mãi Banner Nhỏ', 2, '{}', true, NOW(), NOW()),
(1, 'CATEGORIES_SECTION', 'Danh mục Nổi bật', 3, '{}', true, NOW(), NOW()),
(1, 'FLASH_SALE', 'Khung giờ Flash Sale', 4, '{}', true, NOW(), NOW()),
(1, 'AD_BANNER_INLINE', 'Banner Quảng Cáo Ngang', 5, '{}', true, NOW(), NOW()),
(1, 'FEATURED_PRODUCTS', 'Sản phẩm bán chạy', 6, '{"filter": "bestseller"}', true, NOW(), NOW()),
(1, 'BENEFITS', 'Tiêu chuẩn & Dịch vụ', 7, '{}', true, NOW(), NOW()),
(1, 'FEATURED_PRODUCTS', 'Sản phẩm mới', 8, '{"filter": "new"}', true, NOW(), NOW()),
(1, 'TESTIMONIALS', 'Khách hàng đánh giá', 9, '{}', true, NOW(), NOW()),
(1, 'NEWSLETTER', 'Đăng ký Nhận Tin', 10, '{}', true, NOW(), NOW()),
(1, 'BRAND_CAROUSEL', 'Thương hiệu đồng hành', 11, '{}', true, NOW(), NOW()),
(1, 'RECENT_BLOG_POSTS', 'Góc chia sẻ & Làm đẹp', 12, '{}', true, NOW(), NOW()),
(1, 'CUSTOM_HTML', 'Video Giới Thiệu Cửa Hàng', 13, '{"html": "<div class=\\"py-12 bg-muted/30 border-t border-border\\"><div class=\\"container mx-auto px-4 text-center\\"><h3 class=\\"text-2xl font-bold font-serif mb-6\\">Về GlowSkin Store</h3><div class=\\"max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg border border-border bg-black\\"><iframe class=\\"w-full h-full\\" src=\\"https://www.youtube.com/embed/dQw4w9WgXcQ\\" title=\\"YouTube video player\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" allowfullscreen></iframe></div></div></div>"}', true, NOW(), NOW());

-- ==========================================
-- 4. CÁC SECTION CHO TRANG VỀ CHÚNG TÔI (ID = 2, SLUG: 'about')
-- ==========================================
-- Sắp xếp vị trí tăng dần từ 1 đến 5
INSERT INTO page_sections (page_id, type, title, position, config_json, active, created_at, updated_at) VALUES
(2, 'HERO_SECTION', 'Khám Phá Câu Chuyện GlowSkin', 1, '{"subtitle": "Từ năm 2018", "description": "Chúng tôi tin rằng mọi phụ nữ đều xứng đáng có làn da khỏe đẹp và tự tin. GlowSkin ra đời với sứ mệnh mang đến những sản phẩm mỹ phẩm chất lượng nhất, an toàn nhất cho phụ nữ Việt Nam.", "backgroundColor": "#fff5f5"}', true, NOW(), NOW()),
(2, 'BENEFITS', 'Sứ Mệnh & Tầm Nhìn', 2, '{"filter": "mission-vision"}', true, NOW(), NOW()),
(2, 'BENEFITS', 'Giá Trị Cốt Lõi', 3, '{"filter": "core-values"}', true, NOW(), NOW()),
(2, 'CUSTOM_HTML', 'Hành Trình Lịch Sử', 4, '{"html": "<div class=\\"py-12 bg-muted/20\\"><div class=\\"container mx-auto px-4\\"><h2 class=\\"text-3xl font-serif font-bold text-center mb-8\\">Hành Trình Phát Triển</h2><div class=\\"relative max-w-2xl mx-auto border-l-2 border-primary/30 pl-6 space-y-8\\"><div class=\\"relative\\"><div class=\\"absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white\\"></div><span class=\\"font-bold text-primary\\">2018</span><h3 class=\\"font-semibold\\">Thành Lập</h3><p class=\\"text-sm text-muted-foreground\\">GlowSkin ra đời với cửa hàng đầu tiên tại TP.HCM</p></div><div class=\\"relative\\"><div class=\\"absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white\\"></div><span class=\\"font-bold text-primary\\">2020</span><h3 class=\\"font-semibold\\">Mở Rộng Kênh Online</h3><p class=\\"text-sm text-muted-foreground\\">Khai trương website thương mại điện tử chuyên nghiệp</p></div><div class=\\"relative\\"><div class=\\"absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white\\"></div><span class=\\"font-bold text-primary\\">2024</span><h3 class=\\"font-semibold\\">Đạt Cột Mốc Mới</h3><p class=\\"text-sm text-muted-foreground\\">Lọt top 10 thương hiệu mỹ phẩm được yêu thích nhất toàn quốc</p></div></div></div></div>"}', true, NOW(), NOW()),
(2, 'TESTIMONIALS', 'Ban Điều Hành GlowSkin', 5, '{"filter": "management-team"}', true, NOW(), NOW());

-- ==========================================
-- 5. CÁC SECTION CHO TRANG LIÊN HỆ (ID = 3, SLUG: 'contact')
-- ==========================================
-- Sắp xếp vị trí tăng dần từ 1 đến 2
INSERT INTO page_sections (page_id, type, title, position, config_json, active, created_at, updated_at) VALUES
(3, 'HERO_SECTION', 'Liên Hệ Chúng Tôi', 1, '{"subtitle": "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với GlowSkin bất cứ khi nào bạn cần.", "backgroundColor": "#f8fafc"}', true, NOW(), NOW()),
(3, 'CUSTOM_HTML', 'Bản Đồ Cửa Hàng & Hotline', 2, '{"html": "<div class=\\"py-12 bg-white\\"><div class=\\"container mx-auto px-4 grid md:grid-cols-2 gap-8\\"><div><h3 class=\\"text-xl font-bold mb-4\\">Văn Phòng GlowSkin</h3><p class=\\"text-muted-foreground mb-2\\"><strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p><p class=\\"text-muted-foreground mb-2\\"><strong>Hotline:</strong> 1900 1234 (8:00 - 22:00)</p><p class=\\"text-muted-foreground mb-6\\"><strong>Email:</strong> support@glowskin.vn</p></div><div class=\\"rounded-xl overflow-hidden h-[300px]\\"><iframe src=\\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4469!2d106.7000!3d10.7730!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzIyLjgiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1sen!2s!4v1234567890\\" width=\\"100%\\" height=\\"100%\\" style=\\"border:0;\\" allowfullscreen=\\"\\" loading=\\"lazy\\"></iframe></div></div></div>"}', true, NOW(), NOW());

-- ==========================================
-- 6. CÁC SECTION CHO TRANG MÃ GIẢM GIÁ (ID = 4, SLUG: 'vouchers')
-- ==========================================
-- Sắp xếp vị trí tăng dần từ 1 đến 2
INSERT INTO page_sections (page_id, type, title, position, config_json, active, created_at, updated_at) VALUES
(4, 'HERO_SECTION', 'Mã Giảm Giá & Voucher', 1, '{"subtitle": "Sử dụng các mã ưu đãi dưới đây để nhận được mức giá tốt nhất cho lộ trình chăm sóc da của bạn.", "backgroundColor": "#fffbeb"}', true, NOW(), NOW()),
(4, 'CUSTOM_HTML', 'Danh Sách Vouchers Tích Cực', 2, '{}', true, NOW(), NOW());

-- ==========================================
-- 7. CÁC SECTION CHO TRANG SỰ KIỆN 8/3 (ID = 5, SLUG: 'mung-8-3')
-- ==========================================
-- Sắp xếp vị trí tăng dần từ 1 đến 4
INSERT INTO page_sections (page_id, type, title, position, config_json, active, created_at, updated_at) VALUES
(5, 'HERO_SECTION', 'Yêu Thương Phái Đẹp', 1, '{"subtitle": "Chào mừng ngày Quốc tế Phụ nữ 8/3 — GlowSkin gửi tặng bạn ưu đãi lên đến 50% cùng quà tặng đặc biệt", "backgroundColor": "#fff0f6"}', true, NOW(), NOW()),
(5, 'CUSTOM_HTML', 'Mã Giảm Giá 8/3', 2, '{}', true, NOW(), NOW()),
(5, 'BENEFITS', 'Set Quà Tặng Đặc Biệt', 3, '{}', true, NOW(), NOW()),
(5, 'FEATURED_PRODUCTS', 'Gợi Ý Quà Tặng', 4, '{}', true, NOW(), NOW());

-- ==========================================
-- 8. CÁC SECTION CHO TRANG KHUYẾN MÃI (ID = 6, SLUG: 'sale')
-- ==========================================
-- Sắp xếp vị trí tăng dần từ 1 đến 3
INSERT INTO page_sections (page_id, type, title, position, config_json, active, created_at, updated_at) VALUES
(6, 'HERO_SECTION', 'MEGA SALE EVENT', 1, '{"subtitle": "Săn ngay ngàn ưu đãi với mức giá giảm sốc chưa từng có.", "backgroundColor": "#fef2f2"}', true, NOW(), NOW()),
(6, 'CUSTOM_HTML', 'KHO VOUCHER', 2, '{}', true, NOW(), NOW()),
(6, 'FEATURED_PRODUCTS', 'Sản Phẩm Đang Giảm Giá Sâu', 3, '{"filter": "sale"}', true, NOW(), NOW());

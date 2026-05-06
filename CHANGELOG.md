# Changelog

## [2026-04-08]

### Added

- **Kiến trúc Modular**: Chuyển đổi thành công hệ thống monolith sang kiến trúc plugin modular (`core.min.js`, `tracker.min.js`) qua `loader.js`. Tự động tạo SRI hash trong build pipeline.
- **Glassmorphism Dashboard Pro Max**: Giao diện tabbed chuyên nghiệp, dark/light mode mixed, form nhập liệu sang trọng hỗ trợ live config.
- **Pháo Hoa "Cờ Việt Nam" (FLAG)**: Thuật toán canvas sampling đa sắc (multi-color) riêng biệt để ghép ngôi sao vàng và viền cờ đỏ vào một vụ nổ pháo hoa hoàn hảo.
- **Pháo Hoa "Cúc Đại Đóa (Chrysanthemum)" và "Vòng Khuyên (Ring)"**: Bổ sung bộ sưu tập pháo hoa nhóm Thường (Normal) thành 4 loại để tăng trải nghiệm.

### Changed

- Cân bằng tỷ lệ (Drop Rate) bùng nổ pháo hoa: 90% các hạ/sparks là Sao Vàng nền, 10% là Pháo Hoa Chính (VIP).
- Trong 10% Pháo Hoa Chính, thiết lập tỷ lệ chia đều 50% Nhóm Thường (Peony, Willow, Chrysanthemum, Ring) và 50% Nhóm VIP (Ngôi Sao Vàng, "30 - 04", "1975-2026", "TỰ HÀO VIỆT NAM", Cờ VN).
- Tinh chỉnh vật lý pháo hoa: tốc độ bay lên chậm rãi, thời gian phân rã lâu hơn để tạo ấn tượng cho các dòng chữ VIP.

### Removed

- Chặn đứng 100% việc bắn pháo hoa chữ xuất hiện quá dài/quá nhanh gây loạn màn hình.
- Loại bỏ hiệu ứng Chim Bồ Câu (Dove) và Hoa Mộc Miên (Flame) để dồn tài nguyên toàn lực vào hiệu ứng đêm sao và pháo hoa đại bác VIP.

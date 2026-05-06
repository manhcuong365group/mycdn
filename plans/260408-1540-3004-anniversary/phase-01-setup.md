# Phase 01: Setup & Asset Preparation

Status: ⬜ Pending
Dependencies: None

## Objective

Khởi tạo cấu trúc file và chuẩn bị logic vẽ các thành phần cơ bản cho bộ hiệu ứng 30/04.

## Requirements

### Functional

- [x] Tạo file `src/effects/victory.js` để chứa logic của bộ hiệu ứng mới.
- [x] Khai báo các loại particle mới: `Star`, `Dove`, `Firework`, `FlameFlower`.
- [x] Đăng ký hiệu ứng `victory` trong `src/effects/index.js`.

### Non-Functional

- [ ] Tối ưu hóa memory khi tải assets (sử dụng Canvas drawing thay vì ảnh nếu có thể).

## Implementation Steps

1. [ ] Tạo file [src/effects/victory.js](file:///D:/Manh_Cuong/laragon/www/holiday-effects-cdn/src/effects/victory.js) với khung code cơ bản.
2. [ ] Viết hàm `drawStar(ctx, x, y, radius, points, inset)` để vẽ ngôi sao 5 cánh.
3. [ ] Viết hàm `drawDove(ctx, x, y, size)` (đường bao cơ bản).
4. [ ] Cập nhật [src/effects/index.js](file:///D:/Manh_Cuong/laragon/www/holiday-effects-cdn/src/effects/index.js) để export module `victory`.

## Test Criteria

- [ ] File mới tồn tại và không gây lỗi syntax khi build.
- [ ] Các hàm vẽ cơ bản hiển thị đúng hình dạng mong muốn trên canvas test.

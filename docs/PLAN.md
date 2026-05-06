# 📋 Kế hoạch cải tiến Holiday Effects CDN

## 🎯 Mục tiêu

- **Trải nghiệm người dùng**: Tạo Dashboard trực quan để xem trước và tùy chỉnh hiệu ứng mà không cần động vào code.
- **Kỹ thuật**: Refactor mã nguồn thành module, fix lỗi hiển thị trên Android.
- **Tính năng**: Cho phép cá nhân hóa hình ảnh hiệu ứng (thay hoa mai bằng logo, ảnh bất kỳ).

## 🛠 Lộ trình thực hiện (Phase 2)

### 1. Xây dựng Admin Dashboard (`index.html`)

- Giao diện Premium (Glassmorphism).
- Hệ thống Control Panel: Select Effect, Sliders (Count, Speed, Size), Banner Toggle.
- Live Preview: Thay đổi thông số là hiệu ứng cập nhật ngay lập tức.
- Code Generator: Nút "Copy Embed Code".

### 2. Refactor Core Library (`holiday-effects-full.js`)

- Tách logic thành các Class: `CanvasManager`, `ParticleSystem`, `BannerSystem`.
- Tối ưu hóa Loop: Chuyển sang dùng `requestAnimationFrame` chuẩn hóa (fix lag/black screen).
- Thêm cơ chế `Observer`: Tự động phục hồi canvas nếu bị mất context (thường gặp trên Android).

### 3. Sửa lỗi (Bug Fixes)

- Fix lỗi màn hình đen trên Android Chrome.
- Fix lỗi nút Download không hiển thị (nếu có xung đột z-index).
- Tối ưu mức độ chiếm dụng CPU/RAM trên Mobile.

## 🧪 Kiểm thử

- Chạy `lighthouse_audit.py` để đảm bảo không tụt điểm Core Web Vitals.
- Test tương thích trên 3 trình duyệt (Chrome, Safari, Firefox).

# Phase 02: Implementing 30/04 Effects

Status: ⬜ Pending
Dependencies: Phase 01

## Objective

Hiện thực hóa logic chuyển động và sinh hạt (particle) cho 4 hiệu ứng chính.

## Requirements

### Functional

- [ ] **Fireworks**: Hệ thống hạt nổ từ tâm, có gravity và friction. Màu: Đỏ rực và Vàng kim.
- [ ] **Golden Stars**: Hiệu ứng hạt rơi từ trên xuống, có xoay và phóng to/thu nhỏ nhẹ (pulsing).
- [ ] **Peace Doves**: Chuyển động lượn sóng bay lên từ dưới màn hình.
- [ ] **Flame Flowers**: Cánh hoa rơi lả tả, có hiệu ứng chao nghiêng (swaying).

### Non-Functional

- [ ] Đảm bảo FPS > 60 trên cả desktop và mobile.
- [ ] Giới hạn số lượng particle tối đa (config qua config.json).

## Implementation Steps

1. [ ] Code logic Particle System cho Pháo hoa trong `victory.js`.
2. [ ] Code logic Fall System cho Ngôi sao và Hoa Phượng.
3. [ ] Code logic Path Animation cho Chim bồ câu.
4. [ ] Tích hợp cơ chế Update và Draw vào vòng lặp chính của Core.

## Test Criteria

- [ ] Hiệu ứng hiển thị đúng màu sắc và chuyển động như mô tả.
- [ ] Không có memory leak khi chạy lâu.

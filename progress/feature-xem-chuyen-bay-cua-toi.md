# Tiến độ nhánh feature/xem-chuyen-bay-cua-toi

## Task hiện tại

- Chức năng: 99.6 Xem chuyến bay của tôi, không cần đăng nhập.
- Nhánh: `feature/xem-chuyen-bay-cua-toi` từ `origin/develop` 8d4e1a8.
- Cập nhật: 2026-11-17.

## Đã xong

- Đối chiếu Backend develop: POST tra cứu công khai cần ba trường và CSRF; response chỉ chứa chuyến bay.
- Kiểm tra Figma: không có frame riêng; dùng phong cách B2C Trang chủ & Tìm vé.

## Đang dở

- Kiểm thử cuối sau merge develop, commit và push.

## Việc tiếp theo

1. Build/test sau merge, commit và push.
2. Cung cấp link tạo PR riêng vào develop.

## Quyết định đã chốt

- Không hiển thị dữ liệu hành khách/thanh toán hoặc trạng thái đặt chỗ không có trong response.
- Không yêu cầu đăng nhập; không bỏ qua CSRF.
- Chưa có Backend/tài khoản thử để xác nhận API thật trong phiên này.

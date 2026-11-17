# Tiến độ nhánh feature/chat-admin

## Task hiện tại

- Chức năng: 99.3 Chat Messenger với Admin.
- Nhánh: `feature/chat-admin`.
- Cập nhật: 2026-11-17.

## Đã xong

- Kiểm tra FE develop và Figma: không có frame Chat; dùng phong cách trang chủ và shell quản trị hiện có.
- Đối chiếu Backend develop: Chat dùng REST, không có WebSocket/SSE; khách đã đăng nhập và Admin có endpoint riêng.

## Đang dở

- Kiểm thử lại sau khi merge develop, commit và push.

## Việc tiếp theo

1. Build/test cuối, commit và push.
2. Cung cấp link tạo PR vào develop.

## Quyết định đã chốt

- Không hiển thị tin giả; chỉ hiển thị tin từ GET hoặc POST thành công.
- Gọi GET định kỳ khi popup/trang Admin mở vì Backend chỉ hỗ trợ REST.
- Widget dành cho KHACH_HANG đã đăng nhập; trang hội thoại chỉ ADMIN. Không có tài khoản thử hoặc Backend đang chạy để xác nhận API thật trong phiên này.

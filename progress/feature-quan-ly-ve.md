# Tiến độ nhánh feature/quan-ly-ve

## Task hiện tại

- Chức năng: Quản lý bán vé, FE only.
- Nhánh: `feature/quan-ly-ve`.
- Cập nhật: 2026-11-17.

## Đã xong

- Đối chiếu Figma các frame danh sách, sửa nhanh và trạng thái trống.
- Kiểm tra hợp đồng Backend develop qua GitHub: GET danh sách, PUT sửa, GET PDF; chưa thấy API hủy vé.

## Đang dở

- Task 1: danh sách, tìm kiếm, lọc, phân trang và trạng thái tải/lỗi.

## Việc tiếp theo

1. Build/test và commit Task 1.
2. Modal hủy vé theo hợp đồng hiện có.
3. Form sửa vé và validation.
4. Xuất PDF, build/test, merge develop, push và chuẩn bị PR.

## Quyết định đã chốt

- Không dùng dữ liệu giả, không gọi API hủy chưa có hợp đồng.
- Chỉ làm FE; dùng cookie HttpOnly và CSRF từ apiClient.

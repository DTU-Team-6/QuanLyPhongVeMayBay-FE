# Tiến độ nhánh feature/quan-ly-ve

## Task hiện tại

- Chức năng: Quản lý bán vé, FE only.
- Nhánh: `feature/quan-ly-ve`.
- Cập nhật: 2026-11-17.

## Đã xong

- Đối chiếu Figma các frame danh sách, sửa nhanh và trạng thái trống.
- Kiểm tra hợp đồng Backend develop qua GitHub: GET danh sách, PUT sửa, GET PDF; chưa thấy API hủy vé.
- Task 1 đã commit `30f93e2`: danh sách, tìm kiếm, lọc, phân trang; build thành công, 17/17 test FE qua.
- Task 2 đã commit `34f4c3f`: modal xác nhận, chặn hủy vì thiếu API; build thành công, 17/17 test FE qua.
- Task 3 đã commit `fced21d`: form sửa, validation, lỗi HTTP; build thành công, 19/19 test FE qua.

## Đang dở

- Task 4: tải PDF thật từ Backend.

## Việc tiếp theo

1. Build/test và commit Task 4.
2. Kiểm thử trình duyệt, merge develop, push và chuẩn bị PR.

## Quyết định đã chốt

- Không dùng dữ liệu giả, không gọi API hủy chưa có hợp đồng.
- Chỉ làm FE; dùng cookie HttpOnly và CSRF từ apiClient.

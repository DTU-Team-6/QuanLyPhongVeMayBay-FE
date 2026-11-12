# Tiến độ nhánh Quản lý nhân viên

## Task hiện tại

- Chức năng: Quản lý nhân viên (Danh sách → Thêm → Sửa → Xóa)
- Nhánh: `feature/quan-ly-nhan-vien`
- Cập nhật lần cuối: 12/11/2026

## Đã xong (đã commit)

- Danh sách: khung trang quản trị, bảng, tìm kiếm, phân trang, trạng thái tải/trống/lỗi; service GET theo hợp đồng ở nhánh Backend `feature/danh-sach-nhan-vien`.
- API service cho POST, PUT, DELETE theo DTO/controller của Backend `develop`; kiểu dữ liệu dùng JSDoc theo stack JavaScript.
- `npm run build` thành công; `npm test` đạt 10/10.

## Đang dở

- GET danh sách chưa có trên Backend `develop`; chưa thể kiểm thử dữ liệu thật.
- Các nút Thêm/Sửa/Xóa đã ở đúng vùng trên trang Danh sách nhưng chưa nối tới form/modal.
- Chưa đối chiếu bằng ảnh riêng của form Thêm, form Sửa và modal Xóa.

## Việc tiếp theo

1. Nhận và xem ảnh Figma chi tiết cho Thêm/Sửa/Xóa.
2. Triển khai form Thêm và kiểm thử/commit.
3. Triển khai form Sửa và kiểm thử/commit.
4. Triển khai xác nhận Xóa và kiểm thử/commit.
5. Khi Backend merge GET danh sách, đồng bộ hợp đồng và kiểm thử API thật.

## Quyết định đã chốt và lưu ý

- Không đổi stack JavaScript sang TypeScript; dùng JSDoc cho kiểu dữ liệu.
- Không bật `allow-unsecured` hay bỏ qua Spring Security.
- API nhân viên chỉ dành cho vai trò `ADMIN` trên Backend `develop`.

## Lỗi đang gặp

- Figma MCP: `You've reached the Figma MCP tool call limit on the Starter plan.`

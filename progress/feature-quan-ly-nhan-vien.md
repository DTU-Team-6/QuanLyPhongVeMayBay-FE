# Tiến độ nhánh Quản lý nhân viên

## Task hiện tại

- Chức năng: Quản lý nhân viên (Danh sách → Thêm → Sửa → Xóa)
- Nhánh: `feature/quan-ly-nhan-vien`
- Cập nhật lần cuối: 12/11/2026

## Đã xong (đã commit)

- Danh sách: khung trang quản trị, bảng, tìm kiếm, phân trang, trạng thái tải/trống/lỗi; service GET theo hợp đồng ở nhánh Backend `feature/danh-sach-nhan-vien`.
- API service cho POST, PUT, DELETE theo DTO/controller của Backend `develop`; kiểu dữ liệu dùng JSDoc theo stack JavaScript.
- `npm run build` thành công; `npm test` đạt 10/10.
- Thêm: trang nhập theo Figma frame `1:3265`, validation tại trường, hiển thị lỗi API và chống gửi trùng; POST `/api/v1/nhan-vien`. `npm run build` thành công; `npm test` đạt 13/13.
- Sửa: mở trang theo Figma frame `1:3123` từ bản ghi được chọn; chỉ gửi các trường PUT hỗ trợ, mã NV khóa chỉnh sửa. `npm run build` thành công; `npm test` đạt 13/13.
- Xóa: hộp thoại xác nhận theo Figma frame `1:2809`; chỉ gọi DELETE sau nút xác nhận, hiển thị lỗi và chống gửi trùng. Backend thực hiện soft delete. `npm run build` thành công; `npm test` đạt 13/13.
- Đã mở giao diện trên trình duyệt với API mô phỏng chỉ chạy cục bộ: danh sách hiển thị 8 dòng, mở/đóng trang Thêm và Sửa, mở/hủy hộp thoại Xóa; console không có lỗi. Dữ liệu mô phỏng không nằm trong source.
- Khi chưa đăng nhập Admin, trang vẫn hiển thị bố cục danh sách và mở được form Thêm để xem; không gọi API danh sách, các nút tìm kiếm/lưu bị khóa và không có dữ liệu nhân viên giả. Đã kiểm tra trên trình duyệt không có Backend; `npm run build` thành công, `npm test` đạt 13/13.

## Đang dở

- GET danh sách chưa có trên Backend `develop`; chưa thể kiểm thử dữ liệu thật.
- Figma có hai trường `Tài khoản` và `Chi nhánh` mà DTO Backend `develop` không nhận; chưa có hợp đồng để lưu hai trường này.
- Chưa thử POST/PUT/DELETE với Backend thật hoặc tài khoản Admin thật.

## Việc tiếp theo

1. Khi Backend merge GET danh sách, đồng bộ hợp đồng và kiểm thử API thật.
2. Kiểm tra giao diện và luồng CRUD trên trình duyệt có phiên Admin khi Backend chạy.

## Quyết định đã chốt và lưu ý

- Không đổi stack JavaScript sang TypeScript; dùng JSDoc cho kiểu dữ liệu.
- Không bật `allow-unsecured` hay bỏ qua Spring Security.
- API nhân viên chỉ dành cho vai trò `ADMIN` trên Backend `develop`.
- GET danh sách từ nhánh Backend `feature/danh-sach-nhan-vien` yêu cầu `tieuChi` và `tuKhoa` đi cùng nhau; ô tìm kiếm trống gọi danh sách không lọc.

## Lỗi đang gặp

- Figma MCP: `You've reached the Figma MCP tool call limit on the Starter plan.`

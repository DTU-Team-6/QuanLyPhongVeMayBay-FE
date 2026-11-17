# Tiến độ nhánh Quản lý nhân viên

## Task hiện tại

- Chức năng: Quản lý nhân viên (Danh sách → Thêm → Sửa → Xóa)
- Nhánh: `feature/quan-ly-nhan-vien`
- Cập nhật lần cuối: 17/11/2026

## Đã xong (đã commit)

- Danh sách: khung trang quản trị, bảng, tìm kiếm, phân trang, trạng thái tải/trống/lỗi; service GET theo hợp đồng ở nhánh Backend `feature/danh-sach-nhan-vien`.
- API service cho POST, PUT, DELETE theo DTO/controller của Backend `develop`; kiểu dữ liệu dùng JSDoc theo stack JavaScript.
- `npm run build` thành công; `npm test` đạt 10/10.
- Thêm: trang nhập theo Figma frame `1:3265`, validation tại trường, hiển thị lỗi API và chống gửi trùng; POST `/api/v1/nhan-vien`. `npm run build` thành công; `npm test` đạt 13/13.
- Sửa: mở trang theo Figma frame `1:3123` từ bản ghi được chọn; chỉ gửi các trường PUT hỗ trợ, mã NV khóa chỉnh sửa. `npm run build` thành công; `npm test` đạt 13/13.
- Xóa: hộp thoại xác nhận theo Figma frame `1:2809`; chỉ gọi DELETE sau nút xác nhận, hiển thị lỗi và chống gửi trùng. Backend thực hiện soft delete. `npm run build` thành công; `npm test` đạt 13/13.
- Đã mở giao diện trên trình duyệt với API mô phỏng chỉ chạy cục bộ: danh sách hiển thị 8 dòng, mở/đóng trang Thêm và Sửa, mở/hủy hộp thoại Xóa; console không có lỗi. Dữ liệu mô phỏng không nằm trong source.
- Khi chưa đăng nhập Admin, trang vẫn hiển thị bố cục danh sách và mở được form Thêm để xem; không gọi API danh sách, các nút tìm kiếm/lưu bị khóa và không có dữ liệu nhân viên giả. Đã kiểm tra trên trình duyệt không có Backend; `npm run build` thành công, `npm test` đạt 13/13.
- Đã đồng bộ `origin/develop` tại `8737bce` bằng fast-forward, không có conflict. Backend `develop` tại `d7a8022` chưa có GET `/api/v1/nhan-vien`.
- Thêm đăng nhập qua `POST /api/v1/auth/login`, lấy CSRF qua `GET /api/v1/auth/csrf`; chỉ Admin được mở thao tác quản trị, form Sửa và Xóa kiểm tra lại quyền trước khi gửi. Bỏ đường gọi refresh vì Backend `develop` hiện không có endpoint đó.
- Kiểm tra bằng trình duyệt: khi chưa đăng nhập, trang nhân viên không tải dữ liệu, không hiện nút Thêm, các ô tìm kiếm bị khóa; liên kết Đăng nhập Admin mở form đăng nhập. `npm run build` thành công, `npm test` đạt 17/17.
- Ngày 17/11: FE `origin/develop` vẫn là tổ tiên của nhánh tính năng (`git merge --ff-only origin/develop`: `Already up to date`). Bỏ fallback API URL viết cứng; cần `VITE_API_BASE_URL` trong `.env` (file này được ignore). Danh sách kiểm tra cấu trúc response, ngăn phản hồi lỗi thành trạng thái rỗng; chống kết quả tìm kiếm cũ ghi đè, kiểm tra lại phiên khi CRUD nhận 401. Modal Xóa có phím Escape và focus ban đầu ở Hủy.
- Kiểm tra trình duyệt ở desktop và mobile 390 px: trang Danh sách không lộ dữ liệu/chức năng khi chưa đăng nhập, link đăng nhập mở đúng route; form đăng nhập hiển thị đúng và validation `required` chặn gửi rỗng. Không kiểm thử trực quan form Thêm/Sửa/modal Xóa với phiên Admin vì chưa có Backend hoạt động. `npm run build` thành công, `npm test` đạt 19/19 tại thời điểm ghi.

## Đang dở

- GET danh sách chưa có trên Backend `develop`; chưa thể kiểm thử dữ liệu thật.
- Figma có hai trường `Tài khoản` và `Chi nhánh` mà DTO Backend `develop` không nhận; chưa có hợp đồng để lưu hai trường này.
- Backend không chạy ở `localhost:8080` trong phiên này và chưa có thông tin đăng nhập Admin; chưa thử POST/PUT/DELETE với dữ liệu thật.

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

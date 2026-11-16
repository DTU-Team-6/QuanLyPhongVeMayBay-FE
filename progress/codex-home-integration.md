# Tiến độ task 1

- Nhánh: codex/home-integration
- Ngày: 16/11/2026
- Phạm vi: Layout chung, Trang chủ và Top 10 chuyến bay, tích hợp phiên đăng nhập.

## Đã kiểm tra
- Baseline origin/develop 8737bce: npm test 17/17 đạt, npm run build đạt.
- API TopCheapFlightResponse có tổng giá vé, tiền tệ, mốc giờ và múi giờ; FE giữ nguyên dữ liệu API.
- AuthController có GET csrf, POST login, GET me. BE agent đang bổ sung POST logout.

## Đang làm
- Loại bỏ dữ liệu mock ở danh sách chuyến bay; tách Loading/Empty/Error; hủy request khi rời trang.
- Hiển thị ngày theo sân bay, giá tổng/đơn vị và nối nút xem chuyến vào trang tìm kiếm.
- Header responsive, menu theo vai trò, trạng thái kiểm tra phiên và báo lỗi đăng xuất.
- Form đăng nhập nối API và khởi tạo CSRF cho request thay đổi dữ liệu.

## Tiếp theo
- Kiểm tra lại unit/build và browser với BE chạy thật.
- Phản biện độc lập trước commit/push do agent chính thực hiện.

## Kiểm tra sau thay đổi
- npm test: 22/22 đạt (gồm timezone URL và cookie/CSRF/RFC 9457/AbortError).
- npm run build: đạt; cảnh báo bundle trên 500 kB đã có ở baseline.
- Chưa chạy kiểm thử trình duyệt với BE thật; agent chính thực hiện.
- Không commit/push bởi subagent.

- QA độc lập: không còn P1/P2; browser thực với BE/MySQL QA: giá/chặng khớp, login/logout + reload pass.

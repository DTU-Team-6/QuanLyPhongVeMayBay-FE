# Tiến độ báo cáo

- Nhánh codex/report-integration, task 2, ngày 16/11/2026.
- Dùng AdminShell có sẵn theo Figma; route báo cáo tách khỏi MainLayout.
- Bộ lọc hợp lệ được chụp tại lúc gửi; request bị hủy khi tải mới/rời trang/thay tài khoản.
- GET /reports/generate cho báo cáo chính, kỳ trước, dữ liệu thời gian và hãng riêng cho biểu đồ.
- Loại bỏ toàn bộ dữ liệu giả và tỷ lệ kỳ trước giả. Khi kỳ trước lỗi, hiển thị thiếu dữ liệu.
- Bảng thời gian không ghép ngày kỳ trước sai key; đối chiếu tổng ở KPI, biểu đồ dùng mốc thực theo vị trí trong từng kỳ.
- CSV dùng số liệu báo cáo đã tạo, tên CSV đúng loại file, bảo vệ công thức trong tên đối tượng.

## Đang làm
- Chạy unit/build và review độc lập; chưa commit/push.

## Kết quả kiểm tra
- npm test: 28/28 đạt; npm run build đạt (cảnh báo bundle >500 kB có từ baseline).
- git diff --check sạch.
- Đã sửa P2 do QA độc lập chỉ ra: kiểm tra lại phiên khi API 401; bổ sung biểu đồ nhân viên cho chế độ chỉ biểu đồ.
- Có test snapshot, request hủy, lỗi kỳ trước, response sai kỳ, RFC status giữ nguyên; test ngày thật/enum, CSV và dữ liệu tỷ trọng.
- Chưa commit/push; đang chờ agent chính kiểm thử tích hợp/browser và QA phản biện lần cuối.

- QA re-review chấp thuận; browser BE thật: KPI/bảng/chart đúng fixture 3.000.000 VND, validate ngày đảo và empty state PASS.

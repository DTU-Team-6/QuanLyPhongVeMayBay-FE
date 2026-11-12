# Báo cáo tiến độ: feature/tao-bao-cao-thong-ke

> Cập nhật theo quy ước tại `agents-docs/PROGRESS_TEMPLATE.md` và `AGENTS.md`.

## Task hiện tại

- **Chức năng**: Xây dựng màn hình Tạo báo cáo (SRS 6.5.4.1) và Kết quả thống kê (SRS 6.5.4.2) theo thiết kế Figma `186:3277` và `186:5696`.
- **Nhánh Git**: `feature/tao-bao-cao-thong-ke` (tách từ `develop` tại commit `5d83b1f`).
- **Cập nhật lần cuối**: 12/11/2026 12:02 - Antigravity Assistant.

---

## Đã xong (đã phân tích & chuẩn bị sẵn sàng)

1. **Hoàn thành Task 1 và đã merge vào `develop` (PR #5 - commit `5d83b1f`)**:
   - Layout Header (điều hướng, trạng thái đăng nhập) và Footer (bản quyền, đối tác, liên hệ) chuẩn Figma.
   - Trang chủ (`HomePage.jsx`) với banner, form tìm kiếm chuyến bay khứ hồi / một chiều, dịch vụ tiện ích.
   - Khu vực Top 10 chuyến bay giá rẻ nhất (`TopCheapFlightsSection.jsx`), gọi API `/flights/top-cheap`, xử lý đầy đủ Skeleton loading và Empty state.
   - Toàn bộ hình ảnh, icon tĩnh tải trực tiếp từ CDN Figma với dung lượng chuẩn (12 asset bao gồm `hanoi-promo.png` 2.07MB).

2. **Khởi tạo nhánh làm việc cho Task 2**:
   - Tạo nhánh `feature/tao-bao-cao-thong-ke` tách từ commit mới nhất `develop` (`5d83b1f`).
   - Đảm bảo tuân thủ nguyên tắc Git của nhóm: 1 chức năng = 1 branch riêng biệt, không gộp và đợi.

3. **Phân tích toàn diện đặc tả SRS v1.2 (Mục 6.5.4.1 & 6.5.4.2)**:
   - Mục 6.5.4.1: Form chọn khoảng thời gian (`startDate`, `endDate`), loại báo cáo (`LoaiBaoCao`), tiêu chí gom nhóm (`TieuChiThongKe`), hãng bay (`maHang`), nhân viên (`nhanVienId`), nút tạo báo cáo.
   - Mục 6.5.4.2: Kết quả thống kê dạng Bảng (Table) và Biểu đồ (Chart).

4. **Trích xuất thông số kỹ thuật từ bản thiết kế Figma (FileKey: `G9EkRbj6ldsZqNv1IOK2Sk`)**:
   - **Node `186:3277` ("Staff • Thống kê báo cáo — Bảng")**:
     - Sidebar nghiệp vụ nhân viên ("Thông tin nhân viên", "Quản lý khách hàng", "Quản lý bán vé", "Tìm vé & Đặt vé", "Thống kê báo cáo").
     - Breadcrumb: `Nhân viên / Thống kê báo cáo` • `Vân Việt • HCM`.
     - Bộ lọc: Chọn kiểu hiển thị (Bảng / Biểu đồ đường / Biểu đồ tròn), Báo cáo theo (Doanh thu phòng vé / Top nhân viên bán hàng / Hãng hàng không), Khoảng thời gian nhanh (Tuần này, Tháng này, Quý, Năm), Từ ngày - Đến ngày, Checkbox "So sánh với kỳ trước", Nút "Xem báo cáo".
     - Thẻ chỉ số KPI: Tổng doanh thu (VNĐ, % tăng trưởng), Số vé đã bán, Tăng trưởng doanh thu.
     - Bảng xếp hạng Top nhân viên / doanh thu: Hạng (#1, #2...), Tên nhân viên / Hãng bay, Số vé, Doanh thu, Kỳ trước, Chênh lệch, Tăng trưởng (%).
   - **Node `186:5696` ("Admin • Thống kê báo cáo — Biểu đồ")**:
     - Biểu đồ đường (Line chart SVG) thể hiện doanh thu theo ngày/kỳ: trục giá trị, 2 đường biểu diễn (Kỳ hiện tại `#0284c7` & Kỳ trước `#cbd5e1`), các mốc ngày `26/10` -> `01/11`.
     - Biểu đồ tròn / thanh tỷ trọng doanh thu theo hãng hàng không (Vietnam Airlines 55%, Vietjet Air 30%, Bamboo Airways 15%).
     - Hộp thông báo tổng kết màu xanh `#ecfdf5`.
     - Các nút thao tác: Quay lại bộ lọc, In báo cáo (`window.print`), Xuất Excel.

5. **Đối chiếu và xác thực API Backend Spring Boot (`QuanLyPhongVeMayBay-BE`)**:
   - Controller: `com.team6.quanlyvemaybay.controller.BaoCaoController` (`/api/v1/reports`).
   - `POST /api/v1/reports`: Nhận body JSON `ReportFilterRequest` (`startDate`, `endDate`, `reportType`, `groupBy`, `maHang`, `nhanVienId`, `trangThaiDatCho`).
   - `GET /api/v1/reports/generate`: Nhận query params tương tự.
   - Enum `LoaiBaoCao`: `THEO_HANG`, `THEO_NHAN_VIEN`, `THEO_THOI_GIAN`.
   - Enum `TieuChiThongKe`: `DAY`, `MONTH`, `YEAR`.
   - Trả về: `ApiResponse<ReportResponse>` gồm `summary` (`tongSoDonDatCho`, `tongSoVe`, `tongGiaGoc`, `tongDoanhThu`, `tongLoiNhuan`) và `items` danh sách `ReportItemDto` (`key`, `label`, `soDonDatCho`, `soVeBanRa`, `tongGiaGoc`, `doanhThu`, `loiNhuan`).

---

## Đang dở (cần triển khai tiếp theo)

1. Tạo file service gọi API: `src/services/reportService.js` (kết nối qua `apiClient.js`).
2. Xây dựng Form tạo báo cáo (SRS 6.5.4.1): `src/features/reports/components/ReportFilterForm.jsx`.
   - Date picker từ ngày/đến ngày + preset chọn nhanh (Tuần này, Tháng này, Quý này, Năm nay).
   - Chọn loại báo cáo + tiêu chí gom nhóm + chế độ xem (Bảng / Biểu đồ).
   - Validation: `startDate` và `endDate` không rỗng, `startDate <= endDate`.
3. Xây dựng Giao diện Kết quả thống kê (SRS 6.5.4.2):
   - Thẻ tóm tắt chỉ số KPI: `ReportSummaryCards.jsx`.
   - Chế độ xem Bảng số liệu: `ReportTableView.jsx` (khớp Figma `186:3277`).
   - Chế độ xem Biểu đồ: `ReportChartView.jsx` (khớp Figma `186:5696`).
   - Thanh thao tác: In báo cáo, Xuất Excel/CSV, Quay lại bộ lọc.
4. Tích hợp Trang `src/features/reports/pages/ReportPage.jsx` và gắn route `/bao-cao`.
5. Viết unit test cho validation logic của form báo cáo.

---

## Việc tiếp theo (theo thứ tự)

1. Tạo `src/services/reportService.js`.
2. Tạo module `src/features/reports/`:
   - `ReportFilterForm.jsx`
   - `ReportSummaryCards.jsx`
   - `ReportTableView.jsx`
   - `ReportChartView.jsx`
   - `ReportPage.jsx`
3. Cập nhật routes trong `src/app/routes.jsx` và menu điều hướng.
4. Viết test validation và chạy `npm test`, `npm run build`.
5. Commit nhánh `feature/tao-bao-cao-thong-ke` và đẩy lên remote để tạo Pull Request.

---

## Quyết định đã chốt và lưu ý

- Sử dụng `apiClient.js` sẵn có với tiền tố `/api/v1` và cookie HttpOnly, không sửa cứng URL.
- Định dạng tiền tệ hiển thị bằng `formatCurrency` trong `src/utils/formatters.js`, không tự tính lại tiền sai lệch với BE.
- Biểu đồ thực hiện bằng SVG / Tailwind responsive sắc nét, tương thích hoàn toàn với React 19 mà không gây xung đột dependency.
- Nhớ xóa file `progress/feature-tao-bao-cao-thong-ke.md` trước khi merge vào `develop`.

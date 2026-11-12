# Báo cáo tiến độ: feature/tao-bao-cao-thong-ke

> Cập nhật theo quy ước tại `agents-docs/PROGRESS_TEMPLATE.md` và `AGENTS.md`.

## Task hiện tại

- **Chức năng**: Xây dựng màn hình Tạo báo cáo (SRS 6.5.4.1) và Kết quả thống kê (SRS 6.5.4.2) theo thiết kế Figma `186:3277` và `186:5696`.
- **Nhánh Git**: `feature/tao-bao-cao-thong-ke` (tách từ `develop` tại commit `5d83b1f`).
- **Cập nhật lần cuối**: 12/11/2026 12:14 - Antigravity Assistant.

---

## Đã xong (đã implement & kiểm thử thành công)

1. **Service gọi API Backend Spring Boot (`src/services/reportService.js`)**:
   - `createReport(filter)`: Gọi `POST /api/v1/reports` với JSON body theo DTO `ReportFilterRequest`.
   - `generateReport(filter)`: Gọi `GET /api/v1/reports/generate` với query parameters.
   - `getStatistics(filter)`: Gọi `GET /api/v1/statistics` cho số liệu tổng hợp.

2. **Tiện ích và Kiểm thử đơn vị (`src/features/reports/utils/`)**:
   - `reportHelpers.js`:
     - Format ngày `formatDateToISO` (yyyy-MM-dd).
     - Preset chọn nhanh khoảng ngày: `thisWeek`, `thisMonth`, `thisQuarter`, `thisYear`.
     - Tính khoảng thời gian đối chiếu kỳ trước `getPreviousPeriod`.
     - Validation client-side `validateReportFilter`: bắt buộc chọn ngày, `startDate <= endDate`.
     - Tính % tăng trưởng và chênh lệch `calculateGrowth`.
     - Xuất dữ liệu báo cáo sang CSV UTF-8 kèm Byte Order Mark (`\uFEFF`) để Excel đọc đúng tiếng Việt có dấu.
   - `reportHelpers.test.js`: Đạt 100% test pass (6/6 tests mới + 4/4 tests cũ = 10/10 tests pass).

3. **Giao diện bộ lọc báo cáo (`src/features/reports/components/ReportFilterForm.jsx`)**:
   - Khớp thiết kế Figma `186:3340`.
   - Lựa chọn kiểu hiển thị: Bảng, Biểu đồ, Cả hai.
   - Lựa chọn loại báo cáo: Top nhân viên bán hàng (`THEO_NHAN_VIEN`), Hãng hàng không (`THEO_HANG`), Doanh thu phòng vé (`THEO_THOI_GIAN`).
   - Lựa chọn tiêu chí gom nhóm: Ngày (`DAY`), Tháng (`MONTH`), Năm (`YEAR`).
   - Nút chọn nhanh: Tuần này, Tháng này, Quý này, Năm nay.
   - Date picker Từ ngày - Đến ngày kèm thông báo lỗi trực quan khi không hợp lệ.
   - Checkbox "So sánh với kỳ trước" và Nút "Xem báo cáo" có trạng thái spinner loading.

4. **3 Thẻ chỉ số KPI tổng hợp (`src/features/reports/components/ReportSummaryCards.jsx`)**:
   - Khớp thiết kế Figma `186:3400` và `186:5810`.
   - Thẻ 1: Tổng doanh thu (VNĐ, % tăng trưởng, số tiền kỳ trước).
   - Thẻ 2: Số vé đã bán (Số lượng vé, % tăng trưởng, số vé kỳ trước).
   - Thẻ 3: Tăng trưởng doanh thu (% tăng trưởng, chênh lệch tăng/giảm so với kỳ trước).

5. **Chế độ xem Bảng số liệu (`src/features/reports/components/ReportTableView.jsx`)**:
   - Khớp thiết kế Figma `186:3434`.
   - Cột: Hạng (#1, #2...), Đối tượng (Tên nhân viên / Hãng / Ngày), Số vé, Doanh thu, Kỳ trước, Chênh lệch, Tăng trưởng (%).
   - Highlight badge vàng `#fffbeb` và nền xanh nhạt `#f8fcff` cho hạng #1.
   - Format tiền tệ chuẩn VND bằng `formatCurrency`.

6. **Chế độ xem Biểu đồ (`src/features/reports/components/ReportChartView.jsx`)**:
   - Khớp thiết kế Figma `186:5696`.
   - Biểu đồ đường (Line Chart SVG responsive): 2 đường biểu diễn Kỳ hiện tại (`#0284c7`) và Kỳ trước (`#cbd5e1`), lưới trục Y, nhãn giá trị ngày, trục ngày `26/10` -> `01/11`.
   - Biểu đồ tròn / Donut Chart SVG: Tỷ trọng doanh thu theo hãng (Vietnam Airlines, Vietjet Air, Bamboo Airways...), tâm hiển thị tổng doanh thu triệu đồng.
   - Hộp thông báo tổng kết màu xanh `#ecfdf5` với icon checkmark theo Figma `186:5945`.

7. **Trang báo cáo hoàn chỉnh (`src/features/reports/pages/ReportPage.jsx`)**:
   - Breadcrumb, Tiêu đề, Mốc thời gian đối chiếu.
   - Tích hợp Form lọc, KPI cards, Biểu đồ, Bảng số liệu.
   - Xử lý trạng thái Loading (Spinner), Error banner, Empty state.
   - Các nút thao tác: Quay lại bộ lọc, In báo cáo (`window.print()`), Xuất Excel (CSV UTF-8).
   - Hỗ trợ in ấn sạch sẽ ẩn bộ lọc (`print:hidden`).

8. **Đăng ký Route & Điều hướng**:
   - Khai báo routes `/bao-cao` và `/thong-ke` trong `src/app/routes.jsx`.
   - Thêm liên kết "Thống kê báo cáo" trong Header navigation (`src/components/layout/Header.jsx`).

---

## Đang dở (chưa commit hoặc chưa chạy được)

- Không có (Đã hoàn thành toàn bộ tính năng và kiểm thử thành công).

---

## Việc tiếp theo (theo thứ tự)

1. Commit code tính năng vào nhánh `feature/tao-bao-cao-thong-ke`.
2. Xóa file `progress/feature-tao-bao-cao-thong-ke.md` trước khi mở PR theo đúng quy định.
3. Đẩy nhánh lên GitHub remote `origin/feature/tao-bao-cao-thong-ke`.
4. Tạo Pull Request vào `develop` và cung cấp hướng dẫn review cho nhóm.

---

## Quyết định đã chốt và lưu ý

- Kết nối qua `apiClient.js` và gửi `ReportFilterRequest` theo chuẩn BE.
- Không tự cài thêm thư viện biểu đồ nặng; sử dụng SVG thuần kết hợp Tailwind CSS giúp bundle nhẹ, responsive và tương thích 100% React 19.
- Xuất Excel dưới dạng CSV kèm UTF-8 BOM (`\uFEFF`) để đảm bảo không lỗi font tiếng Việt trên Microsoft Excel.

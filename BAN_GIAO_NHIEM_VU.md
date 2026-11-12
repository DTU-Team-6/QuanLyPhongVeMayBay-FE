# TÀI LIỆU BÀN GIAO CÔNG VIỆC (HANDOFF DOCUMENT)
## Dự án: Hệ thống quản lý phòng bán vé máy bay (QuanLyPhongVeMayBay-FE)
**Nhóm thực hiện:** DTU-Team-6  
**Thời gian bàn giao:** 12/11/2026  
**Nhánh Git hiện tại:** `feature/tao-bao-cao-thong-ke` (tách từ `develop` `5d83b1f`)  

---

### I. TỔNG QUAN VÀ TÌNH TRẠNG HIỆN TẠI

1. **Task 1: Xây dựng Layout Component, Trang chủ (6.1) và Top 10 chuyến bay giá rẻ (99.2)**
   - **Tình trạng:** **ĐÃ HOÀN THÀNH 100% & ĐÃ MERGE VÀO `develop`** qua Pull Request #5 (commit `5d83b1f`).
   - **Các thành phần đã bàn giao:**
     - `src/components/layout/Header.jsx`: Menu điều hướng, logo Vân Việt, nút đăng ký/đăng nhập, trạng thái phiên người dùng.
     - `src/components/layout/Footer.jsx`: Thông tin bản quyền, đối tác hàng không (Vietnam Airlines, Vietjet, Bamboo, Vietravel), hỗ trợ khách hàng.
     - `src/components/layout/MainLayout.jsx`: Khung layout bọc ngoài cho toàn bộ hệ thống.
     - `src/features/home/pages/HomePage.jsx`: Trang chủ với banner tìm kiếm vé khứ hồi / một chiều.
     - `src/features/home/components/TopCheapFlightsSection.jsx`: Hiển thị danh sách top chuyến bay giá tốt, gọi API `/flights/top-cheap`, xử lý Skeleton loading & Empty state.
     - `public/images/`: 12 assets hình ảnh và icon chuẩn tải từ CDN Figma (bao gồm banner `hanoi-promo.png` 2.07MB).

2. **Task 2: Xây dựng Màn hình Tạo báo cáo (6.5.4.1) & Kết quả thống kê (6.5.4.2)**
   - **Tình trạng:** Đã hoàn thành giai đoạn phân tích đặc tả SRS v1.2, giải mã 2 frame Figma (`186:3277` & `186:5696`), đối chiếu DTO backend Spring Boot và khởi tạo nhánh làm việc độc lập `feature/tao-bao-cao-thong-ke`.

---

### II. THÔNG TIN KỸ THUẬT VÀ TÀI LIỆU ĐỐI CHIẾU

#### 1. Thiết kế Figma
- **Link thiết kế:** [Figma Design Canvas 12-2](https://www.figma.com/design/G9EkRbj6ldsZqNv1IOK2Sk/QuanLyPhongVeMayBay?node-id=12-2&t=u0HKgwIasNXlFOGk-1)
- **Node `186:3277`**: "Staff • Thống kê báo cáo — Bảng" (Dành cho nhân viên/admin xem báo cáo dạng bảng chi tiết).
- **Node `186:5696`**: "Admin • Thống kê báo cáo — Biểu đồ" (Dành cho quản trị xem biểu đồ đường xu hướng doanh thu và biểu đồ tròn tỷ trọng hãng bay).

#### 2. Đặc tả nghiệp vụ (SRS v1.2)
- **Mục 6.5.4.1 (Tạo báo cáo):**
  - Nhập khoảng thời gian: `startDate` (Từ ngày) và `endDate` (Đến ngày).
  - Chọn loại báo cáo: Doanh thu theo hãng (`THEO_HANG`), Doanh thu theo nhân viên (`THEO_NHAN_VIEN`), Doanh thu theo thời gian (`THEO_THOI_GIAN`).
  - Chọn tiêu chí gom nhóm thời gian: Theo ngày (`DAY`), theo tháng (`MONTH`), theo năm (`YEAR`).
  - Validation client-side: Bắt buộc chọn ngày, `startDate` phải nhỏ hơn hoặc bằng `endDate`.
- **Mục 6.5.4.2 (Kết quả thống kê):**
  - Hiển thị các thẻ chỉ số KPI: Tổng doanh thu (VNĐ), Tổng số vé bán ra, Tỷ lệ tăng trưởng so với kỳ trước.
  - Bảng dữ liệu: Xếp hạng top, tên nhân viên/hãng, số vé, doanh thu, kỳ trước, chênh lệch, % tăng trưởng.
  - Biểu đồ thống kê: Biểu đồ đường doanh thu qua các mốc thời gian (so sánh 2 kỳ), biểu đồ tròn/thanh tỷ trọng doanh thu theo hãng hàng không.
  - Chức năng phụ trợ: In báo cáo (`window.print`), Xuất báo cáo (Excel/CSV), quay lại điều chỉnh bộ lọc.

#### 3. API Backend Spring Boot liên quan (`QuanLyPhongVeMayBay-BE`)
- **Controller:** `com.team6.quanlyvemaybay.controller.BaoCaoController` (`/api/v1/reports`).
- **Endpoint POST:** `POST /api/v1/reports`
  - Body JSON (`ReportFilterRequest`):
    ```json
    {
      "startDate": "2026-10-26",
      "endDate": "2026-11-01",
      "reportType": "THEO_NHAN_VIEN",
      "groupBy": "DAY",
      "maHang": null,
      "nhanVienId": null,
      "trangThaiDatCho": "DA_THANH_TOAN"
    }
    ```
- **Endpoint GET:** `GET /api/v1/reports/generate?startDate=2026-10-26&endDate=2026-11-01&reportType=THEO_NHAN_VIEN&groupBy=DAY`
- **Cấu trúc dữ liệu trả về (`ReportResponse`):**
  - `summary`: `tongSoDonDatCho`, `tongSoVe`, `tongGiaGoc`, `tongDoanhThu`, `tongLoiNhuan`.
  - `items`: Danh sách `ReportItemDto` gồm `key`, `label`, `soDonDatCho`, `soVeBanRa`, `tongGiaGoc`, `doanhThu`, `loiNhuan`.

---

### III. BƯỚC THỰC HIỆN TIẾP THEO CHO AGENT / DEVELOPER

Để hoàn tất Task 2, người tiếp nhận chỉ cần thực hiện theo đúng các bước sau:

#### Bước 1: Tạo Service gọi API báo cáo
Tạo file `src/services/reportService.js`:
- `createReport(filter)`: Gọi `apiClient('/reports', { method: 'POST', body: JSON.stringify(filter) })`.
- `generateReport(filter)`: Gọi `apiClient('/reports/generate?...')`.

#### Bước 2: Xây dựng Module Báo cáo (`src/features/reports/`)
1. `src/features/reports/components/ReportFilterForm.jsx`:
   - Bộ chọn khoảng thời gian (Từ ngày, Đến ngày) kèm các nút chọn nhanh ("Tuần này", "Tháng này", "Quý này", "Năm nay").
   - Dropdown chọn kiểu hiển thị ("Bảng", "Biểu đồ", "Cả hai").
   - Dropdown chọn loại báo cáo ("Doanh thu phòng vé", "Top nhân viên bán hàng", "Hãng hàng không").
   - Checkbox "So sánh với kỳ trước".
   - Client-side validation: Hiển thị lỗi màu đỏ nếu `startDate` hoặc `endDate` trống, hoặc nếu `startDate > endDate`.
2. `src/features/reports/components/ReportSummaryCards.jsx`:
   - 3 thẻ KPI theo đúng Figma: Tổng doanh thu, Số vé đã bán, Tăng trưởng doanh thu kèm nhãn % so với kỳ trước.
3. `src/features/reports/components/ReportTableView.jsx`:
   - Bảng hiển thị danh sách dòng dữ liệu theo đúng Figma `186:3277`: Cột Hạng (#1, #2...), Đối tượng (Nhân viên/Hãng), Số vé, Doanh thu, Kỳ trước, Chênh lệch, Tăng trưởng.
   - Định dạng tiền tệ bằng `formatCurrency()` trong `src/utils/formatters.js`.
4. `src/features/reports/components/ReportChartView.jsx`:
   - Biểu đồ đường (Line Chart SVG) thể hiện xu hướng doanh thu theo các ngày/mốc thời gian.
   - Biểu đồ tròn / thanh phân bổ tỷ trọng doanh thu giữa các hãng hàng không theo Figma `186:5696`.
5. `src/features/reports/pages/ReportPage.jsx`:
   - Ghép nối form lọc, trạng thái loading (Skeleton), thông báo lỗi hoặc dữ liệu rỗng (Empty state), kết quả hiển thị (Bảng/Biểu đồ).
   - Nút In báo cáo (`window.print`) và Nút Xuất file Excel (CSV UTF-8).

#### Bước 3: Đăng ký Route & Điều hướng
- Thêm đường dẫn `/bao-cao` trong `src/app/routes.jsx` và cập nhật menu điều hướng trên Header.

#### Bước 4: Kiểm thử và Hoàn tất
- Viết unit test cho hàm validate form trong `src/features/reports/reportValidation.test.js`.
- Chạy `npm test` và `npm run build` để xác nhận không có lỗi biên dịch.
- Xóa file `progress/feature-tao-bao-cao-thong-ke.md` trước khi mở PR.
- Đẩy nhánh `feature/tao-bao-cao-thong-ke` lên remote và tạo Pull Request vào `develop`.

---

### IV. QUY TẮC BẮT BUỘC KHI LÀM VIỆC VỚI GIT & TEAM
1. Nhánh làm việc: Luôn làm trên nhánh `feature/tao-bao-cao-thong-ke`, không commit trực tiếp vào `develop`.
2. Khi mở Merge Request (Pull Request): Cần ít nhất 2 approve từ các thành viên trong nhóm. Nhắn lên nhóm Zalo và tag tên 2 bạn reviewer như quy định.
3. Báo cáo tiến độ: Cập nhật thường xuyên vào file `progress/feature-tao-bao-cao-thong-ke.md` trong quá trình thực hiện.

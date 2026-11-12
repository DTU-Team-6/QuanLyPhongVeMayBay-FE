# Tiến độ: feature/dat-ve-chuyen-bay

> Cập nhật theo mẫu PROGRESS_TEMPLATE.md

## Task hiện tại

- Chức năng: Đặt vé chuyến bay (6.4.6, 6.4.7, 6.4.8)
- Nhánh: `feature/dat-ve-chuyen-bay`
- Cập nhật lần cuối: 2026-11-12

## Đã xong (chưa push git theo yêu cầu người dùng)

### Chức năng 6.4.6 – Danh sách chuyến bay (`/chuyen-bay`)
- `src/features/flight-search/services/flightSearchService.js`
- `src/features/flight-search/components/DateTabBar.jsx`
- `src/features/flight-search/components/SortTabBar.jsx`
- `src/features/flight-search/components/FlightCard.jsx`
- `src/features/flight-search/components/FlightSearchSidebar.jsx`
- `src/features/flight-search/components/SelectedFlightBar.jsx`
- `src/features/flight-search/pages/FlightSearchPage.jsx`

### Chức năng 6.4.7 – Modal chi tiết đặt vé
- `src/features/flight-search/components/FlightDetailModal.jsx` (gọi `GET /api/v1/flights/{id}` lấy danh sách hạng vé `FlightDetailResponse`)

### Chức năng 6.4.8 – Trang thông tin hành khách (`/dat-ve/hanh-khach`)
- `src/features/booking/services/bookingService.js` (kết nối `POST /api/v1/dat-cho`)
- `src/features/booking/components/TripSummaryCard.jsx`
- `src/features/booking/components/PaymentSummaryCard.jsx`
- `src/features/booking/components/PassengerForm.jsx`
- `src/features/booking/pages/PassengerInfoPage.jsx`

### Cập nhật file sẵn có
- `src/app/routes.jsx` – thêm routes `/chuyen-bay`, `/dat-ve/hanh-khach`, `/dat-ve/thanh-toan` (placeholder)
- `src/features/home/pages/HomePage.jsx` – điều hướng sang `/chuyen-bay?...` khi chọn chuyến

## Đang dở

- Chưa commit/push (theo yêu cầu: không đẩy lên git)
- Route `/dat-ve/thanh-toan` đang là PlaceholderPage (task tiếp theo)

## Quyết định đã chốt và lưu ý

- Đã đối chiếu trực tiếp contract với repo `QuanLyPhongVeMayBay-BE`:
  - `GET /api/v1/flights` trả `FlightSearchResponse` (`hangVeId`, `thoiGianKhoiHanh.{dateTime,timeZone}`, `thoiGianHaCanh.{dateTime,timeZone}`, `thoiLuongBayPhut`, `loaiKhoang`, `giaBan`, `thuePhi`, `tongGiaVe`, `tienTe`, `soGheTrong`, `hanhLyXachTayKg`, `hanhLyKyGuiKg`).
  - `GET /api/v1/flights/{id}` trả `FlightDetailResponse` (`chuyenBayId`, `hangVe`).
  - `POST /api/v1/dat-cho` nhận `BookingRequest` (`hangVeId`, `emailNguoiDat`, `soDienThoaiNguoiDat`, `hoTenNguoiDat`, `soNguoiLon`, `soTreEm`, `soEmBe`, `hanhKhach` với enum `GioiTinh: Nam|Nu|Khac` và `LoaiHanhKhach: NGUOI_LON|TRE_EM|EM_BE`).
- Endpoint `/flights/min-price-by-date` và `/baggage-options` hiện BE chưa có: FE gọi an toàn và fallback hiển thị `--` / ẩn dropdown hành lý bổ sung khi chưa có.

## Lỗi đang gặp (nếu có)

- Không có lỗi build.

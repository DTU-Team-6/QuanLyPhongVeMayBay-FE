# Tiến độ nhánh feature/trang-chu-top-chuyen-bay-gia-re

## Task hiện tại

- Chức năng: Xây dựng Layout Component (Header, Footer) dùng chung, Trang chủ (6.1) và khu vực hiển thị Top 10 chuyến bay giá rẻ nhất (99.2) theo thiết kế Figma
- Nhánh: `feature/trang-chu-top-chuyen-bay-gia-re`
- Cập nhật lần cuối: 2026-11-12, Antigravity Agent

## Đã xong (đã hoàn thiện và kiểm thử)

- [x] Tạo nhánh `feature/trang-chu-top-chuyen-bay-gia-re` từ `develop`.
- [x] Cài đặt và cấu hình Tailwind CSS (`@tailwindcss/vite`, `tailwindcss`) và `react-router-dom`.
- [x] Cấu hình file môi trường `.env.example`, `.env` với biến `VITE_API_BASE_URL` (không commit `.env`).
- [x] Tải toàn bộ icon và hình ảnh static từ Figma vào thư mục `src/assets/`.
- [x] Xây dựng lớp gọi API dùng chung `src/services/apiClient.js` bằng `fetch`:
  - Đọc `VITE_API_BASE_URL`, gắn tiền tố `/api/v1`
  - Bật `credentials: 'include'` gửi cookie HttpOnly
  - Đọc cookie `XSRF-TOKEN` và gửi header `X-XSRF-TOKEN` cho request thay đổi dữ liệu
  - Bắt và chuẩn hóa lỗi theo RFC 9457 (`code`, `details`).
- [x] Xây dựng `src/services/flightService.js`: hàm `getTopCheapFlights(limit = 10)` gọi `GET /api/v1/flights/top-cheap?limit=10`.
- [x] Xây dựng `src/services/authService.js` và `src/services/publicService.js`.
- [x] Xây dựng `src/context/AuthContext.jsx` quản lý phiên đăng nhập người dùng.
- [x] Xây dựng Header component (`src/components/layout/Header.jsx`): logo Vân Việt, liên kết điều hướng, trạng thái đăng nhập / đăng ký / tài khoản, hỗ trợ responsive mobile.
- [x] Xây dựng Footer component (`src/components/layout/Footer.jsx`): thông tin phòng vé, hotline 1900 6868, chính sách, đối tác hàng không, bản quyền.
- [x] Xây dựng MainLayout (`src/components/layout/MainLayout.jsx`) chứa Header + Outlet + Footer cố định, dùng chung cho toàn hệ thống.
- [x] Xây dựng `FlightSearchForm` và `HeroBanner` trên Trang chủ theo chuẩn Figma (SRS 6.1).
- [x] Xây dựng `ServiceCommitments` (3 cam kết chất lượng dịch vụ).
- [x] Xây dựng khu vực hiển thị Top 10 chuyến bay giá rẻ nhất (`TopCheapFlights.jsx` và `CheapFlightCard.jsx`):
  - Hiển thị đúng giá (gồm thuế phí), chặng bay, thời gian theo `timeZone` của sân bay, hãng bay, hành lý, số ghế trống.
  - Xử lý trạng thái Loading với Skeleton card (`FlightSkeletonCard.jsx`) chuẩn Figma.
  - Xử lý trạng thái Empty / Lỗi kết nối với component `EmptyState.jsx` và nút thử lại API.
- [x] Thiết lập hệ thống định tuyến React Router trong `src/app/routes.jsx` và tích hợp tại `src/App.jsx`.
- [x] Viết unit tests cho các hàm format trong `src/utils/formatters.test.js` và cấu hình lệnh `npm test`.
- [x] Kiểm thử build production `npm run build` thành công trong 220ms.

## Đang dở

- Không có (tất cả các mục của task 1 đã hoàn thiện và kiểm thử đạt yêu cầu).

## Việc tiếp theo (theo thứ tự)

1. Review lại git status và commit code lên nhánh `feature/trang-chu-top-chuyen-bay-gia-re`.
2. Tạo Pull Request / Merge Request vào nhánh `develop`.
3. Gửi thông báo lên nhóm Zalo tag 2 thành viên review/approve theo quy định nhóm.

## Quyết định đã chốt và lưu ý

- Dùng `fetch` và `apiClient.js`, không cài Axios.
- Dùng Tailwind CSS v4 với plugin `@tailwindcss/vite`.
- Định dạng tiền tệ hiển thị đúng định dạng VND, không tự tính lại tổng tiền ở frontend.
- Giờ bay hiển thị theo `timeZone` do backend trả về.

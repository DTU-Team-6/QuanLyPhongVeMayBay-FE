# Tiến độ: feature/thanh-toan-lich-su-giao-dich

## Task hiện tại

- Chức năng: Thanh toán (6.4.3) và Xem lịch sử giao dịch (6.4.4)
- Nhánh: `feature/thanh-toan-lich-su-giao-dich`
- Cập nhật lần cuối: 2026-11-12

## Đã xong

### Chức năng 6.4.3 – Thanh toán vé (`/tai-khoan/thanh-toan`, `/dat-ve/thanh-toan`, `/dat-ve/thanh-toan/ket-qua`)
- `src/features/account/components/AccountSidebar.jsx`
- `src/features/payment/services/paymentService.js`
- `src/features/payment/utils/paymentFormatters.js`
- `src/features/payment/pages/PaymentPage.jsx`
- `src/features/payment/pages/PaymentResultPage.jsx`

### Chức năng 6.4.4 – Xem lịch sử giao dịch (`/tai-khoan/lich-su-giao-dich`)
- `src/features/payment/pages/TransactionHistoryPage.jsx`

### Cập nhật route & layout
- `src/app/routes.jsx`
- `src/components/layout/Header.jsx`

## Đang dở

- Chưa commit/push (chờ kiểm thử và xác nhận)

## Quyết định đã chốt và lưu ý

- Kết nối 100% BE `ThanhToanController`:
  - `GET /api/v1/thanh-toan/lich-su` (dùng cho cả danh sách chờ thanh toán `CHO_THANH_TOAN` và trang lịch sử giao dịch có lọc ngày, trạng thái, phân trang)
  - `POST /api/v1/thanh-toan/tao-url` (VNPay & PayPal)
  - `GET /api/v1/thanh-toan/vnpay/callback`
  - `POST /api/v1/thanh-toan/paypal/capture`
- Hiển thị cả `soTienVnd` và `soTienUsd` do BE trả về trước khi chuyển sang PayPal (FE không tự quy đổi).
- Chức năng "Hủy vé": BE hiện chưa có endpoint hủy đặt chỗ online cho khách hàng nên UI báo thông tin rõ ràng khi endpoint trả 404/405.

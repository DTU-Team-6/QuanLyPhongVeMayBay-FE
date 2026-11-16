# Tiến độ nhánh Đăng ký và đăng nhập

## Task hiện tại

- Chức năng: Giao diện đăng ký và đăng nhập responsive
- Nhánh: `feature/dang-ky-dang-nhap`
- Cập nhật lần cuối: 2026-11-16

## Đã xong (đã commit)

- Giao diện đăng ký/đăng nhập responsive, route, validation cơ bản; commit `67d0e84`.
- Điều chỉnh bố cục desktop theo thiết kế mới: form đăng ký hai cột, card đăng nhập hẹp căn giữa, Header/Footer gọn; vẫn giữ bố cục mobile.
- Tăng cỡ chữ desktop và chiều cao ô nhập sau khi kiểm tra trên màn hình thực tế.

## Đang dở

- Chưa kết nối API đăng ký/đăng nhập; form hiện kiểm tra dữ liệu trên trình duyệt và hiển thị thông báo.

## Việc tiếp theo (theo thứ tự)

1. Chốt hợp đồng API đăng ký/đăng nhập với Backend, sau đó nối service và xử lý lỗi theo `code`/`details`.
2. Tích hợp OAuth Google/Facebook, khôi phục mật khẩu và xác nhận luồng cookie/CSRF với Backend.

## Quyết định đã chốt và lưu ý

- Bám theo thiết kế mobile ban đầu và thiết kế desktop cập nhật sau đó; Header/Footer dùng chung, có biến thể gọn cho trang xác thực.
- Không lưu mật khẩu hoặc token vào `localStorage`/`sessionStorage`.
- Thêm kiểm tra tuổi từ 18 trở lên, điều kiện mật khẩu và xác nhận mật khẩu phía FE.
- API đăng ký/đăng nhập chưa được gọi từ form. `AuthContext` hiện vẫn kiểm tra phiên chung qua `GET /api/v1/auth/me`.

## Lỗi đang gặp (nếu có)

- Trong kiểm thử trình duyệt, `GET http://localhost:8080/api/v1/auth/me` thất bại với `net::ERR_CONNECTION_REFUSED` do Backend không chạy tại địa chỉ này.
- `npm run build` thành công nhưng Vite cảnh báo bundle JavaScript lớn hơn 500 kB.

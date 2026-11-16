# Tiến độ nhánh Đăng ký và đăng nhập

## Task hiện tại

- Chức năng: Giao diện đăng ký và đăng nhập responsive
- Nhánh: `feature/dang-ky-dang-nhap`
- Cập nhật lần cuối: 2026-11-16

## Đã xong (đã commit)

- Giao diện đăng ký/đăng nhập responsive, route, validation cơ bản; commit `67d0e84`.
- Điều chỉnh bố cục desktop theo thiết kế mới: form đăng ký hai cột, card đăng nhập hẹp căn giữa; Header/Footer giữ nguyên kích thước dùng chung.
- Tăng cỡ chữ desktop và chiều cao ô nhập sau khi kiểm tra trên màn hình thực tế.
- Căn card đăng nhập theo thiết kế 480px rộng, cao tự ôm nội dung (xấp xỉ 575px); không khóa chiều cao.
- Căn card đăng ký theo thiết kế 800px rộng với chiều cao tự ôm nội dung; thay icon đầu trang đăng nhập theo biểu tượng cổng và mũi tên được cung cấp.

## Đã xong (chưa commit)

- Nối đăng nhập với `POST /api/v1/auth/login`, khởi tạo CSRF trước request, nhận user từ phản hồi và cập nhật `AuthContext`.
- Khi đăng nhập thành công, chuyển về trang chủ; hiển thị lỗi theo mã Backend và trạng thái đang gửi.
- Tắt checkbox ghi nhớ đăng nhập vì API hiện chưa hỗ trợ tùy chọn này.

## Đang dở

- Chưa kết nối API đăng ký. Backend hiện không nhận/lưu giấy tờ tùy thân và quốc tịch đang có trong form; cần thống nhất hợp đồng trước khi nối.

## Việc tiếp theo (theo thứ tự)

1. Cập nhật hợp đồng đăng ký phía Backend để hỗ trợ giấy tờ tùy thân và quốc tịch; sau đó nối service và xử lý lỗi theo `code`/`details`.
2. Tích hợp OAuth Google/Facebook, khôi phục mật khẩu và xác nhận luồng cookie/CSRF với Backend.

## Quyết định đã chốt và lưu ý

- Bám theo thiết kế mobile ban đầu và thiết kế desktop cập nhật sau đó; card đăng nhập rộng tối đa 480px và card đăng ký tối đa 800px, chiều cao tự nhiên theo nội dung; Header/Footer dùng chung, không thu nhỏ riêng trên trang xác thực.
- Không lưu mật khẩu hoặc token vào `localStorage`/`sessionStorage`.
- Thêm kiểm tra tuổi từ 18 trở lên, điều kiện mật khẩu và xác nhận mật khẩu phía FE.
- `GET /api/v1/auth/me` vẫn kiểm tra phiên chung khi ứng dụng khởi động. Backend hiện đặt cookie access có thời hạn cố định; chưa có endpoint refresh dù tài liệu trước đó mô tả refresh token.

## Lỗi đang gặp (nếu có)

- Trong kiểm thử trình duyệt, `GET http://localhost:8080/api/v1/auth/me` thất bại với `net::ERR_CONNECTION_REFUSED` do Backend không chạy tại địa chỉ này.
- `npm run build` thành công nhưng Vite cảnh báo bundle JavaScript lớn hơn 500 kB.

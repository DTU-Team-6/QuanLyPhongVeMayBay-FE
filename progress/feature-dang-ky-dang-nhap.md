# Tiến độ nhánh Đăng ký và đăng nhập

## Task hiện tại

- Chức năng: Giao diện đăng ký và đăng nhập responsive
- Nhánh: `feature/dang-ky-dang-nhap`
- Cập nhật lần cuối: 2026-11-17

## Đã xong (đã commit)

- Giao diện đăng ký/đăng nhập responsive, route, validation cơ bản; commit `67d0e84`.
- Điều chỉnh bố cục desktop theo thiết kế mới: form đăng ký hai cột, card đăng nhập hẹp căn giữa; Header/Footer giữ nguyên kích thước dùng chung.
- Tăng cỡ chữ desktop và chiều cao ô nhập sau khi kiểm tra trên màn hình thực tế.
- Căn card đăng nhập theo thiết kế 480px rộng, cao tự ôm nội dung (xấp xỉ 575px); không khóa chiều cao.
- Căn card đăng ký theo thiết kế 800px rộng với chiều cao tự ôm nội dung; thay icon đầu trang đăng nhập theo biểu tượng cổng và mũi tên được cung cấp.

## Đã xong

- Nối đăng nhập với `POST /api/v1/auth/login`, khởi tạo CSRF trước request, nhận user từ phản hồi và cập nhật `AuthContext`.
- Khi đăng nhập thành công, chuyển về trang chủ; hiển thị lỗi theo mã Backend và trạng thái đang gửi.
- Tắt checkbox ghi nhớ đăng nhập vì API hiện chưa hỗ trợ tùy chọn này.
- Nối đăng ký với `POST /api/v1/auth/register`, gửi CSRF, giấy tờ và mã quốc tịch; thành công báo người dùng đăng nhập riêng.
- Đã kiểm thử trên trình duyệt với BE thật dùng database test: đăng ký, kiểm tra dữ liệu lưu, đăng nhập và lỗi email trùng; đã xác nhận CORS và CSRF. `npm run build` và `npm test` (21 test) thành công.
- Đã thống nhất kiểm tra tuổi theo ngày Việt Nam, số điện thoại và mật khẩu ở cả FE và BE.
- Kiểm thử lại thành công trên trình duyệt với cookie access cũ và BE test sau khi đồng bộ các quy tắc.

## Đang dở

- Migration BE gộp khách hàng mới chỉ chạy trên database test; chưa chạy trên database dev.

## Việc tiếp theo (theo thứ tự)

1. Chờ duyệt migration gộp khách hàng trên database dev.
2. Tích hợp OAuth Google/Facebook, khôi phục mật khẩu và xác nhận luồng cookie/CSRF với Backend.

## Quyết định đã chốt và lưu ý

- Bám theo thiết kế mobile ban đầu và thiết kế desktop cập nhật sau đó; card đăng nhập rộng tối đa 480px và card đăng ký tối đa 800px, chiều cao tự nhiên theo nội dung; Header/Footer dùng chung, không thu nhỏ riêng trên trang xác thực.
- Không lưu mật khẩu hoặc token vào `localStorage`/`sessionStorage`.
- Thêm kiểm tra tuổi từ 18 trở lên, điều kiện mật khẩu và xác nhận mật khẩu phía FE.
- `GET /api/v1/auth/me` vẫn kiểm tra phiên chung khi ứng dụng khởi động. Backend hiện đặt cookie access có thời hạn cố định; chưa có endpoint refresh dù tài liệu trước đó mô tả refresh token.

## Lỗi đang gặp (nếu có)

- Migration BE mới chưa được áp dụng trên database dev; không mặc định chạy BE trỏ tới database đó khi chưa được duyệt.
- `npm run build` thành công nhưng Vite cảnh báo bundle JavaScript lớn hơn 500 kB.

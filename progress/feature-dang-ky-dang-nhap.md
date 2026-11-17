# Tiến độ nhánh Đăng ký và đăng nhập

## Task hiện tại

- Chức năng: Đăng ký và đăng nhập kết nối Backend
- Nhánh: `feature/dang-ky-dang-nhap`
- Cập nhật lần cuối: 2026-11-17

## Đã xong (đã commit)

- Giao diện đăng ký/đăng nhập responsive, route, validation cơ bản; commit `67d0e84`.
- Điều chỉnh bố cục desktop theo thiết kế mới: form đăng ký hai cột, card đăng nhập hẹp căn giữa; Header/Footer giữ nguyên kích thước dùng chung.
- Tăng cỡ chữ desktop và chiều cao ô nhập sau khi kiểm tra trên màn hình thực tế.
- Căn card đăng nhập theo thiết kế 480px rộng, cao tự ôm nội dung (xấp xỉ 575px); không khóa chiều cao.
- Căn card đăng ký theo thiết kế 800px rộng với chiều cao tự ôm nội dung; thay icon đầu trang đăng nhập theo biểu tượng cổng và mũi tên được cung cấp.

## Đã xong

- Giữ giao diện đăng nhập/đăng ký và kiểm tra biểu mẫu trên trình duyệt.
- Form đăng ký gọi `POST /api/v1/auth/register`, gửi đầy đủ thông tin được BE lưu, hiển thị lỗi trường và chuyển sang đăng nhập khi thành công.
- Form đăng nhập gọi `POST /api/v1/auth/login`, cập nhật `AuthContext` và không lưu token phía FE.
- `authService` khởi tạo cookie CSRF nếu chưa có trước POST đăng ký/đăng nhập.
- Đăng xuất chuyển về trang đăng nhập sau khi BE xác nhận; hiển thị thông báo đăng ký, đăng xuất thành công hoặc lỗi đăng xuất.
- Kiểm tra giao diện đăng ký và đăng xuất với API giả lập; kiểm tra đăng xuất trên desktop và mobile.

## Đang dở

- Chức năng đăng ký/đăng nhập đã kết nối; đăng nhập Google/Facebook, khôi phục mật khẩu và refresh token chưa triển khai.

## Việc tiếp theo (theo thứ tự)

1. Tích hợp OAuth Google/Facebook và khôi phục mật khẩu.
2. Triển khai refresh token khi endpoint BE sẵn sàng; hiện BE chưa có `/api/v1/auth/refresh`.

## Quyết định đã chốt và lưu ý

- Bám theo thiết kế mobile ban đầu và thiết kế desktop cập nhật sau đó; card đăng nhập rộng tối đa 480px và card đăng ký tối đa 800px, chiều cao tự nhiên theo nội dung; Header/Footer dùng chung, không thu nhỏ riêng trên trang xác thực.
- Không lưu mật khẩu hoặc token vào `localStorage`/`sessionStorage`.
- Thêm kiểm tra tuổi từ 18 trở lên, điều kiện mật khẩu và xác nhận mật khẩu phía FE.
- `GET /api/v1/auth/me` vẫn kiểm tra phiên chung khi ứng dụng khởi động. Backend hiện chỉ đặt cookie access có thời hạn cố định; chưa có endpoint refresh.
- Database `ve_may_bay` trên máy kiểm thử thiếu các cột BE yêu cầu; người dùng đã chọn `ve_may_bay_dong_bo_test` để thử.

## Lỗi đang gặp (nếu có)

- `npm test`: đạt 20/20 test.
- `npm run build`: thành công; Vite cảnh báo chunk JavaScript 610.38 kB lớn hơn 500 kB.
- BE: `./gradlew test --tests 'com.team6.quanlyvemaybay.service.AuthServiceTest' --tests 'com.team6.quanlyvemaybay.controller.AuthControllerTest'` thành công.

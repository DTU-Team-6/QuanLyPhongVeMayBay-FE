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

- Giữ giao diện đăng nhập/đăng ký và kiểm tra biểu mẫu trên trình duyệt.
- Theo yêu cầu người dùng, bỏ kết nối API đăng nhập/đăng ký; không thay đổi kết nối API khác.
- Các lượt kiểm thử BE thật trước đó thuộc phiên bản đã được hoàn tác, không phản ánh trạng thái hiện tại.
- Đã kiểm tra hai form trên trình duyệt: đều báo chưa kết nối và không gửi request đăng nhập/đăng ký. `npm test` đạt 20 test; `npm run build` thành công.

## Đang dở

- Chức năng đăng nhập và đăng ký chưa kết nối API.

## Việc tiếp theo (theo thứ tự)

1. Xác nhận lại hợp đồng BE trước khi kết nối đăng nhập và đăng ký.
2. Tích hợp OAuth Google/Facebook, khôi phục mật khẩu và xác nhận luồng cookie/CSRF với Backend.

## Quyết định đã chốt và lưu ý

- Bám theo thiết kế mobile ban đầu và thiết kế desktop cập nhật sau đó; card đăng nhập rộng tối đa 480px và card đăng ký tối đa 800px, chiều cao tự nhiên theo nội dung; Header/Footer dùng chung, không thu nhỏ riêng trên trang xác thực.
- Không lưu mật khẩu hoặc token vào `localStorage`/`sessionStorage`.
- Thêm kiểm tra tuổi từ 18 trở lên, điều kiện mật khẩu và xác nhận mật khẩu phía FE.
- `GET /api/v1/auth/me` vẫn kiểm tra phiên chung khi ứng dụng khởi động. Backend hiện đặt cookie access có thời hạn cố định; chưa có endpoint refresh dù tài liệu trước đó mô tả refresh token.

## Lỗi đang gặp (nếu có)

- BE đã hoàn tác mã nguồn về mốc develop nhưng database dev giữ nguyên; cần kiểm tra tương thích trước khi chạy.
- `npm run build` thành công nhưng Vite cảnh báo bundle JavaScript lớn hơn 500 kB.

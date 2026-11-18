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
- Màn hình thông tin cá nhân tải và lưu hồ sơ qua `GET/PUT /api/v1/auth/me`; email chỉ đọc, khách hàng có thể sửa quốc tịch và giấy tờ. FE khởi tạo CSRF khi cần và cập nhật context sau khi lưu.
- Kiểm tra giả lập trên trình duyệt: lưu thành công, gửi CSRF và giữ địa chỉ; lỗi tải vô hiệu hóa chỉnh sửa, lỗi lưu giữ form và hiện thông báo; nút hủy đóng form. `npm run build` thành công.
- `authService` khởi tạo cookie CSRF nếu chưa có trước POST đăng ký/đăng nhập.
- Đăng xuất chuyển về trang đăng nhập sau khi BE xác nhận; hiển thị thông báo đăng ký, đăng xuất thành công hoặc lỗi đăng xuất.
- Kiểm tra giao diện đăng ký và đăng xuất với API giả lập; kiểm tra đăng xuất trên desktop và mobile.
- Nhập `develop`, giữ giao diện xác thực của nhánh và chuyển hướng đăng nhập theo `next` hoặc vai trò của `develop`.
- Kiểm tra chuyển hướng đăng nhập với API giả lập; chưa kiểm tra lại với BE thật.

## Đang dở

- Đã nối đổi ảnh đại diện với BE/Cloudinary: kiểm tra loại và kích thước, preview, tải trực tiếp lên Cloudinary bằng chữ ký BE, xác minh/lưu ảnh ở BE và đồng bộ AuthContext; hiển thị avatar trong hồ sơ, Header và sidebar; nút “Thay ảnh” đặt bên phải ảnh. `npm run build` thành công; chưa kiểm thử upload Cloudinary thật.
- Đã kết nối ghi nhớ đăng nhập và refresh token; người dùng đã áp dụng migration BE vào database kiểm thử. Khôi phục mật khẩu chưa triển khai.
- Đã nối nút đăng nhập Google/Facebook và callback FE; bảng OAuth trên database kiểm thử đã được người dùng xác nhận khớp migration. Người dùng xác nhận đăng nhập Google và Facebook thật thành công.
- Kiểm tra giả lập callback OAuth thành công, email trùng và phiên không hợp lệ; các nút chuyển tới đúng đường dẫn BE. OAuth dùng cookie phiên, không áp dụng lựa chọn ghi nhớ.
- Kiểm tra giả lập: checkbox gửi đúng cả hai giá trị; hai request 401 đồng thời dùng một refresh trong cùng tab; refresh thất bại hoặc request thử lại vẫn 401 chuyển phiên đã đăng nhập về trang đăng nhập.
- Kiểm tra API BE với database thật: cookie phiên/có thời hạn, rotation, đăng xuất, dùng lại token và hai refresh đồng thời đều đạt. Đã tạo tài khoản giả trong database kiểm thử; không xoá dữ liệu.
- Người dùng báo đăng nhập không chọn ghi nhớ, sau 15 phút tải lại vẫn đăng nhập.
- Đã sửa đồng bộ trạng thái đăng nhập/đăng xuất giữa các tab; kiểm tra giả lập hai tab, kể cả khi BroadcastChannel không có và quay lại tab.
- Đã chỉnh biểu tượng tài khoản, trạng thái chờ xác thực và menu tài khoản chỉ gồm thông tin cá nhân, đăng xuất; kiểm tra menu desktop/mobile với API giả lập.
- Dropdown tài khoản và menu mobile tự đóng khi nhấn bên ngoài hoặc nhấn Escape; đã kiểm tra bằng API giả lập.
- Chưa kiểm tra cập nhật hồ sơ với BE thật; cần chạy BE đã cập nhật API hồ sơ.
- Đã kết nối trang đổi mật khẩu với `POST /api/v1/auth/change-password` qua `authService`, gồm CSRF, kiểm tra mật khẩu/xác nhận, trạng thái gửi và xử lý lỗi từ BE. Thêm nút “Quên mật khẩu?” dạng UI-only, không gọi API; thanh độ mạnh đổi đỏ/cam/vàng/xanh theo số điều kiện đạt. `npm run build` và `git diff --check` đạt; chưa kiểm thử đổi mật khẩu với BE thật.
- Chưa xác nhận đầy đủ luồng FE/BE thật trên giao diện với lựa chọn ghi nhớ, đóng/mở trình duyệt, đồng bộ nhiều tab hoặc chờ hết hạn thực tế 7 ngày.

## Việc tiếp theo (theo thứ tự)

1. Kiểm tra luồng FE/BE thật trên giao diện và kiểm tra đồng bộ nhiều tab.
2. Áp dụng migration avatar BE và cấu hình Cloudinary trên môi trường kiểm thử; xác minh luồng upload thật.
3. Kiểm tra thêm các trường hợp OAuth bị từ chối, email trùng và phiên hết hạn với provider thật khi cần.
4. Kiểm thử đổi mật khẩu với BE thật; tích hợp API khôi phục mật khẩu khi BE hỗ trợ và được yêu cầu.

## Quyết định đã chốt và lưu ý

- Bám theo thiết kế mobile ban đầu và thiết kế desktop cập nhật sau đó; card đăng nhập rộng tối đa 480px và card đăng ký tối đa 800px, chiều cao tự nhiên theo nội dung; Header/Footer dùng chung, không thu nhỏ riêng trên trang xác thực.
- Không lưu mật khẩu hoặc token vào `localStorage`/`sessionStorage`.
- Thêm kiểm tra tuổi từ 18 trở lên, điều kiện mật khẩu và xác nhận mật khẩu phía FE.
- `GET /api/v1/auth/me` kiểm tra phiên chung khi ứng dụng khởi động; BE đã bổ sung endpoint refresh trên nhánh `feature/auth-fe-integration`.
- Database `ve_may_bay` trên máy kiểm thử thiếu các cột BE yêu cầu; người dùng đã chọn `ve_may_bay_dong_bo_test` để thử.

## Lỗi đang gặp (nếu có)

- `npm test`: đạt 20/20 test.
- `npm run build`: thành công; Vite cảnh báo chunk JavaScript 668.22 kB lớn hơn 500 kB.
- BE: `./gradlew test --tests 'com.team6.quanlyvemaybay.service.AuthServiceTest' --tests 'com.team6.quanlyvemaybay.controller.AuthControllerTest'` thành công.

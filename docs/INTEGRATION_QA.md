# Tích hợp ba nhóm chức năng

Các nhánh task được tạo riêng từ develop: codex/home-integration, codex/report-integration, codex/destination-integration. Mở PR vào develop, không push trực tiếp develop/main. Merge task Trang chủ trước để có màn hình đăng nhập/đăng xuất thực; tiếp theo Báo cáo và Điểm đến. Backend cần các PR tương ứng.

## Chạy local

1. Backend Java 21: cấu hình DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, JWT_SECRET, APP_FRONTEND_URL theo database đã chuẩn bị; chạy gradlew.bat bootRun. Không chạy schema.sql trên database có dữ liệu vì file baseline chứa DROP TABLE.
2. Frontend Node 22.12+: npm ci, cấu hình .env với VITE_API_BASE_URL=http://localhost:8080, chạy npm run dev. APP_FRONTEND_URL ở BE phải khớp origin FE (mặc định http://localhost:5173).
3. Truy cập /, /dang-nhap, /bao-cao, /quan-ly-diem-den và /quan-ly-diem-den/them-moi. Báo cáo/Điểm đến dành cho ADMIN hoặc NHAN_VIEN. Token xác thực nằm trong cookie HttpOnly; request tạo dữ liệu lấy CSRF từ BE.

## Kiểm chứng ngày 16/11/2026

- FE tích hợp: 44 Node tests PASS, Vite build PASS. BE tích hợp: 160 tests PASS, Gradle build PASS.
- Browser desktop và mobile 390px: Layout/Top10, login/logout và reload; báo cáo đúng API, validate ngày đảo, empty; thêm điểm đến và refresh danh sách thành công.
- MySQL QA riêng: đơn hai hãng tổng 3.000.000 VND, lọc VN 1.000.000/VJ 2.000.000; cả 3 loại báo cáo đúng 1 đơn, 2/1 vé. Hai request tạo điểm đến đồng thời trả 201 + 409 và chỉ lưu 1 bản ghi.
- SonarQube Community 26.11 chạy local: FE/BE Quality Gate OK; 0 finding mở trong file thay đổi sau sửa. FE còn 23 finding baseline ngoài phạm vi. Không nhập coverage report nên đây không phải xác nhận coverage.
- Cookie XSRF-TOKEN không HttpOnly là chủ đích để JavaScript gửi header CSRF; chỉ finding cụ thể được review, không tắt rule. Cookie xác thực vẫn HttpOnly.

## Giới hạn cần QA nghiệp vụ xác nhận

Figma đã đối chiếu Trang chủ node 186-8876 và Báo cáo node 186-5696. Không tìm thấy frame Điểm đến 99.7 trong Figma/SRS cung cấp: giao diện dùng AdminShell/design system hiện có. Form giữ nguyên DTO BE, không đổi schema: tên100, mã sân bay10, mô tả5000, đường dẫn ảnh255. Xem docs/QA_DIEM_DEN.md ở BE để QA xác nhận trường và cách dùng ảnh. Không triển khai upload Cloudinary mới.

Refresh-token rotation chưa có trong baseline BE; hết phiên yêu cầu đăng nhập lại. Build FE còn cảnh báo bundle >500kB. Dữ liệu QA chỉ nằm ở database local riêng, không được đưa vào source hoặc database dev.

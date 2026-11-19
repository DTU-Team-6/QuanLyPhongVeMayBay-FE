# FE – Dựng môi trường và lỗi thường gặp

Dùng được trên cả macOS và Windows (lệnh `npm` giống nhau).

## Dựng môi trường

1. **Node.js:** `node -v` phải từ **20.19** trở lên (hoặc 22.12+ nếu dùng nhánh 22). Chưa có hoặc quá cũ thì cài bản LTS mới nhất:
   - macOS: `brew install node`, hoặc tải ở nodejs.org.
   - Windows: `winget install OpenJS.NodeJS.LTS`, hoặc tải ở nodejs.org, rồi mở terminal mới.
2. **Lấy code:** `git clone` repo `QuanLyPhongVeMayBay-FE`, `git checkout develop`, rồi tạo nhánh làm việc từ đó (xem `05-git-va-quy-trinh.md`).
3. **Cài thư viện:** `npm install`.
4. **Chạy dev:** `npm run dev`, mở địa chỉ Vite in ra (mặc định `http://localhost:5173`).
5. **Kết nối backend:** cần backend đang chạy ở `http://localhost:8080`. Tạo file `.env` với `VITE_API_BASE_URL=http://localhost:8080` (xem `02-ket-noi-backend.md`).

## Kiểm thử đăng ký, đăng nhập và tài khoản

- Dùng phiên bản FE và BE đều đã chứa chức năng xác thực, hồ sơ và đổi mật khẩu; nếu các commit còn ở nhánh làm việc cục bộ thì thành viên khác chưa thể lấy qua GitHub. Kiểm tra nhánh/commit với người phụ trách hoặc dùng `develop` sau khi thay đổi được merge.
- Chạy BE và MySQL theo hướng dẫn `agents-docs/be/02-dung-moi-truong.md` trong repo BE. BE cần Java 21, JWT secret riêng và database kiểm thử có schema tương thích; không tự chạy `schema.sql` có lệnh xoá bảng. Kiểm tra JDBC URL lúc khởi động trỏ đúng database đã chuẩn bị.
- Chạy FE với `VITE_API_BASE_URL` trỏ tới BE và truy cập đúng origin đã cấu hình trong `APP_FRONTEND_URL` phía BE. Khi FE đổi cổng hoặc hostname, cập nhật origin BE rồi khởi động lại BE; dùng cùng hostname, ví dụ đều là `localhost`, để cookie hoạt động đúng.
- Tại `/dang-ky`, tạo tài khoản kiểm thử mới, sau đó đăng nhập ở `/dang-nhap`. Vào `/tai-khoan` để sửa và lưu hồ sơ; email chỉ đọc. Vào `/tai-khoan/doi-mat-khau`, nhập mật khẩu hiện tại và mật khẩu mới rồi kiểm tra đăng nhập lại bằng mật khẩu mới.
- BE thu hồi refresh token khi đổi mật khẩu; access token đã cấp có thể còn hiệu lực tối đa 15 phút. Nút “Quên mật khẩu?” chỉ hiển thị thông báo, chưa kết nối API khôi phục.
- Đăng nhập bằng mật khẩu và sửa hồ sơ không yêu cầu cấu hình OAuth/Cloudinary. Nếu thử đăng nhập Google/Facebook hoặc thay avatar, cần cấu hình và kiểm tra điều kiện riêng theo tài liệu BE `docs/auth-api.md`.
- FE gửi cookie và CSRF qua `apiClient.js`; không lưu mật khẩu/token, không tắt CSRF, không đưa secret vào `.env` FE. Chỉ kiểm thử trên tài khoản và database được phép; không ghi/xoá dữ liệu database dev của người khác.
- Nếu lỗi: kiểm tra BE đã khởi động thành công, `VITE_API_BASE_URL`, origin CORS và database trước; `401` có thể là phiên chưa đăng nhập/hết hạn, còn lỗi thiếu bảng/cột cần kiểm tra schema/migration trên đúng database. Không khẳng định thành công với BE thật nếu chưa kiểm thử.

## Tailwind CSS

Tailwind CSS đã được nhóm chọn. Với Vite, dùng plugin Vite chính thức của Tailwind CSS:

1. Cài `tailwindcss` và `@tailwindcss/vite` bằng npm.
2. Thêm plugin `tailwindcss()` vào `vite.config.js`, giữ nguyên các plugin và cấu hình hiện có.
3. Thêm `@import "tailwindcss";` vào CSS toàn cục (theo cấu trúc đề xuất là `src/index.css`) và bảo đảm CSS này được import từ entry point của ứng dụng.
4. Chạy `npm run build` để xác nhận cấu hình.

Đây là cách cấu hình Tailwind CSS hiện hành cho Vite; xem [hướng dẫn chính thức](https://tailwindcss.com/docs/installation/using-vite). Trước khi sửa, kiểm tra `package.json`, `vite.config.js` và CSS entry thực tế; không ghi đè cấu hình đã có hoặc chạy lại lệnh khởi tạo Vite.

> **Không chạy `npm create vite`** trong repo này. Project đã được khởi tạo; lệnh đó với lựa chọn "Ignore files and continue" sẽ ghi đè `package.json`, `src/App.jsx`, `vite.config.js`, `README.md`... của nhóm.

## Lỗi thường gặp

| Lỗi | Nguyên nhân và cách xử lý |
|---|---|
| `npm error code ETIMEDOUT` khi `npm install` | Lỗi mạng, không phải lỗi project. Thử `npm install --fetch-timeout=120000 --fetch-retries=5`. Kiểm tra kết nối bằng `npm ping`, `npm config get registry` (phải là `https://registry.npmjs.org/`), `npm config get proxy` (thường phải là `null`). Đổi mạng hoặc bật/tắt VPN nếu vẫn lỗi |
| Vite cảnh báo hoặc báo lỗi về phiên bản Node | Node quá cũ. Cài lại Node 20.19+ hoặc 22.12+ |
| Cổng 5173 đang bận | Vite thường tự chuyển sang cổng kế tiếp và in địa chỉ mới ra terminal. CORS ở backend phải cho phép đúng origin FE đang chạy |
| Trình duyệt báo lỗi CORS khi gọi API | Backend chưa cho phép origin của FE (và vì dùng cookie nên phải bật credentials). Báo người dùng để sửa phía backend, không tự tắt kiểm tra ở trình duyệt |
| Lỡ chạy `npm create vite` trong repo đã có project, file của nhóm bị ghi đè | **Chưa commit thì khôi phục được.** `git diff --stat` để xem, `git restore .` để trả file đã có về bản trong `develop`, `git clean -n -d` để xem trước các file thừa Vite tạo thêm, rồi `git clean -f -d` để xoá. Kiểm tra lại bằng `git status` phải ra `working tree clean` |

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

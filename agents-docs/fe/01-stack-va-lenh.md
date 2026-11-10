# FE – Stack và lệnh thường dùng

Frontend của **Hệ thống quản lý phòng bán vé máy bay** (đồ án nhóm DTU-Team-6, theo tài liệu SRS v1.2), viết bằng **ReactJS**.
Backend ở repo riêng `QuanLyPhongVeMayBay-BE` (Java 21, Spring Boot, MySQL).
Hãy trả lời và viết comment bằng **tiếng Việt**; tên component, biến, hàm giữ theo quy ước trong các file `agents-docs/fe/`.

> **Cách đọc các file này:** mục nào ghi "chưa chốt" nghĩa là nhóm chưa quyết định. Agent **không tự chọn**, mà phải hỏi người dùng trước khi dùng.

## Stack

- **ReactJS + Vite + JavaScript** (chốt, theo `README.md` của repo). Không chuyển sang TypeScript hay công cụ build khác nếu chưa hỏi nhóm.
- **Tailwind CSS** đã được chọn làm thư viện giao diện. Với Vite, dùng plugin chính thức `@tailwindcss/vite` và cú pháp CSS theo hướng dẫn phiên bản đang dùng; kiểm tra phiên bản Vite/package hiện có trước khi cập nhật cấu hình.
- **Điều hướng:** dùng React Router để quản lý URL và chuyển trang.
- **Gọi API:** dùng `fetch` tích hợp sẵn trong trình duyệt, gom cấu hình và xử lý chung ở `services/apiClient.js`; không thêm Axios.
- **Quản lý state:** bắt đầu với `useState`/`useReducer`; dùng React Context cho dữ liệu cần chia sẻ rộng như phiên đăng nhập. Chưa thêm thư viện state riêng cho đến khi có nhu cầu cụ thể.
- Node.js **20.19+ (nhánh 20) hoặc 22.12+**, trình quản lý gói là **npm**.
- Điểm khởi động: `src/main.jsx`; component gốc: `src/App.jsx`.
- Backend API chạy mặc định ở `http://localhost:8080` khi dev.
- Các lựa chọn nền tảng FE nêu trong tài liệu đã được chốt ở trên. Trước khi thêm thư viện khác, đọc `package.json`, nêu lý do và hỏi người dùng trước.

Tailwind CSS và React Router đã được người dùng chọn nên có thể cài/cấu hình khi triển khai FE; không cài thư viện state/API thay thế các lựa chọn đã chốt nếu chưa được hỏi lại.

## Lệnh thường dùng

```bash
npm install          # cài thư viện (lần đầu, và mỗi khi package.json đổi)
npm run dev          # chạy dev, mặc định http://localhost:5173
npm run build        # build production, kết quả ở dist/
npm run preview      # xem thử bản build trên máy local
```

Các script khác (lint, test) chưa được xác nhận: agent đọc mục `scripts` trong `package.json` để biết có hay không, không tự đoán lệnh. Thư mục `dist/` và `node_modules/` không commit.

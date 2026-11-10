# FE – Cấu trúc code

## Cấu trúc đề xuất

Tổ chức code theo chức năng để mỗi phần nghiệp vụ tự quản lý màn hình, component và service của mình. Chỉ đưa code lên cấp dùng chung khi thực sự có nhiều chức năng sử dụng.

```text
src/
├── app/
│   ├── App.jsx
│   └── routes.js              # Khai báo route bằng React Router
├── assets/
├── index.css                  # CSS toàn cục và điểm nạp Tailwind CSS
├── components/                # Thành phần giao diện dùng chung
│   ├── Button.jsx
│   └── Loading.jsx
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   ├── components/
│   │   └── authService.js
│   ├── flight-search/
│   │   ├── pages/
│   │   ├── components/
│   │   └── flightService.js
│   ├── booking/
│   │   ├── pages/
│   │   ├── components/
│   │   └── bookingService.js
│   ├── payment/
│   │   ├── pages/
│   │   └── paymentService.js
│   └── image-upload/
│       ├── components/
│       └── imageUploadService.js
├── services/
│   └── apiClient.js            # Gọi API dùng chung bằng fetch
├── utils/
└── main.jsx
```

Đây là cấu trúc tham khảo, không bắt buộc tạo sẵn toàn bộ thư mục. Tạo file/thư mục khi bắt đầu làm chức năng tương ứng.

## Quy tắc tổ chức

- Mỗi thư mục trong `features/` chứa phần giao diện và logic gọi API thuộc chức năng đó. Ví dụ: `features/booking/` quản lý quy trình đặt chỗ.
- Component chỉ đưa vào `src/components/` nếu thực sự được dùng lại giữa nhiều chức năng; component riêng của một chức năng để cạnh màn hình sử dụng nó.
- `services/apiClient.js` là lớp gọi API dùng chung bằng `fetch`: đọc `VITE_API_BASE_URL`, đặt tiền tố `/api/v1`, gửi cookie và header CSRF cho request thay đổi dữ liệu, đồng thời chuẩn hóa lỗi từ BE. Không đặt logic nghiệp vụ của màn hình vào đây.
- Service theo chức năng (như `bookingService.js`) dùng `apiClient.js`; component không gọi `fetch` trực tiếp. Xử lý lỗi nghiệp vụ theo `code` của BE, không đoán theo nội dung thông báo.
- Dùng Tailwind CSS cho style giao diện; điểm nạp CSS toàn cục là `src/index.css`. Tránh tạo thêm hệ thống CSS song song nếu không có yêu cầu cụ thể.
- `imageUploadService.js` xin chữ ký upload từ BE qua `apiClient.js`, sau đó gửi file trực tiếp lên Cloudinary bằng `FormData`. Request upload Cloudinary không đi qua `apiClient.js` và không thêm tiền tố `/api/v1`; chỉ triển khai khi BE đã công bố hợp đồng endpoint/chữ ký.
- Khai báo điều hướng bằng React Router trong `app/routes.js`; đặt router provider tại điểm khởi động phù hợp với cấu trúc ứng dụng.
- Dùng `useState`/`useReducer` cho state cục bộ và React Context cho state dùng chung như phiên đăng nhập. Giữ component ngắn, dễ đọc; chỉ tách hooks hoặc thêm thư viện state riêng khi nhu cầu thực tế xuất hiện.
- Tailwind CSS đã được chọn; các lựa chọn nền tảng FE hiện có xem tại `01-stack-va-lenh.md`.

# AGENTS.md – QuanLyPhongVeMayBay-FE

Frontend của **Hệ thống quản lý phòng bán vé máy bay** (đồ án nhóm DTU-Team-6, theo tài liệu SRS v1.2), viết bằng **ReactJS**.
Hãy trả lời và viết comment bằng **tiếng Việt**.

> Mục nào ghi "chưa chốt" nghĩa là nhóm chưa quyết định. Agent **không tự chọn**, mà phải hỏi người dùng trước khi dùng.

Hướng dẫn chi tiết được chia thành các file nhỏ trong `agents-docs/fe/`. **Đọc file liên quan đến việc đang làm trước khi bắt đầu:**

| Khi nào | Đọc file |
|---|---|
| Luôn đọc đầu tiên: stack, lệnh npm, thư viện chưa chốt | [agents-docs/fe/01-stack-va-lenh.md](agents-docs/fe/01-stack-va-lenh.md) |
| Gọi API, đăng nhập/cookie/CSRF, OAuth2, lỗi API, giờ bay, PayPal, CORS | [agents-docs/fe/02-ket-noi-backend.md](agents-docs/fe/02-ket-noi-backend.md) |
| Làm màn hình mới, phân quyền, hiển thị giá/ghế, xử lý lỗi ghế | [agents-docs/fe/03-man-hinh-va-nghiep-vu.md](agents-docs/fe/03-man-hinh-va-nghiep-vu.md) |
| Tạo file/thư mục mới trong `src/` | [agents-docs/fe/04-cau-truc-code.md](agents-docs/fe/04-cau-truc-code.md) |
| Commit, merge, hoặc nhận task dài | [agents-docs/fe/05-git-va-quy-trinh.md](agents-docs/fe/05-git-va-quy-trinh.md) |
| Dựng môi trường, chạy lần đầu, lỗi npm/Vite/CORS | [agents-docs/fe/06-dung-moi-truong.md](agents-docs/fe/06-dung-moi-truong.md) |

## Quy tắc bắt buộc (tóm tắt, chi tiết ở các file trên)

> Đây chỉ là bản tóm tắt. **Nếu khác với file chi tiết thì file chi tiết đúng.** Khi phát hiện hai chỗ khác nhau, báo người dùng và sửa lại bản tóm tắt cho khớp.

- **Project đã được khởi tạo.** Không chạy lại `npm create vite` trong repo này, vì nó ghi đè file của nhóm (`package.json`, `src/App.jsx`, `vite.config.js`, `README.md`...).
- Stack đã chốt là ReactJS + Vite + JavaScript, dùng Tailwind CSS; cài thư viện mới khác phải nói rõ lý do và hỏi trước.
- Địa chỉ API đọc từ biến `VITE_API_BASE_URL`, không viết cứng; tiền tố đường dẫn là `/api/v1`, đặt ở lớp gọi API. Không để khoá bí mật ở frontend (PayPal `client-id` được phép, `secret` thì không; Cloudinary API secret chỉ ở BE). Xác nhận thanh toán do BE làm.
- Xác thực: JWT trong cookie HttpOnly (`access_token`, `refresh_token`) do BE đặt. FE không đọc và không tự lưu token vào `localStorage`/`sessionStorage`; gọi API phải gửi kèm cookie; request thay đổi dữ liệu gửi header `X-XSRF-TOKEN` lấy từ cookie `XSRF-TOKEN`; không tắt CSRF.
- Đăng nhập Google/Facebook: chuyển hướng cả trang tới `<VITE_API_BASE_URL>/oauth2/authorization/google` (hoặc `facebook`); BE xử lý OAuth2 rồi chuyển về trang FE `/auth/callback`. FE không xử lý mã/token OAuth2.
- Lỗi từ BE theo RFC 9457 + `code` + `details` (mảng `field`, `code`, `message`; không có thì `[]`); FE dựa vào `code`. Giờ bay: `dateTime` là giờ địa phương của sân bay kèm offset, cùng `timeZone` (IANA); hiển thị theo `timeZone`.
- Điều hướng dùng React Router; gọi API dùng `fetch` gom trong `apiClient.js`; state dùng `useState`/`useReducer` và Context của React. Không tự thay bằng thư viện khác nếu chưa hỏi.
- Không hiển thị `gia_goc` cho khách hàng; không tự tính lại tổng tiền ở frontend.
- Ghế đã bị chiếm: BE trả HTTP 409 với `code` = `GHE_DA_BI_CHIEM`, FE xử lý và cho chọn lại. Mật khẩu không log ra console hay lưu `localStorage`.
- Gọi API gom về một lớp riêng, không gọi rải rác trong component.
- Upload ảnh dùng chữ ký do BE cấp rồi FE tải file trực tiếp lên Cloudinary; không để API secret trong FE. Chi tiết ở `agents-docs/fe/02-ket-noi-backend.md`.
- Task dài: liệt kê các chức năng nhỏ, để người dùng xác nhận, rồi làm từng cái một, mỗi cái một commit.

## Ghi tiến độ (để agent khác làm tiếp được)

Agent có thể bị ngắt bất cứ lúc nào (hết token, hết giới hạn) và người dùng có thể chuyển sang agent khác, vì vậy:

- **Mỗi nhánh một file tiến độ:** `progress/<ten-nhanh>.md` ở thư mục gốc repo, tên nhánh thay `/` bằng `-` (nhánh `feature/man-hinh-tim-chuyen` → `progress/feature-man-hinh-tim-chuyen.md`). Không dùng một file chung cho cả repo, vì sẽ conflict khi merge.
- **Đầu phiên:** đọc file tiến độ của nhánh hiện tại (nếu có), rồi chạy `git log --oneline -10` và `git status` để biết đang làm tới đâu. Làm tiếp phần "Đang dở", không làm lại phần đã xong.
- **Sau mỗi chức năng nhỏ** (cùng lúc với commit): cập nhật file tiến độ gồm việc đã xong, việc đang dở, việc tiếp theo, quyết định đã chốt (ví dụ thư viện nhóm vừa chọn). Chưa có file thì tạo từ mẫu [agents-docs/PROGRESS_TEMPLATE.md](agents-docs/PROGRESS_TEMPLATE.md).
- **Khi thấy sắp hết token hoặc người dùng nói sắp dừng:** commit tạm trên nhánh làm việc (`chore: wip ...`, không đẩy lên `develop`/`main`) và cập nhật file tiến độ ngay.
- **Trước khi mở Pull Request:** xoá file tiến độ của nhánh trong commit cuối (`git rm progress/<ten-nhanh>.md`) để không đưa vào `develop`.
- Chỉ ghi những gì đã thật sự xảy ra (kết quả chạy thử thật, lỗi nguyên văn), không ghi phỏng đoán.
- Đừng cùng lúc hai agent làm trên một nhánh. Nếu thấy `git status` có thay đổi lạ chưa commit, hỏi người dùng trước khi động vào.

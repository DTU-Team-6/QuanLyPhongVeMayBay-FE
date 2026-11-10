# FE – Kết nối với backend

- Địa chỉ API đọc từ biến môi trường tên **`VITE_API_BASE_URL`** (Vite chỉ đưa biến có tiền tố `VITE_` vào code), **không viết cứng** trong code. File `.env` chứa giá trị riêng của từng máy, không commit; `.env.example` chỉ ghi tên biến, ví dụ `VITE_API_BASE_URL=http://localhost:8080`. Biến này chỉ chứa địa chỉ gốc; tiền tố đường dẫn **`/api/v1`** đặt ở lớp gọi API, không viết rải rác trong component.
- Mọi biến đưa vào bundle frontend đều lộ ra trình duyệt của người dùng. Tuyệt đối không để khoá bí mật (secret của PayPal, OAuth, Cloudinary, mật khẩu) ở frontend. Riêng PayPal: `client-id` được phép để ở FE (đây là giá trị công khai), còn `secret` chỉ ở BE. **Việc xác nhận thanh toán do BE làm**, FE không tự coi thanh toán là thành công.

## Xác thực (đã chốt)

- Xác thực bằng **JWT** trong cookie do BE đặt: `access_token` (sống 15 phút) và `refresh_token` (sống 7 ngày, có rotation), cả hai là **HttpOnly**. FE không đọc được và **không tự lưu token** vào `localStorage`/`sessionStorage`.
- Gọi API bằng `fetch` qua `services/apiClient.js` và phải **gửi kèm cookie** (`credentials: 'include'`).
- **CSRF:** BE đặt cookie `XSRF-TOKEN` (không HttpOnly). Với request thay đổi dữ liệu (POST, PUT, PATCH, DELETE), FE đọc giá trị cookie đó và gửi trong header **`X-XSRF-TOKEN`**. Không tắt hay bỏ qua CSRF.
- `SameSite=Lax` (FE và BE cùng site; ở dev, `localhost` khác cổng vẫn là cùng site). `Secure` bật trên HTTPS. Nếu sau này FE và BE khác site, hỏi trước.

| Việc                                   | Cách làm                                                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Đăng nhập, đăng ký                     | `POST /api/v1/auth/login`, `POST /api/v1/auth/register`                                                                       |
| Lấy người dùng hiện tại                | `GET /api/v1/auth/me`, BE trả `id`, họ tên, email, vai trò                                                                     |
| Làm mới token khi access token hết hạn | `POST /api/v1/auth/refresh`; nếu thất bại thì đưa người dùng về trang đăng nhập                                               |
| Đăng xuất                              | `POST /api/v1/auth/logout`                                                                                                    |
| Đăng nhập Google/Facebook              | Chuyển hướng cả trang tới `<VITE_API_BASE_URL>/oauth2/authorization/google` hoặc `/facebook` (**không** có tiền tố `/api/v1`) |
| Sau khi đăng nhập OAuth2               | BE chuyển hướng người dùng về trang FE **`/auth/callback`**                                                                   |

- OAuth2 do BE xử lý bằng Authorization Code Flow. FE chỉ chuyển hướng sang BE và nhận kết quả khi quay về `/auth/callback`; FE không giữ client secret, không xử lý mã hay token OAuth2.
- Nếu `GET /api/v1/auth/me` trả 401, FE gọi `/api/v1/auth/refresh` một lần rồi gọi lại endpoint; nếu vẫn 401 thì đưa người dùng về trang đăng nhập.

## Lỗi và thời gian (đã chốt)

- Lỗi từ BE theo **RFC 9457** (`type`, `title`, `status`, `detail`, `instance`) kèm `code` (mã lỗi nghiệp vụ) và `details`. `details` là **mảng** gồm các phần tử `field`, `code`, `message`; khi không có lỗi chi tiết thì là `[]`. FE dựa vào `code`, không dựa vào nội dung `detail`.
- Giờ bay: API trả mỗi mốc giờ gồm `dateTime` (ISO 8601 **có offset**) và `timeZone` (IANA ZoneId); BE lưu UTC và ZoneId riêng cho sân bay đi và sân bay đến. Hiển thị giờ bay theo `timeZone` được trả về, không tự đoán múi giờ.

## Đã chốt: dateTime

- giờ địa phương của sân bay kèm offset, ví dụ 2026-12-01T08:00:00+07:00, cùng timeZone: "Asia/Ho_Chi_Minh".
- Đây là giờ in trên vé, và offset đủ để so sánh tuyệt đối. FE hiển thị theo timeZone được trả về, không dùng múi giờ của máy người dùng.

## Tiền tệ PayPal (đã chốt)

- Giá trong hệ thống là VND; BE quy đổi sang USD theo tỷ giá cố định trong cấu hình.
- Trước khi thanh toán, hiển thị cả số tiền VND và số tiền USD do BE trả. FE không tự quy đổi.

## Upload ảnh Cloudinary (đã chốt luồng)

- FE xin thông tin/chữ ký upload từ endpoint BE; BE tạo chữ ký bằng Cloudinary API secret và chỉ trả các tham số cần thiết để upload. Hợp đồng request/response và đường dẫn endpoint do BE công bố, FE không tự đặt.
- Sau khi nhận chữ ký, FE upload file trực tiếp từ trình duyệt lên Cloudinary. Request upload này không đi qua `apiClient.js` và không dùng tiền tố `/api/v1`.
- FE không chứa hoặc gửi `CLOUDINARY_API_SECRET`; `cloud_name`, `api_key`, chữ ký và timestamp không thay thế API secret. Không cho phép client tự chọn các tham số nhạy cảm như quyền truy cập hoặc public ID nếu BE chưa giới hạn chúng trong chữ ký.
- Chỉ cho chọn JPEG, PNG hoặc WebP, tối đa 5 MB mỗi ảnh; FE kiểm tra để báo lỗi sớm nhưng BE/Cloudinary vẫn phải áp dụng và xác minh giới hạn này.
- Sau upload, FE dùng thông tin asset Cloudinary trả về theo hợp đồng BE để lưu ảnh gắn với bản ghi nghiệp vụ. Không coi việc upload thành công là hoàn tất lưu dữ liệu nghiệp vụ nếu BE chưa xác nhận bản ghi.

## CORS

- Backend cần cấu hình CORS cho cổng dev của frontend, và vì dùng cookie nên phải cho phép credentials với đúng origin của FE. Nếu gọi API bị chặn CORS, báo người dùng để sửa phía backend, không tự tắt kiểm tra ở trình duyệt.

# FE – Git và quy trình làm việc

## Git

- Nhánh tích hợp của nhóm là **`develop`**. Không đẩy thẳng lên `develop` hay `main`. Tạo nhánh làm việc từ `develop` (`feature/...`, `fix/...`, `chore/...`), xong thì mở Pull Request vào `develop`. (Giả định giống backend, nhóm xác nhận nếu frontend khác.)
- **Trước khi merge:** pull `develop` mới nhất về nhánh của mình và xử lý hết conflict; sau khi hết conflict **pull lần nữa** cho chắc, rồi build/chạy thử; chỉ merge khi đã sạch.
- Agent không tự ý giải conflict bằng cách xoá code của người khác. Gặp conflict thì dừng lại và hỏi.
- Commit theo kiểu `feat: ...`, `fix: ...`, `chore: ...`.
- Không commit `node_modules/`, thư mục build, `.env`.

## Khi làm việc

- **Task dài thì chia nhỏ ra từng chức năng rồi làm lần lượt**, không làm một mạch cả khối lớn:
  1. Trước khi code, liệt kê ngắn gọn các chức năng nhỏ và thứ tự, rồi để người dùng xác nhận.
  2. Làm xong một chức năng (màn hình, gọi API, xử lý lỗi, trạng thái đang tải) thì chạy thử và báo kết quả thật, rồi mới sang chức năng kế tiếp.
  3. Mỗi chức năng một commit riêng.
- Làm đúng phạm vi được yêu cầu, thay đổi nhỏ và dễ review.
- Chức năng nào cần API mà backend chưa có thì nói rõ, không tự bịa dữ liệu giả rồi để lẫn vào code chính.

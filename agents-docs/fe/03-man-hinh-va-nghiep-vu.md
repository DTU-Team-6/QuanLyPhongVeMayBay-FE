# FE – Phạm vi màn hình và quy tắc nghiệp vụ giao diện

## Phạm vi màn hình (theo SRS)

Các nhóm chức năng frontend sẽ có, làm dần theo từng chức năng nhỏ:

- Khách hàng: đăng ký, đăng nhập (kể cả Google/Facebook), tìm chuyến bay, chọn khoang và ghế, nhập hành khách, đặt vé, thanh toán PayPal, xem lịch sử giao dịch, xem tin khuyến mãi.
- Nhân viên/quản trị: quản lý chuyến bay, khách hàng, nhân viên (admin), bán vé tại quầy, báo cáo (doanh thu theo hãng, theo nhân viên, theo thời gian).

Phân quyền hiển thị theo vai trò `ADMIN`, `NHAN_VIEN`, `KHACH_HANG`. Ẩn nút/menu ở giao diện chỉ để tiện dùng, **quyền thật do backend kiểm tra**, không coi frontend là lớp bảo vệ.

## Quy tắc nghiệp vụ liên quan đến giao diện

- **Không hiển thị `gia_goc` (giá mua từ hãng) cho khách hàng và không đưa lên vé in.** Chỉ màn hình của nhân viên/admin được thấy, và chỉ khi backend trả về.
- Tiền hiển thị đúng định dạng và đơn vị tiền tệ do backend trả (`tien_te`). Không tự tính lại tổng tiền ở frontend rồi gửi lên, tổng tiền do backend tính.
- Khi đặt vé, ghế có thể bị người khác đặt trước. Phải xử lý lỗi "ghế đã bị chiếm" từ backend và cho người dùng chọn lại, không giả định chọn ghế luôn thành công. Backend trả **HTTP 409** với `code` = **`GHE_DA_BI_CHIEM`** trong JSON lỗi (RFC 9457 + `code` + `details`): FE nhận ra đúng `code` này (không đoán theo nội dung `detail`), báo người dùng và tải lại sơ đồ ghế để chọn lại.
- Mật khẩu không bao giờ log ra console hay lưu ở `localStorage`. Token nằm trong cookie HttpOnly, FE không tự lưu token ở `localStorage`/`sessionStorage`.

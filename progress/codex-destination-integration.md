# Tiến độ task điểm đến

- Nhánh codex/destination-integration, ngày 16/11/2026.
- Màn hình 99.7.1 danh sách và 99.7.3 thêm mới, dùng AdminShell, API dữ liệu thật.
- Cấu trúc form giữ nguyên CreateDestinationRequest: tên <=100 và sân bay <=10 bắt buộc; mô tả <=5000 và ảnh <=255 tùy chọn. Không thêm schema.
- Danh sách sân bay lấy GET /destinations/airports do BE bổ sung, envelope ApiResponse<List<AirportSummaryDto>>.
- Trước POST lấy CSRF cookie qua /auth/csrf, dùng apiClient gửi cookie/header hiện có.
- Có tìm kiếm/lọc/phân trang, hủy request đọc cũ, kiểm tra quyền, validation client/server, duplicate, thành công quay danh sách mới tải.
- URL ảnh theo BE: /path hoặc http(s), không credentials/lùi thư mục. Không có upload mới.
- Các trường đang bám hợp đồng hiện tại, checklist QA do BE ghi; chưa khẳng định có xác nhận của QA nghiệp vụ cho các trường thiếu frame SRS/Figma.

## Đang làm
- Unit/build và phản biện QA độc lập trước commit/push.

## Kết quả kiểm tra
- npm test: 27/27 đạt, gồm CSRF trước POST, payload/envelope, lỗi trùng, giới hạn form, query encode và URL ảnh.
- npm run build đạt; git diff --check sạch (cảnh báo bundle >500 kB đã có baseline).
- QA độc lập không còn P1/P2. Đã đồng bộ URL ảnh với BE: từ chối decoded control và decoded path bắt đầu //; test /%2fexample.com/a.jpg, /a%0ab.jpg, /a%7fb.jpg đều đạt.
- Checklist trường nghiệp vụ ở BE docs/QA_DIEM_DEN.md; các field hiện tại là hợp đồng có sẵn, chưa được suy diễn thêm từ frame thiếu.
- Agent chính tiếp tục integration/browser/Sonar; subagent chưa commit/push.

- QA reviewer không còn P1/P2. Browser BE thật: validate required, tạo mới thành công, danh sách refresh có bản ghi mới. Chờ Sonar trên nhánh tích hợp trước push.

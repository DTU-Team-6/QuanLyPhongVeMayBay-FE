# Tiến độ nhánh `feature/quan-ly-tin-tuc`

- [x] Khởi tạo nhánh từ `develop` mới nhất (`0532964`)
- [x] Tạo service kết nối API thật `/api/v1/tin-tuc` (`newsService.js`), types (`newsTypes.js`), validation (`newsValidation.js`) + unit test (`newsValidation.test.js`)
- [x] Tách khung giao diện dùng chung `AdminShell` kết nối Quản lý nhân viên và Quản lý tin tức
- [x] Hoàn thiện **99.4.1 Danh sách tin tức** (`AdminNewsListPage.jsx` + `PublicNewsListPage.jsx` + `PublicNewsDetailPage.jsx`)
- [x] Hoàn thiện **99.4.2 Xóa tin tức** (`NewsDeleteDialog.jsx`)
- [x] Hoàn thiện **99.4.3 Thêm tin tức** & **99.4.4 Sửa tin tức** (`AdminNewsFormPage.jsx`, `NewsImageUploadCard.jsx`, `NewsRichEditor.jsx`)
- [x] Cập nhật routes (`/quan-ly-tin-tuc`, `/quan-ly-tin-tuc/them-moi`, `/quan-ly-tin-tuc/:id/chinh-sua`, `/tin-tuc`, `/tin-tuc/:id`) và Header
- [x] Chạy kiểm tra unit test (`npm test`) và production build (`npm run build`)

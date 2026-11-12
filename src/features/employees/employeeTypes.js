/**
 * Hợp đồng dữ liệu dựa trên DTO nhân viên của Backend. Dự án dùng JavaScript,
 * nên JSDoc cung cấp kiểu dữ liệu mà không thay đổi stack sang TypeScript.
 *
 * @typedef {'Nam' | 'Nu' | 'Khac'} GioiTinh
 * @typedef {'ADMIN' | 'NHAN_VIEN'} VaiTroNhanVien
 * @typedef {{id: number, maNhanVien: string, hoTen: string, ngaySinh: string, gioiTinh: GioiTinh, email: string, soDienThoai: string, vaiTro: VaiTroNhanVien, trangThai: number}} NhanVien
 * @typedef {{nhanVien: NhanVien[], trang: number, kichThuoc: number, tongSo: number, tongTrang: number}} DanhSachNhanVien
 * @typedef {{maNhanVien: string, hoTen: string, ngaySinh: string, gioiTinh: GioiTinh, email: string, matKhau: string, soDienThoai: string, vaiTro: VaiTroNhanVien}} ThemNhanVienRequest
 * @typedef {Omit<ThemNhanVienRequest, 'maNhanVien' | 'matKhau'>} SuaNhanVienRequest
 */

export const TIEU_CHI_TIM = [
  { value: 'MA_NHAN_VIEN', label: 'Mã NV' },
  { value: 'HO_TEN', label: 'Họ tên' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'SO_DIEN_THOAI', label: 'Số điện thoại' },
];

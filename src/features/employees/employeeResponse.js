/** Chỉ nhận danh sách đúng hợp đồng; không biến phản hồi lỗi thành dữ liệu rỗng. */
export function requireEmployeeList(response) {
  const result = response?.data;
  if (!Array.isArray(result?.nhanVien)
    || !Number.isInteger(result.tongSo)
    || !Number.isInteger(result.tongTrang)) {
    throw new Error('Phản hồi danh sách nhân viên không đúng hợp đồng API.');
  }
  return result;
}

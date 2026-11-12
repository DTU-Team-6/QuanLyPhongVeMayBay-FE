import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLocalNewsImagePath,
  buildNewsPayload,
  mapNewsApiFieldErrors,
  validateNewsForm,
  validateNewsImageFile,
} from './newsValidation.js';

const validValues = {
  tieuDe: 'Chạm mùa thu Hà Nội cùng Vân Việt',
  moTaNgan: 'Khám phá thủ đô tháng 11 với ưu đãi vé máy bay.',
  noiDung: 'Tháng 11 là thời điểm lý tưởng để khám phá Hà Nội.',
  loaiTin: 'KHUYEN_MAI',
  anhDaiDien: '/assets/news/hanoi-mua-thu.jpg',
  trangThai: 'HIEN_THI',
};

test('validateNewsForm xác thực đầy đủ các trường bắt buộc và độ dài', () => {
  assert.deepEqual(validateNewsForm(validValues), {});

  const emptyErrors = validateNewsForm({
    tieuDe: '',
    moTaNgan: ' ',
    noiDung: '',
    loaiTin: '',
    anhDaiDien: '',
  });
  assert.ok(emptyErrors.tieuDe);
  assert.ok(emptyErrors.moTaNgan);
  assert.ok(emptyErrors.noiDung);
  assert.ok(emptyErrors.loaiTin);
  assert.ok(emptyErrors.anhDaiDien);

  const tooLongUrl = validateNewsForm({
    ...validValues,
    anhDaiDien: `https://example.com/${'a'.repeat(250)}.jpg`,
  });
  assert.ok(tooLongUrl.anhDaiDien);
});

test('validateNewsImageFile kiểm tra định dạng JPG/PNG và giới hạn 5 MB', () => {
  assert.equal(validateNewsImageFile({ name: 'cover.jpg', type: 'image/jpeg', size: 1024 }), null);
  assert.equal(validateNewsImageFile({ name: 'cover.png', type: 'image/png', size: 1024 }), null);
  assert.ok(validateNewsImageFile({ name: 'doc.pdf', type: 'application/pdf', size: 1024 }));
  assert.ok(validateNewsImageFile({ name: 'big.jpg', type: 'image/jpeg', size: 6 * 1024 * 1024 }));
});

test('buildNewsPayload và buildLocalNewsImagePath chuẩn hóa dữ liệu gửi BE', () => {
  assert.equal(buildLocalNewsImagePath('Hà Nội Mùa Thu.JPG'), '/assets/news/h-n-i-m-a-thu.jpg');

  const createPayload = buildNewsPayload(validValues, 'create', 5);
  assert.equal(createPayload.nguoiDungId, 5);
  assert.equal(createPayload.chuyenMuc, 'Khuyến mãi');
  assert.equal(createPayload.loaiTin, 'KHUYEN_MAI');

  const editPayload = buildNewsPayload(validValues, 'edit', 5);
  assert.equal(editPayload.nguoiDungId, undefined);
});

test('mapNewsApiFieldErrors ánh xạ lỗi RFC 9457 vào đúng tên trường', () => {
  const mapped = mapNewsApiFieldErrors({
    details: [
      { field: 'tieuDe', message: 'Tiêu đề tin tức không được để trống' },
      { field: 'noiDung', message: 'Nội dung bài viết không được để trống' },
    ],
  });
  assert.equal(mapped.tieuDe, 'Tiêu đề tin tức không được để trống');
  assert.equal(mapped.noiDung, 'Nội dung bài viết không được để trống');
});

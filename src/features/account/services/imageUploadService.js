import authService from '../../../services/authService';

const AVATAR_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadAvatarImage(file) {
  if (!file || !AVATAR_MIME_TYPES.has(file.type)) {
    throw new Error('Ảnh đại diện phải có định dạng JPEG, PNG hoặc WebP.');
  }
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
    throw new Error('Kích thước ảnh đại diện phải lớn hơn 0 và không vượt quá 5 MB.');
  }

  const signature = await authService.createAvatarUploadSignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.apiKey);
  formData.append('timestamp', String(signature.timestamp));
  formData.append('public_id', signature.publicId);
  formData.append('upload_preset', signature.uploadPreset);
  formData.append('allowed_formats', signature.allowedFormats);
  formData.append('overwrite', 'false');
  formData.append('signature', signature.signature);

  let response;
  try {
    response = await fetch(signature.uploadUrl, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error('Không thể tải ảnh lên Cloudinary. Vui lòng kiểm tra kết nối và thử lại.');
  }

  if (!response.ok) {
    throw new Error('Cloudinary không nhận ảnh. Vui lòng kiểm tra cấu hình tải ảnh và thử lại.');
  }

  let uploadedAsset;
  try {
    uploadedAsset = await response.json();
  } catch {
    throw new Error('Cloudinary không trả về thông tin ảnh hợp lệ. Vui lòng thử lại.');
  }
  if (uploadedAsset?.public_id !== signature.publicId) {
    throw new Error('Cloudinary trả về ảnh không khớp với yêu cầu tải lên.');
  }
  return signature.publicId;
}

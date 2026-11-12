import { useEffect, useRef, useState } from 'react';
import {
  MAX_IMAGE_URL_LENGTH,
  buildLocalNewsImagePath,
  validateNewsImageFile,
} from '../newsValidation';
import { handleNewsImageError, resolveNewsImageSrc } from '../utils/newsImage';

/**
 * Thẻ chọn/tải ảnh đại diện bài viết tin tức (hỗ trợ kéo-thả, chọn từ máy, xem trước và nhập URL).
 */
export default function NewsImageUploadCard({ value, onChange, error }) {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [selectedFileMeta, setSelectedFileMeta] = useState(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState('');

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  const handleFile = (file) => {
    if (!file) return;
    const validationError = validateNewsImageFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError('');
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    const objUrl = URL.createObjectURL(file);
    setPreviewObjectUrl(objUrl);

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setSelectedFileMeta(`${file.name} • ${sizeMb === '0.0' ? '< 0.1' : sizeMb} MB`);
    onChange(buildLocalNewsImagePath(file.name));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const hasImage = Boolean(previewObjectUrl || value?.trim());
  const displaySrc = resolveNewsImageSrc(value, previewObjectUrl);
  const displayError = fileError || error;

  return (
    <section className="rounded-xl border border-[#dce5ef] bg-white p-5 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#0f172a]">
          Ảnh đại diện <span className="text-red-500">*</span>
        </h2>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      {hasImage ? (
        <div className="space-y-3">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
            <img
              src={displaySrc}
              alt="Ảnh đại diện tin tức"
              onError={handleNewsImageError}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="truncate text-[12px] text-[#64748b]">
            {selectedFileMeta || value}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#f8fafc] cursor-pointer"
            >
              Thay ảnh
            </button>
            <button
              type="button"
              onClick={() => {
                if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
                setPreviewObjectUrl('');
                setSelectedFileMeta(null);
                setFileError('');
                onChange('');
              }}
              className="rounded-lg border border-[#fecaca] px-3 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border border-dashed px-4 py-7 text-center transition ${
            dragging
              ? 'border-[#0284c7] bg-[#f0f9ff]'
              : 'border-[#cbd5e1] bg-[#f8fafc]'
          }`}
        >
          <p className="text-[13px] font-semibold text-[#334155]">Kéo thả ảnh vào đây</p>
          <p className="mt-1 text-[12px] text-[#64748b]">hoặc chọn từ thiết bị</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 rounded-lg border border-[#cbd5e1] bg-white px-4 py-1.5 text-[12px] font-semibold text-[#0f172a] hover:bg-[#f1f5f9] cursor-pointer"
          >
            Chọn ảnh
          </button>
        </div>
      )}

      <div className="mt-3">
        <label className="block text-[11px] font-medium text-[#64748b]">
          Đường dẫn / URL ảnh (tối đa {MAX_IMAGE_URL_LENGTH} ký tự)
        </label>
        <input
          type="text"
          maxLength={MAX_IMAGE_URL_LENGTH}
          value={value || ''}
          onChange={(event) => {
            if (previewObjectUrl) {
              URL.revokeObjectURL(previewObjectUrl);
              setPreviewObjectUrl('');
            }
            setSelectedFileMeta(null);
            setFileError('');
            onChange(event.target.value);
          }}
          placeholder="/assets/news/promo1.jpg hoặc https://..."
          className="mt-1 h-9 w-full rounded-lg border border-[#cbd5e1] px-2.5 text-[12px] text-[#0f172a] focus:border-[#0284c7] focus:outline-none"
        />
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-[#64748b]">
        JPG, PNG • Tối đa 5 MB. Nên dùng ảnh ngang, tỉ lệ 16:9.
      </p>

      {displayError && (
        <p className="mt-2 text-[12px] font-medium text-red-600">{displayError}</p>
      )}
    </section>
  );
}

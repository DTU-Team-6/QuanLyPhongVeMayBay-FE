import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminShell from '../../../components/layout/AdminShell';
import Loading from '../../../components/common/Loading';
import newsService from '../services/newsService';
import {
  MAX_TITLE_LENGTH,
  buildNewsPayload,
  mapNewsApiFieldErrors,
  validateNewsForm,
} from '../newsValidation';
import {
  NEWS_CATEGORIES,
  NEWS_STATUSES,
  formatNewsCode,
  formatNewsDate,
} from '../newsTypes';
import NewsImageUploadCard from '../components/NewsImageUploadCard';
import { NewsRichEditor } from '../components/NewsRichEditor';

const EMPTY_FORM = {
  tieuDe: '',
  moTaNgan: '',
  noiDung: '',
  anhDaiDien: '',
  loaiTin: '',
  trangThai: 'HIEN_THI',
};

/**
 * Màn hình 99.4.3 Thêm tin tức & 99.4.4 Sửa tin tức
 */
export default function AdminNewsFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isEdit = mode === 'edit';

  const [values, setValues] = useState(EMPTY_FORM);
  const [meta, setMeta] = useState({ maTin: '', tacGia: '', ngayDang: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canManage =
    !authLoading && (user?.vaiTro === 'ADMIN' || user?.vaiTro === 'NHAN_VIEN');

  useEffect(() => {
    if (!isEdit || !id) {
      setValues(EMPTY_FORM);
      setMeta({
        maTin: '',
        tacGia: user?.hoTen || 'Quản trị viên',
        ngayDang: '',
      });
      setLoadingDetail(false);
      return;
    }

    if (authLoading) return;
    if (!canManage) {
      setLoadingDetail(false);
      return;
    }

    let cancelled = false;
    setLoadingDetail(true);
    setLoadError('');

    newsService
      .getNewsDetail(id)
      .then((detail) => {
        if (cancelled || !detail) return;
        setValues({
          tieuDe: detail.tieuDe || '',
          moTaNgan: detail.moTaNgan || '',
          noiDung: detail.noiDung || '',
          anhDaiDien: detail.anhDaiDien || '',
          loaiTin: detail.loaiTin || '',
          trangThai: detail.trangThai || 'HIEN_THI',
        });
        setMeta({
          maTin: formatNewsCode(detail.id, detail.maTin),
          tacGia: detail.tacGia || 'Vân Việt',
          ngayDang: formatNewsDate(detail.ngayDang, detail.thoiGianTao),
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message || 'Không tải được thông tin bài viết.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, canManage, id, isEdit, user?.hoTen]);

  const updateField = (field, nextValue) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!canManage) {
      setSubmitError('Vui lòng đăng nhập bằng tài khoản Admin hoặc Nhân viên để lưu bài viết.');
      return;
    }

    const validationErrors = validateNewsForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError('Vui lòng kiểm tra lại các trường thông tin bắt buộc.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = buildNewsPayload(values, mode, user?.id ?? null);
      if (isEdit) {
        const updated = await newsService.updateNews(id, payload);
        const code = formatNewsCode(updated?.id ?? id, updated?.maTin || meta.maTin);
        navigate('/quan-ly-tin-tuc', {
          state: { notice: `Cập nhật thành công tin ${code} – ${updated?.tieuDe || payload.tieuDe}.` },
        });
      } else {
        const created = await newsService.createNews(payload);
        const code = formatNewsCode(created?.id, created?.maTin);
        navigate('/quan-ly-tin-tuc', {
          state: { notice: `Thêm thành công bài viết ${code} – ${created?.tieuDe || payload.tieuDe}.` },
        });
      }
    } catch (err) {
      const apiFieldErrors = mapNewsApiFieldErrors(err);
      if (Object.keys(apiFieldErrors).length > 0) {
        setErrors(apiFieldErrors);
      }
      setSubmitError(err?.message || 'Không thể lưu bài viết lúc này. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  return (
    <AdminShell user={user} activeKey="news">
      {/* Breadcrumb */}
      <div className="mb-4 text-[12px] text-[#64748b]">
        <Link to="/quan-ly-tin-tuc" className="hover:text-[#0284c7]">
          Quản trị / Quản lý tin tức
        </Link>
        <span> / </span>
        <span className="font-medium text-[#0f172a]">
          {isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
        </span>
      </div>

      {/* Tiêu đề trang & nút Quay lại */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#0f172a]">
            {isEdit ? 'Chỉnh sửa tin tức' : 'Thêm tin tức'}
          </h1>
          <p className="mt-1 text-[13px] text-[#64748b]">
            {isEdit
              ? `${meta.maTin || '—'} • Cập nhật nội dung bài viết đang hiển thị trên website.`
              : 'Tạo bài viết mới để chia sẻ thông tin đến khách hàng.'}
          </p>
        </div>

        <Link
          to="/quan-ly-tin-tuc"
          className="inline-flex h-10 items-center rounded-lg border border-[#cbd5e1] bg-white px-4 text-[13px] font-semibold text-[#334155] hover:bg-[#f8fafc]"
        >
          Quay lại
        </Link>
      </div>

      {!authLoading && !canManage && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-[#bae6fd] bg-[#e0f2fe] px-4 py-3 text-[13px] text-[#075985]"
        >
          Bạn cần đăng nhập tài khoản <strong>Admin</strong> hoặc <strong>Nhân viên</strong> để gửi dữ liệu lên Backend.
        </div>
      )}

      {loadingDetail ? (
        <div className="rounded-xl border border-[#dce5ef] bg-white p-12">
          <Loading message="Đang tải nội dung bài viết..." />
        </div>
      ) : loadError ? (
        <div role="alert" className="rounded-xl border border-[#fecaca] bg-white p-8 text-center">
          <p className="text-[15px] font-bold text-[#0f172a]">Không tải được bài viết</p>
          <p className="mt-1 text-[13px] text-[#64748b]">{loadError}</p>
          <Link
            to="/quan-ly-tin-tuc"
            className="mt-4 inline-block rounded-lg bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white"
          >
            Quay lại danh sách
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitError && (
            <div
              role="alert"
              className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] font-medium text-red-700"
            >
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* Cột trái: Thông tin bài viết */}
            <section className="rounded-xl border border-[#dce5ef] bg-white p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#0f172a]">Thông tin bài viết</h2>
                <p className="mt-0.5 text-[12px] text-[#64748b]">
                  Các trường có dấu * là bắt buộc.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#0f172a]">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={MAX_TITLE_LENGTH}
                  value={values.tieuDe}
                  onChange={(event) => updateField('tieuDe', event.target.value)}
                  placeholder="Nhập tiêu đề tin tức"
                  className={`h-10 w-full rounded-lg border px-3.5 text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none ${
                    errors.tieuDe
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#cbd5e1] focus:border-[#0284c7]'
                  }`}
                />
                {errors.tieuDe && (
                  <p className="mt-1 text-[12px] font-medium text-red-600">{errors.tieuDe}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#0f172a]">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={values.moTaNgan}
                  onChange={(event) => updateField('moTaNgan', event.target.value)}
                  placeholder="Viết phần tóm tắt hiển thị trên thẻ tin tức..."
                  className={`w-full resize-y rounded-lg border p-3 text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none ${
                    errors.moTaNgan
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#cbd5e1] focus:border-[#0284c7]'
                  }`}
                />
                {errors.moTaNgan && (
                  <p className="mt-1 text-[12px] font-medium text-red-600">{errors.moTaNgan}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#0f172a]">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <NewsRichEditor
                  value={values.noiDung}
                  onChange={(next) => updateField('noiDung', next)}
                  error={errors.noiDung}
                />
              </div>
            </section>

            {/* Cột phải: Ảnh đại diện + Phân loại + Lưu ý hiển thị */}
            <div className="space-y-5">
              <NewsImageUploadCard
                value={values.anhDaiDien}
                onChange={(next) => updateField('anhDaiDien', next)}
                error={errors.anhDaiDien}
              />

              <section className="rounded-xl border border-[#dce5ef] bg-white p-5 shadow-xs space-y-4">
                <h2 className="text-[14px] font-bold text-[#0f172a]">Phân loại</h2>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#0f172a]">
                    Chuyên mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={values.loaiTin}
                    onChange={(event) => updateField('loaiTin', event.target.value)}
                    className={`h-10 w-full rounded-lg border bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none ${
                      errors.loaiTin
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#cbd5e1] focus:border-[#0284c7]'
                    }`}
                  >
                    <option value="">Chọn chuyên mục</option>
                    {NEWS_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.loaiTin && (
                    <p className="mt-1 text-[12px] font-medium text-red-600">{errors.loaiTin}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#0f172a]">
                    Trạng thái hiển thị
                  </label>
                  <select
                    value={values.trangThai}
                    onChange={(event) => updateField('trangThai', event.target.value)}
                    className="h-10 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-[13px] text-[#0f172a] focus:border-[#0284c7] focus:outline-none"
                  >
                    {NEWS_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 border-t border-[#f1f5f9] pt-3 text-[12px] text-[#64748b]">
                  {isEdit && meta.maTin && (
                    <p>
                      Mã tin: <span className="font-semibold text-[#0f172a]">{meta.maTin}</span>
                    </p>
                  )}
                  <p>
                    Tác giả:{' '}
                    <span className="font-medium text-[#334155]">
                      {meta.tacGia || user?.hoTen || 'Quản trị viên'}
                    </span>
                  </p>
                  <p>
                    {isEdit
                      ? `Ngày đăng: ${meta.ngayDang || '—'}`
                      : 'Mã tin và ngày đăng được tạo khi lưu.'}
                  </p>
                </div>
              </section>

              <section className="rounded-xl border border-[#bae6fd] bg-[#f0f9ff] p-4">
                <h3 className="text-[13px] font-bold text-[#0369a1]">
                  Hiển thị cho khách hàng
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-[#0369a1]">
                  Sau khi lưu, nội dung sẽ hiển thị trên trang Tin tức. Người dùng chỉ được xem và đọc bài viết.
                </p>
              </section>
            </div>
          </div>

          {/* Thanh hành động đáy */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dce5ef] bg-white px-5 py-4 shadow-xs">
            <span className="text-[12px] text-[#64748b]">
              Kiểm tra nội dung và ảnh trước khi lưu.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => navigate('/quan-ly-tin-tuc')}
                className="h-10 rounded-lg border border-[#cbd5e1] bg-white px-5 text-[13px] font-semibold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting || !canManage}
                className="h-10 rounded-lg bg-[#0284c7] px-5 text-[13px] font-semibold text-white hover:bg-[#0369a1] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {submitting
                  ? 'Đang lưu...'
                  : isEdit
                    ? 'Lưu thay đổi'
                    : 'Thêm tin tức'}
              </button>
            </div>
          </div>
        </form>
      )}
    </AdminShell>
  );
}

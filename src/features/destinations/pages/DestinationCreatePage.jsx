import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DestinationWorkspace from '../components/DestinationWorkspace';
import DestinationImage from '../components/DestinationImage';
import useDestinationAirports from '../hooks/useDestinationAirports';
import destinationService from '../services/destinationService';
import { DESTINATION_LIMITS, destinationFieldErrors, validateDestination, validDestinationImage } from '../utils/destinationHelpers';

const EMPTY_VALUES = { tenDiemDen: '', maSanBay: '', moTa: '', hinhAnh: '' };

function DestinationCreateContent() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const airportState = useDestinationAirports();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState('');
  const activeRequest = useRef(null);
  const form = useRef(null);
  const pending = useRef(false);
  useEffect(() => () => activeRequest.current?.abort(), []);

  function change(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => { const next = { ...previous }; delete next[name]; return next; });
    setError(null);
    if (name === 'hinhAnh') setPreview('');
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current || airportState.loading || airportState.error) return;
    const validation = validateDestination(values, airportState.airports);
    setErrors(validation.errors);
    setError(null);
    if (!validation.isValid) {
      form.current?.elements.namedItem(Object.keys(validation.errors)[0])?.focus();
      return;
    }
    pending.current = true;
    setSubmitting(true);
    const controller = new AbortController();
    activeRequest.current = controller;
    try {
      const created = await destinationService.create(validation.payload, { signal: controller.signal });
      if (!controller.signal.aborted) navigate('/quan-ly-diem-den', { replace: true, state: { notice: `Đã thêm điểm đến “${created.tenDiemDen}” thành công.` } });
    } catch (requestError) {
      if (controller.signal.aborted) return;
      const fieldErrors = destinationFieldErrors(requestError);
      setErrors(fieldErrors);
      setError(requestError);
      if (requestError.status === 401) await checkAuth();
      else if (Object.keys(fieldErrors).length) form.current?.elements.namedItem(Object.keys(fieldErrors)[0])?.focus();
    } finally {
      if (!controller.signal.aborted) { pending.current = false; setSubmitting(false); }
    }
  }

  const fieldClass = (name) => `w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-sky-500 ${errors[name] ? 'border-red-500' : 'border-slate-300'}`;
  const fieldError = (name) => errors[name] && <p id={`${name}-error`} className="text-xs text-red-600 mt-1" role="alert">{errors[name]}</p>;
  const errorText = error?.status === 0 ? 'Chưa nhận được xác nhận lưu. Hãy kiểm tra danh sách trước khi thử lại.' : error?.status === 403 ? 'Tài khoản không có quyền thêm điểm đến hoặc phiên làm việc đã thay đổi. Vui lòng tải lại trang.' : error?.message;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/quan-ly-diem-den" className="text-xs text-sky-700 hover:underline">← Danh sách điểm đến</Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-3">Thêm điểm đến</h1>
        <p className="text-sm text-slate-500 mt-2">Nhập thông tin điểm đến và chọn sân bay kết nối. Trường có * là bắt buộc.</p>
      </div>
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><p>{errorText || 'Không thể thêm điểm đến. Vui lòng kiểm tra thông tin và thử lại.'}</p>{error.status === 0 && <Link to="/quan-ly-diem-den" className="inline-block underline mt-2 font-semibold">Kiểm tra danh sách</Link>}</div>}
      <form ref={form} onSubmit={submit} noValidate className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <fieldset disabled={submitting} className="min-w-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6">
          <legend className="sr-only">Thông tin điểm đến mới</legend>
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="tenDiemDen" className="block text-sm font-semibold text-slate-700 mb-2">Tên điểm đến *</label>
              <input id="tenDiemDen" name="tenDiemDen" value={values.tenDiemDen} onChange={change} maxLength={DESTINATION_LIMITS.tenDiemDen} autoComplete="off" aria-required="true" aria-invalid={!!errors.tenDiemDen} aria-describedby={errors.tenDiemDen ? 'tenDiemDen-error' : undefined} placeholder="Ví dụ: Cầu Rồng Đà Nẵng" className={fieldClass('tenDiemDen')} />
              {fieldError('tenDiemDen')}
              <p className="text-xs text-slate-400 text-right mt-1">{values.tenDiemDen.length}/{DESTINATION_LIMITS.tenDiemDen}</p>
            </div>
            <div>
              <label htmlFor="maSanBay" className="block text-sm font-semibold text-slate-700 mb-2">Sân bay kết nối *</label>
              <select id="maSanBay" name="maSanBay" value={values.maSanBay} onChange={change} disabled={submitting || airportState.loading || !!airportState.error} aria-required="true" aria-invalid={!!errors.maSanBay} aria-describedby={errors.maSanBay ? 'maSanBay-error' : undefined} className={fieldClass('maSanBay')}>
                <option value="">{airportState.loading ? 'Đang tải sân bay…' : 'Chọn sân bay kết nối'}</option>
                {airportState.airports.map((item) => <option key={item.maSanBay} value={item.maSanBay}>{item.maSanBay} — {item.tenSanBay} ({item.thanhPho}, {item.quocGia})</option>)}
              </select>
              {fieldError('maSanBay')}
              {airportState.error && <p role="alert" className="text-xs text-red-600 mt-2">Chưa tải được sân bay. <button type="button" onClick={airportState.reload} className="underline font-semibold">Tải lại danh sách sân bay</button></p>}
              {!airportState.loading && !airportState.error && airportState.airports.length === 0 && <p role="status" className="text-xs text-amber-800 mt-2">Chưa có sân bay trong hệ thống. Cần bổ sung sân bay trước khi thêm điểm đến.</p>}
            </div>
            <div>
              <label htmlFor="moTa" className="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
              <textarea id="moTa" name="moTa" value={values.moTa} onChange={change} rows={7} maxLength={DESTINATION_LIMITS.moTa} aria-invalid={!!errors.moTa} aria-describedby={errors.moTa ? 'moTa-error' : undefined} placeholder="Giới thiệu điểm đến, địa danh hoặc trải nghiệm nổi bật…" className={fieldClass('moTa')} />
              {fieldError('moTa')}
              <p className="text-xs text-slate-400 text-right mt-1">{values.moTa.length.toLocaleString('vi-VN')}/{DESTINATION_LIMITS.moTa.toLocaleString('vi-VN')}</p>
            </div>
            <div>
              <label htmlFor="hinhAnh" className="block text-sm font-semibold text-slate-700 mb-2">Đường dẫn hình ảnh</label>
              <input id="hinhAnh" name="hinhAnh" value={values.hinhAnh} onChange={change} maxLength={DESTINATION_LIMITS.hinhAnh} autoComplete="off" aria-invalid={!!errors.hinhAnh} aria-describedby={errors.hinhAnh ? 'hinhAnh-error' : 'hinhAnh-hint'} placeholder="https://… hoặc /assets/destinations/…" className={fieldClass('hinhAnh')} />
              {fieldError('hinhAnh')}
              <p id="hinhAnh-hint" className="text-xs text-slate-500 mt-2">Không bắt buộc. Dùng ảnh đã có bằng URL http(s) hoặc đường dẫn trên website.</p>
            </div>
          </div>
          <aside className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-slate-700">Ảnh minh họa</h2>
            <DestinationImage src={preview} name={values.tenDiemDen} large />
            <button type="button" disabled={!values.hinhAnh.trim()} onClick={() => {
              const url = values.hinhAnh.trim();
              if (validDestinationImage(url)) { setPreview(url); setErrors((previous) => { const next = { ...previous }; delete next.hinhAnh; return next; }); }
              else setErrors((previous) => ({ ...previous, hinhAnh: 'Đường dẫn hình ảnh không hợp lệ' }));
            }} className="self-start rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40">Xem trước ảnh</button>
          </aside>
          <div className="xl:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button type="button" onClick={() => navigate('/quan-ly-diem-den')} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700">Hủy</button>
            <button type="submit" disabled={submitting || airportState.loading || !!airportState.error || airportState.airports.length === 0} className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Đang lưu…' : 'Lưu điểm đến'}</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default function DestinationCreatePage() {
  return <DestinationWorkspace><DestinationCreateContent /></DestinationWorkspace>;
}

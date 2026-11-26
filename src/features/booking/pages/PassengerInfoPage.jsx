import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PassengerForm from '../components/PassengerForm';
import TripSummaryCard from '../components/TripSummaryCard';
import PaymentSummaryCard from '../components/PaymentSummaryCard';
import bookingService from '../services/bookingService';
import paymentService from '../../payment/services/paymentService';
import { ApiError } from '../../../services/apiClient';

/**
 * Stepper hiển thị bước đặt vé
 */
function BookingStepper({ currentStep }) {
  const steps = [
    { label: 'Chọn chuyến bay', step: 1 },
    { label: 'Thông tin hành khách', step: 2 },
    { label: 'Thanh toán', step: 3 },
  ];

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, idx) => (
        <div key={s.step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition
              ${
                s.step < currentStep
                  ? 'bg-[#0284c7] border-[#0284c7] text-white'
                  : s.step === currentStep
                    ? 'bg-white border-[#0284c7] text-[#0284c7]'
                    : 'bg-white border-[#cbd5e1] text-[#94a3b8]'
              }`}
            >
              {s.step < currentStep ? '✓' : s.step}
            </div>
            <span
              className={`text-[11px] mt-1 whitespace-nowrap ${
                s.step === currentStep ? 'text-[#0284c7] font-semibold' : 'text-[#94a3b8]'
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 mt-[-12px] min-w-[40px] ${
                s.step < currentStep ? 'bg-[#0284c7]' : 'bg-[#e2e8f0]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Trang khai báo thông tin hành khách – 6.4.8
 * Nhận state từ location.state: { chuyenDi, chuyenVe, soNguoiLon, soTreEm, soEmBe, loaiVe, tongTien }
 */
export default function PassengerInfoPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const chuyenDi = state?.chuyenDi || null;
  const chuyenVe = state?.chuyenVe || null;
  const soNguoiLon = state?.soNguoiLon || 1;
  const soTreEm = state?.soTreEm || 0;
  const soEmBe = state?.soEmBe || 0;
  const loaiVe = state?.loaiVe || 'oneWay';
  const tongTien = state?.tongTien ?? null;

  const [danhSachHanhKhach, setDanhSachHanhKhach] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [baggageOptionsDi, setBaggageOptionsDi] = useState([]);
  const [baggageOptionsVe, setBaggageOptionsVe] = useState([]);

  useEffect(() => {
    if (!chuyenDi) {
      navigate('/chuyen-bay', { replace: true });
    }
  }, [chuyenDi, navigate]);

  useEffect(() => {
    bookingService.getBaggageOptions().then((opts) => {
      setBaggageOptionsDi(opts);
      setBaggageOptionsVe(opts);
    });
  }, []);

  if (!chuyenDi) return null;

  const validate = (danhSach) => {
    const newErrors = {};
    let isValid = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolveFlightDate = (raw) => {
      if (!raw) return today;
      if (typeof raw === 'string') {
        const parsed = new Date(`${raw.slice(0, 10)}T00:00:00`);
        return Number.isNaN(parsed.getTime()) ? today : parsed;
      }
      if (Array.isArray(raw) && raw.length >= 3) {
        return new Date(raw[0], raw[1] - 1, raw[2]);
      }
      if (typeof raw === 'object') {
        const iso = raw.thoiGianDiaPhuong || raw.gioDiaPhuong || raw.iso || raw.value;
        if (typeof iso === 'string') {
          const parsed = new Date(`${iso.slice(0, 10)}T00:00:00`);
          return Number.isNaN(parsed.getTime()) ? today : parsed;
        }
      }
      return today;
    };
    const flightDate = resolveFlightDate(chuyenDi?.thoiGianKhoiHanh);

    const calcAge = (birthStr, refDate) => {
      const b = new Date(`${birthStr}T00:00:00`);
      let age = refDate.getFullYear() - b.getFullYear();
      const m = refDate.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && refDate.getDate() < b.getDate())) age -= 1;
      return age;
    };

    danhSach.forEach((hk, i) => {
      const errs = {};

      if (!hk.hoTen?.trim()) {
        errs.hoTen = 'Vui lòng nhập họ tên';
        isValid = false;
      } else if (!/^[A-Z\s'-]+$/.test(hk.hoTen.trim())) {
        errs.hoTen = 'Họ tên phải viết IN HOA, không dấu (chỉ ký tự A-Z)';
        isValid = false;
      }

      if (!hk.ngaySinh) {
        errs.ngaySinh = 'Vui lòng nhập ngày sinh';
        isValid = false;
      } else {
        const birthDate = new Date(`${hk.ngaySinh}T00:00:00`);
        if (birthDate >= today) {
          errs.ngaySinh = 'Ngày sinh phải trước ngày hiện tại';
          isValid = false;
        } else {
          const age = calcAge(hk.ngaySinh, flightDate);
          if (hk.loaiHanhKhach === 'NGUOI_LON' && age < 12) {
            errs.ngaySinh = `Người lớn phải từ 12 tuổi trở lên tính đến ngày bay (hiện ${age} tuổi)`;
            isValid = false;
          } else if (hk.loaiHanhKhach === 'TRE_EM' && (age < 2 || age >= 12)) {
            errs.ngaySinh = `Trẻ em phải từ 2 đến dưới 12 tuổi tính đến ngày bay (hiện ${age} tuổi)`;
            isValid = false;
          } else if (hk.loaiHanhKhach === 'EM_BE' && (age < 0 || age >= 2)) {
            errs.ngaySinh = `Em bé phải dưới 2 tuổi tính đến ngày bay (hiện ${age} tuổi)`;
            isValid = false;
          }
        }
      }

      if (hk.loaiHanhKhach === 'NGUOI_LON' && !hk.cmndPassport?.trim()) {
        errs.cmndPassport = 'Người lớn bắt buộc nhập số CMND/CCCD hoặc Passport';
        isValid = false;
      }

      // Khớp pattern BE: ^\+?[0-9 ]{8,20}$ — chỉ bắt buộc cho hành khách đầu tiên (người liên hệ/đặt vé)
      const phone = hk.soDienThoai?.trim() || '';
      if (i === 0 && !phone) {
        errs.soDienThoai = 'Vui lòng nhập số điện thoại liên hệ';
        isValid = false;
      } else if (phone && !/^\+?[0-9 ]{8,20}$/.test(phone)) {
        errs.soDienThoai = 'Số điện thoại không hợp lệ (8-20 chữ số)';
        isValid = false;
      }

      const email = hk.email?.trim() || '';
      if (i === 0 && !email) {
        errs.email = 'Vui lòng nhập email nhận vé';
        isValid = false;
      } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.email = 'Email không hợp lệ';
        isValid = false;
      }

      if (Object.keys(errs).length > 0) {
        newErrors[i] = errs;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const buildBookingRequest = (hangVeId) => {
    const nguoiDat = danhSachHanhKhach[0] || {};
    return {
      hangVeId,
      emailNguoiDat: nguoiDat.email?.trim(),
      soDienThoaiNguoiDat: nguoiDat.soDienThoai?.trim(),
      hoTenNguoiDat: nguoiDat.hoTen?.trim(),
      soNguoiLon,
      soTreEm,
      soEmBe,
      hanhKhach: danhSachHanhKhach.map((hk) => ({
        hoTen: hk.hoTen.trim(),
        ngaySinh: hk.ngaySinh,
        gioiTinh: hk.gioiTinh,
        email: hk.email?.trim() || null,
        soDienThoai: hk.soDienThoai?.trim() || null,
        cmndPassport: hk.cmndPassport?.trim() || null,
        loaiHanhKhach: hk.loaiHanhKhach,
      })),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(danhSachHanhKhach)) return;

    setSubmitting(true);
    setSubmitError(null);

    let bookingDi = null;
    try {
      bookingDi = await bookingService.createBooking(
        buildBookingRequest(chuyenDi.hangVeId)
      );

      let bookingVe = null;
      if (loaiVe === 'roundTrip' && chuyenVe?.hangVeId) {
        try {
          bookingVe = await bookingService.createBooking(
            buildBookingRequest(chuyenVe.hangVeId)
          );
        } catch (veErr) {
          // Rollback đơn chiều đi nếu chiều về thất bại để tránh giữ chỗ/trùng đơn
          if (bookingDi?.id) {
            await paymentService.cancelBooking(bookingDi.id).catch(() => {});
          }
          throw veErr;
        }
      }

      navigate('/dat-ve/thanh-toan', {
        state: {
          bookingDi,
          bookingVe,
          chuyenDi,
          chuyenVe,
          soNguoiLon,
          soTreEm,
          soEmBe,
          loaiVe,
        },
        replace: true,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        // Map chi tiết lỗi hành khách từ BE vào từng ô nhập liệu
        if (Array.isArray(err.details) && err.details.length > 0) {
          const mappedErrors = {};
          err.details.forEach((d) => {
            const match = /^hanhKhach\[(\d+)\]\.(.+)$/.exec(d.field || '');
            if (match) {
              const idx = Number(match[1]);
              const fieldName = match[2];
              mappedErrors[idx] = { ...(mappedErrors[idx] || {}), [fieldName]: d.message };
            }
          });
          if (Object.keys(mappedErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...mappedErrors }));
          }
        }

        if (err.status === 401 || err.code === 'UNAUTHORIZED') {
          setSubmitError({
            type: 'chuaDangNhap',
            message: 'Bạn cần đăng nhập tài khoản trước khi xác nhận đặt vé.',
          });
        } else if (err.code === 'CHUYEN_BAY_DA_KHOI_HANH' || err.code === 'CHUYEN_BAY_DA_HUY') {
          setSubmitError({
            type: 'gheChiem',
            message: err.message || 'Chuyến bay không còn khả dụng. Vui lòng chọn chuyến bay khác.',
          });
        } else if (err.code === 'GHE_DA_BI_CHIEM' || err.code === 'HET_CHO' || err.status === 409) {
          setSubmitError({
            type: 'gheChiem',
            message: err.message || 'Ghế vừa bị người khác đặt. Vui lòng quay lại chọn chuyến bay khác.',
          });
        } else if (err.code === 'NETWORK_ERROR') {
          setSubmitError({
            type: 'mang',
            message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.',
          });
        } else {
          const detailMsg =
            Array.isArray(err.details) && err.details.length > 0
              ? err.details.map((d) => d.message).filter(Boolean).join(' · ')
              : null;
          setSubmitError({ type: 'khac', message: detailMsg || err.message });
        }
      } else {
        setSubmitError({ type: 'khac', message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const tongTienHienThi =
    tongTien != null ? tongTien : chuyenDi?.tongGiaVe != null ? Number(chuyenDi.tongGiaVe) : null;

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      <div className="bg-[#0284c7] text-white px-4 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[20px] font-bold">Khai báo thông tin hành khách</h1>
          <p className="text-[12px] text-sky-100 mt-1">
            Vui lòng nhập thông tin chính xác như trên giấy tờ tùy thân khi bay.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <BookingStepper currentStep={2} />
        </div>

        {submitError?.type === 'chuaDangNhap' && (
          <div className="bg-amber-50 border border-amber-300 rounded-[10px] p-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="font-semibold text-amber-800 text-[13px]">⚠️ {submitError.message}</p>
            <button
              type="button"
              onClick={() => navigate('/dang-nhap')}
              className="px-4 py-1.5 bg-[#0284c7] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#0369a1] transition cursor-pointer"
            >
              Đăng nhập ngay →
            </button>
          </div>
        )}

        {submitError?.type === 'gheChiem' && (
          <div className="bg-red-50 border border-red-300 rounded-[10px] p-4 mb-5 flex flex-col gap-2">
            <p className="font-semibold text-red-700">⚠️ {submitError.message}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[13px] text-[#0284c7] font-semibold hover:underline cursor-pointer self-start"
            >
              ← Quay lại chọn chuyến bay khác
            </button>
          </div>
        )}

        {submitError && !['gheChiem', 'chuaDangNhap'].includes(submitError.type) && (
          <div className="bg-red-50 border border-red-300 rounded-[10px] p-4 mb-5">
            <p className="text-red-700 text-[13px]">⚠️ {submitError.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 flex-col lg:flex-row items-start">
            <div className="flex-1 min-w-0">
              <PassengerForm
                soNguoiLon={soNguoiLon}
                soTreEm={soTreEm}
                soEmBe={soEmBe}
                baggageOptionsDi={baggageOptionsDi}
                baggageOptionsVe={loaiVe === 'roundTrip' ? baggageOptionsVe : []}
                onPassengersChange={setDanhSachHanhKhach}
                errors={errors}
              />

              <label className="flex items-start gap-3 mt-5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 size-4 rounded text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
                />
                <span className="text-[13px] text-[#334155]">
                  Tôi đã kiểm tra thông tin và đồng ý với điều kiện vận chuyển của hãng hàng không.
                </span>
              </label>

              <div className="flex items-center justify-between mt-6 gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] border border-[#cbd5e1] rounded-[8px] hover:bg-[#f1f5f9] transition cursor-pointer"
                >
                  ← Chọn lại chuyến bay
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[8px] flex items-center gap-2 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    '→ Tiến hành Đặt vé'
                  )}
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-4">
              <TripSummaryCard
                chuyenDi={chuyenDi}
                chuyenVe={chuyenVe}
                loaiVe={loaiVe}
              />
              <PaymentSummaryCard
                chuyenDi={chuyenDi}
                chuyenVe={chuyenVe}
                loaiVe={loaiVe}
                soNguoiLon={soNguoiLon}
                soTreEm={soTreEm}
                soEmBe={soEmBe}
                tongTien={tongTienHienThi}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

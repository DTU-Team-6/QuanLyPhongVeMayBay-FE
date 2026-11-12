import { useState, useEffect } from 'react';

/**
 * Loại hành khách khớp enum LoaiHanhKhach của BE
 */
const LOAI_HK = [
  { key: 'NGUOI_LON', label: 'Người lớn', moTa: 'Từ 12 tuổi trở lên' },
  { key: 'TRE_EM', label: 'Trẻ em', moTa: 'Từ 2 đến dưới 12 tuổi' },
  { key: 'EM_BE', label: 'Em bé', moTa: 'Dưới 2 tuổi' },
];

/**
 * Form nhập thông tin một hành khách
 */
function PassengerFormItem({
  index,
  loaiHanhKhach,
  value,
  onChange,
  baggageOptionsDi,
  baggageOptionsVe,
  errors,
}) {
  const handleChange = (field, rawValue) => {
    const val = field === 'hoTen' ? rawValue.toUpperCase() : rawValue;
    onChange && onChange(index, { ...value, [field]: val });
  };

  const labelFor = (field) => `passenger-${index}-${field}`;
  const loaiMeta = LOAI_HK.find((l) => l.key === loaiHanhKhach) || LOAI_HK[0];

  return (
    <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-5">
      {/* Header hành khách */}
      <div className="flex items-center gap-3 mb-4">
        <span className="size-8 bg-[#0284c7] text-white text-[13px] font-bold rounded-full flex items-center justify-center">
          {index + 1}
        </span>
        <div>
          <h3 className="text-[14px] font-bold text-[#334155]">Hành khách {index + 1}</h3>
          <p className="text-[12px] text-[#64748b]">
            {loaiMeta.label} · {loaiMeta.moTa}
          </p>
        </div>
      </div>

      {/* Lưu ý trẻ em / em bé */}
      {loaiHanhKhach !== 'NGUOI_LON' && (
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-[8px] p-3 mb-4 text-[12px] text-[#0369a1]">
          {loaiHanhKhach === 'TRE_EM'
            ? 'Trẻ em dưới 14 tuổi có thể sử dụng giấy khai sinh; số CMND/Passport không bắt buộc.'
            : 'Em bé cần đi cùng người lớn.'}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Họ và tên */}
        <div className="sm:col-span-2">
          <label htmlFor={labelFor('hoTen')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            Họ và tên <span className="text-red-500">*</span>
            <span className="ml-1 font-normal text-[#94a3b8]">(viết IN HOA, không dấu)</span>
          </label>
          <input
            id={labelFor('hoTen')}
            type="text"
            value={value.hoTen}
            placeholder="VD: NGUYEN VAN A"
            onChange={(e) => handleChange('hoTen', e.target.value)}
            className={`w-full h-10 px-3 border rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none uppercase
              ${errors?.hoTen ? 'border-red-400 bg-red-50' : 'border-[#cbd5e1] bg-white focus:border-[#0284c7]'}`}
          />
          {errors?.hoTen && <p className="text-red-500 text-[11px] mt-1">{errors.hoTen}</p>}
        </div>

        {/* Giới tính */}
        <div>
          <label htmlFor={labelFor('gioiTinh')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            id={labelFor('gioiTinh')}
            value={value.gioiTinh}
            onChange={(e) => handleChange('gioiTinh', e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7] cursor-pointer"
          >
            <option value="Nam">Nam</option>
            <option value="Nu">Nữ</option>
            <option value="Khac">Khác</option>
          </select>
        </div>

        {/* Ngày sinh */}
        <div>
          <label htmlFor={labelFor('ngaySinh')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            id={labelFor('ngaySinh')}
            type="date"
            value={value.ngaySinh}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleChange('ngaySinh', e.target.value)}
            className={`w-full h-10 px-3 border rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none
              ${errors?.ngaySinh ? 'border-red-400 bg-red-50' : 'border-[#cbd5e1] bg-white focus:border-[#0284c7]'}`}
          />
          {errors?.ngaySinh && <p className="text-red-500 text-[11px] mt-1">{errors.ngaySinh}</p>}
        </div>

        {/* CMND / Passport */}
        <div>
          <label htmlFor={labelFor('cmndPassport')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            CMND / Passport
            {loaiHanhKhach !== 'NGUOI_LON' && (
              <span className="ml-1 font-normal text-[#94a3b8]">(không bắt buộc)</span>
            )}
          </label>
          <input
            id={labelFor('cmndPassport')}
            type="text"
            value={value.cmndPassport}
            placeholder="Số CMND/CCCD hoặc hộ chiếu"
            onChange={(e) => handleChange('cmndPassport', e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label htmlFor={labelFor('soDienThoai')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id={labelFor('soDienThoai')}
            type="tel"
            value={value.soDienThoai}
            placeholder="0912345678"
            onChange={(e) => handleChange('soDienThoai', e.target.value)}
            className={`w-full h-10 px-3 border rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none
              ${errors?.soDienThoai ? 'border-red-400 bg-red-50' : 'border-[#cbd5e1] bg-white focus:border-[#0284c7]'}`}
          />
          {errors?.soDienThoai && <p className="text-red-500 text-[11px] mt-1">{errors.soDienThoai}</p>}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label htmlFor={labelFor('email')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            Email nhận vé <span className="text-red-500">*</span>
          </label>
          <input
            id={labelFor('email')}
            type="email"
            value={value.email}
            placeholder="email@example.com"
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full h-10 px-3 border rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none
              ${errors?.email ? 'border-red-400 bg-red-50' : 'border-[#cbd5e1] bg-white focus:border-[#0284c7]'}`}
          />
          {errors?.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
        </div>

        {/* Hành lý bổ sung chiều đi (chỉ hiển thị khi BE có dữ liệu) */}
        {baggageOptionsDi && baggageOptionsDi.length > 0 && (
          <div>
            <label htmlFor={labelFor('hanhLyDi')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
              Hành lý bổ sung chiều đi
            </label>
            <select
              id={labelFor('hanhLyDi')}
              value={value.hanhLyBoSungDi}
              onChange={(e) => handleChange('hanhLyBoSungDi', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7] cursor-pointer"
            >
              <option value="">Không mua thêm</option>
              {baggageOptionsDi.map((opt) => (
                <option key={opt.id || opt.ma} value={opt.id || opt.ma}>
                  {opt.moTa || `${opt.soKg}kg`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Hành lý bổ sung chiều về */}
        {baggageOptionsVe && baggageOptionsVe.length > 0 && (
          <div>
            <label htmlFor={labelFor('hanhLyVe')} className="block text-[12px] font-semibold text-[#334155] mb-1.5">
              Hành lý bổ sung chiều về
            </label>
            <select
              id={labelFor('hanhLyVe')}
              value={value.hanhLyBoSungVe}
              onChange={(e) => handleChange('hanhLyBoSungVe', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7] cursor-pointer"
            >
              <option value="">Không mua thêm</option>
              {baggageOptionsVe.map((opt) => (
                <option key={opt.id || opt.ma} value={opt.id || opt.ma}>
                  {opt.moTa || `${opt.soKg}kg`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Form tổng hợp tất cả hành khách (Người lớn -> Trẻ em -> Em bé)
 */
export default function PassengerForm({
  soNguoiLon = 1,
  soTreEm = 0,
  soEmBe = 0,
  baggageOptionsDi,
  baggageOptionsVe,
  onPassengersChange,
  errors,
}) {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const types = [
      ...Array.from({ length: soNguoiLon }, () => 'NGUOI_LON'),
      ...Array.from({ length: soTreEm }, () => 'TRE_EM'),
      ...Array.from({ length: soEmBe }, () => 'EM_BE'),
    ];
    const list = types.map((loaiHanhKhach) => ({
      hoTen: '',
      gioiTinh: 'Nam',
      ngaySinh: '',
      cmndPassport: '',
      soDienThoai: '',
      email: '',
      hanhLyBoSungDi: '',
      hanhLyBoSungVe: '',
      loaiHanhKhach,
    }));
    setPassengers(list);
    onPassengersChange && onPassengersChange(list);
  }, [soNguoiLon, soTreEm, soEmBe]);

  const handleItemChange = (index, fieldData) => {
    const next = passengers.map((p, i) => (i === index ? { ...p, ...fieldData } : p));
    setPassengers(next);
    onPassengersChange && onPassengersChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {passengers.map((p, i) => (
        <PassengerFormItem
          key={`${p.loaiHanhKhach}-${i}`}
          index={i}
          loaiHanhKhach={p.loaiHanhKhach}
          value={p}
          onChange={handleItemChange}
          baggageOptionsDi={baggageOptionsDi}
          baggageOptionsVe={baggageOptionsVe}
          errors={errors?.[i]}
        />
      ))}
    </div>
  );
}

import { getPresetDateRange } from '../utils/reportHelpers';

export default function ReportFilterForm({ filter, onChange, onSubmit, loading = false, errors = {} }) {
  function change(event) { const { name, type, checked, value } = event.target; onChange({ [name]: type === 'checkbox' ? checked : value }); }
  const inputClass = 'w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-sky-500';
  function select(name, label, options) {
    return <div><label htmlFor={name} className="block text-xs font-semibold text-slate-700 mb-2">{label}</label><select id={name} name={name} value={filter[name]} onChange={change} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} className={inputClass}>{options.map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select>{errors[name] && <p id={`${name}-error`} className="text-xs text-red-600 mt-1">{errors[name]}</p>}</div>;
  }
  return <form noValidate onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
    <fieldset disabled={loading} className="min-w-0 flex flex-col gap-5"><legend className="font-semibold text-lg mb-5">Bộ lọc báo cáo</legend>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {select('displayMode', 'Chọn kiểu hiển thị', [['BOTH', 'Bảng và biểu đồ'], ['TABLE', 'Bảng'], ['CHART', 'Biểu đồ']])}
        {select('reportType', 'Báo cáo theo *', [['THEO_NHAN_VIEN', 'Nhân viên bán hàng'], ['THEO_HANG', 'Hãng hàng không'], ['THEO_THOI_GIAN', 'Doanh thu theo thời gian']])}
        {select('groupBy', 'Gom nhóm thời gian', [['DAY', 'Theo ngày'], ['MONTH', 'Theo tháng'], ['YEAR', 'Theo năm']])}
      </div>
      <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-slate-500 mr-1">Chọn nhanh:</span>{[['thisWeek', 'Tuần này'], ['thisMonth', 'Tháng này'], ['thisQuarter', 'Quý này'], ['thisYear', 'Năm nay']].map(([value, label]) => <button key={value} type="button" onClick={() => onChange(getPresetDateRange(value))} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">{label}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {[['startDate', 'Từ ngày *'], ['endDate', 'Đến ngày *']].map(([name, label]) => <div key={name}><label htmlFor={name} className="block text-xs font-semibold text-slate-700 mb-2">{label}</label><input id={name} name={name} type="date" value={filter[name]} min="0001-01-01" max="9999-12-31" onChange={change} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} className={`${inputClass} ${errors[name] ? 'border-red-500' : ''}`} />{errors[name] && <p id={`${name}-error`} role="alert" className="text-xs text-red-600 mt-1">{errors[name]}</p>}</div>)}
        <label className="flex items-center gap-2 h-10 xl:mt-6 text-sm text-slate-700"><input name="comparePrevious" type="checkbox" checked={filter.comparePrevious} onChange={change} className="size-4 accent-sky-600" />So sánh với kỳ trước</label>
        <button type="submit" className="h-10 xl:mt-6 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold disabled:opacity-60">{loading ? 'Đang tạo báo cáo…' : 'Tạo báo cáo'}</button>
      </div>
    </fieldset>
  </form>;
}

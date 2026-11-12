/**
 * Thanh tab sắp xếp kết quả tìm kiếm chuyến bay
 * - Tabs: Đề xuất | Giá thấp đến cao | Thời gian khởi hành | Hãng hàng không
 * - Tab đang chọn: có underline màu xanh (#0284c7)
 */

const SORT_OPTIONS = [
  { key: 'deXuat', label: 'Đề xuất' },
  { key: 'giaThapDenCao', label: 'Giá thấp đến cao' },
  { key: 'thoiGianKhoiHanh', label: 'Thời gian khởi hành' },
  { key: 'hangHangKhong', label: 'Hãng hàng không' },
];

export default function SortTabBar({ activeSort, onSortChange }) {
  return (
    <div className="flex gap-0 border-b border-[#e2e8f0] bg-white">
      {SORT_OPTIONS.map((opt) => {
        const isActive = activeSort === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSortChange(opt.key)}
            className={`px-5 py-3 text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap
              ${isActive
                ? 'text-[#0284c7] border-b-2 border-[#0284c7] -mb-px'
                : 'text-[#64748b] border-b-2 border-transparent hover:text-[#0284c7]'
              }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

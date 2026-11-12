import searchXIcon from '../../assets/search-x.svg';

/**
 * Component hiển thị trạng thái dữ liệu trống (Empty State) theo thiết kế Figma
 */
export default function EmptyState({
  title = 'Chưa có chuyến bay cho hành trình này',
  description = 'Hiện tại không có chuyến bay nào phù hợp hoặc chưa có dữ liệu khả dụng.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8 md:p-12 shadow-xs flex flex-col items-center justify-center text-center min-h-[320px] w-full">
      <div className="bg-[#f8fafc] rounded-full size-[64px] flex items-center justify-center mb-4">
        <img src={searchXIcon} alt="Không có dữ liệu" className="size-[30px]" />
      </div>
      <h3 className="text-[#0f172a] text-[18px] font-semibold mb-2">
        {title}
      </h3>
      <p className="text-[#64748b] text-[14px] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-[14px] px-6 h-[40px] rounded-[8px] transition cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

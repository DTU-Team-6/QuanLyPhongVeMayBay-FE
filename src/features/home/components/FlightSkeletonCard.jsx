/**
 * Component hiển thị khung Skeleton cho thẻ chuyến bay trong lúc tải dữ liệu
 * Thiết kế khớp chuẩn trạng thái Loading của Figma
 */
export default function FlightSkeletonCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-[20px] shadow-xs flex flex-col gap-[16px] w-full animate-pulse">
      {/* Hàng thông tin chính */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Hãng bay */}
        <div className="flex items-center gap-[10px] w-[180px] shrink-0">
          <div className="size-[32px] rounded-[8px] bg-slate-200" />
          <div className="flex flex-col gap-2">
            <div className="h-[14px] w-[110px] bg-slate-200 rounded-sm" />
            <div className="h-[10px] w-[80px] bg-slate-100 rounded-sm" />
          </div>
        </div>

        {/* Cụm giờ đi - tuyến bay - giờ đến */}
        <div className="flex items-center justify-between flex-1 max-w-[500px] gap-4">
          {/* Giờ đi */}
          <div className="flex flex-col gap-1 w-[90px]">
            <div className="h-[24px] w-[60px] bg-slate-200 rounded-sm" />
            <div className="h-[10px] w-[75px] bg-slate-100 rounded-sm" />
          </div>

          {/* Đường bay */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px]">
            <div className="h-[10px] w-[60px] bg-slate-100 rounded-sm" />
            <div className="h-[2px] w-full bg-slate-200 rounded-full" />
            <div className="h-[10px] w-[50px] bg-slate-100 rounded-sm" />
          </div>

          {/* Giờ đến */}
          <div className="flex flex-col gap-1 w-[90px] text-right md:text-left">
            <div className="h-[24px] w-[60px] bg-slate-200 rounded-sm" />
            <div className="h-[10px] w-[75px] bg-slate-100 rounded-sm" />
          </div>
        </div>

        {/* Giá vé */}
        <div className="flex flex-col items-end gap-1 w-[140px] shrink-0">
          <div className="h-[22px] w-[110px] bg-slate-200 rounded-sm" />
          <div className="h-[10px] w-[90px] bg-slate-100 rounded-sm" />
        </div>
      </div>

      {/* Đường phân cách */}
      <div className="h-px bg-[#e2e8f0] w-full" />

      {/* Hàng điều kiện & nút hành động */}
      <div className="flex items-center justify-between">
        <div className="h-[12px] w-[240px] bg-slate-100 rounded-sm" />
        <div className="h-[36px] w-[110px] bg-slate-200 rounded-[8px]" />
      </div>
    </div>
  );
}

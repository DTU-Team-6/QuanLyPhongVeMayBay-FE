/**
 * Loading Spinner dùng chung cho ứng dụng
 */
export default function Loading({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full min-h-[240px]">
      <div className="relative size-10">
        <div className="size-10 rounded-full border-4 border-[#e2e8f0] border-t-[#0284c7] animate-spin" />
      </div>
      {message && <p className="mt-4 text-[#64748b] text-[14px]">{message}</p>}
    </div>
  );
}

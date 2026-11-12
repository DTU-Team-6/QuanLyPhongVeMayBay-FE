import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-[#e0f2fe] text-[#0284c7] font-semibold text-xs px-3 py-1 rounded-full mb-3">
        ĐANG PHÁT TRIỂN
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">{title}</h1>
      <p className="text-[#64748b] max-w-md mb-6">{description || 'Chức năng này đang được phát triển theo lộ trình của nhóm.'}</p>
      <Link
        to="/"
        className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
      >
        Quay lại Trang chủ
      </Link>
    </div>
  );
}

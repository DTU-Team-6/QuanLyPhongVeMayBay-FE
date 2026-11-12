import FlightSearchForm from './FlightSearchForm';
import hanoiPromoImg from '../../../assets/hanoi-promo.png';
import infoIcon from '../../../assets/info.svg';
import headsetIcon from '../../../assets/headset.svg';

/**
 * Hero Banner của Trang chủ theo thiết kế Figma
 * Bao gồm Lời chào, Biểu mẫu tìm kiếm, Thẻ ưu đãi Hà Nội mùa thu, Thông báo và Hotline
 */
export default function HeroBanner({ onSearch }) {
  return (
    <section className="bg-[#f0f9ff] px-6 lg:px-[120px] py-10 w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        {/* Lời chào thương hiệu */}
        <div className="flex flex-col gap-2 items-start">
          <div className="bg-[#e0f2fe] px-3 py-1 rounded-full">
            <span className="font-semibold text-[#0369a1] text-[12px] tracking-wide">
              CÙNG VÂN VIỆT, ĐI MUÔN NƠI
            </span>
          </div>
          <h1 className="font-bold text-[#0f172a] text-[28px] sm:text-[36px] leading-tight">
            Hành trình mới, khởi đầu an tâm.
          </h1>
          <p className="font-normal text-[#64748b] text-[14px]">
            Tìm chuyến bay phù hợp, đặt vé dễ dàng với đội ngũ luôn đồng hành.
          </p>
        </div>

        {/* Khối Đặt vé và Ưu đãi (2 cột) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          {/* Cột trái: Biểu mẫu tìm vé (7/12 cột trên màn hình lớn) */}
          <div className="lg:col-span-7 w-full">
            <FlightSearchForm onSearch={onSearch} />
          </div>

          {/* Cột phải: Ưu đãi & Lưu ý (5/12 cột trên màn hình lớn) */}
          <div className="lg:col-span-5 flex flex-col gap-4 w-full">
            {/* Banner Khuyến mãi Hà Nội */}
            <div className="relative rounded-[16px] overflow-hidden h-[260px] sm:h-[300px] lg:h-[280px] p-6 flex flex-col justify-end shadow-md group">
              <img
                src={hanoiPromoImg}
                alt="Chạm mùa thu Hà Nội"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Lớp gradient tương phản */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-transparent" />

              <div className="relative z-10 flex flex-col gap-1.5 items-start">
                <div className="bg-[#fffbeb] px-2.5 py-0.5 rounded-full mb-1">
                  <span className="font-semibold text-[#b45309] text-[11px]">
                    ƯU ĐÃI THÁNG 11
                  </span>
                </div>
                <h3 className="font-semibold text-white text-[22px] sm:text-[26px] leading-tight">
                  Chạm mùa thu Hà Nội
                </h3>
                <p className="text-white text-[14px]">
                  Vé một chiều chỉ từ <span className="font-bold text-[#fde047]">1.800.000 ₫</span>
                </p>
                <p className="text-[#e2e8f0] text-[12px]">
                  Áp dụng cho chuyến bay từ 12 – 30/11/2026
                </p>
              </div>
            </div>

            {/* Hộp Thông báo lưu ý */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[8px] p-4 flex gap-3 items-start">
              <img src={infoIcon} alt="" className="size-[18px] shrink-0 mt-0.5" />
              <p className="text-[#92400e] text-[13px] leading-[1.5]">
                Lưu ý: Quý khách có mặt tại sân bay trước giờ khởi hành ít nhất 120 phút với chuyến bay nội địa.
              </p>
            </div>

            {/* Hỗ trợ trực tiếp / Hotline */}
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-4 sm:p-5 flex items-center gap-3 shadow-xs">
              <div className="size-11 rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0">
                <img src={headsetIcon} alt="" className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#0f172a] text-[14px]">
                  Cần tư vấn hành trình?
                </span>
                <span className="text-[#64748b] text-[13px]">
                  Gọi <strong className="text-[#0284c7]">1900 6868</strong> • Phục vụ 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

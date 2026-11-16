import { Link } from 'react-router-dom';
import planeIcon from '../../assets/plane.svg';

/**
 * Footer Component dùng chung cho toàn hệ thống theo thiết kế Figma
 * Hiển thị thông tin phòng vé, hotline liên hệ, chính sách và bản quyền
 */
export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white w-full">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] py-[32px] flex flex-col gap-[24px]">
        {/* Hàng thông tin chính 4 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[64px] items-start">
          {/* Cột 1: Thông tin phòng vé */}
          <div className="flex flex-col gap-[12px] max-w-[360px]">
            <div className="flex items-center gap-[10px]">
              <div className="bg-[#0284c7] flex items-center justify-center rounded-[10px] size-[36px] shrink-0">
                <img src={planeIcon} alt="Vân Việt Logo" className="size-[23px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-[20px] leading-tight">
                  Vân Việt
                </span>
                <span className="font-medium text-[#94a3b8] text-[9px] tracking-[1.4px]">
                  PHÒNG VÉ MÁY BAY
                </span>
              </div>
            </div>
            <p className="text-[#cbd5e1] text-[13px] leading-[1.5]">
              Vững hành trình, trọn niềm tin. Đại lý vé máy bay nội địa và quốc tế.
            </p>
            <p className="text-[#94a3b8] text-[12px] leading-[1.5]">
              28 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Cột 2: Hotline và Hỗ trợ */}
          <div className="flex flex-col gap-[8px]">
            <p className="font-semibold text-white text-[14px]">
              Luôn sẵn sàng hỗ trợ
            </p>
            <a
              href="tel:19006868"
              className="font-semibold text-white text-[22px] hover:text-[#38bdf8] transition-colors"
            >
              1900 6868
            </a>
            <p className="text-[#94a3b8] text-[13px] leading-[1.5]">
              hotro@vanviet.vn • 24/7
            </p>
          </div>

          {/* Cột 3: Chính sách & Quy định */}
          <div className="flex flex-col gap-[8px]">
            <p className="font-semibold text-white text-[14px]">
              Thông tin cần biết
            </p>
            <Link
              to="/dieu-khoan"
              className="text-[#cbd5e1] hover:text-white text-[13px] leading-[1.5] transition-colors"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/chinh-sach-bao-mat"
              className="text-[#cbd5e1] hover:text-white text-[13px] leading-[1.5] transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/quy-dinh-doi-tra"
              className="text-[#cbd5e1] hover:text-white text-[13px] leading-[1.5] transition-colors"
            >
              Quy định đổi, hoàn vé
            </Link>
          </div>

          {/* Cột 4: Đối tác hàng không */}
          <div className="flex flex-col gap-[8px]">
            <p className="font-semibold text-white text-[14px]">
              Đối tác hàng không
            </p>
            <p className="text-[#cbd5e1] text-[13px] leading-[1.5]">
              Vietnam Airlines
            </p>
            <p className="text-[#cbd5e1] text-[13px] leading-[1.5]">
              Vietjet Air • Bamboo Airways
            </p>
          </div>
        </div>

        {/* Đường phân cách */}
        <div className="bg-[#334155] h-px w-full" />

        {/* Dòng bản quyền */}
        <p className="text-[#94a3b8] text-[12px] leading-[1.5]">
          © 2026 Phòng vé Vân Việt. Mọi quyền được bảo lưu. • Giá vé hiển thị bằng VNĐ.
        </p>
      </div>
    </footer>
  );
}

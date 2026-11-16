import { Link, useLocation } from 'react-router-dom';
import planeIcon from '../../assets/plane.svg';

/**
 * Footer Component dùng chung cho toàn hệ thống theo thiết kế Figma
 * Hiển thị thông tin phòng vé, hotline liên hệ, chính sách và bản quyền
 */
export default function Footer() {
  const { pathname } = useLocation();
  const isAuthPage = ['/dang-ky', '/dang-nhap'].includes(pathname);

  return (
    <footer className="bg-[#0f172a] text-white w-full">
      <div className={`mx-auto flex flex-col ${
        isAuthPage
          ? 'max-w-[1120px] gap-4 px-6 py-6 md:gap-4 md:px-8 md:py-5'
          : 'max-w-[1440px] gap-[24px] px-6 py-[32px] lg:px-[120px]'
      }`}>
        {/* Hàng thông tin chính 4 cột */}
        <div className={`grid grid-cols-1 items-start ${
          isAuthPage ? 'gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-6' : 'gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-[64px]'
        }`}>
          {/* Cột 1: Thông tin phòng vé */}
          <div className="flex flex-col gap-[12px] max-w-[360px]">
            <div className="flex items-center gap-[10px]">
              <div className={`bg-[#0284c7] flex items-center justify-center rounded-[10px] size-[36px] shrink-0 ${isAuthPage ? 'md:size-[24px] md:rounded-[6px]' : ''}`}>
                <img src={planeIcon} alt="Vân Việt Logo" className={isAuthPage ? 'size-[23px] md:size-[19px]' : 'size-[23px]'} />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-white leading-tight ${isAuthPage ? 'text-[20px] md:text-[16px]' : 'text-[20px]'}`}>
                  Vân Việt
                </span>
                <span className={`font-medium text-[#94a3b8] tracking-[1.4px] ${isAuthPage ? 'text-[9px] md:text-[8px]' : 'text-[9px]'}`}>
                  PHÒNG VÉ MÁY BAY
                </span>
              </div>
            </div>
            <p className={`text-[#cbd5e1] leading-[1.5] ${isAuthPage ? 'text-[13px] md:text-[11px]' : 'text-[13px]'}`}>
              Vững hành trình, trọn niềm tin. Đại lý vé máy bay nội địa và quốc tế.
            </p>
            <p className={`text-[#94a3b8] leading-[1.5] ${isAuthPage ? 'text-[12px] md:text-[10px]' : 'text-[12px]'}`}>
              28 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Cột 2: Hotline và Hỗ trợ */}
          <div className="flex flex-col gap-[8px]">
            <p className={`font-semibold text-white ${isAuthPage ? 'text-[14px] md:text-[12px]' : 'text-[14px]'}`}>
              Luôn sẵn sàng hỗ trợ
            </p>
            <a
              href="tel:19006868"
              className={`font-semibold text-white hover:text-[#38bdf8] transition-colors ${isAuthPage ? 'text-[22px] md:text-[18px]' : 'text-[22px]'}`}
            >
              1900 6868
            </a>
            <p className={`text-[#94a3b8] leading-[1.5] ${isAuthPage ? 'text-[13px] md:text-[10px]' : 'text-[13px]'}`}>
              hotro@vanviet.vn • 24/7
            </p>
          </div>

          {/* Cột 3: Chính sách & Quy định */}
          <div className="flex flex-col gap-[8px]">
            <p className={`font-semibold text-white ${isAuthPage ? 'text-[14px] md:text-[12px]' : 'text-[14px]'}`}>
              Thông tin cần biết
            </p>
            <Link
              to="/dieu-khoan"
              className={`text-[#cbd5e1] hover:text-white leading-[1.5] transition-colors ${isAuthPage ? 'text-[13px] md:text-[10px]' : 'text-[13px]'}`}
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/chinh-sach-bao-mat"
              className={`text-[#cbd5e1] hover:text-white leading-[1.5] transition-colors ${isAuthPage ? 'text-[13px] md:text-[10px]' : 'text-[13px]'}`}
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/quy-dinh-doi-tra"
              className={`text-[#cbd5e1] hover:text-white leading-[1.5] transition-colors ${isAuthPage ? 'text-[13px] md:text-[10px]' : 'text-[13px]'}`}
            >
              Quy định đổi, hoàn vé
            </Link>
          </div>

          {/* Cột 4: Đối tác hàng không */}
          <div className="flex flex-col gap-[8px]">
            <p className={`font-semibold text-white ${isAuthPage ? 'text-[14px] md:text-[12px]' : 'text-[14px]'}`}>
              Đối tác hàng không
            </p>
            <p className={`text-[#cbd5e1] leading-[1.5] ${isAuthPage ? 'text-[13px] md:text-[10px]' : 'text-[13px]'}`}>
              Vietnam Airlines
            </p>
            <p className={`text-[#cbd5e1] leading-[1.5] ${isAuthPage ? 'text-[13px] md:text-[10px]' : 'text-[13px]'}`}>
              Vietjet Air • Bamboo Airways
            </p>
          </div>
        </div>

        {/* Đường phân cách */}
        <div className="bg-[#334155] h-px w-full" />

        {/* Dòng bản quyền */}
        <p className={`text-[#94a3b8] leading-[1.5] ${isAuthPage ? 'text-[12px] md:text-[10px]' : 'text-[12px]'}`}>
          © 2026 Phòng vé Vân Việt. Mọi quyền được bảo lưu. • Giá vé hiển thị bằng VNĐ.
        </p>
      </div>
    </footer>
  );
}

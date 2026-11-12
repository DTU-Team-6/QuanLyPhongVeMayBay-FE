import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../features/home/pages/HomePage';
import PlaceholderPage from '../components/common/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'khuyen-mai',
        element: (
          <PlaceholderPage
            title="Tin khuyến mãi"
            description="Tổng hợp các chương trình ưu đãi vé máy bay mới nhất."
          />
        ),
      },
      {
        path: 'gioi-thieu',
        element: (
          <PlaceholderPage
            title="Giới thiệu phòng vé Vân Việt"
            description="Đại lý vé máy bay nội địa và quốc tế uy tín hàng đầu."
          />
        ),
      },
      {
        path: 'quy-dinh-hanh-ly',
        element: (
          <PlaceholderPage
            title="Quy định hành lý"
            description="Thông tin chi tiết về kích thước, trọng lượng hành lý xách tay và ký gửi."
          />
        ),
      },
      {
        path: 'chuyen-bay',
        element: (
          <PlaceholderPage
            title="Kết quả tìm kiếm chuyến bay"
            description="Màn hình tìm kiếm và chọn chuyến bay (Task tiếp theo)."
          />
        ),
      },
      {
        path: 'dang-nhap',
        element: (
          <PlaceholderPage
            title="Đăng nhập tài khoản"
            description="Màn hình đăng nhập tài khoản khách hàng / nhân viên."
          />
        ),
      },
      {
        path: 'dang-ky',
        element: (
          <PlaceholderPage
            title="Đăng ký tài khoản"
            description="Màn hình đăng ký tài khoản khách hàng mới."
          />
        ),
      },
      {
        path: '*',
        element: (
          <PlaceholderPage
            title="404 - Không tìm thấy trang"
            description="Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển dời."
          />
        ),
      },
    ],
  },
]);

export default router;

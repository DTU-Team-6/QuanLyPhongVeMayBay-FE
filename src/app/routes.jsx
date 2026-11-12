import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../features/home/pages/HomePage';
import ReportPage from '../features/reports/pages/ReportPage';
import PlaceholderPage from '../components/common/PlaceholderPage';
import EmployeePage from '../features/employees/pages/EmployeePage';
import FlightSearchPage from '../features/flight-search/pages/FlightSearchPage';
import PassengerInfoPage from '../features/booking/pages/PassengerInfoPage';

export const router = createBrowserRouter([
  { path: '/quan-ly-nhan-vien', element: <EmployeePage /> },
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
        // 6.4.6 – Trang danh sách chuyến bay
        path: 'chuyen-bay',
        element: <FlightSearchPage />,
      },
      {
        // 6.4.8 – Trang khai báo thông tin hành khách
        path: 'dat-ve/hanh-khach',
        element: <PassengerInfoPage />,
      },
      {
        path: 'dat-ve/thanh-toan',
        element: (
          <PlaceholderPage
            title="Thanh toán đặt vé"
            description="Đặt chỗ thành công. Chức năng thanh toán sẽ được triển khai ở task tiếp theo."
          />
        ),
      },
      {
        path: 'bao-cao',
        element: <ReportPage />,
      },
      {
        path: 'thong-ke',
        element: <ReportPage />,
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

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../features/home/pages/HomePage';
import ReportPage from '../features/reports/pages/ReportPage';
import PlaceholderPage from '../components/common/PlaceholderPage';
import EmployeePage from '../features/employees/pages/EmployeePage';
import FlightSearchPage from '../features/flight-search/pages/FlightSearchPage';
import PassengerInfoPage from '../features/booking/pages/PassengerInfoPage';
import PaymentPage from '../features/payment/pages/PaymentPage';
import PaymentResultPage from '../features/payment/pages/PaymentResultPage';
import TransactionHistoryPage from '../features/payment/pages/TransactionHistoryPage';
import AdminNewsListPage from '../features/news/pages/AdminNewsListPage';
import AdminNewsFormPage from '../features/news/pages/AdminNewsFormPage';
import PublicNewsListPage from '../features/news/pages/PublicNewsListPage';
import PublicNewsDetailPage from '../features/news/pages/PublicNewsDetailPage';

export const router = createBrowserRouter([
  { path: '/quan-ly-nhan-vien', element: <EmployeePage /> },
  { path: '/quan-ly-tin-tuc', element: <AdminNewsListPage /> },
  { path: '/quan-ly-tin-tuc/them-moi', element: <AdminNewsFormPage mode="create" /> },
  { path: '/quan-ly-tin-tuc/:id/chinh-sua', element: <AdminNewsFormPage mode="edit" /> },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'tin-tuc',
        element: <PublicNewsListPage />,
      },
      {
        path: 'tin-tuc/:id',
        element: <PublicNewsDetailPage />,
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
        // 6.4.3 – Trang thanh toán đặt vé
        path: 'dat-ve/thanh-toan',
        element: <PaymentPage />,
      },
      {
        // 6.4.3 – Xác nhận kết quả callback VNPay / PayPal
        path: 'dat-ve/thanh-toan/ket-qua',
        element: <PaymentResultPage />,
      },
      {
        path: 'thanh-toan/that-bai',
        element: <PaymentResultPage isCancelled />,
      },
      {
        path: 'tai-khoan',
        element: (
          <PlaceholderPage
            title="Thông tin cá nhân"
            description="Màn hình quản lý thông tin tài khoản cá nhân."
          />
        ),
      },
      {
        // 6.4.3 – Thanh toán vé trong khu vực tài khoản
        path: 'tai-khoan/thanh-toan',
        element: <PaymentPage />,
      },
      {
        // 6.4.4 – Xem lịch sử giao dịch
        path: 'tai-khoan/lich-su-giao-dich',
        element: <TransactionHistoryPage />,
      },
      {
        path: 'tai-khoan/doi-mat-khau',
        element: (
          <PlaceholderPage
            title="Đổi mật khẩu"
            description="Màn hình thay đổi mật khẩu tài khoản."
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

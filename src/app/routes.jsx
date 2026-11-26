import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import HomePage from '../features/home/pages/HomePage';
import ReportPage from '../features/reports/pages/ReportPage';
import PlaceholderPage from '../components/common/PlaceholderPage';
import EmployeePage from '../features/employees/pages/EmployeePage';
import TicketPage from '../features/tickets/pages/TicketPage';
import AdminChatPage from '../features/chat/pages/AdminChatPage';
import MyFlightsPage from '../features/my-flights/pages/MyFlightsPage';
import FlightSearchPage from '../features/flight-search/pages/FlightSearchPage';
import PassengerInfoPage from '../features/booking/pages/PassengerInfoPage';
import PaymentPage from '../features/payment/pages/PaymentPage';
import PaymentResultPage from '../features/payment/pages/PaymentResultPage';
import TransactionHistoryPage from '../features/payment/pages/TransactionHistoryPage';
import AdminNewsListPage from '../features/news/pages/AdminNewsListPage';
import AdminNewsFormPage from '../features/news/pages/AdminNewsFormPage';
import PublicNewsListPage from '../features/news/pages/PublicNewsListPage';
import PublicNewsDetailPage from '../features/news/pages/PublicNewsDetailPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import OAuthCallbackPage from '../features/auth/pages/OAuthCallbackPage';
import PersonalInfoPage from '../features/account/pages/PersonalInfoPage';
import ChangePasswordPage from '../features/account/pages/ChangePasswordPage';

export const router = createBrowserRouter([
  { path: '/quan-ly', element: <AdminDashboardPage /> },
  { path: '/admin', element: <Navigate to="/quan-ly" replace /> },
  { path: '/quan-ly/thong-tin', element: <PersonalInfoPage inAdminShell /> },
  { path: '/quan-ly/doi-mat-khau', element: <ChangePasswordPage inAdminShell /> },
  { path: '/quan-ly/bao-cao', element: <ReportPage inAdminShell /> },
  { path: '/quan-ly-nhan-vien', element: <EmployeePage /> },
  { path: '/quan-ly-ban-ve', element: <TicketPage /> },
  { path: '/quan-ly-chat', element: <AdminChatPage /> },
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
        path: 'chuyen-bay-cua-toi',
        element: <MyFlightsPage />,
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
          <PublicNewsListPage
            defaultCategory="KHUYEN_MAI"
            title="Tin khuyến mãi & Ưu đãi vé"
            description="Tổng hợp các chương trình ưu đãi vé máy bay mới nhất của các hãng hàng không."
          />
        ),
      },
      {
        path: 'gioi-thieu',
        element: (
          <PublicNewsListPage
            defaultCategory="GIOI_THIEU"
            title="Giới thiệu phòng vé Vân Việt & Điểm đến"
            description="Đại lý vé máy bay nội địa và quốc tế uy tín hàng đầu, gợi ý các điểm đến hấp dẫn."
          />
        ),
      },
      {
        path: 'quy-dinh-hanh-ly',
        element: (
          <PublicNewsListPage
            defaultCategory="QUY_DINH_HANH_LY"
            title="Quy định hành lý & Kinh nghiệm bay"
            description="Thông tin chi tiết về kích thước, trọng lượng hành lý xách tay, ký gửi và kinh nghiệm bay an toàn."
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
        element: <PersonalInfoPage />,
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
        element: <ChangePasswordPage />,
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
        element: <LoginPage />,
      },
      {
        path: 'dang-ky',
        element: <RegisterPage />,
      },
      {
        path: 'auth/callback',
        element: <OAuthCallbackPage />,
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

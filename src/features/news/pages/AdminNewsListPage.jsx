import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminShell from '../../../components/layout/AdminShell';
import Loading from '../../../components/common/Loading';
import newsService from '../services/newsService';
import {
  NEWS_CATEGORIES,
  formatNewsCode,
  formatNewsDate,
  getNewsCategoryLabel,
} from '../newsTypes';
import { handleNewsImageError, resolveNewsImageSrc } from '../utils/newsImage';
import NewsDeleteDialog from '../components/NewsDeleteDialog';

const PAGE_SIZE = 6;

/**
 * 99.4.1 Danh sách tin tức & 99.4.2 Xóa tin tức (Khu vực Quản trị)
 */
export default function AdminNewsListPage() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [keywordInput, setKeywordInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [queryFilter, setQueryFilter] = useState({
    keyword: '',
    loaiTin: '',
    page: 0,
  });

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canManage =
    !authLoading && (user?.vaiTro === 'ADMIN' || user?.vaiTro === 'NHAN_VIEN');

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const loadNews = useCallback(async () => {
    if (!canManage) return;
    setLoading(true);
    setError(null);
    try {
      const data = await newsService.getNewsList({
        keyword: queryFilter.keyword,
        loaiTin: queryFilter.loaiTin || undefined,
        page: queryFilter.page,
        size: PAGE_SIZE,
      });
      setPageData(data);
    } catch (err) {
      setPageData(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [canManage, queryFilter]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setNotice('');
    setQueryFilter({
      keyword: keywordInput.trim(),
      loaiTin: categoryInput,
      page: 0,
    });
  };

  const handleReset = () => {
    setKeywordInput('');
    setCategoryInput('');
    setNotice('');
    setQueryFilter({ keyword: '', loaiTin: '', page: 0 });
  };

  const handleDeleteConfirm = async (item) => {
    const res = await newsService.deleteNews(item.id);
    const maTin = formatNewsCode(item.id, item.maTin);
    setDeleteTarget(null);
    setNotice(res?.message || `Xóa thành công tin ${maTin} – ${item.tieuDe}`);

    const remainingOnPage = (pageData?.content?.length || 1) - 1;
    if (remainingOnPage === 0 && queryFilter.page > 0) {
      setQueryFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    } else {
      loadNews();
    }
  };

  const items = pageData?.content || [];
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = Math.max(pageData?.totalPages || 0, 1);
  const currentPage = pageData?.pageNumber ?? queryFilter.page;
  const startItem = totalElements > 0 ? currentPage * PAGE_SIZE + 1 : 0;
  const endItem = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  const selectedCategoryLabel = queryFilter.loaiTin
    ? getNewsCategoryLabel(queryFilter.loaiTin)
    : 'Tất cả tin tức';

  return (
    <AdminShell user={user} activeKey="news">
      {/* Breadcrumb */}
      <div className="mb-4 text-[12px] text-[#64748b]">
        <span>Quản trị / </span>
        <span className="font-medium text-[#0f172a]">Quản lý tin tức</span>
      </div>

      {/* Tiêu đề & Nút Thêm tin tức */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#0f172a]">
            Quản lý tin tức
          </h1>
          <p className="mt-1 text-[13px] text-[#64748b]">
            {totalElements} bài viết • Quản lý nội dung hiển thị trên website Vân Việt.
          </p>
        </div>

        <Link
          to="/quan-ly-tin-tuc/them-moi"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0284c7] px-4 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#0369a1]"
        >
          <span>+</span>
          <span>Thêm tin tức</span>
        </Link>
      </div>

      {/* Thông báo quyền hoặc kết quả thao tác */}
      {!authLoading && !canManage && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-[#bae6fd] bg-[#e0f2fe] px-4 py-3 text-[13px] text-[#075985]"
        >
          Đây là bản xem giao diện. Vui lòng{' '}
          <Link to="/dang-nhap" className="font-semibold underline">
            đăng nhập bằng tài khoản Admin hoặc Nhân viên
          </Link>{' '}
          để tải dữ liệu và thực hiện thêm, sửa, xóa tin tức từ Backend.
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#9be8c4] bg-[#eafbf3] px-4 py-3 text-[13px] font-medium text-[#086b51]"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="text-xs font-bold hover:underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm & lọc chuyên mục */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 flex flex-col gap-3 rounded-xl border border-[#dce5ef] bg-white p-3.5 shadow-xs md:flex-row md:items-center"
      >
        <input
          type="text"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="Nhập tiêu đề hoặc từ khóa..."
          className="h-10 flex-1 rounded-lg border border-[#dce5ef] bg-[#f8fafc] px-3.5 text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#0284c7] focus:bg-white focus:outline-none"
        />

        <select
          aria-label="Lọc theo chuyên mục"
          value={categoryInput}
          onChange={(event) => setCategoryInput(event.target.value)}
          className="h-10 rounded-lg border border-[#dce5ef] bg-white px-3 text-[13px] font-medium text-[#334155] focus:border-[#0284c7] focus:outline-none md:w-[210px]"
        >
          <option value="">Tất cả chuyên mục</option>
          {NEWS_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!canManage || loading}
            className="h-10 rounded-lg bg-[#0284c7] px-5 text-[13px] font-semibold text-white hover:bg-[#0369a1] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!canManage || loading}
            className="h-10 rounded-lg border border-[#cbd5e1] bg-white px-4 text-[13px] font-semibold text-[#334155] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Đặt lại
          </button>
        </div>
      </form>

      {/* Thanh tiêu đề danh sách */}
      <div className="mb-4 flex items-center justify-between text-[13px]">
        <h2 className="text-[15px] font-bold text-[#0f172a]">{selectedCategoryLabel}</h2>
        <span className="text-[12px] text-[#64748b]">
          {totalElements} bài viết • Mới nhất trước
        </span>
      </div>

      {/* Nội dung danh sách tin tức (99.4.1) */}
      {loading || authLoading ? (
        <div className="rounded-xl border border-[#dce5ef] bg-white p-10">
          <Loading message="Đang tải danh sách tin tức..." />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-[#fecaca] bg-white p-8 text-center"
        >
          <p className="text-[15px] font-bold text-[#0f172a]">
            Không tải được danh sách tin tức
          </p>
          <p className="mt-1.5 text-[13px] text-[#64748b]">{error.message}</p>
          <button
            type="button"
            onClick={loadNews}
            className="mt-4 rounded-lg bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0369a1] cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-[#dce5ef] bg-white p-12 text-center">
          <p className="text-[15px] font-bold text-[#0f172a]">
            {!canManage
              ? 'Đăng nhập tài khoản Quản trị hoặc Nhân viên để xem bài viết'
              : queryFilter.keyword || queryFilter.loaiTin
                ? 'Không tìm thấy bài viết phù hợp'
                : 'Chưa có bài viết tin tức nào'}
          </p>
          <p className="mt-1.5 text-[13px] text-[#64748b]">
            {!canManage
              ? 'Dữ liệu quản trị tin tức yêu cầu quyền ADMIN hoặc NHAN_VIEN.'
              : queryFilter.keyword || queryFilter.loaiTin
                ? 'Thử thay đổi từ khóa hoặc chọn lại chuyên mục khác.'
                : 'Nhấn "+ Thêm tin tức" để tạo bài viết đầu tiên.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const categoryLabel = getNewsCategoryLabel(item.loaiTin, item.chuyenMuc);
            const maTin = formatNewsCode(item.id, item.maTin);
            const isHidden = item.trangThai === 'AN';

            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#dce5ef] bg-white shadow-xs transition hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e2e8f0]">
                  <img
                    src={resolveNewsImageSrc(item.anhDaiDien)}
                    alt={item.tieuDe}
                    onError={handleNewsImageError}
                    className="h-full w-full object-cover"
                  />
                  {isHidden && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-[#0f172a]/75 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      Đang ẩn
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-[#0284c7]">{categoryLabel}</span>
                    <span className="font-mono text-[#94a3b8]">{maTin}</span>
                  </div>

                  <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#0f172a]">
                    {item.tieuDe}
                  </h3>

                  <p className="mt-2 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[#64748b]">
                    {item.moTaNgan}
                  </p>

                  <p className="mt-3 text-[11px] text-[#94a3b8]">
                    {formatNewsDate(item.ngayDang, item.thoiGianTao)} •{' '}
                    {item.tacGia || 'Vân Việt'}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#f1f5f9] pt-3 text-[12px] font-semibold">
                    <Link
                      to={`/tin-tuc/${item.id}`}
                      className="text-[#0284c7] hover:underline"
                    >
                      Xem bài viết
                    </Link>

                    <div className="flex items-center gap-4">
                      <Link
                        to={`/quan-ly-tin-tuc/${item.id}/chinh-sua`}
                        className="text-[#0284c7] hover:underline"
                      >
                        Sửa
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="text-[#0284c7] hover:text-red-600 hover:underline cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalElements > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#64748b]">
          <span>
            Hiển thị {startItem}–{endItem} trong {totalElements} bài viết
          </span>

          <div className="flex items-center gap-1.5">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={() =>
                  setQueryFilter((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                className="h-8 rounded-lg border border-[#cbd5e1] bg-white px-3 font-medium text-[#334155] hover:bg-[#f8fafc] cursor-pointer"
              >
                Trước
              </button>
            )}

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQueryFilter((prev) => ({ ...prev, page: idx }))}
                className={`flex size-8 items-center justify-center rounded-lg text-[12px] font-semibold cursor-pointer ${
                  idx === currentPage
                    ? 'bg-[#0284c7] text-white'
                    : 'border border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            {currentPage < totalPages - 1 && (
              <button
                type="button"
                onClick={() =>
                  setQueryFilter((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                className="h-8 rounded-lg border border-[#cbd5e1] bg-white px-3 font-medium text-[#334155] hover:bg-[#f8fafc] cursor-pointer"
              >
                Sau
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa tin tức (99.4.2) */}
      {deleteTarget && (
        <NewsDeleteDialog
          newsItem={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </AdminShell>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '../../../components/common/Loading';
import { ApiError } from '../../../services/apiClient';
import newsService from '../services/newsService';
import {
  NEWS_CATEGORIES,
  formatNewsDate,
  getNewsCategoryLabel,
} from '../newsTypes';
import { handleNewsImageError, resolveNewsImageSrc } from '../utils/newsImage';

const PAGE_SIZE = 6;

/**
 * Trang Tin tức & Cẩm nang bay dành cho khách hàng (Screenshot 1)
 */
export default function PublicNewsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('loaiTin') || '';

  const [keywordInput, setKeywordInput] = useState('');
  const [categoryInput, setCategoryInput] = useState(initialCategory);
  const [queryFilter, setQueryFilter] = useState({
    keyword: '',
    loaiTin: initialCategory,
    page: 0,
  });

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paramCategory = searchParams.get('loaiTin') || '';
    setCategoryInput(paramCategory);
    setQueryFilter((prev) => ({
      ...prev,
      loaiTin: paramCategory,
      page: 0,
    }));
  }, [searchParams]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsService.getNewsList({
        keyword: queryFilter.keyword,
        loaiTin: queryFilter.loaiTin || undefined,
        trangThai: 'HIEN_THI',
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
  }, [queryFilter]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleSearch = (event) => {
    event.preventDefault();
    setQueryFilter({
      keyword: keywordInput.trim(),
      loaiTin: categoryInput,
      page: 0,
    });
    if (categoryInput) {
      setSearchParams({ loaiTin: categoryInput });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setKeywordInput('');
    setCategoryInput('');
    setSearchParams({});
    setQueryFilter({ keyword: '', loaiTin: '', page: 0 });
  };

  const items = pageData?.content || [];
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = Math.max(pageData?.totalPages || 0, 1);
  const currentPage = pageData?.pageNumber ?? queryFilter.page;
  const startItem = totalElements > 0 ? currentPage * PAGE_SIZE + 1 : 0;
  const endItem = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  const selectedLabel = queryFilter.loaiTin
    ? getNewsCategoryLabel(queryFilter.loaiTin)
    : 'Tất cả tin tức';

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f8fafc] px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1140px]">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-[12px] text-[#64748b]">
          <Link to="/" className="hover:text-[#0284c7]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-medium text-[#0f172a]">Tin tức</span>
        </nav>

        {/* Tiêu đề trang */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a]">
            Tin tức &amp; Cẩm nang bay
          </h1>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Cập nhật ưu đãi, thông tin chuyến bay và kinh nghiệm cho mỗi hành trình.
          </p>
        </div>

        {/* Bộ lọc tìm kiếm */}
        <form
          onSubmit={handleSearch}
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
            aria-label="Chọn chuyên mục"
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
              className="h-10 rounded-lg bg-[#0284c7] px-5 text-[13px] font-semibold text-white hover:bg-[#0369a1] cursor-pointer"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-10 rounded-lg border border-[#cbd5e1] bg-white px-4 text-[13px] font-semibold text-[#334155] hover:bg-[#f8fafc] cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        </form>

        {/* Thanh đầu mục */}
        <div className="mb-4 flex items-center justify-between text-[13px]">
          <h2 className="text-[15px] font-bold text-[#0f172a]">{selectedLabel}</h2>
          <span className="text-[12px] text-[#64748b]">
            {totalElements} bài viết • Mới nhất trước
          </span>
        </div>

        {/* Lưới bài viết */}
        {loading ? (
          <div className="rounded-xl border border-[#dce5ef] bg-white p-10">
            <Loading message="Đang tải bài viết..." />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center"
          >
            <p className="text-[15px] font-bold text-[#0f172a]">
              {error instanceof ApiError && (error.status === 401 || error.status === 403)
                ? 'Yêu cầu xác thực để tải tin tức từ hệ thống'
                : 'Không tải được danh sách tin tức'}
            </p>
            <p className="mt-1.5 text-[13px] text-[#64748b]">{error.message}</p>
            <div className="mt-4 flex justify-center gap-3">
              {error instanceof ApiError && (error.status === 401 || error.status === 403) && (
                <Link
                  to="/dang-nhap"
                  className="rounded-lg bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0369a1]"
                >
                  Đăng nhập
                </Link>
              )}
              <button
                type="button"
                onClick={loadNews}
                className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-[13px] font-semibold text-[#334155] hover:bg-[#f8fafc] cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-[#dce5ef] bg-white p-12 text-center">
            <p className="text-[15px] font-bold text-[#0f172a]">Chưa có bài viết phù hợp</p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              Thử thay đổi từ khóa hoặc đặt lại bộ lọc chuyên mục.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#dce5ef] bg-white shadow-xs transition hover:shadow-md"
              >
                <Link
                  to={`/tin-tuc/${item.id}`}
                  className="block aspect-[16/9] w-full overflow-hidden bg-[#e2e8f0]"
                >
                  <img
                    src={resolveNewsImageSrc(item.anhDaiDien)}
                    alt={item.tieuDe}
                    onError={handleNewsImageError}
                    className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-semibold text-[#0284c7]">
                    {getNewsCategoryLabel(item.loaiTin, item.chuyenMuc)}
                  </span>

                  <Link to={`/tin-tuc/${item.id}`}>
                    <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#0f172a] hover:text-[#0284c7]">
                      {item.tieuDe}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-3 flex-1 text-[12px] leading-relaxed text-[#64748b]">
                    {item.moTaNgan}
                  </p>

                  <p className="mt-3 text-[11px] text-[#94a3b8]">
                    {formatNewsDate(item.ngayDang, item.thoiGianTao)} •{' '}
                    {item.tacGia || 'Vân Việt'}
                  </p>

                  <div className="mt-3 pt-1">
                    <Link
                      to={`/tin-tuc/${item.id}`}
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0284c7] hover:underline"
                    >
                      <span>Đọc tiếp</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {totalElements > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#64748b]">
            <span>
              Hiển thị {startItem}–{endItem} trong {totalElements} bài viết
            </span>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setQueryFilter((prev) => ({ ...prev, page: idx }))
                  }
                  className={`flex size-8 items-center justify-center rounded-lg text-[12px] font-semibold cursor-pointer ${
                    idx === currentPage
                      ? 'bg-[#0284c7] text-white'
                      : 'border border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

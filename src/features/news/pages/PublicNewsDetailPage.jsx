import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../../components/common/Loading';
import newsService from '../services/newsService';
import {
  estimateReadingMinutes,
  formatNewsDate,
  getNewsCategoryLabel,
} from '../newsTypes';
import { handleNewsImageError, resolveNewsImageSrc } from '../utils/newsImage';
import { NewsContentRenderer } from '../components/NewsRichEditor';

/**
 * Trang chi tiết bài viết tin tức (Screenshot 2)
 */
export default function PublicNewsDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([
      newsService.getNewsDetail(id),
      newsService.getNewsList({ trangThai: 'HIEN_THI', page: 0, size: 4 }).catch(() => null),
    ])
      .then(([detail, listRes]) => {
        if (cancelled) return;
        setArticle(detail);
        const others = (listRes?.content || [])
          .filter((item) => String(item.id) !== String(id))
          .slice(0, 3);
        setFeaturedList(others);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Không tải được chi tiết bài viết.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f8fafc] px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1140px]">
        {/* Breadcrumb */}
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-[12px] text-[#64748b]">
          <Link to="/" className="hover:text-[#0284c7]">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/tin-tuc" className="hover:text-[#0284c7]">
            Tin tức
          </Link>
          {article?.tieuDe && (
            <>
              <span>/</span>
              <span className="truncate font-medium text-[#0f172a]">
                {article.tieuDe}
              </span>
            </>
          )}
        </nav>

        <div className="mb-5">
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0284c7] hover:underline"
          >
            <span>←</span>
            <span>Tất cả tin tức</span>
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#dce5ef] bg-white p-12">
            <Loading message="Đang tải nội dung bài viết..." />
          </div>
        ) : error || !article ? (
          <div className="rounded-2xl border border-[#fecaca] bg-white p-10 text-center">
            <p className="text-[16px] font-bold text-[#0f172a]">
              Không tìm thấy bài viết
            </p>
            <p className="mt-1.5 text-[13px] text-[#64748b]">
              {error || 'Bài viết có thể đã bị xóa hoặc bạn không có quyền truy cập.'}
            </p>
            <Link
              to="/tin-tuc"
              className="mt-4 inline-block rounded-lg bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white"
            >
              Về danh sách tin tức
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            {/* Bài viết chính */}
            <article className="rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-xs lg:p-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">
                {getNewsCategoryLabel(article.loaiTin, article.chuyenMuc)}
              </span>

              <h1 className="mt-2 text-[26px] font-bold leading-snug text-[#0f172a] lg:text-[30px]">
                {article.tieuDe}
              </h1>

              <p className="mt-2.5 text-[12px] text-[#64748b]">
                {formatNewsDate(article.ngayDang, article.thoiGianTao)} •{' '}
                {article.tacGia || 'Vân Việt'} •{' '}
                {estimateReadingMinutes(article.noiDung)} phút đọc
              </p>

              {article.moTaNgan && (
                <p className="mt-4 text-[14px] font-medium leading-relaxed text-[#334155]">
                  {article.moTaNgan}
                </p>
              )}

              <div className="my-5 overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                <img
                  src={resolveNewsImageSrc(article.anhDaiDien)}
                  alt={article.tieuDe}
                  onError={handleNewsImageError}
                  className="max-h-[420px] w-full object-cover"
                />
              </div>

              <NewsContentRenderer content={article.noiDung} />
            </article>

            {/* Cột phải: Tin nổi bật + Hỗ trợ */}
            <aside className="space-y-5">
              <section className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-xs">
                <h2 className="text-[15px] font-bold text-[#0f172a]">Tin nổi bật</h2>
                {featuredList.length === 0 ? (
                  <p className="mt-3 text-[12px] text-[#64748b]">
                    Chưa có bài viết khác.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3.5">
                    {featuredList.map((item) => (
                      <Link
                        key={item.id}
                        to={`/tin-tuc/${item.id}`}
                        className="group flex items-start gap-3"
                      >
                        <img
                          src={resolveNewsImageSrc(item.anhDaiDien)}
                          alt={item.tieuDe}
                          onError={handleNewsImageError}
                          className="h-12 w-16 shrink-0 rounded-lg border border-[#e2e8f0] object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-[#0f172a] group-hover:text-[#0284c7]">
                            {item.tieuDe}
                          </p>
                          <p className="mt-1 text-[11px] text-[#94a3b8]">
                            {formatNewsDate(item.ngayDang, item.thoiGianTao)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-[#bae6fd] bg-[#e0f2fe]/70 p-5">
                <h3 className="text-[14px] font-bold text-[#0f172a]">
                  Cần tư vấn hành trình?
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#0369a1]">
                  Đội ngũ Vân Việt luôn sẵn sàng đồng hành cùng bạn.
                </p>
                <p className="mt-3 text-[20px] font-bold text-[#0284c7]">
                  1900 6868
                </p>
                <p className="mt-1 text-[11px] text-[#0369a1]">Phục vụ 24/7</p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

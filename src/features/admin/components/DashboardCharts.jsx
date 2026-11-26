import { useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';

function formatShortMoney(value) {
  const num = Number(value || 0);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} tỷ`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} tr`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}k`;
  return String(Math.round(num));
}

/**
 * Biểu đồ vùng (Area + Line SVG) hiển thị xu hướng doanh thu thật theo thời gian.
 */
export function RevenueAreaChart({ items = [], loading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (loading && items.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-xl bg-[#f8fafc] text-sm text-[#64748b]">
        Đang tải dữ liệu biểu đồ doanh thu...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc]/70 px-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#e0f2fe] text-[#0284c7]">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#1e293b]">Chưa có phát sinh doanh thu trong kỳ này</p>
        <p className="mt-1 max-w-sm text-xs text-[#64748b]">
          Biểu đồ sẽ tự động hiển thị ngay khi có đơn đặt vé đã thanh toán. Thử chuyển sang kỳ dài hơn (Quý này / Năm nay).
        </p>
      </div>
    );
  }

  const width = 640;
  const height = 230;
  const padLeft = 52;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 34;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const values = items.map((it) => Number(it.doanhThu || 0));
  const maxVal = Math.max(...values, 1);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxVal * ratio));

  const points = items.map((item, idx) => {
    const x = items.length === 1
      ? padLeft + innerW / 2
      : padLeft + (idx / (items.length - 1)) * innerW;
    const val = Number(item.doanhThu || 0);
    const y = padTop + innerH - (val / maxVal) * innerH;
    return {
      x,
      y,
      val,
      tickets: item.soVe ?? item.soVeBanRa ?? 0,
      label: item.label || item.key || `#${idx + 1}`,
    };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${padTop + innerH} L ${points[0].x} ${padTop + innerH} Z`
    : '';

  const hovered = hoveredIndex !== null ? points[hoveredIndex] : null;
  const labelStep = Math.max(1, Math.ceil(points.length / 7));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full overflow-visible" role="img" aria-label="Biểu đồ doanh thu theo thời gian">
        <defs>
          <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Đường lưới ngang và nhãn trục Y */}
        {yTicks.map((tick, idx) => {
          const y = padTop + innerH - (idx / (yTicks.length - 1)) * innerH;
          return (
            <g key={idx}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#e2e8f0" strokeDasharray={idx === 0 ? undefined : '4 4'} />
              <text x={padLeft - 8} y={y + 4} textAnchor="end" className="fill-[#64748b] text-[10px]">
                {formatShortMoney(tick)}
              </text>
            </g>
          );
        })}

        {/* Vùng tô màu và đường xu hướng */}
        {areaPath && <path d={areaPath} fill="url(#dashRevGrad)" />}
        {points.length > 1 && (
          <path d={linePath} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Các điểm dữ liệu và nhãn trục X */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g
              key={p.label + idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {isHovered && (
                <line x1={p.x} y1={padTop} x2={p.x} y2={padTop + innerH} stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#0284c7' : '#ffffff'}
                stroke="#0284c7"
                strokeWidth="2.5"
              />
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              {(idx % labelStep === 0 || idx === points.length - 1) && (
                <text x={p.x} y={height - 10} textAnchor="middle" className="fill-[#64748b] text-[10px]">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-2 right-3 rounded-xl border border-[#bae6fd] bg-[#0f172a] px-3.5 py-2.5 text-xs text-white shadow-lg"
        >
          <p className="font-semibold text-[#7dd3fc]">{hovered.label}</p>
          <p className="mt-1 font-bold tabular-nums">{formatCurrency(hovered.val)}</p>
          <p className="text-[11px] text-slate-300">{hovered.tickets} vé bán ra</p>
        </div>
      )}
    </div>
  );
}

/**
 * Biểu đồ Donut SVG hiển thị cơ cấu trạng thái vé.
 */
export function TicketStatusDonut({ paid = 0, pending = 0, cancelled = 0 }) {
  const total = paid + pending + cancelled;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: 'paid', label: 'Đã thanh toán', value: paid, color: '#10b981', badge: 'bg-emerald-500' },
    { key: 'pending', label: 'Chờ thanh toán', value: pending, color: '#f59e0b', badge: 'bg-amber-500' },
    { key: 'cancelled', label: 'Đã hủy', value: cancelled, color: '#94a3b8', badge: 'bg-slate-400' },
  ];

  let offsetAcc = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 150 150" className="size-[164px] -rotate-90" role="img" aria-label="Tỷ trọng trạng thái vé">
          <circle cx="75" cy="75" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="18" />
          {total > 0 &&
            segments.map((seg) => {
              if (!seg.value) return null;
              const length = (seg.value / total) * circumference;
              const dashArray = `${length} ${circumference - length}`;
              const dashOffset = -offsetAcc;
              offsetAcc += length;
              return (
                <circle
                  key={seg.key}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="18"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                />
              );
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tabular-nums text-[#0f172a]">{total}</span>
          <span className="text-[11px] font-medium text-[#64748b]">Tổng số vé</span>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <div key={seg.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#334155]">
                  <span className={`size-2.5 rounded-full ${seg.badge}`} />
                  {seg.label}
                </span>
                <span className="font-semibold tabular-nums text-[#0f172a]">
                  {seg.value} <span className="font-normal text-[#64748b]">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                <div className={`h-full rounded-full ${seg.badge} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Thanh tỷ trọng doanh thu theo hãng hàng không.
 */
export function AirlineRevenueBars({ items = [] }) {
  if (!items.length) {
    return (
      <p className="text-xs text-[#64748b]">
        Chưa có số liệu doanh thu theo hãng trong kỳ đã chọn.
      </p>
    );
  }

  const total = items.reduce((sum, it) => sum + Number(it.doanhThu || 0), 0) || 1;
  const barColors = ['bg-[#0284c7]', 'bg-[#0ea5e9]', 'bg-[#38bdf8]', 'bg-[#6366f1]', 'bg-[#10b981]'];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.slice(0, 4).map((it, idx) => {
        const amount = Number(it.doanhThu || 0);
        const pct = Math.round((amount / total) * 100);
        return (
          <div key={it.key || it.label || idx} className="rounded-lg border border-[#eef2f6] bg-[#f8fafc] p-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-semibold text-[#1e293b]">{it.label || it.key}</span>
              <span className="shrink-0 font-bold tabular-nums text-[#0284c7]">{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
              <div className={`h-full rounded-full ${barColors[idx % barColors.length]}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] font-medium tabular-nums text-[#64748b]">
              {formatCurrency(amount)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

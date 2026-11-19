/** Tạo dải năm ngày theo ngày lịch, không phụ thuộc múi giờ thiết bị. */
export function buildMinPriceDateRange(selectedDate) {
  const base = new Date(`${selectedDate}T00:00:00.000Z`);
  if (!Number.isFinite(base.getTime()) || base.toISOString().slice(0, 10) !== selectedDate) return null;
  const start = new Date(base);
  const end = new Date(base);
  start.setUTCDate(start.getUTCDate() - 2);
  end.setUTCDate(end.getUTCDate() + 2);
  return {
    ngayBatDau: start.toISOString().slice(0, 10),
    ngayKetThuc: end.toISOString().slice(0, 10),
  };
}

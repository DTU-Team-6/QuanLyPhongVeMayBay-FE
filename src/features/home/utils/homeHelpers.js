/** Ngày xuất phát theo múi giờ sân bay, không phụ thuộc múi giờ thiết bị. */
export function buildFlightSearchUrl(flight) {
  const departure = flight.thoiGianKhoiHanh;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: departure.timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(departure.dateTime));
  const part = (type) => parts.find((item) => item.type === type).value;
  const params = new URLSearchParams({
    maDi: flight.sanBayDi.maSanBay,
    maDen: flight.sanBayDen.maSanBay,
    ngayDi: `${part('year')}-${part('month')}-${part('day')}`,
    soNguoiLon: '1', soTreEm: '0', soEmBe: '0', loaiVe: 'oneWay',
  });
  return `/chuyen-bay?${params}`;
}

export function localDateValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

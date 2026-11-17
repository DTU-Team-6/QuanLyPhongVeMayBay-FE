export function validateMessage(value) {
  const content = value.trim();
  if (!content) return 'Vui lòng nhập nội dung tin nhắn.';
  if (content.length > 2000) return 'Tin nhắn không được vượt quá 2000 ký tự.';
  return '';
}

export function requirePage(response) {
  const page = response?.data;
  if (!page || !Array.isArray(page.content) || !Number.isInteger(page.totalPages)) {
    throw new Error('Dữ liệu hội thoại từ máy chủ không đúng định dạng.');
  }
  return page;
}

export function messageTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function sortMessages(messages) {
  return [...messages].sort((a, b) => new Date(a.guiLuc).valueOf() - new Date(b.guiLuc).valueOf());
}

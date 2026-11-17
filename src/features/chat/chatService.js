import apiClient from '../../services/apiClient';
import { requirePage } from './chatUtils';

const query = (page, size) => `?trang=${encodeURIComponent(page)}&kichThuoc=${encodeURIComponent(size)}`;

async function send(endpoint, content) {
  // Backend có thể xoay cookie XSRF-TOKEN sau mỗi POST.
  await apiClient('/auth/csrf');
  const response = await apiClient(endpoint, { method: 'POST', body: JSON.stringify({ noiDung: content.trim() }) });
  return response?.data;
}

export const chatService = {
  async customerHistory(page = 0, size = 20) {
    return requirePage(await apiClient(`/chat/messages${query(page, size)}`));
  },
  sendCustomer(content) { return send('/chat/messages', content); },
  async conversations(page = 0, size = 20) {
    return requirePage(await apiClient(`/chat/conversations${query(page, size)}`));
  },
  async adminHistory(customerId, page = 0, size = 20) {
    return requirePage(await apiClient(`/chat/conversations/${encodeURIComponent(customerId)}/messages${query(page, size)}`));
  },
  sendAdmin(customerId, content) {
    return send(`/chat/conversations/${encodeURIComponent(customerId)}/messages`, content);
  },
};

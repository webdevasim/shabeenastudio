export type Customer = { id: string | number; name: string; email: string; role: string };
const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN = 'shabeena_customer_token';
export function getToken() { return typeof window === 'undefined' ? null : sessionStorage.getItem(TOKEN); }
export function getCustomer(): Customer | null { if (typeof window === 'undefined') return null; try { return JSON.parse(sessionStorage.getItem('shabeena_customer') || 'null'); } catch { return null; } }
async function request(path: string, method = 'GET', payload?: unknown) {
  if (!base) throw new Error('Set NEXT_PUBLIC_API_BASE_URL in .env.local');
  const res = await fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) }, body: payload === undefined ? undefined : JSON.stringify(payload), cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
export async function registerCustomer(name: string, email: string, password: string) { return request('/auth/register', 'POST', { name, email, password }); }
export async function loginCustomer(email: string, password: string) { const data = await request('/auth/login', 'POST', { email, password }); sessionStorage.setItem(TOKEN, data.token); sessionStorage.setItem('shabeena_customer', JSON.stringify(data.user)); return data.user as Customer; }
export async function logoutCustomer() { try { if (getToken()) await request('/auth/logout', 'POST'); } finally { sessionStorage.removeItem(TOKEN); sessionStorage.removeItem('shabeena_customer'); } }
export async function currentCustomer() { const data = await request('/auth/me'); return data.user as Customer; }

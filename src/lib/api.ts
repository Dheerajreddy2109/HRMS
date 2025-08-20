const API_BASE = 'https://hr.kaphi.in/api'; // your subdomain

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try { msg = await res.text(); } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // auth
  login: (email: string, password: string) =>
    request<{ user: any }>('/auth.php?action=login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload: any) =>
    request<{ success: boolean; id: number }>('/auth.php?action=register', { method: 'POST', body: JSON.stringify(payload) }),

  // employees
  employees: {
    list: () => request<any[]>('/employees.php'),
    create: (payload: any) => request<{ success: boolean; id: number }>('/employees.php', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // leaves
  leaves: {
    list: () => request<any[]>('/leaves.php'),
    create: (payload: any) => request<{ id: number }>('/leaves.php', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: number, payload: any) =>
      request<{ success: boolean }>('/leaves.php', { method: 'PATCH', body: JSON.stringify({ id, ...payload }) }),
  },

  // attendance
  attendance: {
    list: () => request<any[]>('/attendance.php'),
    upsert: (payload: any) => request<{ success: boolean }>('/attendance.php', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // holidays
  holidays: {
    list: () => request<any[]>('/holidays.php'),
    create: (payload: any) => request<{ id: number }>('/holidays.php', { method: 'POST', body: JSON.stringify(payload) }),
    remove: (id: number) => request<{ success: boolean }>(`/holidays.php?id=${id}`, { method: 'DELETE' }),
  },
};
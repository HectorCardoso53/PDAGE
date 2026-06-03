// Em produção (Docker + nginx), usa URL relativa — o nginx faz o proxy de /api para o backend.
// Em dev local (npm run dev), usa http://localhost:3001 definido em .env.local.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, init);
}

const BASE = 'http://localhost:8000'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })
  if (!res.ok) throw await res.json()
  return res.json()
}
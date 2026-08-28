const API = import.meta.env.VITE_API_URL || 'http://localhost:3002'

function authHeader(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getComments(token, bookingId) {
  const res = await fetch(`${API}/api/bookings/${bookingId}/comments`, { headers: authHeader(token) })
  if (!res.ok) throw new Error('Failed to fetch comments')
  return res.json()
}

export async function createComment(token, bookingId, text) {
  const res = await fetch(`${API}/api/bookings/${bookingId}/comments`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ text }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create comment')
  return data
}

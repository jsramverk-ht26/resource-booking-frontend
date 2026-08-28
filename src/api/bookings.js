const API = import.meta.env.VITE_API_URL || 'http://localhost:3002'

function authHeader(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getBookings(token) {
  const res = await fetch(`${API}/api/bookings`, { headers: authHeader(token) })
  if (!res.ok) throw new Error('Failed to fetch bookings')
  return res.json()
}

export async function createBooking(token, resourceId, startsAt, endsAt) {
  const res = await fetch(`${API}/api/bookings`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ resourceId, startsAt, endsAt }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Booking failed')
  return data
}

export async function cancelBooking(token, id) {
  const res = await fetch(`${API}/api/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  })
  if (!res.ok) throw new Error('Failed to cancel booking')
  return res.json()
}

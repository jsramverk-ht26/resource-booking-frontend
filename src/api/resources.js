const API = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export async function getResources() {
  const res = await fetch(`${API}/api/resources`)
  if (!res.ok) throw new Error('Failed to fetch resources')
  return res.json()
}

export async function getResource(id) {
  const res = await fetch(`${API}/api/resources/${id}`)
  if (!res.ok) throw new Error('Failed to fetch resource')
  return res.json()
}

export async function getAvailability(id, date) {
  const res = await fetch(`${API}/api/resources/${id}/availability?date=${date}`)
  if (!res.ok) throw new Error('Failed to fetch availability')
  return res.json()
}

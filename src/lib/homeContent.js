const API_URL = import.meta.env.VITE_API_URL || ''

export async function getHomeContent() {
  const res = await fetch(`${API_URL}/api/home-content`)
  if (!res.ok) throw new Error('Error fetching home content')
  return res.json()
}

export async function updateHomeContent(content) {
  const res = await fetch(`${API_URL}/api/home-content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('Error updating home content')
  return res.json()
}

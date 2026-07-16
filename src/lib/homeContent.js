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

export async function uploadHomeImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${API_URL}/api/home-content/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(err.error || 'Upload failed')
  }
  return res.json()
}

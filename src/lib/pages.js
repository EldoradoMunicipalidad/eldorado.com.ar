// Page Content API — editable content for dynamic pages
import { cmsAuthHeaders } from './cmsAuth'

const API = '/api/pages'

// ─── Get page content ────────────────────────────────────────────────
export async function getPageContent(pageId) {
  try {
    const res = await fetch(`${API}/${pageId}`)
    return await res.json()
  } catch (e) {
    console.warn(`getPageContent(${pageId}) error:`, e.message)
    return { content: null, updated_at: null }
  }
}

// ─── Update page content ─────────────────────────────────────────────
export async function updatePageContent(pageId, content) {
  try {
    const res = await fetch(`${API}/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...cmsAuthHeaders() },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error('Error al guardar')
    return await res.json()
  } catch (e) {
    console.warn(`updatePageContent(${pageId}) error:`, e.message)
    throw e
  }
}

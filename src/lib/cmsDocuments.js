import { cmsAuthHeaders } from './cmsAuth'

const API = '/api/pages/upload-document'

export async function uploadCmsDocument(file) {
  const form = new FormData()
  form.append('document', file)

  const res = await fetch(API, {
    method: 'POST',
    headers: cmsAuthHeaders(),
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

export async function uploadCmsImage(file) {
  const form = new FormData()
  form.append('image', file)

  const res = await fetch('/api/pages/upload-image', {
    method: 'POST',
    headers: cmsAuthHeaders(),
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

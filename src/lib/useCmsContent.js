import { useEffect, useState } from 'react'
import { getPageContent } from './pages'

// Carga una página editable sin bloquear el render inicial: mientras el CMS
// responde se muestran los datos locales de respaldo.
export function useCmsContent(pageId, fallback) {
  const [content, setContent] = useState(fallback)

  useEffect(() => {
    let cancelled = false
    getPageContent(pageId).then((response) => {
      if (!cancelled && response.content) setContent({ ...fallback, ...response.content })
    })
    return () => { cancelled = true }
  }, [pageId, fallback])

  return content
}

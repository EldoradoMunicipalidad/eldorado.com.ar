import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { subirFoto } from '../../../lib/reclamos'

export default function FileUpload({ fotos, onFotosChange, maxFiles = 3 }) {
  const [items, setItems] = useState([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    if (!files) return
    const remaining = maxFiles - items.length
    const toAdd = Array.from(files).slice(0, remaining)

    toAdd.forEach((file) => {
      const item = { file, progress: 0, url: '' }
      setItems((prev) => [...prev, item])
      setUploading(true)

      subirFoto(
        file,
        (progress) => {
          setItems((prev) =>
            prev.map((f) => (f.file === file ? { ...f, progress } : f))
          )
        },
        (url) => {
          setItems((prev) => {
            const updated = prev.map((f) =>
              f.file === file ? { ...f, progress: 100, url } : f
            )
            const urls = updated
              .filter((f) => f.url)
              .map((f) => f.url)
            onFotosChange(urls)
            return updated
          })
          setUploading(false)
        },
        (error) => {
          setItems((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, error: error.message } : f
            )
          )
          setUploading(false)
        }
      )
    })
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    const urls = newItems.filter((f) => f.url).map((f) => f.url)
    onFotosChange(urls)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-slate-200"
          >
            {item.url ? (
              <img
                src={item.url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                {item.error ? (
                  <span className="text-[10px] text-red-500 px-1 text-center">
                    {item.error}
                  </span>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mb-1" />
                    <span className="text-[10px]">{item.progress}%</span>
                  </>
                )}
              </div>
            )}
            <button
              onClick={() => removeItem(i)}
              className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-black/70"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {items.length < maxFiles && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-sky-400 hover:text-sky-500 transition-colors disabled:opacity-50"
          >
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-[10px]">Agregar foto</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-slate-400">
        {items.length}/{maxFiles} fotos · Formatos: JPG, PNG, WebP
      </p>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'

interface ImagePickerProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

export function ImagePicker({ onFilesChange, maxFiles = 3, maxSizeMB = 5 }: ImagePickerProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])

    if (previews.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`)
      return
    }

    const maxBytes = maxSizeMB * 1024 * 1024
    const validFiles: { file: File; url: string }[] = []

    for (const file of files) {
      if (file.size > maxBytes) {
        setError(`"${file.name}" exceeds ${maxSizeMB}MB limit.`)
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(`"${file.name}" is not a valid image. Only JPG, PNG, WEBP allowed.`)
        return
      }
      validFiles.push({ file, url: URL.createObjectURL(file) })
    }

    const updated = [...previews, ...validFiles]
    setPreviews(updated)
    onFilesChange(updated.map(p => p.file))

    // Reset input
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index].url)
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onFilesChange(updated.map(p => p.file))
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-2.5 border border-red-200 bg-red-50 text-red-700 text-xs font-medium rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((p, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square">
              <img src={p.url} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      {previews.length < maxFiles && (
        <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-pcc-300 text-pcc-700 bg-pcc-50 rounded-lg hover:bg-pcc-100 hover:border-pcc-400 transition-colors duration-150 text-sm font-medium cursor-pointer justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <span>Attach Images ({previews.length}/{maxFiles})</span>
          <span className="font-urdu text-xs text-pcc-500">تصاویر منسلک کریں</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleSelect}
            className="hidden"
          />
        </label>
      )}

      <p className="text-xs text-muted-foreground">JPG, PNG or WEBP. Max {maxSizeMB}MB each.</p>
    </div>
  )
}

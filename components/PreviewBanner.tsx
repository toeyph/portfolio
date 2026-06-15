'use client'

import { Eye, Pencil, X } from 'lucide-react'

interface PreviewBannerProps {
  onEdit: () => void
  onDiscard: () => void
}

export default function PreviewBanner({ onEdit, onDiscard }: PreviewBannerProps) {
  return (
    <div className="pf-preview-banner">
      <Eye size={15} />
      <span className="pf-preview-label">Preview mode — changes not saved yet</span>
      <button className="pf-preview-edit" onClick={onEdit}>
        <Pencil size={13} /> Back to editing
      </button>
      <button className="pf-preview-close" onClick={onDiscard} aria-label="Exit preview">
        <X size={15} />
      </button>
    </div>
  )
}

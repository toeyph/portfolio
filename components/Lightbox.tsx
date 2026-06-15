'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface LightboxProps {
  src: string
  onClose: () => void
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="pf-lightbox" onClick={onClose}>
      <button className="pf-lightbox-close" onClick={onClose} aria-label="Close">
        <X size={20} />
      </button>
      <div className="pf-lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="pf-lightbox-img" />
      </div>
    </div>
  )
}

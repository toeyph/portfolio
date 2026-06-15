'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface ImageCropperModalProps {
  src: string
  aspectRatio?: number
  previewLabel?: string
  onConfirm: (croppedDataURL: string) => void
  onCancel: () => void
}

export default function ImageCropperModal({
  src,
  aspectRatio = 16 / 9,
  previewLabel = 'Preview',
  onConfirm,
  onCancel,
}: ImageCropperModalProps) {
  const CONT_W = 460
  const isPortrait = aspectRatio < 1
  // Frame: target crop area, centered with visible margins around it
  const FRAME_W = isPortrait ? Math.round(CONT_W * 0.60) : Math.round(CONT_W * 0.86)
  const FRAME_H = Math.round(FRAME_W / aspectRatio)
  const MARGIN_V = isPortrait ? Math.round(FRAME_H * 0.14) : Math.round(FRAME_H * 0.15)
  const MARGIN_H = Math.round((CONT_W - FRAME_W) / 2)
  const CONT_H = FRAME_H + MARGIN_V * 2
  const FRAME_X = MARGIN_H
  const FRAME_Y = MARGIN_V

  const [imgNat, setImgNat] = useState({ w: 1, h: 1 })
  const [scale, setScale] = useState(1)
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(scale)
  const imgNatRef = useRef(imgNat)
  const imgPosRef = useRef(imgPos)

  useEffect(() => { scaleRef.current = scale }, [scale])
  useEffect(() => { imgNatRef.current = imgNat }, [imgNat])
  useEffect(() => { imgPosRef.current = imgPos }, [imgPos])

  // Clamp so the image always covers the full frame
  const clamp = useCallback((x: number, y: number, sc: number, nat?: { w: number; h: number }) => {
    const n = nat ?? imgNatRef.current
    const iw = n.w * sc
    const ih = n.h * sc
    return {
      x: Math.min(FRAME_X, Math.max(FRAME_X + FRAME_W - iw, x)),
      y: Math.min(FRAME_Y, Math.max(FRAME_Y + FRAME_H - ih, y)),
    }
  }, [FRAME_X, FRAME_Y, FRAME_W, FRAME_H])

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    setImgNat({ w, h })
    imgNatRef.current = { w, h }
    // Scale so the image fills the frame (like object-fit: cover on the frame)
    const sc = Math.max(FRAME_W / w, FRAME_H / h)
    setScale(sc)
    scaleRef.current = sc
    // Center the image on the frame
    const cx = FRAME_X - (w * sc - FRAME_W) / 2
    const cy = FRAME_Y - (h * sc - FRAME_H) / 2
    const pos = clamp(cx, cy, sc, { w, h })
    setImgPos(pos)
    imgPosRef.current = pos
  }

  useEffect(() => {
    const move = (e: PointerEvent | TouchEvent) => {
      if (!dragging.current) return
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
      const dx = cx - lastPos.current.x
      const dy = cy - lastPos.current.y
      lastPos.current = { x: cx, y: cy }
      setImgPos((prev) => clamp(prev.x + dx, prev.y + dy, scaleRef.current))
    }
    const up = () => {
      if (!dragging.current) return
      dragging.current = false
      setIsDragging(false)
    }
    window.addEventListener('pointermove', move as EventListener)
    window.addEventListener('pointerup', up)
    window.addEventListener('touchmove', move as EventListener, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('pointermove', move as EventListener)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('touchmove', move as EventListener)
      window.removeEventListener('touchend', up)
    }
  }, [clamp])

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = true
    setIsDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
    containerRef.current?.setPointerCapture(e.pointerId)
  }

  const handleConfirm = () => {
    const canvas = document.createElement('canvas')
    const OUTPUT = 1200
    canvas.width = OUTPUT
    canvas.height = Math.round(OUTPUT / aspectRatio)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const capturedSrc = src
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      const { x, y } = imgPosRef.current
      const sc = scaleRef.current
      ctx.drawImage(
        img,
        (FRAME_X - x) / sc,
        (FRAME_Y - y) / sc,
        FRAME_W / sc,
        FRAME_H / sc,
        0, 0, canvas.width, canvas.height,
      )
      onConfirm(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.onerror = () => { if (!cancelled) { console.warn('ImageCropperModal: failed to load src'); onCancel() } }
    img.src = capturedSrc
    return () => { cancelled = true }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(8,4,2,.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#1a0f08', border: '1px solid rgba(232,201,160,.15)',
        borderRadius: 14, padding: 28, width: '100%', maxWidth: 520,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#f1e7d8' }}>
              Adjust photo
            </div>
            <div style={{ fontSize: 12, color: '#b3a08d', marginTop: 4, letterSpacing: '.1em' }}>
              {previewLabel}
            </div>
          </div>
          <button onClick={onCancel} style={{
            width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(232,201,160,.18)',
            background: 'transparent', color: '#b3a08d', cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>✕</button>
        </div>

        {/* Cropper area */}
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          style={{
            width: CONT_W, maxWidth: '100%', height: CONT_H,
            position: 'relative', overflow: 'hidden',
            borderRadius: 8, background: '#080402',
            cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
          }}
        >
          {/* Full image — draggable */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            onLoad={onImgLoad}
            draggable={false}
            alt=""
            style={{
              position: 'absolute', left: 0, top: 0,
              width: imgNat.w * scale, height: imgNat.h * scale,
              transform: `translate(${imgPos.x}px, ${imgPos.y}px)`,
              pointerEvents: 'none', objectFit: 'unset',
              willChange: 'transform', userSelect: 'none',
            }}
          />
          {/* Frame border + dark overlay outside via box-shadow */}
          <div style={{
            position: 'absolute',
            left: FRAME_X, top: FRAME_Y,
            width: FRAME_W, height: FRAME_H,
            boxSizing: 'border-box',
            border: '2px solid rgba(216,169,120,.9)',
            boxShadow: '0 0 0 2000px rgba(0,0,0,0.62)',
            pointerEvents: 'none', zIndex: 2,
          }} />
          {/* Rule-of-thirds grid inside frame */}
          <div style={{
            position: 'absolute',
            left: FRAME_X, top: FRAME_Y,
            width: FRAME_W, height: FRAME_H,
            pointerEvents: 'none', zIndex: 3,
            background:
              'linear-gradient(rgba(216,169,120,.09) 1px,transparent 1px) center/33.33% 33.33%,' +
              'linear-gradient(90deg,rgba(216,169,120,.09) 1px,transparent 1px) center/33.33% 33.33%',
          }} />
          {/* Corner marks */}
          {([[-1,-1],[1,-1],[-1,1],[1,1]] as const).map(([hd, vd], i) => (
            <div key={i} style={{
              position: 'absolute',
              left: hd < 0 ? FRAME_X - 1 : FRAME_X + FRAME_W - 14,
              top: vd < 0 ? FRAME_Y - 1 : FRAME_Y + FRAME_H - 14,
              width: 14, height: 14,
              borderTop: vd < 0 ? '3px solid #d8a978' : 'none',
              borderBottom: vd > 0 ? '3px solid #d8a978' : 'none',
              borderLeft: hd < 0 ? '3px solid #d8a978' : 'none',
              borderRight: hd > 0 ? '3px solid #d8a978' : 'none',
              pointerEvents: 'none', zIndex: 4,
            }} />
          ))}
          {/* Drag hint */}
          <div style={{
            position: 'absolute',
            top: FRAME_Y + FRAME_H - 32,
            left: FRAME_X + FRAME_W / 2,
            transform: 'translateX(-50%)',
            background: 'rgba(13,8,5,.75)', borderRadius: 20, padding: '4px 14px',
            fontSize: 11, color: '#d8a978', letterSpacing: '.08em',
            pointerEvents: 'none', zIndex: 5, whiteSpace: 'nowrap',
          }}>
            ↔ Drag to reposition
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#8a6f5a', marginTop: 14, letterSpacing: '.06em' }}>
          Export size: 1200×{Math.round(1200 / aspectRatio)}px · Area inside the frame will be saved
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, fontFamily: 'var(--font-mulish), sans-serif', fontWeight: 700, fontSize: 12,
              letterSpacing: '.1em', textTransform: 'uppercase', padding: '14px 20px',
              borderRadius: 2, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg,#ecd2ab,#d8a978)', color: '#1c1006',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >✓ Use this photo</button>
          <button
            onClick={onCancel}
            style={{
              fontFamily: 'var(--font-mulish), sans-serif', fontWeight: 700, fontSize: 12,
              letterSpacing: '.1em', textTransform: 'uppercase', padding: '14px 20px',
              borderRadius: 2, cursor: 'pointer',
              background: 'transparent', border: '1px solid #d8a978', color: '#d8a978',
            }}
          >Cancel</button>
        </div>
      </div>
    </div>
  )
}

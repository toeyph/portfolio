'use client'
import { useEffect, useRef } from 'react'

export default function FilmGrain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.height = 400
    const draw = () => {
      const img = ctx.createImageData(400, 400)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = d[i+1] = d[i+2] = v
        d[i+3] = 18
      }
      ctx.putImageData(img, 0, 0)
    }
    draw()
    const id = setInterval(draw, 80)
    return () => clearInterval(id)
  }, [])
  return (
    <canvas ref={ref} aria-hidden style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 998, pointerEvents: 'none',
      opacity: 0.055, mixBlendMode: 'overlay', imageRendering: 'pixelated',
    }} />
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -200, y: -200 })
  const ring = useRef({ x: -200, y: -200 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; setVisible(true) }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    let animId: number
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.25
      ring.current.y += (mouse.current.y - ring.current.y) * 0.25
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouse.current.x}px,${mouse.current.y}px)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', onLeave); document.removeEventListener('mouseenter', onEnter); cancelAnimationFrame(animId) }
  }, [])

  return (
    <>
      <div ref={dotRef} className="pf-cur-dot" style={{ opacity: visible ? 1 : 0 }} />
      <div ref={ringRef} className="pf-cur-ring" style={{ opacity: visible ? 1 : 0 }} />
    </>
  )
}

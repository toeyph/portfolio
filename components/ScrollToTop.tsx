'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => {
    const start = window.scrollY
    const duration = 900
    let begin: number | null = null
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (begin === null) begin = ts
      const p = Math.min((ts - begin) / duration, 1)
      window.scrollTo(0, start * (1 - ease(p)))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  if (!visible) return null

  return (
    <button
      className="pf-scroll-top"
      onClick={scrollTop}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  )
}

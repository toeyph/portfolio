'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function CountUp({ value }: { value: string }) {
  const num = parseInt(value)
  const suffix = value.replace(/[0-9]/g, '')
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(isNaN(num) ? value : `0${suffix}`)

  useEffect(() => {
    if (!inView || isNaN(num)) return
    let animId: number
    const dur = 1600
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      setDisplay(Math.round(num * (1 - Math.pow(1 - p, 3))) + suffix)
      if (p < 1) animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [inView, num, suffix])

  return <span ref={ref}>{display}</span>
}

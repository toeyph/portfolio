'use client'

import { Lock, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NavProps {
  name: string
  onAdminOpen: () => void
}

const NAV_SECTIONS = ['about', 'work', 'experience', 'lifestyle', 'contact']

export default function Nav({ name, onAdminOpen }: NavProps) {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Close mobile menu on scroll
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    const target = el.getBoundingClientRect().top + window.scrollY - 64
    const start = window.scrollY
    const diff = target - start
    const duration = 1400
    let begin: number | null = null
    const ease = (t: number) => 1 - Math.pow(1 - t, 4)
    const step = (ts: number) => {
      if (begin === null) begin = ts
      const p = Math.min((ts - begin) / duration, 1)
      window.scrollTo(0, start + diff * ease(p))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <>
      <nav className="pf-nav">
        <div className="pf-nav-in">
          <div className="pf-logo">
            <span className="dot" />
            {(name || 'Your').split(' ')[0]}
            <span style={{ color: 'var(--gold)' }}>.dev</span>
          </div>
          <div className="pf-navlinks">
            {NAV_SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={scrollTo(id)}
                className={active === id ? 'active' : ''}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <button className="pf-iconbtn" title="Admin" onClick={onAdminOpen}>
              <Lock size={16} />
            </button>
          </div>
          {/* Mobile: hamburger + admin */}
          <div className="pf-nav-mobile-bar">
            <button className="pf-iconbtn" title="Admin" onClick={onAdminOpen}>
              <Lock size={16} />
            </button>
            <button
              className="pf-nav-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="pf-nav-drawer" role="dialog" aria-label="Navigation">
          {NAV_SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={scrollTo(id)}
              className={active === id ? 'active' : ''}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      )}
    </>
  )
}

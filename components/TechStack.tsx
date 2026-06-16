'use client'

import { useRef, useEffect, useState } from 'react'
import FadeUp from './FadeUp'
import SkillIcon from './SkillIcon'
import { groupSkills } from '@/lib/utils'
import type { Skill } from '@/lib/types'

interface TechStackProps {
  skills: (string | Skill)[]
}

const HOLES = Array.from({ length: 32 })

function FilmStrip({ name, color, items }: { name: string; color: string; items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const check = () => setShowHint(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', check); ro.disconnect() }
  }, [])

  return (
    <FadeUp>
      <div className="pf-fstrip-combo">
        {/* Film canister at left end */}
        <div className="pf-film-can-v">
          <div className="pf-film-can-v-cap" />
          <div className="pf-film-can-v-label">
            <div className="pf-film-can-v-stripe" />
            <span className="pf-film-can-v-brand">Color Film</span>
            <span className="pf-film-can-v-iso">400</span>
            <span className="pf-film-can-v-detail">35mm · 24</span>
          </div>
          <div className="pf-film-can-v-cap" />
          <div className="pf-film-can-v-slot" />
          <div className="pf-film-can-v-gloss" />
        </div>

        {/* Horizontal film strip */}
        <div className="pf-fstrip">
          <div className="pf-fstrip-perf">
            <div className="pf-fstrip-perf-holes">
              {HOLES.map((_, i) => <span key={i} />)}
            </div>
          </div>
          <div className="pf-fstrip-track" ref={trackRef}>
            <div className="pf-fstrip-slate">
              <span className="pf-fstrip-slate-dot" style={{ background: color }} />
              <span className="pf-fstrip-slate-name">{name}</span>
              <span className="pf-fstrip-slate-count">{items.length}</span>
            </div>
            {items.map((item, i) => (
              <div className="pf-fstrip-frame" key={item}>
                <span className="pf-fstrip-idx">{String(i + 1).padStart(2, '0')}</span>
                <div className="pf-fstrip-icon">
                  <SkillIcon name={item} size={36} />
                </div>
                <span className="pf-fstrip-name">{item}</span>
              </div>
            ))}
          </div>
          <div className="pf-fstrip-perf">
            <div className="pf-fstrip-perf-holes">
              {HOLES.map((_, i) => <span key={i} />)}
            </div>
          </div>
          {showHint && <div className="pf-fstrip-scroll-hint" aria-hidden />}
        </div>
      </div>
    </FadeUp>
  )
}

export default function TechStack({ skills }: TechStackProps) {
  const groups = groupSkills(skills)
  return (
    <section className="pf-section pf-sec-light" id="tech">
      <FadeUp>
        <div className="pf-kicker">Tech stack</div>
        <h2 className="pf-h2 pf-display">
          Tools of the <em>trade</em>.
        </h2>
      </FadeUp>
      <div className="pf-fstrip-list">
        {groups.map((g) => (
          <FilmStrip key={g.name} name={g.name} color={g.color} items={g.items} />
        ))}
      </div>
    </section>
  )
}

'use client'

import FadeUp from './FadeUp'
import SkillIcon from './SkillIcon'
import { groupSkills } from '@/lib/utils'
import type { Skill } from '@/lib/types'

interface TechStackProps {
  skills: (string | Skill)[]
}

const HOLES = Array.from({ length: 28 })

function FilmStrip({ name, color, items }: { name: string; color: string; items: string[] }) {
  return (
    <FadeUp>
      <div className="pf-fstrip">
        {/* Top sprocket row */}
        <div className="pf-fstrip-perf">
          <div className="pf-fstrip-perf-holes">
            {HOLES.map((_, i) => <span key={i} />)}
          </div>
        </div>

        {/* Main content row */}
        <div className="pf-fstrip-track">
          {/* Category slate — first frame */}
          <div className="pf-fstrip-slate">
            <span className="pf-fstrip-slate-dot" style={{ background: color }} />
            <span className="pf-fstrip-slate-name">{name}</span>
            <span className="pf-fstrip-slate-count">{items.length}</span>
          </div>

          {/* Skill frames */}
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

        {/* Bottom sprocket row */}
        <div className="pf-fstrip-perf">
          <div className="pf-fstrip-perf-holes">
            {HOLES.map((_, i) => <span key={i} />)}
          </div>
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

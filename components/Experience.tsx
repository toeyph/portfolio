'use client'

import FadeUp from './FadeUp'
import type { Experience as ExperienceType } from '@/lib/types'

interface ExperienceProps {
  experience: ExperienceType[]
}

export default function Experience({ experience }: ExperienceProps) {
  if (experience.length === 0) return null

  return (
    <section className="pf-section pf-sec-dark" id="experience">
      <FadeUp>
        <div className="pf-kicker">Experience</div>
        <h2 className="pf-h2 pf-display">
          Where I&apos;ve <em>worked</em>.
        </h2>
      </FadeUp>

      <div className="pf-exp-list">
        {experience.map((x, i) => (
          <FadeUp key={x.id} delay={i * 0.08}>
            <div className="pf-exp-card">
              <span className="pf-exp-num">{String(i + 1).padStart(2, '0')}</span>

              <div className="pf-exp-body">
                <h4 className="pf-display pf-exp-role">{x.role}</h4>
                <div className="pf-exp-co">{x.company}</div>
                {x.description && <p className="pf-exp-desc">{x.description}</p>}
              </div>

              <div className="pf-exp-period">{x.period}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

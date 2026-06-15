'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ZoomIn } from 'lucide-react'
import FadeUp from './FadeUp'
import SkillIcon from './SkillIcon'
import type { Project } from '@/lib/types'

interface ProjectsProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
  onImageClick?: (url: string) => void
}

export default function Projects({ projects, onProjectClick, onImageClick }: ProjectsProps) {
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section className="pf-section pf-sec-light" id="work">
      <FadeUp>
        <div className="pf-kicker">Work</div>
        <h2 className="pf-h2 pf-display">
          Things I&apos;ve <em>built</em>.
        </h2>
      </FadeUp>

      <FadeUp delay={0.08} className="pf-filters">
        {categories.map((c) => (
          <button
            key={c}
            className={'pf-filter' + (filter === c ? ' on' : '')}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </FadeUp>

      <div className="pf-film-hint"><span>drag to explore</span> →</div>

      <div className="pf-film-strip-wrap">
        <div className="pf-projects">
          {visible.map((p, i) => (
            <motion.article
              key={p.id}
              className="pf-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              onClick={() => onProjectClick(p)}
            >
              <div
                className="pf-cover"
                style={{ background: `linear-gradient(135deg, ${p.accent[0]}, ${p.accent[1]})` }}
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.title} />
                ) : (
                  <span className="initial">{p.title.charAt(0)}</span>
                )}
                <span className="cat pf-mono">{p.category}</span>
                <span className="pf-frame-num">{String(i + 1).padStart(2, '0')}</span>
                {p.image && (
                  <button
                    className="pf-cover-zoom"
                    onClick={(e) => { e.stopPropagation(); onImageClick?.(p.image) }}
                    aria-label="View full image"
                  >
                    <ZoomIn size={15} />
                  </button>
                )}
              </div>
              <div className="pf-cbody">
                <h3 className="pf-display">
                  {p.title}
                  <ArrowUpRight size={18} style={{ color: p.accent[1], flex: 'none' }} />
                </h3>
                <p>{p.description}</p>
                <div className="pf-tags">
                  {p.tags.map((t) => (
                    <span className="pf-tag" key={t}>
                      <SkillIcon name={t} size={16} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="pf-film-fade-r" aria-hidden />
      </div>

      {visible.length === 0 && (
        <p className="pf-lead">No projects in this category yet.</p>
      )}
    </section>
  )
}

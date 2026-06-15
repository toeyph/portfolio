'use client'

import { X, ExternalLink } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import SkillIcon from './SkillIcon'
import type { Project } from '@/lib/types'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
  onImageClick?: (url: string) => void
}

export default function ProjectDetailModal({ project: p, onClose, onImageClick }: ProjectDetailModalProps) {
  return (
    <div className="pf-overlay" onClick={onClose}>
      <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-modal-head">
          <h3 className="pf-display">{p.title}</h3>
          <button className="pf-iconbtn" onClick={onClose}><X size={18} /></button>
        </div>

        <div
          className={`pf-detail-cover${p.image ? ' pf-detail-cover-zoom' : ''}`}
          style={{ background: `linear-gradient(135deg, ${p.accent[0]}, ${p.accent[1]})` }}
          onClick={() => p.image && onImageClick?.(p.image)}
        >
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={p.title} />
          ) : (
            <span
              className="pf-display"
              style={{ fontSize: 60, color: 'rgba(255,255,255,.9)' }}
            >
              {p.title.charAt(0)}
            </span>
          )}
        </div>

        <span className="pf-tag pf-mono">{p.category}</span>
        <p style={{ color: 'var(--muted)', marginTop: 14, lineHeight: 1.6 }}>{p.description}</p>

        <div className="pf-tags" style={{ marginTop: 16 }}>
          {p.tags.map((t) => (
            <span className="pf-tag" key={t}>
              <SkillIcon name={t} size={18} /> {t}
            </span>
          ))}
        </div>

        <div className="pf-cta" style={{ justifyContent: 'flex-start', marginTop: 24 }}>
          {p.demoUrl.trim() && p.demoUrl.trim() !== '#' && (
            <a className="pf-btn primary" href={p.demoUrl.trim()} target="_blank" rel="noreferrer">
              Live demo <ExternalLink size={16} />
            </a>
          )}
          {p.repoUrl.trim() && p.repoUrl.trim() !== '#' && (
            <a className="pf-btn ghost" href={p.repoUrl.trim()} target="_blank" rel="noreferrer">
              <GithubIcon size={16} /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

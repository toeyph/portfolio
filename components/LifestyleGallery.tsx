'use client'

import type { LifestylePhoto } from '@/lib/types'

interface Props {
  photos: LifestylePhoto[]
}

const TILTS = [-3.2, 2.4, -1.8, 3.6, -2.6, 1.4, -3.8, 2.2, -1.2, 3.0]

export default function LifestyleGallery({ photos }: Props) {
  if (photos.length === 0) return null

  return (
    <section id="lifestyle" className="ls-section">
      <div className="ls-glow" aria-hidden />

      <div className="pf-wrap">
        <div className="ls-header">
          <p className="pf-eyebrow">| Life &amp; Style |</p>
          <h2 className="pf-display ls-title">Beyond the Code</h2>
          <p className="ls-subtitle">A glimpse into the world outside the terminal.</p>
        </div>
      </div>

      <div className="ls-wall">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="ls-pol"
            style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}
          >
            <div className="ls-pol-photo">
              {photo.url
                ? <img src={photo.url} alt={photo.caption || ''} draggable={false} />
                : <div className="ls-pol-empty">✦</div>
              }
            </div>
            {photo.caption && <p className="ls-pol-cap">{photo.caption}</p>}
          </div>
        ))}
      </div>

      <div className="pf-wrap">
        <div className="ls-rule" aria-hidden>
          <span /><span className="ls-rule-dot">✦</span><span />
        </div>
      </div>
    </section>
  )
}

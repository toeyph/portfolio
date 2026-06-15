'use client'

import FadeUp from './FadeUp'
import type { Profile, Highlight } from '@/lib/types'

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6L12 3z" />
      <circle cx="19" cy="18" r="1.2" />
    </svg>
  )
}

interface AboutProps {
  profile: Profile
  highlights: Highlight[]
}

export default function About({ profile, highlights }: AboutProps) {
  return (
    <section className="pf-section pf-about-sec" id="about">
      <FadeUp className="pf-about-header">
        <div className="pf-eyebrow">| About Me |</div>
      </FadeUp>
      <FadeUp delay={0.1} className="pf-about-grid">
        <div className="pf-about-img">
          {(profile.avatarAbout || profile.avatar) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarAbout || profile.avatar} alt={profile.name} />
          ) : (
            <div className="pf-about-empty">
              <span>{(profile.name || 'A').charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="pf-about-text">
          <p className="pf-about-lead">{profile.about}</p>
          {profile.aboutMore && (
            <p className="pf-about-body">{profile.aboutMore}</p>
          )}
          {highlights.length > 0 && (
            <>
              <div className="pf-about-divider" />
              <ul className="pf-highlights">
                {highlights.map((h, i) => (
                  <li key={h.id || i}>
                    <span className="dot"><Sparkle /></span>
                    <span>{h.text}{i < highlights.length - 1 ? ';' : '.'}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </FadeUp>
    </section>
  )
}

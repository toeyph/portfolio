'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, ArrowUpRight, Code2, Download } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import CountUp from './CountUp'
import type { Profile, Contact } from '@/lib/types'

interface HeroProps {
  profile: Profile
  contact: Contact
  projectCount: number
}

export default function Hero({ profile, contact, projectCount }: HeroProps) {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }


  // Split-text animation helpers
  const headline = profile.headline || profile.roles?.[0] || 'Developer'
  const words = headline.split(' ').filter(Boolean)
  const maxCharsPerWord = words.reduce((m, w) => Math.max(m, w.length), 1)

  return (
    <header className="pf-hero pf-hero-full">
      {/* Letterbox decorative bars */}
      <div className="pf-lb-top" aria-hidden />
      <div className="pf-lb-bottom" aria-hidden />

      {/* Full-bleed background photo */}
      {profile.avatar && (
        <img src={profile.avatar} alt="" className="pf-hero-photo" aria-hidden />
      )}
      <div className="pf-hero-overlay" aria-hidden />

      {/* Stats — absolute top-right */}
      <div className="pf-hero-stats">
        <div className="pf-stat-ico"><Code2 size={20} /></div>
        <div>
          <span className="pf-stat-num"><CountUp value={profile.years} /></span>
          <span className="pf-stat-lbl">years of work</span>
        </div>
        <div>
          <span className="pf-stat-num"><CountUp value={String(profile.nominations || projectCount)} /></span>
          <span className="pf-stat-lbl">{profile.nominations ? 'recognitions' : 'projects built'}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="pf-hero-inner">
        <div className="pf-hero-left">
          <div className="pf-hero-main">
            <div className="pf-eyebrow">| {profile.name} |</div>
            {profile.openToWork && (
              <div className="pf-otw">
                <span className="pf-otw-dot" />
                Open to work
              </div>
            )}

            {/* Split-text animated headline */}
            <motion.h1
              key={headline}
              className="pf-name pf-display"
              aria-label={headline}
            >
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.15 + (wordIndex * maxCharsPerWord + charIndex) * 0.028,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <p className="pf-tagline">{profile.tagline}</p>
            <div className="pf-cta">
              <a className="pf-btn primary" href="#work" onClick={scrollTo('work')}>
                <ArrowUpRight size={15} /> Project Gallery
              </a>
              <a className="pf-btn ghost" href="#contact" onClick={scrollTo('contact')}>
                Contact Me
              </a>
              {profile.resumeUrl && (
                <a className="pf-btn ghost" href={profile.resumeUrl} download target="_blank" rel="noreferrer">
                  <Download size={15} /> Download CV
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Full-width footer bar */}
        <div className="pf-hero-foot">
          <div className="pf-cinfo">
            <span className="ic"><Mail size={18} /></span>
            <div>
              <div className="lbl">Contact Information</div>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
          <div className="pf-cinfo">
            <span className="ic"><MapPin size={18} /></span>
            <div>
              <div className="lbl">Based In</div>
              <span className="val">{profile.location}</span>
            </div>
          </div>
          <div className="pf-hero-social">
            {contact.github && (
              <a className="pf-iconbtn" href={contact.github} title="GitHub" target="_blank" rel="noreferrer">
                <GithubIcon size={18} />
              </a>
            )}
            {contact.linkedin && (
              <a className="pf-iconbtn" href={contact.linkedin} title="LinkedIn" target="_blank" rel="noreferrer">
                <LinkedinIcon size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

    </header>
  )
}

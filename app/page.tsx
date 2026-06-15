'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import TechStack from '@/components/TechStack'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ProjectDetailModal from '@/components/ProjectDetailModal'
import AdminPanel from '@/components/AdminPanel'
import LifestyleGallery from '@/components/LifestyleGallery'
import ScrollToTop from '@/components/ScrollToTop'
import Lightbox from '@/components/Lightbox'
import PreviewBanner from '@/components/PreviewBanner'
import FilmGrain from '@/components/FilmGrain'
import CustomCursor from '@/components/CustomCursor'
import { loadContent, persistContent, uploadImage, trackPageView } from '@/lib/supabase'
import { DEFAULT_CONTENT } from '@/lib/content'
import type { PortfolioContent, Project } from '@/lib/types'

export default function PortfolioPage() {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Project | null>(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [previewDraft, setPreviewDraft] = useState<PortfolioContent | null>(null)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    trackPageView()
    loadContent().then((saved) => {
      if (alive && saved) {
        setContent((prev) => ({
          profile: { ...prev.profile, ...saved.profile },
          contact: { ...prev.contact, ...saved.contact },
          highlights: saved.highlights ?? prev.highlights,
          skills: saved.skills ?? prev.skills,
          experience: saved.experience ?? prev.experience,
          projects: saved.projects ?? prev.projects,
          lifestylePhotos: saved.lifestylePhotos ?? prev.lifestylePhotos ?? [],
        }))
        if (saved.profile?.name) {
          document.title = `${saved.profile.name} — ${saved.profile.headline || saved.profile.roles?.[0] || 'Portfolio'}`
        }
      }
      if (alive) setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const display = previewDraft ?? content
  const { profile, contact, skills, experience, projects, highlights = [], lifestylePhotos = [] } = display

  async function saveAll(next: PortfolioContent) {
    const previous = content
    setContent(next)
    setPreviewDraft(null)
    const upload = async (val: string | undefined, path: string) => {
      if (val && val.startsWith('data:')) return await uploadImage(val, path)
      return val ?? ''
    }
    const updated: PortfolioContent = {
      ...next,
      profile: {
        ...next.profile,
        avatar: await upload(next.profile.avatar, 'hero'),
        avatarAbout: await upload(next.profile.avatarAbout, 'about'),
      },
      projects: await Promise.all(
        (next.projects || []).map(async (p) => ({
          ...p,
          image: await upload(p.image, `project-${p.id}`),
        })),
      ),
      lifestylePhotos: await Promise.all(
        (next.lifestylePhotos || []).map(async (photo) => ({
          ...photo,
          url: await upload(photo.url, `lifestyle-${photo.id}`),
        })),
      ),
    }
    setContent(updated)
    try {
      await persistContent(updated)
    } catch (err) {
      setContent(previous)
      throw err
    }
  }

  if (loading) {
    return (
      <div className="pf-root" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--gold)', fontFamily: 'var(--font-playfair), serif', fontSize: 22 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>✦</div>
          Loading…
        </div>
      </div>
    )
  }

  return (
    <div className="pf-root">
      <div className="pf-bg" aria-hidden>
        <div className="pf-glow g1" />
        <div className="pf-glow g2" />
      </div>

      <Nav name={profile.name} onAdminOpen={() => setAdminOpen(true)} />

      <Hero
        profile={profile}
        contact={contact}
        projectCount={projects.length}
      />

      <div className="pf-wrap">
        <About profile={profile} highlights={highlights} />
        <TechStack skills={skills} />
        <Experience experience={experience} />
        <Projects projects={projects} onProjectClick={setDetail} onImageClick={setLightboxUrl} />
        <Contact contact={contact} />
      </div>
      <LifestyleGallery photos={lifestylePhotos} />

      <Footer name={profile.name} />

      {lightboxUrl && (
        <Lightbox src={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}

      {detail && (
        <ProjectDetailModal
          project={detail}
          onClose={() => setDetail(null)}
          onImageClick={setLightboxUrl}
        />
      )}

      <ScrollToTop />
      <FilmGrain />
      <CustomCursor />

      {previewDraft && (
        <PreviewBanner
          onEdit={() => setAdminOpen(true)}
          onDiscard={() => setPreviewDraft(null)}
        />
      )}

      {adminOpen && (
        <AdminPanel
          content={previewDraft ?? content}
          onClose={() => { setAdminOpen(false); setPreviewDraft(null) }}
          onSave={saveAll}
          onPreview={(draft) => { setPreviewDraft(draft); setAdminOpen(false) }}
        />
      )}
    </div>
  )
}

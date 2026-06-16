'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X, Plus, Pencil, Trash2, Check, Lock, Unlock, Briefcase, Upload,
  Download, Loader2, MessageSquare, Eye, BarChart2,
} from 'lucide-react'
import SkillIcon from './SkillIcon'
import ImageCropperModal from './ImageCropperModal'
import { supabase, loadMessages, loadAnalytics } from '@/lib/supabase'
import { ACCENTS } from '@/lib/content'
import type { PortfolioContent, Experience, Project, LifestylePhoto } from '@/lib/types'

const TABS = ['Hero', 'About', 'Skills', 'Experience', 'Work', 'Lifestyle', 'Contact', 'Messages', 'Analytics']

function emptyProject(): Omit<Project, 'id' | 'tags'> & { id: string; tags: string } {
  return { id: '', title: '', description: '', tags: '', category: 'Web App', demoUrl: '', repoUrl: '', image: '', accent: ACCENTS[0] }
}
function emptyExp(): Experience {
  return { id: '', role: '', company: '', period: '', description: '' }
}

interface AdminPanelProps {
  content: PortfolioContent
  onClose: () => void
  onSave: (next: PortfolioContent) => Promise<void>
  onPreview: (draft: PortfolioContent) => void
}

type ProjForm = Omit<Project, 'tags'> & { tags: string }

export default function AdminPanel({ content, onClose, onSave, onPreview }: AdminPanelProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('Hero')
  const [draft, setDraft] = useState<PortfolioContent>(content)
  const [savedFlash, setSavedFlash] = useState(false)

  const [skillInput, setSkillInput] = useState('')
  const [skillCategory, setSkillCategory] = useState('Frontend')
  const [expForm, setExpForm] = useState<Experience>(emptyExp())
  const [editingExp, setEditingExp] = useState(false)
  const [projForm, setProjForm] = useState<ProjForm>(emptyProject() as ProjForm)
  const [editingProj, setEditingProj] = useState(false)
  const [imgErr, setImgErr] = useState('')
  const dragExpIdx = useRef<number | null>(null)
  const [dragOverExpIdx, setDragOverExpIdx] = useState<number | null>(null)
  const dragProjIdx = useRef<number | null>(null)
  const [dragOverProjIdx, setDragOverProjIdx] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [messages, setMessages] = useState<{ id: string; name: string; email: string; message: string; created_at: string }[]>([])
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [msgsErr, setMsgsErr] = useState('')
  const [analytics, setAnalytics] = useState<{ total: number; thisWeek: number } | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)
  const aboutAvatarRef = useRef<HTMLInputElement>(null)
  const lifestyleFileRef = useRef<HTMLInputElement>(null)
  const [lifestyleCaptionDraft, setLifestyleCaptionDraft] = useState('')

  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropperSrc, setCropperSrc] = useState('')
  const [cropperAspect, setCropperAspect] = useState(16 / 9)
  const [cropperLabel, setCropperLabel] = useState('')
  const [cropperTarget, setCropperTarget] = useState<'hero' | 'about' | 'project' | 'lifestyle'>('hero')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUnlocked(true)
    })
  }, [])

  // Revoke object URL on unmount if cropper is still open
  useEffect(() => {
    return () => {
      if (cropperSrc) URL.revokeObjectURL(cropperSrc)
    }
  }, [cropperSrc])

  useEffect(() => {
    if (tab !== 'Messages' || !unlocked) return
    setMsgsLoading(true)
    setMsgsErr('')
    loadMessages()
      .then((data) => { setMessages(data as typeof messages); setMsgsLoading(false) })
      .catch((e: Error) => { setMsgsErr(e.message); setMsgsLoading(false) })
  }, [tab, unlocked])

  useEffect(() => {
    if (tab !== 'Analytics' || !unlocked) return
    setAnalyticsLoading(true)
    loadAnalytics()
      .then((data) => { setAnalytics(data); setAnalyticsLoading(false) })
      .catch(() => setAnalyticsLoading(false))
  }, [tab, unlocked])

  const setProfile = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => ({ ...d, profile: { ...d.profile, [k]: e.target.value } }))

  const setContactF = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, [k]: e.target.value } }))

  const commit = async () => {
    // Auto-flush any unsaved Work / Experience form data before persisting
    let nextDraft = draft

    if (tab === 'Work' && projForm.title.trim()) {
      const tagsArr = projForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const rec: Project = { ...projForm, tags: tagsArr, id: projForm.id || 'p' + Date.now() }
      nextDraft = {
        ...nextDraft,
        projects: editingProj
          ? nextDraft.projects.map((p) => (p.id === rec.id ? rec : p))
          : [rec, ...nextDraft.projects],
      }
      setProjForm(emptyProject() as ProjForm)
      setEditingProj(false)
      setDraft(nextDraft)
    }

    if (tab === 'Experience' && expForm.role.trim()) {
      const rec: Experience = { ...expForm, id: expForm.id || 'e' + Date.now() }
      nextDraft = {
        ...nextDraft,
        experience: editingExp
          ? nextDraft.experience.map((x) => (x.id === rec.id ? rec : x))
          : [...nextDraft.experience, rec],
      }
      setExpForm(emptyExp())
      setEditingExp(false)
      setDraft(nextDraft)
    }

    setIsSaving(true)
    try {
      await onSave(nextDraft)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 1800)
    } catch (e) {
      setErr('Save failed: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = () => {
    const v = skillInput.trim()
    if (!v) return
    setDraft((d) => ({ ...d, skills: [...d.skills, { name: v, category: skillCategory }] }))
    setSkillInput('')
  }
  const rmSkill = (i: number) =>
    setDraft((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }))
  const skillName = (s: string | { name: string; category: string }) =>
    typeof s === 'string' ? s : s.name
  const skillCat = (s: string | { name: string; category: string }) =>
    typeof s === 'string' ? 'Other' : s.category

  const submitExp = () => {
    if (!expForm.role.trim()) return
    const rec: Experience = { ...expForm, id: expForm.id || 'e' + Date.now() }
    setDraft((d) => ({
      ...d,
      experience: editingExp
        ? d.experience.map((x) => (x.id === rec.id ? rec : x))
        : [...d.experience, rec],
    }))
    setExpForm(emptyExp())
    setEditingExp(false)
  }
  const editExp = (x: Experience) => { setExpForm(x); setEditingExp(true) }
  const rmExp = (id: string) =>
    setDraft((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== id) }))
  const dropExp = (toIdx: number) => {
    const fromIdx = dragExpIdx.current
    if (fromIdx === null || fromIdx === toIdx) return
    setDraft((d) => {
      const arr = [...d.experience]
      const [moved] = arr.splice(fromIdx, 1)
      arr.splice(toIdx, 0, moved)
      return { ...d, experience: arr }
    })
    dragExpIdx.current = null
    setDragOverExpIdx(null)
  }

  const dropProj = (toIdx: number) => {
    const fromIdx = dragProjIdx.current
    if (fromIdx === null || fromIdx === toIdx) return
    setDraft((d) => {
      const arr = [...d.projects]
      const [moved] = arr.splice(fromIdx, 1)
      arr.splice(toIdx, 0, moved)
      return { ...d, projects: arr }
    })
    dragProjIdx.current = null
    setDragOverProjIdx(null)
  }

  const setProj = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProjForm((f) => ({ ...f, [k]: e.target.value }))

  const submitProj = () => {
    if (!projForm.title.trim()) return
    const tagsArr = projForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
    const rec: Project = { ...projForm, tags: tagsArr, id: projForm.id || 'p' + Date.now() }
    setDraft((d) => ({
      ...d,
      projects: editingProj
        ? d.projects.map((p) => (p.id === rec.id ? rec : p))
        : [rec, ...d.projects],
    }))
    setProjForm(emptyProject() as ProjForm)
    setEditingProj(false)
  }
  const editProj = (p: Project) => {
    setProjForm({ ...p, tags: p.tags.join(', ') })
    setEditingProj(true)
  }
  const rmProj = (id: string) =>
    setDraft((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }))


  const openCropper = (file: File, aspect: number, label: string, target: 'hero' | 'about' | 'project' | 'lifestyle') => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setCropperSrc(url)
    setCropperAspect(aspect)
    setCropperLabel(label)
    setCropperTarget(target)
    setCropperOpen(true)
  }

  const onCropperConfirm = (croppedUrl: string) => {
    if (cropperTarget === 'hero') {
      setDraft((d) => ({ ...d, profile: { ...d.profile, avatar: croppedUrl } }))
    } else if (cropperTarget === 'about') {
      setDraft((d) => ({ ...d, profile: { ...d.profile, avatarAbout: croppedUrl } }))
    } else if (cropperTarget === 'lifestyle') {
      const newPhoto: LifestylePhoto = {
        id: 'ls' + Date.now(),
        url: croppedUrl,
        caption: lifestyleCaptionDraft.trim() || undefined,
      }
      setDraft((d) => ({
        ...d,
        lifestylePhotos: [...(d.lifestylePhotos ?? []), newPhoto],
      }))
      setLifestyleCaptionDraft('')
    } else {
      setProjForm((f) => ({ ...f, image: croppedUrl }))
    }
    URL.revokeObjectURL(cropperSrc)
    setCropperOpen(false)
    setCropperSrc('')
  }

  const onCropperCancel = () => {
    URL.revokeObjectURL(cropperSrc)
    setCropperOpen(false)
    setCropperSrc('')
  }

  const handleLogin = async () => {
    setLoginLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoginLoading(false)
    if (error) setErr(error.message)
    else setUnlocked(true)
  }

  const sortedJSON = (v: unknown): string => JSON.stringify(v, Object.keys(v as object ?? {}).sort())
  const isDirty = sortedJSON(draft) !== sortedJSON(content)
  const handleClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Discard them?')) return
    onClose()
  }

  const isUploaded = projForm.image.startsWith('data:')

  return (
    <>
      {cropperOpen && (
        <ImageCropperModal
          src={cropperSrc}
          aspectRatio={cropperAspect}
          previewLabel={cropperLabel}
          onConfirm={onCropperConfirm}
          onCancel={onCropperCancel}
        />
      )}

      <div className="pf-overlay" onClick={handleClose}>
        <div className="pf-modal wide" onClick={(e) => e.stopPropagation()}>
          <div className="pf-modal-head">
            <h3 className="pf-display">{unlocked ? 'Manage your site' : 'Admin access'}</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {unlocked && (
                <button
                  className="pf-btn ghost"
                  style={{ padding: '7px 14px', fontSize: 11, letterSpacing: '.1em' }}
                  onClick={() => onPreview(draft)}
                >
                  <Eye size={13} /> Preview
                </button>
              )}
              {unlocked && (
                <button
                  className="pf-iconbtn" title="Logout"
                  onClick={async () => { await supabase.auth.signOut(); setUnlocked(false); setEmail(''); setPassword('') }}
                >
                  <Lock size={16} />
                </button>
              )}
              <button className="pf-iconbtn" onClick={handleClose}><X size={18} /></button>
            </div>
          </div>

          {!unlocked ? (
            <div>
              <div className="pf-field">
                <label>Email</label>
                <input
                  className="pf-input" type="email" value={email} autoFocus
                  placeholder="admin@email.com"
                  onChange={(e) => { setEmail(e.target.value); setErr('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('pf-pw-input')?.focus() }}
                />
              </div>
              <div className="pf-field">
                <label>Password</label>
                <input
                  id="pf-pw-input"
                  className="pf-input" type="password" value={password}
                  placeholder="••••••••"
                  onChange={(e) => { setPassword(e.target.value); setErr('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
                />
                {err && <p className="pf-hint" style={{ color: 'var(--rust)' }}>{err}</p>}
              </div>
              <button className="pf-btn primary" disabled={loginLoading} onClick={handleLogin}>
                <Unlock size={16} /> {loginLoading ? 'Logging in…' : 'Login'}
              </button>
            </div>
          ) : (
            <div>
              <div className="pf-tabs">
                {TABS.map((t) => (
                  <button key={t} className={'pf-tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
                ))}
              </div>

              {/* HERO TAB */}
              {tab === 'Hero' && (
                <div>
                  <div className="pf-field">
                    <label>Background photo</label>
                    <div style={{
                      width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden',
                      border: '1px solid rgba(232,201,160,.15)', background: '#0d0805',
                      backgroundImage: draft.profile.avatar ? `url(${draft.profile.avatar})` : 'none',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      display: 'grid', placeItems: 'center', marginBottom: 12, position: 'relative',
                    }}>
                      {!draft.profile.avatar && <span style={{ color: '#8a6f5a', fontSize: 13 }}>No photo yet</span>}
                      <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 10, color: '#d8a978', letterSpacing: '.14em', textTransform: 'uppercase', opacity: .8 }}>Preview</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button className="pf-btn ghost" onClick={() => avatarRef.current?.click()}>
                        <Upload size={15} /> Upload & crop
                      </button>
                      {draft.profile.avatar && (
                        <button className="pf-btn ghost" onClick={() => setDraft((d) => ({ ...d, profile: { ...d.profile, avatar: '' } }))}>
                          <Trash2 size={15} /> Remove
                        </button>
                      )}
                      <input ref={avatarRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) openCropper(f, 16/9, 'Hero — full screen background (16:9)', 'hero') }} style={{ display: 'none' }} />
                    </div>
                    <p className="pf-hint">Crop to 16:9 — shown full-screen behind the text overlay</p>
                  </div>

                  <div className="pf-field"><label>Name</label><input className="pf-input" value={draft.profile.name} onChange={setProfile('name')} placeholder="Your name" /></div>
                  <div className="pf-field"><label>Headline</label><input className="pf-input" value={draft.profile.headline || ''} onChange={setProfile('headline')} placeholder="Full-Stack Developer & UI Engineer" /></div>
                  <div className="pf-field">
                    <label>Roles (comma separated)</label>
                    <input
                      className="pf-input"
                      value={draft.profile.roles.join(', ')}
                      onChange={(e) => setDraft((d) => ({ ...d, profile: { ...d.profile, roles: e.target.value.split(',').map((r) => r.trim()) } }))}
                      placeholder="Full-Stack Developer, UI Engineer"
                    />
                  </div>
                  <div className="pf-field"><label>Tagline</label><input className="pf-input" value={draft.profile.tagline} onChange={setProfile('tagline')} /></div>
                  <div className="pf-row">
                    <div className="pf-field"><label>Location</label><input className="pf-input" value={draft.profile.location} onChange={setProfile('location')} placeholder="Bangkok, TH" /></div>
                    <div className="pf-field"><label>Years of experience</label><input className="pf-input" value={draft.profile.years} onChange={setProfile('years')} placeholder="5+" /></div>
                  </div>
                  <div className="pf-field"><label>Recognitions stat (leave blank to show project count)</label><input className="pf-input" value={draft.profile.nominations || ''} onChange={setProfile('nominations')} placeholder="12" /></div>
                  <div className="pf-field">
                    <label>Resume / CV URL</label>
                    <input className="pf-input" value={draft.profile.resumeUrl || ''} onChange={setProfile('resumeUrl')} placeholder="https://drive.google.com/..." />
                    <p className="pf-hint">Link to a PDF — a Download CV button appears on the live site.</p>
                  </div>
                  <div className="pf-field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!draft.profile.openToWork}
                        onChange={(e) => setDraft((d) => ({ ...d, profile: { ...d.profile, openToWork: e.target.checked } }))}
                        style={{ width: 16, height: 16, accentColor: 'var(--gold)' }}
                      />
                      Show &ldquo;Open to work&rdquo; badge on Hero
                    </label>
                  </div>
                </div>
              )}

              {/* ABOUT TAB */}
              {tab === 'About' && (
                <div>
                  <div className="pf-field">
                    <label>Portrait photo</label>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{
                        width: 110, aspectRatio: '3/4', borderRadius: 6, overflow: 'hidden',
                        border: '1px solid rgba(232,201,160,.15)', background: '#0d0805',
                        backgroundImage: (draft.profile.avatarAbout || draft.profile.avatar) ? `url(${draft.profile.avatarAbout || draft.profile.avatar})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center center',
                        display: 'grid', placeItems: 'center', flex: 'none',
                      }}>
                        {!(draft.profile.avatarAbout || draft.profile.avatar) && <span style={{ fontSize: 11, color: '#8a6f5a', textAlign: 'center', padding: 4 }}>No photo</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: '#d8a978', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button className="pf-btn ghost" onClick={() => aboutAvatarRef.current?.click()}>
                            <Upload size={14} /> Upload & crop
                          </button>
                          {draft.profile.avatarAbout && (
                            <button className="pf-btn ghost" onClick={() => setDraft((d) => ({ ...d, profile: { ...d.profile, avatarAbout: '' } }))}>
                              <X size={14} /> Use Hero photo
                            </button>
                          )}
                        </div>
                        <p className="pf-hint" style={{ marginTop: 8 }}>Crop as portrait (3:4).<br />Leave blank to reuse the Hero photo.</p>
                      </div>
                    </div>
                    <input ref={aboutAvatarRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) openCropper(f, 3/4, 'About — portrait beside text (3:4)', 'about') }} style={{ display: 'none' }} />
                  </div>

                  <div className="pf-field"><label>Bio — lead paragraph</label><textarea className="pf-textarea" value={draft.profile.about} onChange={setProfile('about')} /></div>
                  <div className="pf-field"><label>Bio — secondary paragraph (optional)</label><textarea className="pf-textarea" value={draft.profile.aboutMore || ''} onChange={setProfile('aboutMore')} /></div>

                  <div className="pf-sub">
                    <h4 className="pf-display">Highlights</h4>
                    <p className="pf-hint" style={{ marginTop: 0, marginBottom: 12 }}>Awards, talks, certifications — one line each.</p>
                    {(draft.highlights || []).map((h, i) => (
                      <div className="pf-row" key={h.id || i} style={{ gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                        <input
                          className="pf-input" value={h.text}
                          onChange={(e) => {
                            const v = e.target.value
                            setDraft((d) => ({ ...d, highlights: d.highlights.map((x, idx) => idx === i ? { ...x, text: v } : x) }))
                          }}
                          placeholder="e.g. Best Hackathon Project, TechCrunch Disrupt (2024)"
                        />
                        <button className="pf-mini del" onClick={() => setDraft((d) => ({ ...d, highlights: d.highlights.filter((_, idx) => idx !== i) }))}><Trash2 size={15} /></button>
                      </div>
                    ))}
                    <button className="pf-btn ghost" onClick={() => setDraft((d) => ({ ...d, highlights: [...(d.highlights || []), { id: 'h' + Date.now(), text: '' }] }))}>
                      <Plus size={15} /> Add highlight
                    </button>
                  </div>
                </div>
              )}

              {/* SKILLS TAB */}
              {tab === 'Skills' && (() => {
                const PRESET_CATS = ['Frontend', 'Backend', 'Tools & DevOps', 'Mobile', 'Database', 'Other']
                const cats = Array.from(new Set([
                  ...PRESET_CATS,
                  ...draft.skills.map(skillCat),
                ]))
                const grouped = cats
                  .map((cat) => ({ cat, items: draft.skills.map((s, i) => ({ s, i })).filter(({ s }) => skillCat(s) === cat) }))
                  .filter(({ items }) => items.length > 0)

                return (
                  <div>
                    {grouped.length === 0 && <p className="pf-hint">No skills yet — add some below.</p>}
                    {grouped.map(({ cat, items }) => (
                      <div key={cat} style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>{cat}</div>
                        <div className="pf-skilledit">
                          {items.map(({ s, i }) => (
                            <span className="pf-chip" key={i}>
                              <SkillIcon name={skillName(s)} size={18} /> {skillName(s)}
                              <span className="rm" onClick={() => rmSkill(i)}><X size={13} /></span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="pf-sub" style={{ marginTop: 8 }}>
                      <h4 className="pf-display">Add skill</h4>
                      <div className="pf-row">
                        <div className="pf-field" style={{ marginBottom: 0 }}>
                          <label>Name</label>
                          <input
                            className="pf-input" value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') addSkill() }}
                            placeholder="e.g. Rust"
                          />
                        </div>
                        <div className="pf-field" style={{ marginBottom: 0 }}>
                          <label>Category</label>
                          <input
                            className="pf-input" list="skill-cats"
                            value={skillCategory}
                            onChange={(e) => setSkillCategory(e.target.value)}
                            placeholder="Frontend"
                          />
                          <datalist id="skill-cats">
                            {PRESET_CATS.map((c) => <option key={c} value={c} />)}
                          </datalist>
                        </div>
                      </div>
                      <button className="pf-btn primary" style={{ marginTop: 10 }} onClick={addSkill}>
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </div>
                )
              })()}

              {/* EXPERIENCE TAB */}
              {tab === 'Experience' && (
                <div>
                  <div className="pf-sub">
                    <h4 className="pf-display">{editingExp ? 'Edit role' : 'Add a role'}</h4>
                    <div className="pf-row">
                      <div className="pf-field"><label>Role / position</label><input className="pf-input" value={expForm.role} onChange={(e) => setExpForm((f) => ({ ...f, role: e.target.value }))} placeholder="Frontend Developer" /></div>
                      <div className="pf-field"><label>Company</label><input className="pf-input" value={expForm.company} onChange={(e) => setExpForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Inc." /></div>
                    </div>
                    <div className="pf-field"><label>Period</label><input className="pf-input" value={expForm.period} onChange={(e) => setExpForm((f) => ({ ...f, period: e.target.value }))} placeholder="2023 — Present" /></div>
                    <div className="pf-field"><label>Description</label><textarea className="pf-textarea" value={expForm.description || ''} onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))} /></div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="pf-btn primary" onClick={submitExp}>
                        {editingExp ? <><Check size={16} /> Update</> : <><Plus size={16} /> Add role</>}
                      </button>
                      {editingExp && <button className="pf-btn ghost" onClick={() => { setExpForm(emptyExp()); setEditingExp(false) }}>Cancel</button>}
                    </div>
                  </div>
                  {draft.experience.map((x, i) => (
                    <div
                      key={x.id}
                      className="pf-adminitem"
                      draggable
                      onDragStart={() => { dragExpIdx.current = i }}
                      onDragOver={(e) => { e.preventDefault(); setDragOverExpIdx(i) }}
                      onDragLeave={() => setDragOverExpIdx(null)}
                      onDrop={() => dropExp(i)}
                      onDragEnd={() => { dragExpIdx.current = null; setDragOverExpIdx(null) }}
                      style={{
                        opacity: dragExpIdx.current === i ? 0.4 : 1,
                        outline: dragOverExpIdx === i ? '2px solid var(--gold)' : 'none',
                        outlineOffset: 2,
                        cursor: 'grab',
                        transition: 'opacity .15s, outline .1s',
                      }}
                    >
                      <div className="sw" style={{ background: 'linear-gradient(135deg,var(--gold),var(--rust))' }}><Briefcase size={16} /></div>
                      <div className="meta"><b>{x.role}</b><span>{x.company} · {x.period}</span></div>
                      <button className="pf-mini" onClick={() => editExp(x)}><Pencil size={15} /></button>
                      <button className="pf-mini del" onClick={() => rmExp(x.id)}><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* WORK TAB */}
              {tab === 'Work' && (
                <div>
                  <div className="pf-sub">
                    <h4 className="pf-display">{editingProj ? 'Edit project' : 'Add a project'}</h4>
                    <div className="pf-field"><label>Title</label><input className="pf-input" value={projForm.title} onChange={setProj('title')} placeholder="Project name" /></div>
                    <div className="pf-field"><label>Description</label><textarea className="pf-textarea" value={projForm.description} onChange={setProj('description')} /></div>
                    <div className="pf-row">
                      <div className="pf-field"><label>Tech (comma separated)</label><input className="pf-input" value={projForm.tags} onChange={setProj('tags')} placeholder="React, Node.js" /></div>
                      <div className="pf-field"><label>Category</label><input className="pf-input" value={projForm.category} onChange={setProj('category')} placeholder="Web App" /></div>
                    </div>
                    <div className="pf-row">
                      <div className="pf-field"><label>Live demo URL</label><input className="pf-input" value={projForm.demoUrl} onChange={setProj('demoUrl')} placeholder="https://" /></div>
                      <div className="pf-field"><label>Repo URL</label><input className="pf-input" value={projForm.repoUrl} onChange={setProj('repoUrl')} placeholder="https://github.com/" /></div>
                    </div>
                    <div className="pf-field">
                      <label>Cover image</label>
                      <div style={{
                        width: '100%', aspectRatio: '16/9', borderRadius: 6, overflow: 'hidden',
                        border: '1px solid rgba(232,201,160,.15)',
                        background: projForm.image ? 'none' : `linear-gradient(135deg,${projForm.accent[0]},${projForm.accent[1]})`,
                        backgroundImage: projForm.image ? `url(${projForm.image})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        display: 'grid', placeItems: 'center', marginBottom: 10, position: 'relative',
                      }}>
                        {!projForm.image && <span style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: 42, color: 'rgba(255,243,228,.85)' }}>{projForm.title ? projForm.title.charAt(0) : '?'}</span>}
                        {projForm.image && (
                          <button onClick={() => { setProjForm((f) => ({ ...f, image: '' })); setImgErr('') }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(13,8,5,.75)', border: '1px solid rgba(232,201,160,.2)', color: '#b3a08d', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                      <button className="pf-btn ghost" onClick={() => fileRef.current?.click()}>
                        <Upload size={15} /> Upload & crop
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) openCropper(f, 16/9, 'Project cover — 16:9', 'project') }} style={{ display: 'none' }} />
                      <input className="pf-input" style={{ marginTop: 10 }} value={isUploaded ? '' : projForm.image} onChange={setProj('image')} disabled={isUploaded} placeholder={isUploaded ? 'Using uploaded image' : '...or paste an image URL'} />
                      {imgErr ? <p className="pf-hint" style={{ color: 'var(--rust)' }}>{imgErr}</p> : <p className="pf-hint">Leave blank to use the accent color instead.</p>}
                    </div>
                    <div className="pf-field">
                      <label>Accent color</label>
                      <div className="pf-swatches">
                        {ACCENTS.map((a, i) => (
                          <div key={i}
                            className={'pf-swatch' + (projForm.accent[0] === a[0] && projForm.accent[1] === a[1] ? ' on' : '')}
                            style={{ background: `linear-gradient(135deg, ${a[0]}, ${a[1]})` }}
                            onClick={() => setProjForm((f) => ({ ...f, accent: a }))}
                          />
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="pf-btn primary" onClick={submitProj}>
                        {editingProj ? <><Check size={16} /> Update</> : <><Plus size={16} /> Add project</>}
                      </button>
                      {editingProj && <button className="pf-btn ghost" onClick={() => { setProjForm(emptyProject() as ProjForm); setEditingProj(false) }}>Cancel</button>}
                    </div>
                  </div>

                  {draft.projects.map((p, i) => (
                    <div
                      className="pf-adminitem"
                      key={p.id}
                      draggable
                      onDragStart={() => { dragProjIdx.current = i }}
                      onDragOver={(e) => { e.preventDefault(); setDragOverProjIdx(i) }}
                      onDragLeave={() => setDragOverProjIdx(null)}
                      onDrop={() => dropProj(i)}
                      onDragEnd={() => { dragProjIdx.current = null; setDragOverProjIdx(null) }}
                      style={{
                        opacity: dragProjIdx.current === i ? 0.4 : 1,
                        outline: dragOverProjIdx === i ? '2px solid var(--gold)' : 'none',
                        outlineOffset: 2,
                        cursor: 'grab',
                        transition: 'opacity .15s, outline .1s',
                      }}
                    >
                      <div className="sw" style={{ background: `linear-gradient(135deg, ${p.accent[0]}, ${p.accent[1]})` }} />
                      <div className="meta"><b>{p.title}</b><span>{p.category} · {p.tags.join(', ')}</span></div>
                      <button className="pf-mini" onClick={() => editProj(p)}><Pencil size={15} /></button>
                      <button className="pf-mini del" onClick={() => rmProj(p.id)}><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* CONTACT TAB */}
              {tab === 'Contact' && (
                <div>
                  <div className="pf-field"><label>Email</label><input className="pf-input" value={draft.contact.email} onChange={setContactF('email')} placeholder="you@example.com" /></div>
                  <div className="pf-field"><label>GitHub URL</label><input className="pf-input" value={draft.contact.github} onChange={setContactF('github')} placeholder="https://github.com/yourname" /></div>
                  <div className="pf-field"><label>LinkedIn URL</label><input className="pf-input" value={draft.contact.linkedin} onChange={setContactF('linkedin')} placeholder="https://linkedin.com/in/yourname" /></div>
                  <p className="pf-hint">Leave a field blank to hide that button.</p>
                </div>
              )}

              {/* MESSAGES TAB */}
              {tab === 'Messages' && (
                <div>
                  <p className="pf-hint" style={{ marginBottom: 16, marginTop: 0 }}>
                    Messages submitted via the contact form.
                  </p>
                  {msgsLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: 14 }}>
                      <Loader2 size={16} className="pf-spin" /> Loading…
                    </div>
                  )}
                  {msgsErr && <p className="pf-hint" style={{ color: 'var(--rust)' }}>{msgsErr}</p>}
                  {!msgsLoading && !msgsErr && messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                      <MessageSquare size={28} style={{ marginBottom: 12, opacity: .4 }} />
                      <p style={{ fontSize: 14 }}>No messages yet.</p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div className="pf-msg" key={m.id}>
                      <div className="pf-msg-head">
                        <span className="pf-msg-name">{m.name}</span>
                        <span className="pf-msg-email">{m.email}</span>
                        <span className="pf-msg-date">{new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <p className="pf-msg-body">{m.message}</p>
                      <a className="pf-msg-reply" href={`mailto:${m.email}?subject=Re: Your message`}>
                        <Download size={13} style={{ transform: 'rotate(90deg)' }} /> Reply
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* LIFESTYLE TAB */}
              {tab === 'Lifestyle' && (
                <div>
                  <p className="pf-hint" style={{ marginBottom: 16, marginTop: 0 }}>
                    Lifestyle photos are displayed as a rotating 3D carousel on the page.
                  </p>

                  {/* Upload area */}
                  <div className="pf-sub">
                    <h4 className="pf-display">Add New Photo</h4>
                    <div className="pf-field">
                      <label>Caption (optional)</label>
                      <input
                        className="pf-input"
                        value={lifestyleCaptionDraft}
                        onChange={(e) => setLifestyleCaptionDraft(e.target.value)}
                        placeholder="e.g. Coffee &amp; Code ☕"
                      />
                    </div>
                    <button
                      className="pf-btn ghost"
                      onClick={() => lifestyleFileRef.current?.click()}
                    >
                      <Upload size={15} /> Choose photo &amp; crop
                    </button>
                    <input
                      ref={lifestyleFileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        e.target.value = ''
                        if (!f || !f.type.startsWith('image/')) return
                        const url = URL.createObjectURL(f)
                        setCropperSrc(url)
                        setCropperAspect(3 / 4)
                        setCropperLabel('Lifestyle — portrait (3:4)')
                        setCropperTarget('lifestyle' as typeof cropperTarget)
                        setCropperOpen(true)
                      }}
                    />
                    <p className="pf-hint" style={{ marginTop: 8 }}>Crop as portrait (3:4) to fit the carousel.</p>
                  </div>

                  {/* Existing photos */}
                  {(draft.lifestylePhotos ?? []).length === 0 ? (
                    <p className="pf-hint">No photos yet — upload your first one above.</p>
                  ) : (
                    <div className="ls-admin-grid">
                      {(draft.lifestylePhotos ?? []).map((photo, i) => (
                        <div key={photo.id} className="ls-admin-card">
                          <div className="ls-admin-thumb">
                            {photo.url ? (
                              <img src={photo.url} alt={photo.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ color: 'var(--gold)', opacity: .4 }}>✦</span>
                            )}
                            <button
                              className="ls-admin-del"
                              onClick={() =>
                                setDraft((d) => ({
                                  ...d,
                                  lifestylePhotos: (d.lifestylePhotos ?? []).filter((_, idx) => idx !== i),
                                }))
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <input
                            className="pf-input"
                            style={{ marginTop: 6, fontSize: 11 }}
                            value={photo.caption || ''}
                            placeholder="caption..."
                            onChange={(e) => {
                              const v = e.target.value
                              setDraft((d) => ({
                                ...d,
                                lifestylePhotos: (d.lifestylePhotos ?? []).map((p, idx) =>
                                  idx === i ? { ...p, caption: v } : p,
                                ),
                              }))
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ANALYTICS TAB */}
              {tab === 'Analytics' && (
                <div>
                  {analyticsLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: 14 }}>
                      <Loader2 size={16} className="pf-spin" /> Loading…
                    </div>
                  )}
                  {analytics && (
                    <div className="pf-analytics">
                      <div className="pf-stat-card">
                        <BarChart2 size={20} style={{ color: 'var(--gold)' }} />
                        <div className="pf-stat-val">{analytics.total.toLocaleString()}</div>
                        <div className="pf-stat-lbl">Total page views</div>
                      </div>
                      <div className="pf-stat-card">
                        <BarChart2 size={20} style={{ color: 'var(--rust)' }} />
                        <div className="pf-stat-val">{analytics.thisWeek.toLocaleString()}</div>
                        <div className="pf-stat-lbl">Views this week</div>
                      </div>
                    </div>
                  )}
                  {!analyticsLoading && !analytics && (
                    <div className="pf-sub">
                      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
                        Analytics require a <code style={{ background: 'rgba(255,255,255,.06)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>page_view_events</code> table in Supabase.
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.7 }}>
                        Run in Supabase SQL editor:
                      </p>
                      <pre className="pf-sql-block">{`CREATE TABLE page_view_events (
  id bigint primary key generated always as identity,
  created_at timestamptz default now()
);
ALTER TABLE page_view_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert" ON page_view_events
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth read" ON page_view_events
  FOR SELECT TO authenticated USING (true);`}</pre>
                    </div>
                  )}
                </div>
              )}

              <div className="pf-savebar">
                <button className="pf-btn primary" onClick={commit} disabled={isSaving || tab === 'Analytics' || tab === 'Messages'}>
                  {isSaving
                    ? <><Loader2 size={16} className="pf-spin" /> Saving…</>
                    : <><Check size={16} /> Save changes</>
                  }
                </button>
                {savedFlash && <span className="pf-saved"><Check size={14} /> Saved</span>}
                {err && <span className="pf-hint" style={{ margin: 0, color: 'var(--rust)' }}>{err}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

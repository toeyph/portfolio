'use client'

import { useState } from 'react'
import { Mail, Send, Check, Copy } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import FadeUp from './FadeUp'
import { sendContactMessage } from '@/lib/supabase'
import type { Contact as ContactType } from '@/lib/types'

interface ContactProps {
  contact: ContactType
}

export default function Contact({ contact }: ContactProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return
    setStatus('sending')
    try {
      await sendContactMessage(name.trim(), email.trim(), message.trim())
      setStatus('sent')
      setName(''); setEmail(''); setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="pf-section pf-sec-dark" id="contact">
      <FadeUp>
        <div className="pf-contact">
          <div className="pf-contact-deco" aria-hidden>
            <span /><span className="pf-contact-star">✦</span><span />
          </div>

          <div className="pf-kicker" style={{ marginTop: 32 }}>Get in touch</div>
          <h2 className="pf-h2 pf-display pf-contact-title">
            Let&apos;s build something <em>memorable</em>.
          </h2>
          <p className="pf-lead pf-contact-lead">
            Got a project, a role, or just want to chat? Drop a message below.
          </p>

          {status === 'sent' ? (
            <div className="pf-contact-success">
              <Check size={28} />
              <p>Message sent! I&apos;ll get back to you soon.</p>
              <button
                className="pf-btn ghost"
                style={{ marginTop: 20, fontSize: 13 }}
                onClick={() => setStatus('idle')}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="pf-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="pf-cf-row">
                <div className="pf-cf-field">
                  <label htmlFor="cf-name">Name</label>
                  <input
                    id="cf-name" type="text" value={name} required
                    placeholder="Your name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="pf-cf-field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email" type="email" value={email} required
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="pf-cf-field">
                <label htmlFor="cf-msg">Message</label>
                <textarea
                  id="cf-msg" value={message} required rows={5}
                  placeholder="Tell me about your project or idea…"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              {status === 'error' && (
                <p className="pf-cf-error">Something went wrong — please try emailing me directly.</p>
              )}
              <button
                type="submit"
                className="pf-btn primary pf-cf-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending'
                  ? <><span className="pf-cf-spinner" /> Sending…</>
                  : <><Send size={15} /> Send message</>
                }
              </button>
            </form>
          )}

          <div className="pf-contact-divider">
            <span /><small>or reach me directly</small><span />
          </div>

          <div className="pf-contact-email-row">
            <a className="pf-contact-email" href={`mailto:${contact.email}`}>
              <Mail size={16} />
              <span>{contact.email}</span>
            </a>
            <div className="pf-email-divider" aria-hidden />
            <button className="pf-copy-btn" onClick={copyEmail} title="Copy email address">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="pf-contact-divider">
            <span /><small>find me on</small><span />
          </div>

          <div className="pf-contact-social">
            {contact.github && (
              <a className="pf-contact-soc-btn" href={contact.github} target="_blank" rel="noreferrer">
                <GithubIcon size={20} /><span>GitHub</span>
              </a>
            )}
            {contact.linkedin && (
              <a className="pf-contact-soc-btn" href={contact.linkedin} target="_blank" rel="noreferrer">
                <LinkedinIcon size={20} /><span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </FadeUp>
    </section>
  )
}

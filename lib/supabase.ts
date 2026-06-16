import { createClient } from '@supabase/supabase-js'
import type { PortfolioContent } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? 'portfolio-images'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase env vars — portfolio running in offline mode.')
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '')

export async function loadContent(): Promise<PortfolioContent | null> {
  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('data')
      .maybeSingle()
    if (error) { console.warn('loadContent:', error.message); return null }
    return (data?.data as PortfolioContent) ?? null
  } catch (e) {
    console.warn('loadContent exception:', e)
    return null
  }
}

export async function persistContent(contentData: PortfolioContent): Promise<void> {
  const { data: row, error: selectErr } = await supabase
    .from('portfolio_content')
    .select('id')
    .maybeSingle()

  if (selectErr) {
    throw new Error(`Failed to read content: ${selectErr.message}`)
  }

  const now = new Date().toISOString()
  const { error } = row
    ? await supabase
        .from('portfolio_content')
        .update({ data: contentData, updated_at: now })
        .eq('id', row.id)
    : await supabase
        .from('portfolio_content')
        .insert({ data: contentData, updated_at: now })

  if (error) throw new Error(`Failed to save: ${error.message}`)
}

export async function uploadImage(dataUrl: string, path: string): Promise<string> {
  try {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const extMap: Record<string, string> = {
      'image/png': 'png', 'image/webp': 'webp',
      'image/gif': 'gif', 'image/avif': 'avif',
    }
    const ext = extMap[blob.type] ?? 'jpg'
    const filePath = `${path}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, { contentType: blob.type })
    if (error) { console.warn('uploadImage:', error.message); return dataUrl }
    const { data: pub } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)
    return pub.publicUrl
  } catch (e) {
    console.warn('uploadImage exception:', e)
    return dataUrl
  }
}

export async function sendContactMessage(name: string, email: string, message: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message })
  if (error) throw new Error(error.message)
}

export async function loadMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function trackPageView(): Promise<void> {
  const { error } = await supabase.from('page_view_events').insert({})
  if (error) console.warn('trackPageView:', error.message)
}

export async function loadAnalytics(): Promise<{ total: number; thisWeek: number }> {
  const { count: total, error: e1 } = await supabase
    .from('page_view_events')
    .select('*', { count: 'exact', head: true })
  if (e1) throw new Error(`Analytics error: ${e1.message}`)

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: thisWeek, error: e2 } = await supabase
    .from('page_view_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo)
  if (e2) throw new Error(`Analytics error: ${e2.message}`)

  return { total: total ?? 0, thisWeek: thisWeek ?? 0 }
}

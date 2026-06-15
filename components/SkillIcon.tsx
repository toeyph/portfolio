'use client'

import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { iconSlug } from '@/lib/utils'

interface SkillIconProps {
  name: string
  size?: number
}

export default function SkillIcon({ name, size = 24 }: SkillIconProps) {
  const slug = iconSlug(name)
  const [err, setErr] = useState(false)

  if (!slug || err) {
    return (
      <span className="pf-ico fallback" style={{ width: size, height: size }}>
        <Code2 size={Math.round(size * 0.58)} color="#fff" />
      </span>
    )
  }

  return (
    <span className="pf-ico" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt=""
        loading="lazy"
        onError={() => setErr(true)}
      />
    </span>
  )
}

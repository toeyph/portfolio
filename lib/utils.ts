export const ICON_SLUGS: Record<string, string> = {
  'react': 'react', 'reactjs': 'react', 'react native': 'react',
  'typescript': 'typescript', 'ts': 'typescript',
  'javascript': 'javascript', 'js': 'javascript',
  'next.js': 'nextdotjs', 'nextjs': 'nextdotjs', 'next': 'nextdotjs',
  'node.js': 'nodedotjs', 'nodejs': 'nodedotjs', 'node': 'nodedotjs',
  'tailwind': 'tailwindcss', 'tailwindcss': 'tailwindcss', 'tailwind css': 'tailwindcss',
  'graphql': 'graphql',
  'postgresql': 'postgresql', 'postgres': 'postgresql',
  'three.js': 'threedotjs', 'threejs': 'threedotjs', 'three': 'threedotjs',
  'python': 'python', 'docker': 'docker', 'figma': 'figma',
  'aws': 'amazonwebservices', 'amazon web services': 'amazonwebservices',
  'redis': 'redis', 'framer motion': 'framer', 'framer': 'framer',
  'vue': 'vuedotjs', 'vue.js': 'vuedotjs', 'svelte': 'svelte', 'angular': 'angular',
  'express': 'express', 'mongodb': 'mongodb', 'mysql': 'mysql',
  'firebase': 'firebase', 'supabase': 'supabase',
  'git': 'git', 'github': 'github', 'gitlab': 'gitlab',
  'html': 'html5', 'html5': 'html5', 'css': 'css3', 'css3': 'css3', 'sass': 'sass',
  'rust': 'rust', 'go': 'go', 'golang': 'go', 'java': 'openjdk',
  'c++': 'cplusplus', 'c#': 'csharp', 'php': 'php', 'ruby': 'ruby',
  'laravel': 'laravel', 'django': 'django', 'flask': 'flask',
  'kubernetes': 'kubernetes', 'k8s': 'kubernetes',
  'vite': 'vite', 'webpack': 'webpack', 'jest': 'jest', 'vitest': 'vitest',
  'prisma': 'prisma', 'websocket': 'socketdotio', 'socket.io': 'socketdotio',
  'd3': 'd3dotjs', 'd3.js': 'd3dotjs', 'tensorflow': 'tensorflow',
  'flutter': 'flutter', 'swift': 'swift', 'kotlin': 'kotlin',
}

export function iconSlug(name: string): string {
  const key = String(name).trim().toLowerCase()
  if (key in ICON_SLUGS) return ICON_SLUGS[key]
  return key.replace(/[\s.]/g, '')
}

export interface TechGroup {
  name: string
  color: string
  items: string[]
}

const AUTO_CATS: { name: string; color: string; keys: string[] }[] = [
  {
    name: 'Frontend',
    color: 'var(--gold)',
    keys: ['react','reactjs','react native','vue','vue.js','svelte','angular','next.js','nextjs','next','typescript','ts','javascript','js','tailwind','tailwindcss','tailwind css','html','html5','css','css3','sass','framer motion','framer','d3','d3.js','three.js','threejs','three','flutter','swift','kotlin'],
  },
  {
    name: 'Backend',
    color: 'var(--rust)',
    keys: ['node.js','nodejs','node','express','python','django','flask','php','laravel','ruby','go','golang','rust','java','c++','c#','graphql','postgresql','postgres','mongodb','mysql','redis','prisma','websocket','socket.io'],
  },
  {
    name: 'Tools & DevOps',
    color: '#a8854f',
    keys: ['docker','kubernetes','k8s','aws','amazon web services','git','github','gitlab','figma','vite','webpack','jest','vitest','firebase','supabase','tensorflow'],
  },
]

const CAT_COLORS: Record<string, string> = {
  'Frontend': 'var(--gold)',
  'Backend': 'var(--rust)',
  'Tools & DevOps': '#a8854f',
  'Mobile': '#7a6b8a',
  'Database': '#4f7a6b',
  'Other': '#8a6f5a',
}

export function autoCategory(name: string): string {
  const key = String(name).trim().toLowerCase()
  for (const cat of AUTO_CATS) {
    if (cat.keys.includes(key)) return cat.name
  }
  return 'Other'
}

import type { Skill } from './types'

export function groupSkills(skills: (string | Skill)[]): TechGroup[] {
  const order: string[] = []
  const map = new Map<string, string[]>()
  for (const s of skills ?? []) {
    const name = typeof s === 'string' ? s : s.name
    const cat = typeof s === 'string' ? autoCategory(s) : (s.category || 'Other')
    if (!map.has(cat)) { map.set(cat, []); order.push(cat) }
    map.get(cat)!.push(name)
  }
  return order.map((cat) => ({
    name: cat,
    color: CAT_COLORS[cat] ?? '#8a6f5a',
    items: map.get(cat)!,
  }))
}

export function fileToDataURL(file: File, maxDim = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Could not read that image.'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

import type { PortfolioContent } from './types'

export const ACCENTS: [string, string][] = [
  ['#d2a679', '#8a5226'],
  ['#c0673a', '#5e2418'],
  ['#b08d57', '#5a3a1f'],
  ['#a8743f', '#43210f'],
  ['#9c6b4a', '#33180d'],
  ['#caa06a', '#7a3f1c'],
]

export const DEFAULT_CONTENT: PortfolioContent = {
  lifestylePhotos: [],
  profile: {
    name: 'Aria Suk',
    roles: ['Full-Stack Developer', 'UI Engineer', 'Creative Coder'],
    headline: 'Full-Stack Developer & UI Engineer',
    tagline: 'Available for freelance projects worldwide.',
    about:
      'My work spans the full stack — from polished interfaces to the systems that power them. I have built products for startups, agencies, and open-source communities, shipping experiences used by thousands of people.',
    aboutMore:
      'Born and raised in Bangkok, I discovered programming at fifteen and never looked back. My journey began with side projects, leading to roles at fast-growing teams where I learned to build things that last. I care about craft, clarity, and code that future-me will thank present-me for.',
    location: 'Bangkok, TH',
    years: '5+',
    nominations: '',
    avatar: '',
    avatarAbout: '',
  },
  contact: {
    email: 'hello@example.com',
    github: 'https://github.com/yourname',
    linkedin: 'https://linkedin.com/in/yourname',
  },
  highlights: [
    { id: 'h1', text: 'Best Hackathon Project, TechCrunch Disrupt (2024)' },
    { id: 'h2', text: 'Open-Source Contributor of the Year, GitHub Stars (2023)' },
    { id: 'h3', text: 'Featured Developer, Awwwards (2022)' },
    { id: 'h4', text: 'Speaker, React Conf Asia (2023)' },
  ],
  skills: [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Tailwind', category: 'Frontend' },
    { name: 'Three.js', category: 'Frontend' },
    { name: 'Framer Motion', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'GraphQL', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Redis', category: 'Backend' },
    { name: 'Docker', category: 'Tools & DevOps' },
    { name: 'AWS', category: 'Tools & DevOps' },
    { name: 'Figma', category: 'Tools & DevOps' },
  ],
  experience: [
    {
      id: 'e1',
      role: 'Senior Frontend Developer',
      company: 'Pixelmint Studio',
      period: '2023 — Present',
      description:
        'Lead the web team building design-system-driven products. Shipped a component library now used across 6 apps.',
    },
    {
      id: 'e2',
      role: 'Full-Stack Developer',
      company: 'Nimbus Labs',
      period: '2021 — 2023',
      description:
        'Built realtime dashboards and internal tools with React, Node, and PostgreSQL for a fast-growing startup.',
    },
    {
      id: 'e3',
      role: 'Junior Developer',
      company: 'Freelance',
      period: '2020 — 2021',
      description:
        'Designed and developed websites for small businesses, learning the full path from brief to launch.',
    },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Nebula Dashboard',
      description:
        'A real-time analytics dashboard with animated charts, custom widgets, and a drag-and-drop layout engine.',
      tags: ['React', 'TypeScript', 'D3'],
      category: 'Web App',
      demoUrl: '#',
      repoUrl: '#',
      image: '',
      accent: ACCENTS[0],
    },
    {
      id: 'p2',
      title: 'PixelPaws',
      description:
        'A pet-adoption mobile app that matches shelters with families. Offline-first, with push notifications.',
      tags: ['React Native', 'Firebase'],
      category: 'Mobile',
      demoUrl: '#',
      repoUrl: '#',
      image: '',
      accent: ACCENTS[4],
    },
    {
      id: 'p3',
      title: 'DevSync',
      description:
        'A collaborative code editor with live cursors, syntax-aware presence, and conflict-free editing.',
      tags: ['Next.js', 'WebSocket', 'Redis'],
      category: 'Web App',
      demoUrl: '#',
      repoUrl: '#',
      image: '',
      accent: ACCENTS[1],
    },
    {
      id: 'p4',
      title: 'Lumen API',
      description:
        'A batteries-included REST toolkit: auth, rate-limiting, and auto-generated docs out of the box.',
      tags: ['Node.js', 'Express', 'PostgreSQL'],
      category: 'Backend',
      demoUrl: '#',
      repoUrl: '#',
      image: '',
      accent: ACCENTS[5],
    },
    {
      id: 'p5',
      title: 'Synthwave Player',
      description:
        'A music visualizer that reacts to audio frequencies in 3D — built for headphones and late nights.',
      tags: ['Three.js', 'Web Audio'],
      category: 'Creative',
      demoUrl: '#',
      repoUrl: '#',
      image: '',
      accent: ACCENTS[2],
    },
  ],
}

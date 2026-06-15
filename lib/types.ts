export interface Profile {
  name: string
  roles: string[]
  headline: string
  tagline: string
  about: string
  aboutMore?: string
  location: string
  years: string
  nominations?: string
  avatar?: string
  avatarAbout?: string
  resumeUrl?: string
  openToWork?: boolean
}


export interface Contact {
  email: string
  github: string
  linkedin: string
}

export interface Highlight {
  id: string
  text: string
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  description?: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  demoUrl: string
  repoUrl: string
  image: string
  accent: [string, string]
}

export interface LifestylePhoto {
  id: string
  url: string
  caption?: string
}

export interface Skill {
  name: string
  category: string
}

export interface PortfolioContent {
  profile: Profile
  contact: Contact
  highlights: Highlight[]
  skills: (string | Skill)[]
  experience: Experience[]
  projects: Project[]
  lifestylePhotos?: LifestylePhoto[]
}

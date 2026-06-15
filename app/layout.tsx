import type { Metadata } from 'next'
import { Playfair_Display, Lora, Mulish } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-mulish',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourportfolio.dev'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'Aria Suk — Full-Stack Developer', template: '%s | Aria Suk' },
  description: 'Full-Stack Developer & UI Engineer based in Bangkok. Building polished interfaces and the systems behind them.',
  keywords: ['Full-Stack Developer', 'UI Engineer', 'React', 'Next.js', 'Bangkok'],
  authors: [{ name: 'Aria Suk' }],
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'Aria Suk — Full-Stack Developer & UI Engineer',
    description: 'Building polished interfaces and the systems behind them.',
    siteName: 'Aria Suk Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Aria Suk Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aria Suk — Full-Stack Developer',
    description: 'Building polished interfaces and the systems behind them.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} ${mulish.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

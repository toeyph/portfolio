interface FooterProps {
  name: string
}

export default function Footer({ name }: FooterProps) {
  return (
    <footer className="pf-footer">
      <div className="pf-wrap">
        built with Next.js + ☕ — © {new Date().getFullYear()} {name}
      </div>
    </footer>
  )
}
